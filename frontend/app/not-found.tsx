"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-black text-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-7xl font-extrabold tracking-tight text-green-600">
          404
        </h1>
        <p className="mt-4 text-2xl font-semibold text-gray-100">
          Page Not Found
        </p>
        <p className="mt-2 text-gray-400 max-w-md mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been removed, renamed, or doesn’t exist anymore.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back Home
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 0.5, duration: 1.2 }}
        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-black"
      />
    </main>
  );
}
