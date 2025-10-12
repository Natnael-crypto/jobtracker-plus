"use client";

import React, { Suspense, useEffect, useState } from "react";
import ServiceDetailsSection from "@/components/business/ServiceDetailsSection";
import QualificationsPage from "@/components/business/QualificationsPage";
import AccountClosureSection from "@/components/business/AccountClosureSection";
import Portfolio from "@/components/business/Portfolio";
import { ChangePasswordSection } from "@/components/common/ChangePasswordSection";
import { ProfileDetailsSection } from "@/components/common/ProfileDetailsSection";
import AboutMe from "@/components/business/AboutMe";
import AddressAutocomplete from "@/components/common/AddressAutocomplete";
import JobRadius from "@/components/common/JobRange";
import { Button } from "@/components/ui/button";
import {
  useCreateVerificationSession,
  useVerified,
} from "@/hooks/useUserProfile";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSearchParams } from "next/navigation";
import VerificationReviewPopup from "@/components/business/VerificationReviewPopup";

const ProfileSection: React.FC = () => {
  const idVerificationParams = useSearchParams();
  const [idVerificationStatus, setIdVerificationStatus] = useState("");
  const { mutate: createVerificationSession } = useCreateVerificationSession();
  const { data: verified } = useVerified();

  useEffect(() => {
    const serviceQuery = idVerificationParams.get("status");
    if (serviceQuery && serviceQuery !== idVerificationStatus) {
      setIdVerificationStatus(serviceQuery);
    }
  }, [idVerificationParams]);

  return (
    <div className="">
      <VerificationReviewPopup show={idVerificationStatus == "In Review"} />
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-3xl font-semibold text-gray-900">
                My Profile
              </h1>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {verified?.verified ? (
                      <BadgeCheck className="w-6 h-6 ml-2 text-green-600 cursor-pointer" />
                    ) : (
                      <BadgeAlert className="w-6 h-6 ml-2 text-red-600 cursor-pointer" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent
                    className={`bg-white text-green-600 text-sm rounded-md px-3 py-2 border-1 border-green-600 ${
                      !verified?.verified && "text-red-600 border-red-600"
                    }`}
                  >
                    {verified?.verified
                      ? "Your identity is verified. You have full access to all features."
                      : "Your account is not verified yet. Please complete verification to unlock all features."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {verified != undefined && verified?.verified === false && (
              <Button
                onClick={() => createVerificationSession()}
                className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded-md font-semibold"
              >
                Verify Identity
              </Button>
            )}
          </div>

          <div className="border-t border-gray-200 mt-6" />
        </header>

        <div id="ProfileImage">
          <ProfileDetailsSection />
        </div>
        <div id="Address">
          <AddressAutocomplete />
        </div>

        <div id="job-radius">
          <JobRadius />
        </div>

        <div id="AboutMe">
          <AboutMe />
        </div>

        <div id="Services">
          <ServiceDetailsSection />
        </div>

        <div id="Qualifications">
          <QualificationsPage />
        </div>

        <div id="Portfolio">
          <Portfolio />
        </div>
        <ChangePasswordSection />
        <AccountClosureSection />
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading trades...</div>}>
      <ProfileSection />
    </Suspense>
  );
}
