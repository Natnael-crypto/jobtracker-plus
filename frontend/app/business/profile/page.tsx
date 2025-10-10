"use client";

import React from "react";
import ServiceDetailsSection from "@/components/business/ServiceDetailsSection";
import QualificationsPage from "@/components/business/QualificationsPage";
import AccountClosureSection from "@/components/business/AccountClosureSection";
import Portfolio from "@/components/business/Portfolio";
import { ChangePasswordSection } from "@/components/common/ChangePasswordSection";
import { ProfileDetailsSection } from "@/components/common/ProfileDetailsSection";
import AboutMe from "@/components/business/AboutMe";
import AddressAutocomplete from "@/components/common/AddressAutocomplete";
import JobRadius from "@/components/common/JobRange";

const ProfileSection: React.FC = () => {
  return (
    <div className="">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>

          <div className="border-t border-gray-200 mt-6" />
        </header>

        <ProfileDetailsSection />
        <AddressAutocomplete />

        <JobRadius />

        <AboutMe />

        <ServiceDetailsSection />

        <QualificationsPage />

        <Portfolio />
        <ChangePasswordSection />
        <AccountClosureSection />
      </div>
    </div>
  );
};

export default ProfileSection;
