"use client";

import React, { FC, useState } from "react";

interface Tradesperson {
  name: string;
  rating: number;
  reviews: number;
  description: string;
  tradeTag: string;
  verified: boolean;
}

const PRIMARY_COLOR = "#1A1B4B";
const ACTIVE_TAB_COLOR = "#1A1B4B";

const TradespersonCard: FC<{ person: Tradesperson }> = ({ person }) => {
  return (
    <div
      className="flex-shrink-0 w-72 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
      style={{ cursor: "pointer" }}
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h3
          className="text-base font-semibold"
          style={{ color: PRIMARY_COLOR }}
        >
          {person.name}
        </h3>
      </div>

      <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
        <svg
          className="w-4 h-4 text-yellow-500 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="font-semibold text-gray-800">
          {person.rating.toFixed(1)}
        </span>
        <span className="text-gray-400">
          ({person.reviews.toLocaleString()})
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-4">{person.description}</p>

      <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
        {person.tradeTag}
      </div>
    </div>
  );
};

const tradespeopleData: Tradesperson[] = [
  {
    name: "JLP Limited",
    rating: 5.0,
    reviews: 2021,
    description: "Browse the best electricians in your area",
    tradeTag: "Electrician",
    verified: true,
  },
  {
    name: "LPM Limited",
    rating: 5.0,
    reviews: 2021,
    description: "Browse the best plumbers in your area",
    tradeTag: "Plumbing",
    verified: false,
  },
  {
    name: "WMP Limited",
    rating: 5.0,
    reviews: 2021,
    description: "Browse the best roofers in your area",
    tradeTag: "Roofer",
    verified: false,
  },
  {
    name: "WAL Limited",
    rating: 5.0,
    reviews: 2021,
    description: "Browse the best handymen in your area",
    tradeTag: "Handyman",
    verified: false,
  },
  {
    name: "JCK Limited",
    rating: 4.9,
    reviews: 1890,
    description: "Trusted carpenters available now",
    tradeTag: "Carpenter",
    verified: true,
  },
];

export default function Tradespeople() {
  const [activeLocation, setActiveLocation] = useState("UK");
  const locations = ["UK", "London", "Manchester"];

  const LocationTab: FC<{ location: string }> = ({ location }) => (
    <button
      onClick={() => setActiveLocation(location)}
      className={`px-4 py-2 text-base font-medium transition-colors ${
        activeLocation === location
          ? "border-b-2"
          : "text-gray-500 hover:text-gray-700"
      }`}
      style={{
        borderColor:
          activeLocation === location ? ACTIVE_TAB_COLOR : "transparent",
        color: activeLocation === location ? ACTIVE_TAB_COLOR : undefined,
      }}
    >
      {location}
    </button>
  );

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-4xl font-extrabold"
              style={{ color: PRIMARY_COLOR, lineHeight: "1.2" }}
            >
              Tradespeople
            </h2>
            <a
              href="#"
              className="flex items-center text-sm font-medium text-gray-500 group transition-colors hover:text-gray-800"
            >
              View All
              <img src="/arrow.svg" className="ml-2" alt="" />
            </a>
          </div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b border-gray-200 mb-8">
            {locations.map((loc) => (
              <LocationTab key={loc} location={loc} />
            ))}
          </div>

          {/* Horizontal Scroll */}
          <div className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4">
            {tradespeopleData.map((person, index) => (
              <TradespersonCard key={index} person={person} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
