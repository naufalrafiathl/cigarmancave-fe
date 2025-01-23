"use client";
import React, { useState } from "react";
import { useSubscriptionOperations } from "@/hooks/useSubscriptionOperations";
import {
  Trophy,
  Medal,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Calendar,
  DollarSign,
} from "lucide-react";

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

// Subscription Card Component
const SubscriptionCard = ({
  plan,
  isSelected,
  onSelect,
}: SubscriptionCardProps) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border rounded-xl 
        transition-all duration-300 cursor-pointer relative overflow-hidden
        ${
          isSelected
            ? "border-[#E25931] ring-2 ring-[#E25931]/20"
            : "border-white/10 hover:border-[#E25931]"
        }`}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 bg-[#E25931] rounded-full p-1">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-xl">{plan.name}</h3>
          <div className="bg-[#E25931]/10 px-3 py-1 rounded-full">
            <span className="text-[#E25931] text-sm font-medium">
              ${plan.price}/{plan.interval}
            </span>
          </div>
        </div>

        <p className="text-[#B9B9B9] text-sm leading-relaxed">
          {plan.description}
        </p>

        <div className="space-y-3">
          <h4 className="text-white font-medium">Features:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[#B9B9B9] text-sm group"
              >
                <Trophy className="w-4 h-4 text-[#E25931] mt-0.5 group-hover:text-[#EFA427] transition-colors" />
                <span className="group-hover:text-white transition-colors">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Active Subscription Status Component
const ActiveSubscriptionCard = ({
  status,
  currentPeriodEnd,
  onCancel,
  isCanceling,
}: {
  status: string;
  currentPeriodEnd: Date;
  onCancel: () => void;
  isCanceling: boolean;
}) => {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "active":
        return {
          icon: ShieldCheck,
          color: "text-green-400",
          bgColor: "bg-green-400/10",
          text: "Active",
        };
      case "canceled":
        return {
          icon: AlertCircle,
          color: "text-[#E25931]",
          bgColor: "bg-[#E25931]/10",
          text: "Canceled",
        };
      case "cancelling":
        return {
          icon: Calendar,
          color: "text-yellow-400",
          bgColor: "bg-yellow-400/10",
          text: "Canceling Soon",
        };
      default:
        return {
          icon: ShieldCheck,
          color: "text-[#B9B9B9]",
          bgColor: "bg-[#B9B9B9]/10",
          text: status,
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl border border-white/10">
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">
              Current Subscription
            </h2>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}
            >
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>
          </div>

          {
            <div className="flex flex-col items-end">
              <span className="text-[#B9B9B9] text-sm">
                {status.toLowerCase() === "canceled" ||
                status.toLowerCase() === "canceling"
                  ? "Access Until"
                  : "Next Billing"}
              </span>
              <span className="text-white font-medium">
                {new Date(currentPeriodEnd).toLocaleDateString()}
              </span>
            </div>
          }
        </div>

        {status.toLowerCase() === "active" && (
          <button
            onClick={onCancel}
            disabled={isCanceling}
            className="w-full sm:w-auto px-6 py-3 bg-[#E25931]/10 hover:bg-[#E25931]/20 
              text-[#E25931] rounded-xl font-medium transition-colors flex items-center 
              justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCanceling ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                Cancel Subscription
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const CancelConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          Cancel Subscription?
        </h3>
        <p className="text-[#B9B9B9] text-sm leading-relaxed mb-6">
          Are you sure you want to cancel your subscription? You'll continue to
          have access to premium features until the end of your current billing
          period.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#404040] hover:bg-[#505050] 
              text-white rounded-lg transition-colors"
          >
            Keep Subscription
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-[#E25931] hover:bg-[#E25931]/90 
              text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm Cancel"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export function SubscriptionView() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const {
    plans,
    plansLoading,
    createSubscription,
    cancelSubscription,
    isCancelingSubscription,
    isCreatingSubscription,
    error,
    isAuthenticated,
    subscriptionStatus,
  } = useSubscriptionOperations();

  const handleSubscribe = async (priceId: string) => {
    if (!isAuthenticated) return;
    try {
      await createSubscription({ priceId });
    } catch (err) {
      console.error("Subscription error:", err);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription();
    } catch (err) {
      console.error("Cancellation error:", err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
        <div className="text-center px-4">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Please Log In
          </h2>
          <p className="text-[#B9B9B9] mb-6 max-w-md">
            You need to be logged in to view and manage subscription plans
          </p>
          <a
            href="/api/auth/login"
            className="inline-flex items-center px-6 py-3 bg-[#E25931] hover:bg-[#E25931]/90 
              text-white rounded-xl font-medium transition-colors"
          >
            Log In to Continue
          </a>
        </div>
      </div>
    );
  }

  const benefits: BenefitCardProps[] = [
    {
      icon: Trophy,
      title: "Advanced Cigar Insights",
      description:
        "Get detailed insights and expert information about cigars as you review them, enhancing your smoking experience and knowledge",
    },
    {
      icon: DollarSign,
      title: "Smart Receipt Import",
      description:
        "Skip manual entry - simply upload your cigar receipts to automatically populate your digital humidor, perfectly mirroring your physical collection",
    },
    {
      icon: Medal,
      title: "Early Access to New Features",
      description:
        "Be among the first to experience exciting new features coming soon - including advance recommendation, profile insights, and more",
    },
    {
      icon: ShieldCheck,
      title: "Support the Community",
      description:
        "Your subscription helps us build a better platform for cigar enthusiasts worldwide, ensuring continuous improvements and innovations",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Active/Cancelled Subscription Status */}
        {subscriptionStatus?.hasSubscription ? (
          <>
            <div className="mb-8">
              <ActiveSubscriptionCard
                status={subscriptionStatus.status || "active"}
                currentPeriodEnd={subscriptionStatus.currentPeriodEnd!}
                onCancel={handleCancel}
                isCanceling={isCancelingSubscription}
              />
            </div>

            {/* Additional Info for Cancelling Status */}
            {subscriptionStatus?.status?.toLowerCase() === "canceling" && (
              <div className="mb-8 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl p-6 border border-[#EFA427]/20">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#EFA427]" />
                  </div>
                  <div>
                    <h3 className="text-[#EFA427] font-medium mb-2">
                      Your Premium Benefits Continue
                    </h3>
                    <p className="text-[#B9B9B9] text-sm leading-relaxed">
                      You'll continue to enjoy all premium features until{" "}
                      {subscriptionStatus?.currentPeriodEnd
                        ? new Date(
                            subscriptionStatus.currentPeriodEnd
                          ).toLocaleDateString()
                        : "the end of your billing period"}
                      . You won't be billed again after this period. Feel free
                      to resubscribe anytime to maintain your premium status.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Show Plans Section only for non-subscribers
          <div className="space-y-8">
            {error && (
              <div className="bg-[#E25931]/10 border border-[#E25931] rounded-xl p-4">
                <p className="text-[#E25931]">{error.message}</p>
              </div>
            )}

            {plansLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#E25931] animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <SubscriptionCard
                      key={plan.id}
                      plan={plan}
                      isSelected={selectedPlan === plan.id}
                      onSelect={() => setSelectedPlan(plan.id)}
                    />
                  ))}
                </div>

                {selectedPlan && (
                  <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl p-6 border border-white/10">
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
                        disabled={isCreatingSubscription}
                        className="w-full sm:w-auto px-6 py-3 bg-[#E25931] hover:bg-[#EFA427] 
                          disabled:opacity-50 rounded-xl text-white font-medium 
                          transition-colors flex items-center justify-center gap-2"
                      >
                        {isCreatingSubscription ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Medal className="w-5 h-5" />
                            Complete Subscription
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Benefits Section - Always visible */}
        <div className="mt-12 space-y-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-3">
            Premium Benefits
            <span className="text-[#EFA427] text-sm font-normal bg-[#EFA427]/10 px-3 py-1 rounded-full">
              What you'll get
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-xl p-6 
                  border border-white/10 hover:border-[#EFA427] transition-all duration-300"
              >
                <div className="mb-4">
                  <benefit.icon className="w-8 h-8 text-[#EFA427]" />
                </div>
                <h4 className="text-white font-semibold mb-2">
                  {benefit.title}
                </h4>
                <p className="text-[#B9B9B9] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionView;
