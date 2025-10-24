// app/pages/role-selection.tsx (Next.js 13+ with app router)
"use client";

import Footer from "@/components/langing/Footer";
import TopNav from "@/components/langing/top";
import { useRouter } from "next/navigation";

export default function RoleSelection() {
  const router = useRouter();

  const handleSelection = (role: "client" | "trade") => {
    router.push(`/signup/${role}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-white">
      <TopNav />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-green-500 text-center">
          Select Your Role
        </h1>
        <p className="text-center mb-12 text-gray-900 max-w-md">
          Choose whether you are a client looking for services or a tradesperson
          offering your skills.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => handleSelection("client")}
            className="bg-white hover:bg-green-600 text-black font-semibold py-6 px-12 rounded-lg shadow-lg transition-colors duration-300"
          >
            Client
          </button>
          <button
            onClick={() => handleSelection("trade")}
            className="bg-black hover:bg-gray-800 hover:text-white text-white font-semibold py-6 px-12 rounded-lg shadow-lg transition-colors duration-300"
          >
            Tradesperson
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
