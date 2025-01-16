"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSubscriptionOperations } from '@/hooks/useSubscriptionOperations';
import { Loader2, CheckCircle } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifySubscription } = useSubscriptionOperations();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    async function confirmSubscription() {
      if (!sessionId) {
        setError('No session ID found');
        setIsLoading(false);
        return;
      }

      try {
        // Verify subscription on backend
        const result = await verifySubscription(sessionId);

        if (result) {
          setIsSuccess(true);
        } else {
          setError('Subscription verification failed');
        }
      } catch (err) {
        console.error('Subscription verification error:', err);
        setError('An error occurred during subscription verification');
      } finally {
        setIsLoading(false);
      }
    }

    confirmSubscription();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-12 h-12 text-[#EFA427] animate-spin" />
          <p className="text-white">Confirming your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#222222]">
        <div className="text-center p-8 bg-red-500/10 border border-red-500 rounded-xl">
          <h2 className="text-2xl font-semibold text-red-400 mb-4">
            Subscription Error
          </h2>
          <p className="text-white mb-6">{error}</p>
          <button 
            onClick={() => router.push('/subscription')}
            className="px-6 py-2 bg-[#EFA427] text-black rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-[#222222]">
      <div className="text-center">
        <CheckCircle className="mx-auto mb-4 w-16 h-16 text-[#EFA427]" />
        <h2 className="text-2xl font-semibold text-white mb-4">
          Subscription Successful!
        </h2>
        <p className="text-[#B9B9B9] mb-6">
          Thank you for subscribing. You now have access to premium features.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-[#EFA427] text-black rounded-xl"
          >
            Go to Home
          </button>
          <button 
            onClick={() => router.push('/profile')}
            className="px-6 py-2 border border-white/10 text-white rounded-xl"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}