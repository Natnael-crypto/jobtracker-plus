"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
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
import path from "path";

const paths = [
  { path: "/how-client", name: "How it works" },
  { path: "/how-trade", name: "How a trade works" },
  // { path: "/faq", name: "Cost guides" },
  { path: "/trade", name: "Tradespersons" },
];

const TopNav = () => {
  const { data: user, error: userError, refetch: refetchUser } = useUser();
  return (
    <div className="bg-white text-gray-800">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo + Left Nav */}
          <div className="flex items-center space-x-12">
            <Link
              href="/"
              className="text-xl font-bold tracking-widest text-gray-900"
            >
              JOBTRACKER <span className="text-green-500">+</span>
            </Link>

            <nav className="hidden lg:flex space-x-8 text-md text-black items-center">
              {/* ✅ Categories Navigation Menu */}
              <NavigationMenu className="relative">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="font-medium text-md text-black hover:text-gray-900 flex items-center gap-1">
                      Categories
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      className="
            absolute left-1/2 -translate-x-1/2
            bg-white shadow-xl rounded-xl border mt-2
            p-4 grid grid-cols-2 md:grid-cols-3 gap-6
            min-w-[900px] max-h-[50vh] overflow-y-auto scrollbar-hide
        "
                    >
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
          </div>

          {/* Right Buttons */}
          <div className="flex items-center space-x-3 text-sm">
            {user?.data.role === "client" ? (
              <Link
                href="/client/post-job"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 hidden sm:block"
              >
                Post a Job
              </Link>
            ) : user == undefined ? (
              <Link
                href="/post-job"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 hidden sm:block"
              >
                Post a Job
              </Link>
            ) : null}
            {user?.data.role != "client" ? (
              <Link
                href="/signup/trade"
                className="py-2 px-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200 hidden sm:block"
              >
                Trade Signup
              </Link>
            ) : null}

            {user?.data.role === "client" ? (
              <Link href="/client/profile">
                <img
                  src="/user-icon.png"
                  alt="User Account"
                  width={24}
                  height={24}
                  className="rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
                />
              </Link>
            ) : user?.data.role === "business" ? (
              <Link href="/business/profile">
                <img
                  src="/user-icon.png"
                  alt="User Account"
                  width={24}
                  height={24}
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
        </div>
      </header>
    </div>
  );
};

export default TopNav;
