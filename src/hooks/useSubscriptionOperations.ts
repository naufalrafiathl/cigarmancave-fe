import { config } from "@/config";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from "@stripe/stripe-js";

// Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

export interface SubscriptionResponse {
  subscriptionId?: string;
  clientSecret?: string;
}

interface APIError {
  message: string;
  status: number;
}

// Move Stripe initialization to the top of the file
const stripePromise: Promise<Stripe | null> = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
  );
  

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const tokenResponse = await fetch("/api/auth/token");
  if (!tokenResponse.ok) {
    throw new Error("Failed to get authentication token");
  }

  const { accessToken } = await tokenResponse.json();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
};

// Helper function to handle API responses
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
      status: response.status,
    }));

    throw {
      message: errorData.message || "An error occurred while processing your request",
      status: response.status,
    } as APIError;
  }

  return response.json();
};

export function useSubscriptionOperations() {
  const { user } = useUser();
  const queryClient = useQueryClient();

  // Fetch Available Subscription Plans
  const plansQuery = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(`${config.apiUrl}/api/subscriptions/plans`, {
        headers,
        credentials: "include",
      });

      return handleApiResponse<{ data: SubscriptionPlan[] }>(response).then(
        (res) => res.data
      );
    },
  });

  const createSubscriptionMutation = useMutation<
  { checkoutUrl: string },
  APIError,
  { priceId: string }
>({
  mutationFn: async ({ priceId }) => {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${config.apiUrl}/api/subscriptions/create`,
      {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({ priceId }),
      }
    );

    const data = await handleApiResponse<{ data: { checkoutUrl: string } }>(
      response
    );
    return data.data;
  },
  onSuccess: (data) => {
    window.location.href = data.checkoutUrl;
  }
});

  // Cancel Subscription Mutation
  const cancelSubscriptionMutation = useMutation<void, APIError, void>({
    mutationFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/subscriptions/cancel`,
        {
          method: "POST",
          headers,
          credentials: "include",
        }
      );

      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
    },
  });

  // Get User Subscription Status
  const subscriptionStatusQuery = useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/subscriptions/status`,
        {
          headers,
          credentials: 'include',
        }
      );
  
      return handleApiResponse<{ 
        status: string, 
        data: SubscriptionStatus 
      }>(response).then(res => res.data);
    },
    enabled: !!user, // Only run query if user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Define SubscriptionStatus type
  interface SubscriptionStatus {
    hasSubscription: boolean;
    isPremium: boolean;
    status: string | null;
    currentPeriodEnd: Date | null;
    stripeStatus?: string;
  }


  const verifySubscription = async (sessionId: string): Promise<boolean> => {
    try {
      if (!sessionId) {
        console.error('No session ID provided');
        return false;
      }
  
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${config.apiUrl}/api/subscriptions/verify-session`,
        {
          method: 'POST',
          headers: {
            ...headers,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ sessionId })
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Verification failed', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        return false;
      }
  
      const data = await handleApiResponse<{ 
        status: string, 
        data: { 
          verified: boolean 
        } 
      }>(response);
  
      return data.data.verified;
    } catch (error) {
      console.error('Subscription verification error:', error);
      
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }

      return false;
    }
  };

  return {
    // Queries
    plans: plansQuery.data || [],
    plansLoading: plansQuery.isLoading,
    plansError: plansQuery.error,
    verifySubscription,

    // Subscription Status
    subscriptionStatus: subscriptionStatusQuery.data,
    subscriptionLoading: subscriptionStatusQuery.isLoading,
    subscriptionError: subscriptionStatusQuery.error,

    // Mutations
    createSubscription: createSubscriptionMutation.mutateAsync,
    cancelSubscription: cancelSubscriptionMutation.mutateAsync,

    // State Helpers
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isCancelingSubscription: cancelSubscriptionMutation.isPending,
    error: (createSubscriptionMutation.error ||
      cancelSubscriptionMutation.error ||
      subscriptionStatusQuery.error) as APIError | null,

    // Authentication Status
    isAuthenticated: !!user,
  };
}