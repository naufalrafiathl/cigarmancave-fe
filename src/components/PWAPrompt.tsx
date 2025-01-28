// src/components/PWAPrompt.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type BrowserType = "safari" | "chrome-ios" | "chrome-android";

const INSTALL_INSTRUCTIONS: Record<
  BrowserType,
  { steps: string[]; note?: string }
> = {
  safari: {
    steps: [
      "Tap the Share button (rectangle with arrow) at the bottom of Safari",
      "In the share menu, scroll down and tap 'Add to Home Screen'",
      "On the Add to Home screen menu, you can edit the name if you'd like",
      "Tap 'Add' in the top right corner to install",
    ],
  },
  "chrome-ios": {
    steps: [
      "Tap the Share button (rectangle with arrow) at the top right corner in Safari",
      "In the share menu, scroll down and tap 'Add to Home Screen'",
      "Tap 'Add' in the top right corner to install",
    ],
  },
  "chrome-android": {
    steps: [
      "Tap the three-dot menu (⋮) in the top right corner of Chrome",
      "Look for 'Install app' or 'Add to Home screen' in the menu",
      "Review the installation prompt that appears",
      "Tap 'Install' to add the app to your home screen",
    ],
    note: "The app icon will appear on your home screen after installation",
  },
};

export function PWAPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | null>(null);
  const [showHowTo, setShowHowTo] = useState(false);
  const [selectedBrowser, setSelectedBrowser] = useState<BrowserType>("safari");
  const [lastDismissed, setLastDismissed] = useLocalStorage(
    "pwa-prompt-dismissed",
    ""
  );

  useEffect(() => {
    const checkDevice = () => {
      const ua = navigator.userAgent;
      const iOS = /iPad|iPhone|iPod/.test(ua);
      const android = /Android/.test(ua);
      const isPWA = window.matchMedia("(display-mode: standalone)").matches;
      const canShowAgain =
        !lastDismissed ||
        Date.now() - new Date(lastDismissed).getTime() >
          7 * 24 * 60 * 60 * 1000;

          if (!isPWA && canShowAgain && (iOS || android)) {
            setPlatform(iOS ? 'ios' : 'android');
            setIsOpen(true);
          }
    };

    const timer = setTimeout(checkDevice, 2000);
    return () => clearTimeout(timer);
  }, [lastDismissed]);

  const handleDismiss = () => {
    setIsOpen(false);
    setLastDismissed(new Date().toISOString());
  };

  const TabButton = ({
    browser,
    label,
  }: {
    browser: BrowserType;
    label: string;
  }) => (
    <button
      className={`px-4 py-2 rounded-lg transition-colors ${
        selectedBrowser === browser
          ? "bg-[#EFA427] text-black"
          : "text-[#B9B9B9] hover:bg-[#222222]"
      }`}
      onClick={() => setSelectedBrowser(browser)}
    >
      {label}
    </button>
  );

  const Instructions = () => (
    <div className="space-y-6">
      {/* Browser Tabs */}
      <div className="flex gap-2 p-1 bg-[#222222] rounded-lg">
        {platform === "ios" ? (
          <>
            <TabButton browser="safari" label="Safari" />
            <TabButton browser="chrome-ios" label="Chrome" />
          </>
        ) : (
          <TabButton browser="chrome-android" label="Chrome" />
        )}
      </div>

      {/* Instructions Content */}
      <div className="space-y-4">
        <ol className="list-decimal pl-5 space-y-3">
          {INSTALL_INSTRUCTIONS[selectedBrowser].steps.map((step, index) => (
            <li key={index} className="text-[#B9B9B9]">
              {step}
            </li>
          ))}
        </ol>

        {INSTALL_INSTRUCTIONS[selectedBrowser].note && (
          <div className="text-sm text-[#B9B9B9]/80 bg-[#222222] p-3 rounded-lg">
            {INSTALL_INSTRUCTIONS[selectedBrowser].note}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Initial Prompt */}
      <Dialog
        open={isOpen && !showHowTo}
        onClose={() => {}}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded-lg bg-[#1E1E1E] shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#222222]">
              <Dialog.Title className="text-xl font-semibold text-[#EFA427]">
                Get the Best Experience
              </Dialog.Title>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-[#222222] rounded-full transition-colors text-[#B9B9B9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-[#B9B9B9]">
              <Dialog.Description className="mb-4">
                Install our app for a better experience with offline access and
                faster loading.
              </Dialog.Description>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 bg-[#EFA427] text-black rounded-lg hover:bg-[#EFA427]/90 transition-colors"
                  onClick={() => setShowHowTo(true)}
                >
                  Show Me How
                </button>
                <button
                  className="px-4 py-2 border border-[#222222] rounded-lg hover:bg-[#222222] transition-colors"
                  onClick={handleDismiss}
                >
                  Not Now
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* How-To Instructions */}
      <Dialog
        open={showHowTo}
        onClose={() => setShowHowTo(false)}
        className="relative z-50"
      >
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-[#1E1E1E] shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#222222]">
              <Dialog.Title className="text-xl font-semibold text-[#EFA427]">
                Installation Instructions
              </Dialog.Title>
              <button
                onClick={() => setShowHowTo(false)}
                className="p-1 hover:bg-[#222222] rounded-full transition-colors text-[#B9B9B9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <Instructions />

              <button
                className="w-full px-4 py-2 bg-[#EFA427] text-black rounded-lg hover:bg-[#EFA427]/90 transition-colors"
                onClick={() => {
                  setShowHowTo(false);
                  setIsOpen(false);
                }}
              >
                Got It
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
