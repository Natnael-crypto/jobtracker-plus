"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Step1Form } from "@/components/client/Step1Form";
import { Step2Form } from "@/components/client/Step2Form";
import { Step3Form } from "@/components/client/Step3Form";
import Step4Review from "@/components/client/Step4Form";
import { SidebarJob } from "@/components/client/SidebarJob";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { v4 as uuidv4 } from "uuid";
import { useUser, useSignUp, useLogin } from "@/hooks/useLogin";
import api from "@/lib/axios";

type Step = 1 | 2 | 3 | 4;

export interface BookingData {
  id: string;
  step: Step;
  service: string;
  serviceDetails: string;
  timeline:
    | "As soon as possible"
    | "Specific date"
    | "Flexible"
    | "Not Set"
    | string;
  budget:
    | "£50 - £1,000"
    | "£1,000 - £5,000"
    | "£5,000 +"
    | "Prefer not to say"
    | "Not Set";
  location: string;
  description: string;
  hasPhotos: "Yes" | "No, maybe later" | "Not Set";
  headline: string;
  imageUrls: string[];
  address: {
    label: string;
    countryCode: string;
    countryName: string;
    state: string;
    countyCode: string;
    county: string;
    city: string;
    postalCode: string;
  };
}

const INITIAL_DATA: BookingData = {
  id: "",
  step: 1,
  service: "",
  serviceDetails: "",
  timeline: "Not Set",
  budget: "Not Set",
  location: "",
  description: "",
  hasPhotos: "Not Set",
  headline: "",
  imageUrls: [],
  address: {
    label: "",
    countryCode: "",
    countryName: "",
    state: "",
    countyCode: "",
    county: "",
    city: "",
    postalCode: "",
  },
};

const STORAGE_KEY = "bookingData";

export const ACCENT_COLOR = "#69B87F";
export const BG_COLOR = "#F7F7F7";
export const LIGHT_BORDER = "#DDEEED";

export const Card: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
    {children}
  </div>
);

export default function JobCreateForm() {
  const [data, setData] = useState<BookingData>(INITIAL_DATA);
  const [authStep, setAuthStep] = useState<
    "none" | "email" | "login" | "signup"
  >("none");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const { data: user, error: userError, refetch: refetchUser } = useUser();
  const { mutate: signup, isPending: isSigningUp } = useSignUp();
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  // ---- LOAD BOOKING DATA ----
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: BookingData = JSON.parse(saved);
        setData(parsed);
        return;
      } catch {
        console.warn("Invalid booking data in localStorage, resetting.");
      }
    }
    const freshData = { ...INITIAL_DATA, id: uuidv4() };
    setData(freshData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  }, []);

  // ---- UPDATE BOOKING DATA ----
  const updateData = useCallback((fields: Partial<BookingData>) => {
    setData((prev) => {
      const updated = { ...prev, ...fields };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // ---- STEP NAVIGATION ----
  const nextStep = useCallback(() => {
    setData((prev) => {
      const next = (prev.step + 1) as Step;
      const updated = { ...prev, step: next };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const prevStep = useCallback(() => {
    setData((prev) => {
      if (prev.step > 1) {
        const prevStep = (prev.step - 1) as Step;
        const updated = { ...prev, step: prevStep };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, []);

  const clearForm = useCallback(() => {
    const freshData = { ...INITIAL_DATA, id: uuidv4() };
    setData(freshData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
  }, []);

  // ---- AUTH FLOW HANDLERS ----
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmailCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.get(`/email?email=${form.email}`);
      const exists = res.data.exists;
      if (exists) {
        setAuthStep("login");
      } else {
        setAuthStep("signup");
      }
    } catch {
      setError("Error verifying email. Please try again.");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password) {
      setError("Password is required");
      return;
    }
    login(
      { email: form.email, password: form.password },
      {
        onSuccess: async () => {
          await refetchUser();
          setAuthStep("none");
        },
        onError: () => setError("Invalid credentials"),
      }
    );
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    signup(
      {
        email: form.email,
        password: form.password,
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        role: "client",
      },
      {
        onSuccess: async () => {
          await refetchUser();
          setAuthStep("none");
        },
        onError: () => setError("Signup failed. Try again."),
      }
    );
  };

  // ---- STEP TITLE ----
  const stepTitle = useMemo(() => {
    switch (data.step) {
      case 1:
        return "Service Details";
      case 2:
        return "Other Details";
      case 3:
        return "Additional Info";
      case 4:
        return "Review & Submit";
      default:
        return "Submission Complete";
    }
  }, [data.step]);

  // ---- AUTH CHECK AT STEP 4 ----
  useEffect(() => {
    if (data.step === 4 && (!user || userError)) {
      setAuthStep("email");
    }
  }, [data.step, user, userError]);

  // ---- RENDER ----
  return (
    <div className="min-h-screen p-8 mt-12">
      <TopNav />

      <div className="max-w-7xl mx-auto">
        {/* ---- AUTH FLOW (only shown when needed) ---- */}
        {authStep !== "none" ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {authStep === "email"
                ? "Enter your email"
                : authStep === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

            {/* EMAIL CHECK */}
            {authStep === "email" && (
              <form onSubmit={handleEmailCheck} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 font-semibold"
                >
                  Continue
                </button>
              </form>
            )}

            {/* LOGIN FORM */}
            {authStep === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 font-semibold disabled:opacity-70"
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
                <p
                  onClick={() => setAuthStep("email")}
                  className="text-sm text-gray-600 text-center cursor-pointer hover:underline"
                >
                  Use a different email
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {authStep === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" required />
                  <p className="text-gray-600 text-sm">
                    I accept{" "}
                    <a
                      href="/terms"
                      className="text-black font-semibold hover:underline"
                    >
                      Terms of Use
                    </a>{" "}
                    &{" "}
                    <a
                      href="/privacy"
                      className="text-black font-semibold hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 font-semibold disabled:opacity-70"
                >
                  {isSigningUp ? "Creating account..." : "Sign Up"}
                </button>
              </form>
            )}
          </div>
        ) : (
          <>
            {/* ---- MAIN FORM ---- */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center">
                {data.step <= 4 && (
                  <button
                    onClick={prevStep}
                    className="p-2 mr-4 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft size={24} className="text-gray-800" />
                  </button>
                )}
                <h1 className="text-xl font-medium text-gray-800">
                  {data.step < 4 ? `Step ${data.step} of 3` : stepTitle}
                </h1>
              </div>
              <button
                onClick={clearForm}
                className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Clear Form
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm">
                  {data.step === 1 && (
                    <Step1Form
                      data={data}
                      updateData={updateData}
                      nextStep={nextStep}
                    />
                  )}
                  {data.step === 2 && (
                    <Step2Form
                      data={data}
                      updateData={updateData}
                      nextStep={nextStep}
                    />
                  )}
                  {data.step === 3 && (
                    <Step3Form
                      data={data}
                      updateData={updateData}
                      nextStep={nextStep}
                    />
                  )}
                  {data.step === 4 && <Step4Review data={data} />}
                </div>
              </div>

              <div className="lg:col-span-1">
                <SidebarJob data={data} />
              </div>
            </div>
          </>
        )}
      </div>

      <br />
      <br />
      <Footer />
    </div>
  );
}
