"use client";

import React from "react";

import { ProfileDetailsSection } from "@/components/common/ProfileDetailsSection";
import { ChangePasswordSection } from "@/components/common/ChangePasswordSection";

const ProfileSection: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>

          <div className="border-t border-gray-200 mt-6" />
        </header>

        <ProfileDetailsSection />

        <ChangePasswordSection />
      </div>
    </div>
  );
};

export default ProfileSection;
