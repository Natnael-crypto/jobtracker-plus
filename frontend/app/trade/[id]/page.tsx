"use client";

import { ReviewCard2 } from "@/components/client/ReviewCard";
import ImageGallery from "@/components/common/ImageGallery";
import LoadingPage from "@/components/common/LoadingPage";
import Footer from "@/components/langing/Footer";
import TopNav from "@/components/langing/top";
import { useProvider } from "@/hooks/useTrade";
import { ProviderDetail } from "@/types/trade";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const UserIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CheckCircleIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

const StarIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="none"
    className={props.className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ProfileHeader: React.FC<{ profile: ProviderDetail }> = ({ profile }) => {
  console.log(profile);
  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center">
        {profile.Profile.image_url !== "" ? (
          <img
            src={profile.Profile.image_url}
            className="w-10 h-10 rounded-full object-cover mr-4 p-1 border rounded-full"
          />
        ) : (
          <UserIcon className="w-10 h-10 text-gray-500 mr-4 p-1 border rounded-full" />
        )}
        <div className="flex flex-col">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold mr-2">
              {profile.Profile.first_name} {profile.Profile.last_name}
            </h1>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <StarIcon className="w-4 h-4 text-yellow-600 mr-1" />
            <span className="font-medium mr-1">{profile.Rate}</span>
            <span className="text-gray-400 mr-2">
              ({profile.ReviewCount.toLocaleString()})
            </span>
            <span>{profile.Address?.street}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSection: React.FC<{ profile: ProviderDetail }> = ({
  profile,
}) => {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <div className="mb-8">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-3 mr-6 text-lg font-medium transition ${
            activeTab === "services"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`pb-3 text-lg font-medium transition ${
            activeTab === "reviews"
              ? "text-gray-900 border-b-2 border-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reviews
        </button>
      </div>

      {activeTab === "services" && (
        <>
          <div className="flex overflow-x-auto whitespace-nowrap space-x-2 py-2 mb-4">
            {profile.Service.map((tab, index) => (
              <button
                key={tab.id}
                className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                  index === 0
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
                }`}
              >
                {tab.service_name}
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === "reviews" && (
        <div>
          {profile &&
            profile.Review.map((review) => <ReviewCard2 review={review} />)}
          {profile && profile.Review.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No reviews found.</p>
          )}
        </div>
      )}
    </div>
  );
};

const AboutSection: React.FC<{ profile: ProviderDetail }> = ({ profile }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4">About</h2>
    <p className="text-gray-600 leading-relaxed">
      {profile.BusinessIntroduction?.description}
    </p>
  </div>
);

const InfoSection: React.FC<{ profile: ProviderDetail }> = ({ profile }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
    <div>
      <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Verified business by JOBTRACKER
          </span>
        </div>
        <div className="flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Instant Confirmation
          </span>
        </div>
        <div className="flex items-center">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-gray-700 font-medium">
            Accepts cash or card payments
          </span>
        </div>
      </div>
    </div>
  </div>
);

const ActionCard: React.FC<{ profile: ProviderDetail }> = ({ profile }) => {
  return (
    <div className="p-6 border border-gray-200 rounded-xl shadow-lg sticky top-8 bg-white">
      <button className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold text-lg mb-4 hover:bg-green-700 transition">
        Invite Now
      </button>

      <p className="text-gray-500 text-sm">
        Post a job to get started
        <a href="#" className="text-blue-600 ml-1 hover:underline">
          See how it works.
        </a>
      </p>
    </div>
  );
};

const TradePersonProfile: React.FC = () => {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading, isError, error } = useProvider(id);
  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <br />
      <br />
      <br />
      <br />
      {data != undefined && !isLoading ? (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <ProfileHeader profile={data} />
          <ImageGallery profile={data} />

          <div className="grid grid-cols-1 lg:grid-cols-10 gap-10">
            <main className="lg:col-span-7">
              <ServicesSection profile={data} />
              <AboutSection profile={data} />
              <InfoSection profile={data} />
            </main>

            <aside className="lg:col-span-3">
              <ActionCard profile={data} />
            </aside>
          </div>
        </div>
      ) : (
        <LoadingPage />
      )}
      <Footer />
    </div>
  );
};

export default TradePersonProfile;
