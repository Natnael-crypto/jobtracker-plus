"use client";

import React from "react";
import SidebarSection from "./SidebarSection";

interface SidebarProps {
  activeItem: string;
  onSelect: (item: string) => void;
}

export default function Sidebar({ activeItem, onSelect }: SidebarProps) {
  const sidebarNav = {
    "TERMS AND CONDITIONS": [
      "Homeowners Privacy Policy",
      "Homeowners Terms of Use",
      "Tradespeople Terms of Use",
      "Tradespeople Privacy Policy",
    ],
    FAQ: ["FAQ – Homeowners", "FAQ – Tradespeople"],
  };

  return (
    <aside className="w-full md:w-64 p-4 md:p-6 bg-gray-50 border-r border-gray-100">
      <nav>
        {Object.entries(sidebarNav).map(([section, items]) => (
          <SidebarSection
            key={section}
            title={section}
            items={items}
            activeItem={activeItem}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </aside>
  );
}
