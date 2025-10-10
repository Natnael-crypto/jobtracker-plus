import React from "react";
import { Button } from "../ui/button";

const ArrowRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const Search = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const Wrench = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.71-3.71a1 1 0 0 0 0-1.42l-2.34-2.34a1 1 0 0 0-1.42 0Z" />
    <path d="M21.37 3.33 19 5.66M18 8l-2 2M16 4l-1 1" />
    <path d="M3.4 20.6 12 12M20.4 3.6l-2.6 2.6" />
  </svg>
);

const Paintbrush = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7.7 20a1 1 0 0 0 2.2 0L20 9a2 2 0 0 0 0-2l-2-2a2 2 0 0 0-2 0Z" />
    <path d="M2 20h.01" />
    <path d="M7 16a2 2 0 0 0 2 2h3" />
  </svg>
);

const Zap = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L3 14h9l-1 8 11-12h-9l1-8z" />
  </svg>
);

const Hammer = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 12-8.37-8.37a1.83 1.83 0 0 0-2.6 0l-1.4 1.4a1.83 1.83 0 0 0 0 2.6L12 15M17 17l4 4" />
    <path d="m19 19-4-4" />
    <path d="m18 11-1-1" />
  </svg>
);

const icons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  Plumber: Wrench,
  Handyman: Wrench,
  Gardening: Paintbrush,
  Painter: Paintbrush,
  Electrician: Zap,
  Carpenter: Hammer,
};

const categories = [
  "Plumber",
  "Handyman",
  "Gardening",
  "Painter",
  "Handyman",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "Handyman",
];

const HeroSection = () => {
  return (
    <div className="bg-white text-gray-800">
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="py-12 lg:py-0">
              <p className="text-lg text-gray-600 mb-4">
                All in one marketplace from sourcing the right tradespeople to
                finding competitive materials
              </p>
              <h1 className="text-6xl font-extrabold leading-tight tracking-tighter mb-8 max-w-lg">
                Build & Maintain with{" "}
                <span className="text-gray-900">Confidence</span>
              </h1>

              <div className="flex space-x-4 mb-10">
                <Button variant="outline" className="h-[50px]">
                  <span>Post a Job</span>
                  <ArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" className="h-[50px]">
                  <span>Find Material</span>
                  <ArrowRight className="ml-2" />
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="w-full pl-5 pr-14 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-700 transition">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Hero Right Image */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src="/hero.svg"
                  alt="Tradesperson carefully sanding wood in a workshop"
                  className="w-full h-full object-cover min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories/Trades Scroller */}
        <div className="py-12 border-t border-b border-gray-100 my-12">
          <div className="flex justify-center">
            <div className="flex space-x-4 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => {
                const IconComponent = icons[category] || Wrench; // default fallback
                return (
                  <button
                    key={index}
                    className="flex items-center space-x-2 border border-gray-200 py-3 px-4 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-150 flex-shrink-0"
                  >
                    <IconComponent className="text-gray-500 w-4 h-4" />
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HeroSection;
