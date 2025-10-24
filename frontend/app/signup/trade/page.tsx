"use client";

import { useState } from "react";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { useSignUp } from "@/hooks/useLogin";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const {
    mutate: signup,
    error: signupError,
    isPending: isLoading,
  } = useSignUp();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      let signupForm = {
        email: form.email,
        password: form.password,
        role: "business",
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
      };
      signup(signupForm);
      router.push("/business");
    } catch (err) {
      setError("Server error, please try again");
    }
  };

  return (
    <div>
      <TopNav />
      <br />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Create an account
          </h2>
          {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  href="/info"
                  className="text-black font-semibold hover:underline"
                >
                  JobTracker + Terms of Use{" "}
                </a>
                &{" "}
                <a
                  href="/info"
                  className="text-black font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?
            <a
              href="/login"
              className="text-black font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
}
