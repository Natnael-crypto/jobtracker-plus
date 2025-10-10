"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/services/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MenuItem {
  label: string;
  icon: string;
  iconDark: string;
  href: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

const sidebarMenu: MenuSection[] = [
  {
    items: [
      {
        label: "Dashboard",
        icon: "/home2.svg",
        iconDark: "/home.svg",
        href: "/client",
      },
      {
        label: "Schedule",
        icon: "/schedule.svg",
        iconDark: "/schedule-dark.svg",
        href: "/client/schedule",
      },
      {
        label: "Post a job",
        icon: "/document.svg",
        iconDark: "/document-dark.svg",
        href: "/client/post-job",
      },
      {
        label: "My Jobs",
        icon: "/receipt.svg",
        iconDark: "/receipt-dark.svg",
        href: "/client/my-jobs",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        label: "My Profile",
        icon: "/account.svg",
        iconDark: "/account-dark.svg",
        href: "/client/profile",
      },
    ],
  },
];

interface SidebarLinkProps {
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  item,
  isActive,
  collapsed,
}) => {
  const activeClasses = isActive ? `bg-black text-white` : `hover:bg-gray-50`;
  return (
    <Link
      href={item.href}
      className={`flex items-center py-3 px-6 rounded-lg rounded-l-none transition-colors duration-150 ease-in-out ${activeClasses}`}
      style={{ minHeight: "48px" }}
    >
      <Image
        src={isActive ? item.iconDark : item.icon}
        alt={item.label}
        width={20}
        height={20}
      />
      {!collapsed && (
        <span className="ml-3 text-sm font-medium">{item.label}</span>
      )}
    </Link>
  );
};

const ClientSidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActivePath = (href: string) => {
    const currentParts = pathname.split("/").slice(0, 3).join("/");
    return currentParts === href;
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const SidebarContent = (
    <div
      className={`flex flex-col h-screen bg-white shadow-xl font-sans transition-all duration-300 ease-in-out text-black ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b">
        {!collapsed && (
          <a href="/" className="text-xl font-bold text-gray-800">
            JOBTRACKER <span className="text-green-500">+</span>
          </a>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-500 hover:text-gray-800 hidden md:block"
          aria-label="Toggle sidebar"
        >
          <img src="/sidebar.svg" alt="toggle" />
        </button>
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileOpen(false)}
          className="p-2 text-gray-700 md:hidden"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>

      {/* Menu Sections */}
      <nav className="flex flex-col flex-grow overflow-y-auto">
        <div className="pt-4 space-y-1">
          {sidebarMenu[0].items.map((item) => (
            <SidebarLink
              key={item.label}
              item={item}
              isActive={isActivePath(item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="flex-grow min-h-20"></div>

        {sidebarMenu.slice(1).map((section, index) => (
          <div key={index} className="py-6">
            {!collapsed && section.title && (
              <h3 className="text-xs font-light uppercase tracking-wider px-6 text-gray-500 mb-3">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.label}
                  item={item}
                  isActive={isActivePath(item.href)}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex items-center py-3 px-6 rounded-lg rounded-l-none transition-colors duration-150 ease-in-out hover:bg-gray-50"
          style={{ minHeight: "48px" }}
        >
          <Image
            src={
              isActivePath("/client/logout")
                ? "/logout-dark.svg"
                : "/logout.svg"
            }
            alt="Logout"
            width={20}
            height={20}
          />
          {!collapsed && (
            <span className="ml-3 text-sm font-medium">Logout</span>
          )}
        </button>
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">{SidebarContent}</div>

      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md md:hidden fixed top-0 left-0 right-0 z-40">
        <h1 className="text-lg font-bold text-gray-800">
          JOBTRACKER <span className="text-green-500">+</span>
        </h1>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-gray-700"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Sidebar Slide-in */}
            <motion.div
              className="fixed top-0 left-0 h-full z-50 w-64"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {SidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientSidebar;
