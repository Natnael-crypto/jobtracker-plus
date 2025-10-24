"use client";

import React from "react";

interface SidebarSectionProps {
  title: string;
  items: string[];
  activeItem: string;
  onSelect: (item: string) => void;
}

export default function SidebarSection({
  title,
  items,
  activeItem,
  onSelect,
}: SidebarSectionProps) {
  return (
    <div className="mb-8">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <button
              onClick={() => onSelect(item)}
              className={`w-full text-left flex items-center justify-between py-2 rounded-md transition-colors duration-200
                ${
                  activeItem === item
                    ? "font-semibold text-black bg-gray-100"
                    : "text-gray-700 hover:bg-gray-50"
                } px-3`}
            >
              <span>{item}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
