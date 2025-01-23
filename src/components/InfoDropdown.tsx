// src/app/(dashboard)/components/InfoDropdown.tsx
"use client";

import { Info } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { InfoModal } from "./InfoModal";

export function InfoDropdown() {
  const [showPolicies, setShowPolicies] = useState(false);
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowPolicies(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const policies = [
    { 
      title: "Privacy Policy",
      content: (
        <div className="space-y-6 text-[#B9B9B9]">
          <div className="mb-8">
            <p className="text-lg mb-4">Effective Date: January 17, 2025</p>
            <p>Cigar Mancave ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our platform.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Personal Information: Name, email address, date of birth, and account credentials.</li>
              <li>Usage Data: Log data, device information, and browsing activity.</li>
              <li>Content: Photos, reviews, comments, and other content you post.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services.</li>
              <li>Personalize user experience.</li>
              <li>Communicate with users about updates, promotions, and support.</li>
              <li>Monitor and moderate content to maintain community standards.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">3. Sharing Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not sell your information.</li>
              <li>Data may be shared with service providers for operations.</li>
              <li>Legal compliance or protection of rights may require data disclosure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">4. Content and Age Restrictions</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must be 21+ or meet the legal smoking age in their jurisdiction.</li>
              <li>Prohibited content includes illegal tobacco sales, hate speech, sexually explicit material, graphic violence, and other sensitive or harmful content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">5. Data Security</h2>
            <p>We use standard security measures to protect your data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">6. Contact Us</h2>
            <p>Cigar Mancave</p>
            <p>Brisbane, Australia</p>
            <p>Email: contact@cigarmancave.com</p>
          </section>
        </div>
      )
    },
    { 
      title: "Terms of Use",
      content: (
        <div className="space-y-6 text-[#B9B9B9]">
          <div className="mb-8">
            <p className="text-lg mb-4">Effective Date: January 17, 2025</p>
            <p>Welcome to Cigar Mancave! By using our platform, you agree to the following terms.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">1. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must be 21+ or of legal smoking age in their location.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">2. User-Generated Content</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You own the content you post but grant us a license to display and share it.</li>
              <li>Prohibited content includes unlawful, harmful, misleading, sexually explicit, or violent material.</li>
              <li>We may remove content that violates these terms or applicable laws.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">3. Prohibited Activities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Selling or promoting tobacco products without proper authorization.</li>
              <li>Spamming, harassment, abusive behavior, and sharing explicit or harmful content.</li>
              <li>Attempting to bypass content moderation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">4. Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate our terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">5. Limitation of Liability</h2>
            <p>We are not liable for user content or third-party actions on the platform.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">6. Compliance with Tobacco Laws</h2>
            <p>Users must comply with local, state, and federal tobacco regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">7. Contact Us</h2>
            <p>Cigar Mancave</p>
            <p>Brisbane, Australia</p>
            <p>Email: contact@cigarmancave.com</p>
          </section>
        </div>
      )
    },
    { 
      title: "Fair Use Policy",
      content: (
        <div className="space-y-6 text-[#B9B9B9]">
          <div className="mb-8">
            <p className="text-lg mb-4">Effective Date: January 17, 2025</p>
            <p>Cigar Mancave is committed to fostering a respectful community. This Fair Use Policy ensures a safe and enjoyable experience.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">1. Responsible Use</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Share content relevant to cigars and lifestyle respectfully.</li>
              <li>Do not post content that violates laws, including sexually explicit, violent, or harmful material.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">2. Content Moderation</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We reserve the right to review, moderate, and remove content that violates our policies.</li>
              <li>Repeated violations may result in account suspension or termination.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">3. Age-Restricted Content</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Users must be 21+ or of legal smoking age in their country.</li>
              <li>No promotion of underage smoking or illegal tobacco sales.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">4. Compliance with Laws</h2>
            <p>Follow all applicable laws regarding tobacco use and promotion.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#EFA427] mb-3">5. Contact Us</h2>
            <p>Cigar Mancave</p>
            <p>Brisbane, Australia</p>
            <p>Email: contact@cigarmancave.com</p>
          </section>
        </div>
      )
    },
  ];

  const activeContent = policies.find(p => p.title === activePolicy);

  return (
    <>
      <div className="relative flex items-center gap-1" ref={menuRef}>
        <button
          className="p-2 hover:bg-[#3C3D3E] rounded-full transition-colors text-[#B9B9B9]"
          onClick={() => setShowPolicies(!showPolicies)}
        >
          <Info className="w-5 h-5" />
        </button>

        {showPolicies && (
          <div className="absolute right-0 top-12 w-48 bg-[#1E1E1E] rounded-lg shadow-lg border border-[#222222] py-2 z-50">
            {policies.map((policy) => (
              <button
                key={policy.title}
                onClick={() => {
                  setActivePolicy(policy.title);
                  setShowPolicies(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#B9B9B9] hover:bg-[#222222] hover:text-[#EFA427] transition-colors"
              >
                {policy.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <InfoModal
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        title={activePolicy || ""}
      >
        {activeContent?.content}
      </InfoModal>
    </>
  );
}