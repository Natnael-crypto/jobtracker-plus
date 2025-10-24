"use client";

import FAQHomeowners from "@/components/common/FAQHomeowners";
import FAQTradespeople from "@/components/common/FAQTradespeople";
import HomeownersPrivacyPolicy from "@/components/common/HomeownersPrivacyPolicy";
import HomeownersTermsOfUse from "@/components/common/HomeownersTermsOfUse";
import Sidebar from "@/components/common/sidebar";
import TradespeoplePrivacyPolicy from "@/components/common/TradespeoplePrivacyPolicy";
import TradespeopleTermsOfUse from "@/components/common/TradespeopleTermsOfUse";
import TopNav from "@/components/langing/top";
import React, { JSX, useEffect, useState } from "react";

export default function InfoPage() {
  const sectionKeys: Record<string, string> = {
    "home-owners-privacy-policy": "Homeowners Privacy Policy",
    "home-owners-terms-of-use": "Homeowners Terms of Use",
    "tradespeople-terms-of-use": "Tradespeople Terms of Use",
    "tradespeople-privacy-policy": "Tradespeople Privacy Policy",
    "faq-homeowners": "FAQ – Homeowners",
    "faq-tradespeople": "FAQ – Tradespeople",
  };

  const [activeContent, setActiveContent] = useState(
    "Homeowners Privacy Policy"
  );

  const contentMap: Record<string, JSX.Element> = {
    "Homeowners Privacy Policy": <HomeownersPrivacyPolicy />,
    "Homeowners Terms of Use": <HomeownersTermsOfUse />,
    "Tradespeople Terms of Use": <TradespeopleTermsOfUse />,
    "Tradespeople Privacy Policy": <TradespeoplePrivacyPolicy />,
    "FAQ – Homeowners": <FAQHomeowners />,
    "FAQ – Tradespeople": <FAQTradespeople />,
  };

  // Function to update state based on hash
  const updateActiveContentFromHash = () => {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    if (hash && sectionKeys[hash]) {
      setActiveContent(sectionKeys[hash]);
    }
  };

  // On initial load and when hash changes
  useEffect(() => {
    updateActiveContentFromHash();
    window.addEventListener("hashchange", updateActiveContentFromHash);
    return () => {
      window.removeEventListener("hashchange", updateActiveContentFromHash);
    };
  }, []);

  // Optional: Update URL hash when activeContent changes
  useEffect(() => {
    const hashKey = Object.keys(sectionKeys).find(
      (key) => sectionKeys[key] === activeContent
    );
    if (hashKey && window.location.hash.replace("#", "") !== hashKey) {
      window.history.replaceState(null, "", `#${hashKey}`);
    }
  }, [activeContent]);

  return (
    <div className="min-h-screen bg-white font-sans">
      <TopNav />
      <div className="flex flex-col md:flex-row mt-16">
        <Sidebar activeItem={activeContent} onSelect={setActiveContent} />
        <main className="flex-1 p-6 pt-1 md:p-10 lg:p-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              {activeContent}
            </h1>
            <div className="prose prose-lg max-w-none text-gray-700">
              {contentMap[activeContent]}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
