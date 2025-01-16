"use client";
import React, { useState } from "react";
import { useSubscriptionOperations } from "@/hooks/useSubscriptionOperations";
import { Trophy, Medal, Loader2, CheckCircle2 } from "lucide-react";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Stripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";

// Type Definitions
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: () => void;
}

interface BenefitCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

// Stripe Initialization
const stripePromise: Promise<Stripe | null> = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Subscription Card Component
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      className={`bg-gradient-to-br from-[#2A2A2A] to-[#222222] border rounded-xl transition-all duration-300 cursor-pointer relative
        ${
          isSelected
            ? "border-[#EFA427] ring-2 ring-[#EFA427]/50"
            : "border-white/10 hover:border-[#EFA427]"
        }`}
      onClick={onSelect}
    >
      {/* Card Content */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#EFA427] rounded-full p-1">
          <CheckCircle2 className="w-4 h-4 text-black" />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-xl">{plan.name}</h3>
          <div className="bg-[#EFA427]/10 px-3 py-1 rounded-full">
            <span className="text-[#EFA427] text-sm">
              ${plan.price}/{plan.interval}
            </span>
          </div>
        </div>

        <p className="text-[#B9B9B9] text-sm">{plan.description}</p>

        <div className="space-y-2">
          <h4 className="text-white font-medium">Features:</h4>
          <ul className="space-y-1">
            {plan.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-[#B9B9B9] text-sm"
              >
                <Trophy className="w-4 h-4 text-[#EFA427]" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Benefit Card Component
const BenefitCard: React.FC<BenefitCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div
    className="bg-[#2A2A2A] rounded-xl p-6 border border-white/10 
    hover:border-[#EFA427] transition-all duration-300"
  >
    <div className="mb-4">
      <Icon className="w-8 h-8 text-[#EFA427]" />
    </div>
    <h4 className="text-white font-semibold mb-2">{title}</h4>
    <p className="text-[#B9B9B9] text-sm">{description}</p>
  </div>
);



// Main Subscription View Component
export function SubscriptionView(): JSX.Element {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();
  const {
    plans,
    plansLoading,
    createSubscription,
    cancelSubscription,
    isCancelingSubscription,
    isCreatingSubscription,
    error,
    isAuthenticated,
    subscriptionStatus, // Add this
    subscriptionLoading // Add this
  } = useSubscriptionOperations();

  const handlePlanSelect = (planId: string): void => {
    setSelectedPlan(planId);
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      // Optionally show a success message
    } catch (err) {
      console.error("Subscription cancellation error", err);
    }
  };


  const handleSubscribe = async (priceId: string): Promise<void> => {
    if (!isAuthenticated) {
      // Handle login requirement
      return;
    }

    try {
      await createSubscription({ priceId });
      // The mutation will handle redirecting to Stripe Checkout
    } catch (err) {
      console.error("Subscription error", err);
    }
  };

  // Benefits Data
  const BENEFITS: BenefitCardProps[] = [
    {
      icon: Trophy,
      title: "Exclusive Features",
      description: "Access to advanced tools and insights",
    },
    {
      icon: Medal,
      title: "Priority Support",
      description: "Dedicated customer support",
    },
    {
      icon: CheckCircle2,
      title: "No Ads",
      description: "Enjoy an ad-free experience",
    },
  ];

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Please Log In
          </h2>
          <p className="text-[#B9B9B9] mb-6">
            You need to be logged in to view subscription plans
          </p>
          <button
            className="px-6 py-2 bg-[#EFA427] text-black rounded-xl"
            // Add login handler
            onClick={() => {
              // Implement login redirect or modal
              console.log("Redirect to login");
            }}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (isAuthenticated && subscriptionStatus?.hasSubscription) {
    return (
      <div className="h-full">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-gradient-to-br from-[#2A2A2A] to-[#222222] rounded-xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your Current Subscription
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[#B9B9B9]">Status:</p>
                  <p 
                    className={`font-semibold ${
                      subscriptionStatus.status === 'canceled' 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}
                  >
                    {subscriptionStatus.status?.toUpperCase() || 'Active'}
                  </p>
                </div>
                
                {subscriptionStatus.currentPeriodEnd && (
                  <div>
                    <p className="text-[#B9B9B9]">
                      {subscriptionStatus.status === 'canceled' 
                        ? 'Subscription Ends' 
                        : 'Renewal Date'}:
                    </p>
                    <p className="text-white font-semibold">
                      {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
  
              {subscriptionStatus.status === 'canceled' ? (
                <button
                  onClick={() => {
                    // Scroll or navigate to plan selection
                    document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full px-6 py-3 bg-[#EFA427] hover:bg-[#EFA427]/90 
                  rounded-xl text-black font-medium 
                  transition-colors flex items-center justify-center gap-2"
                >
                  Resubscribe
                </button>
              ) : (
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelingSubscription}
                  className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 
                  disabled:opacity-50 rounded-xl text-white font-medium 
                  transition-colors flex items-center justify-center gap-2"
                >
                  {isCancelingSubscription ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Cancel Subscription"
                  )}
                </button>
              )}
            </div>
          </div>
  
          {/* Subscription Benefits */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-white mb-6">
              Why Go Premium?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {BENEFITS.map((benefit, index) => (
                <BenefitCard
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-[#222222] border-b border-white/10 px-4 py-3 pt-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Subscription Plans
              </h2>
              <p className="text-[#B9B9B9]">
                Unlock premium features and support our platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {plansLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#EFA427] animate-spin" />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-xl p-4 mb-6">
                <p className="text-red-400">{error.message}</p>
              </div>
            )}

            {/* Subscription Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <SubscriptionCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan === plan.id}
                  onSelect={() => handlePlanSelect(plan.id)}
                />
              ))}
            </div>

            {/* Subscription Action */}
            {selectedPlan && (
              <div className="mt-8 bg-gradient-to-br from-[#2A2A2A] to-[#232323] rounded-xl p-6 border border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Ready to Upgrade?
                    </h3>
                    <p className="text-[#B9B9B9] text-sm">
                      Complete your subscription to unlock premium features
                    </p>
                  </div>
                  <button
                    onClick={() => handleSubscribe(selectedPlan)}
                    disabled={isCreatingSubscription || !stripe || !elements}
                    className="px-6 py-3 bg-[#EFA427] hover:bg-[#EFA427]/90 
      disabled:opacity-50 rounded-xl text-black font-medium 
      transition-colors flex items-center gap-2"
                  >
                    {isCreatingSubscription ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Medal className="w-5 h-5" />
                    )}
                    {isCreatingSubscription
                      ? "Processing..."
                      : "Complete Subscription"}
                  </button>
                </div>
              </div>
            )}

            {/* Subscription Benefits */}
            <div className="mt-12">
              <h3 className="text-xl font-semibold text-white mb-6">
                Why Go Premium?
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {BENEFITS.map((benefit, index) => (
                  <BenefitCard
                    key={index}
                    icon={benefit.icon}
                    title={benefit.title}
                    description={benefit.description}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Wrapper component to ensure Stripe elements are available
export default function SubscriptionPage(): JSX.Element {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionView />
    </Elements>
  );
}
