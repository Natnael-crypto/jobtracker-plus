"use client";

import { useDeleteAccount } from "@/hooks/useLogin";
import * as React from "react";
import { useState } from "react";

const ArrowUpRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <polyline points="7 17 17 7"></polyline>
    <line x1="7" y1="7" x2="17" y2="7"></line>
    <line x1="17" y1="17" x2="17" y2="7"></line>
  </svg>
);

const AccountClosureSection: React.FC = () => {
  const [password, setPassword] = useState("");
  const deleteAccount = useDeleteAccount();

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      console.error("Please enter your password.");
      return;
    }

    try {
      await deleteAccount.mutateAsync({ password });
      window.location.href = "/";
    } catch (err: any) {
      console.error("❌ Error deleting account:", err.message);
    }
  };

  return (
    <div className="">
      <div className="max-w-4xl mx-auto border border-gray-100">
        <div className="px-6 pt-8 pb-4 sm:px-10 sm:pt-10 sm:pb-5">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Closing Account
          </h1>
        </div>

        <div className="border-t border-gray-200"></div>

        <form onSubmit={handleDelete} className="px-6 py-6 sm:px-10 sm:py-8">
          <p className="text-base text-gray-600 mb-8 max-w-2xl">
            Warning: If you close your account, you will{" "}
            <strong>permanently lose access</strong> to your business account,
            and will lose access forever.
          </p>

          <div className="space-y-2 mb-8">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Enter Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full max-w-lg px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base transition duration-150 ease-in-out"
              placeholder="**********"
              required
              disabled={deleteAccount.isPending}
            />
          </div>

          <button
            type="submit"
            disabled={deleteAccount.isPending}
            className={`
              inline-flex items-center justify-center 
              px-6 py-2 border border-transparent text-base font-medium rounded-lg shadow-sm 
              text-white bg-[#66BB6A] hover:bg-[#5CB85C] 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#66BB6A]
              transition duration-150 ease-in-out w-[150px]
              ${deleteAccount.isPending ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {deleteAccount.isPending ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                Delete
                <ArrowUpRightIcon className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountClosureSection;
