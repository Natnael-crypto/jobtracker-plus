"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Services } from "@/data/services";
import { useUser } from "@/hooks/useLogin";
import { motion, AnimatePresence } from "framer-motion";

const paths = [
  { path: "/how-client", name: "How it works" },
  { path: "/how-trade", name: "How a trade works" },
  { path: "/trade", name: "Tradespersons" },
];

const TopNav = () => {
  const { data: user } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMenu = () => setMobileOpen((prev) => !prev);

  return (
    <div className="bg-white text-gray-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-medium tracking-widest text-gray-900"
          >
            JOBTRACKER <span className="text-green-500">+</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8 text-md text-black items-center">
            {/* Categories */}
            <NavigationMenu className="relative">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="font-medium text-md text-black hover:text-gray-900 flex items-center gap-1">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="absolute left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl border mt-2 p-4 grid grid-cols-2 md:grid-cols-3 gap-6 min-w-[900px] max-h-[50vh] overflow-y-auto scrollbar-hide">
                    {Services.map((service) => (
                      <div key={service.id}>
                        <h3 className="font-semibold text-gray-900 text-sm mb-2">
                          {service.name}
                        </h3>
                        <ul className="space-y-1">
                          {service.subcategories.slice(0, 9).map((sub) => (
                            <li key={sub.id}>
                              <NavigationMenuLink
                                asChild
                                className="text-sm text-gray-600 hover:text-green-600 hover:underline transition"
                              >
                                <Link href={`/trade?service=${service.name}`}>
                                  {sub.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {paths.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="hover:text-gray-900 transition duration-150"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3 text-sm">
            {user?.data.role === "client" ? (
              <Link
                href="/client/post-job"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                Post a Job
              </Link>
            ) : (
              <Link
                href="/post-job"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                Post a Job
              </Link>
            )}
            {user?.data.role !== "client" && (
              <Link
                href="/signup/trade"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
              >
                Trade Signup
              </Link>
            )}
            {user ? (
              <Link
                href={
                  user.data.role === "business"
                    ? "/business/profile"
                    : user.data.role === "admin"
                    ? "/admin"
                    : "client/profile"
                }
              >
                <img
                  src="/user-icon.png"
                  alt="User Account"
                  width={28}
                  height={28}
                  className="rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
                />
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-gray-900 font-medium py-2 px-4 hover:bg-gray-50 rounded-lg"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-gray-800 hover:bg-gray-100 transition"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden bg-white border-t shadow-md px-6 py-4 space-y-4"
            >
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Navigation</h3>
                {paths.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-700 hover:text-green-600 text-sm py-1"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">Categories</h3>
                <div className="grid grid-cols-2 gap-2 max-h-[30vh] overflow-y-auto">
                  {Services.slice(0, 8).map((service) => (
                    <Link
                      key={service.id}
                      href={`/trade?service=${service.name}`}
                      onClick={() => setMobileOpen(false)}
                      className="text-sm text-gray-600 hover:text-green-600"
                    >
                      {service.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t flex flex-col gap-3">
                {user?.data.role === "client" ? (
                  <Link
                    href="/client/post-job"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-700 font-medium py-2 border rounded-lg text-center hover:bg-gray-50"
                  >
                    Post a Job
                  </Link>
                ) : (
                  <Link
                    href="/post-job"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-700 font-medium py-2 border rounded-lg text-center hover:bg-gray-50"
                  >
                    Post a Job
                  </Link>
                )}

                {user?.data.role !== "client" && (
                  <Link
                    href="/signup/trade"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-700 font-medium py-2 border rounded-lg text-center hover:bg-gray-50"
                  >
                    Trade Signup
                  </Link>
                )}

                {user ? (
                  <Link
                    href={
                      user.data.role === "business"
                        ? "/business/profile"
                        : user.data.role === "admin"
                        ? "/admin"
                        : "client/profile"
                    }
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 py-2 rounded-lg px-3 hover:bg-gray-50 items-center mx-auto"
                  >
                    <img
                      src="/user-icon.png"
                      alt="User"
                      width={28}
                      height={28}
                      className="rounded-full border border-gray-200"
                    />
                    <span className="font-medium text-gray-800">
                      My Profile
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-gray-900 font-medium py-2 border rounded-lg text-center hover:bg-gray-50"
                  >
                    Login
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
};

export default TopNav;
