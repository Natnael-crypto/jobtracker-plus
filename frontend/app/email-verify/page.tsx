"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import Footer from "@/components/langing/Footer";
import TopNav from "@/components/langing/top";

function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Email verification in progress...");

  const verifyEmailMutation = useMutation({
    mutationFn: async (token: string) => {
      const res = await api.post("/verify-email", { code: token });
      return res.data;
    },
    onSuccess: () => {
      setMessage(" Email verified successfully!");
    },
    onError: (error: any) => {
      if (error.response && error.response.status === 400) {
        setTimeout(() => {
          verifyEmailMutation.mutate(token!);
        }, 2000);
      } else {
        setMessage(" Verification failed. Please try again later.");
      }
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    } else {
      setMessage("Invalid verification link.");
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4">
      <TopNav />
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            {message}
          </h1>

          {verifyEmailMutation.isPending && (
            <p className="text-gray-500 animate-pulse">Please wait...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
