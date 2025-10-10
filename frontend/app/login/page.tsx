"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { useLogin } from "@/hooks/useLogin";
import { getUser } from "@/services/auth";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Sanitize redirect path ---
  const redirectParam = searchParams.get("redirect");
  const redirectPath =
    redirectParam &&
    redirectParam.startsWith("/") &&
    !redirectParam.startsWith("//")
      ? redirectParam
      : "/";

  const { mutateAsync: login, isPending: isLoading } = useLogin();

  // --- Controlled input handler ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // --- Utility: Wait for session initialization ---
  async function waitForSession(timeout = 3000, interval = 200) {
    const start = Date.now();

    while (Date.now() - start < timeout) {
      try {
        const user = await getUser();

        if (user?.data?.role) {
          return user.data;
        }
      } catch {
        // Ignore transient network/session errors during wait
      }

      await new Promise((res) => setTimeout(res, interval));
    }

    throw new Error("Session not ready after login");
  }

  // --- Main submit handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      // --- Attempt login ---
      const res = await login({
        email: form.email.trim(),
        password: form.password,
        redirect: redirectPath,
      });

      if (!res?.success) {
        setError(res?.message || "Invalid credentials");
        return;
      }

      // --- Wait 1s to ensure session cookie/JWT is set ---
      await new Promise((r) => setTimeout(r, 1000));

      const user = await waitForSession();

      if (!user?.role) {
        setError("Could not verify session. Please try again.");
        return;
      }

      // --- Role-based redirect ---
      if (redirectPath !== "/") {
        router.push(redirectPath);
        return;
      }

      switch (user.role) {
        case "client":
          router.push("/client");
          break;
        case "business":
          router.push("/business");
          break;
        case "admin":
          router.push("/admin");
          break;
        default:
          router.push("/");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        "Login failed. Please check your credentials or try again later."
      );
    }
  };

  return (
    <div>
      <TopNav />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Login to your account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div></div>}>
      <Login />
    </Suspense>
  );
}
