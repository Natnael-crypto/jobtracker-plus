"use client";

import React, { useState, useMemo } from "react";
import { X, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { ProfileStat } from "@/types/userProfile";
import { useUserProfileStat } from "@/hooks/useUserProfile";

const ProfileSetupStatus: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { data: userProfileStat, isLoading, isError } = useUserProfileStat();

  const safeProfile: ProfileStat | null = userProfileStat ?? null;

  const {
    completedCount,
    totalCount,
    percentage,
    completedKeys,
    incompleteKeys,
  } = useMemo(() => {
    if (!safeProfile) {
      return {
        completedCount: 0,
        totalCount: 0,
        percentage: 0,
        completedKeys: [],
        incompleteKeys: [],
      };
    }

    const entries = Object.entries(safeProfile);
    const completed = entries.filter(([, value]) => value);
    const incomplete = entries.filter(([, value]) => !value);
    const total = entries.length;

    return {
      completedCount: completed.length,
      totalCount: total,
      percentage: Math.round((completed.length / total) * 100),
      completedKeys: completed.map(([key]) => key),
      incompleteKeys: incomplete.map(([key]) => key),
    };
  }, [safeProfile]);

  if (!isVisible || isError) return null;

  return (
    <div className="fixed top-16 right-4 z-50 w-72">
      <div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-4 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-gray-800 text-sm">Profile Setup</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="Toggle Details"
            >
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-600 hover:text-gray-900 transition"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {percentage != 100 && (
          <p className="text-sm text-red-500 mb-2">
            Finish profile setup to bid for jobs
          </p>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-1 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              percentage < 40
                ? "bg-red-500"
                : percentage < 70
                ? "bg-yellow-500"
                : "bg-green-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Loading or Stats */}
        {isLoading ? (
          <p className="text-xs text-gray-500 animate-pulse">
            Loading profile status...
          </p>
        ) : (
          <p className="text-xs text-gray-600 mb-2">
            <span className="font-medium">{completedCount}</span> of{" "}
            <span className="font-medium">{totalCount}</span> completed (
            {percentage}%)
          </p>
        )}

        {/* Expandable Section */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          {!isLoading && (
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 shadow-inner">
              {/* Completed Section */}
              <div>
                <h3 className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Completed ({completedKeys.length})
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {completedKeys.length > 0 ? (
                    completedKeys.map((key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2 px-2 py-1 bg-green-50 rounded-md hover:bg-green-100 transition cursor-pointer"
                      >
                        <CheckCircle className="text-green-600 w-3.5 h-3.5 flex-shrink-0" />
                        <span className="capitalize text-gray-700">{key}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 px-2">
                      No sections completed
                    </li>
                  )}
                </ul>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-3" />

              {/* Incomplete Section */}
              <div>
                <h3 className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
                  <XCircle className="w-4 h-4 text-red-600" />
                  Incomplete ({incompleteKeys.length})
                </h3>
                <ul className="space-y-1.5 text-xs">
                  {incompleteKeys.length > 0 ? (
                    incompleteKeys.map((key) => (
                      <li
                        key={key}
                        className="flex items-center gap-2 px-2 py-1 bg-red-50 rounded-md hover:bg-red-100 transition cursor-pointer"
                        onClick={() => {
                          window.location.href = "/business/profile#" + key;
                        }}
                      >
                        <XCircle className="text-red-600 w-3.5 h-3.5 flex-shrink-0" />
                        <span className="capitalize text-gray-700">{key}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 px-2">
                      All sections completed 🎉
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupStatus;
