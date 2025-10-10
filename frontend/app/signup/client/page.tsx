"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { useSignUp, useLogin } from "@/hooks/useLogin";
import axios from "axios";
import api from "@/lib/axios";

export default function SignUp() {
  const [step, setStep] = useState<"email" | "login" | "signup">("email");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");

  const { mutate: signup, isPending: isSigningUp } = useSignUp();
  const { mutate: login, isPending: isLoggingIn } = useLogin();
  const router = useRouter();

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
        setStep("login");
      } else {
        setStep("signup");
      }
    } catch (err) {
      setError("Error verifying email. Please try again.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.password) {
      setError("Password is required");
      return;
    }

    try {
      login(
        { email: form.email, password: form.password },
        {
          onSuccess: () => router.push("/client/post-job"),
          onError: () => setError("Invalid credentials"),
        }
      );
    } catch {
      setError("Server error, please try again");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
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
          onSuccess: () => router.push("/client/post-job"),
          onError: () => setError("Signup failed. Try again."),
        }
      );
    } catch {
      setError("Server error, please try again");
    }
  };

  return (
    <div>
      <TopNav />
      <br />
      <br />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {step === "email"
              ? "Create an account"
              : step === "login"
              ? "Welcome back"
              : "Complete your account"}
          </h2>

          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

          {/* Step 1: Email check */}
          {step === "email" && (
            <form onSubmit={handleEmailCheck} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
              >
                Continue
              </button>
            </form>
          )}

          {/* Step 2: Login form if email exists */}
          {step === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                />
              </div>
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-70"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </button>
              <p
                onClick={() => setStep("email")}
                className="text-sm text-gray-600 text-center cursor-pointer hover:underline"
              >
                Use a different email
              </p>
            </form>
          )}

          {/* Step 3: Full signup form */}
          {step === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
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
                    JobTracker + Terms of Use{" "}
                  </a>
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
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-70"
              >
                {isSigningUp ? "Creating account..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
