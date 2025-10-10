"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Search, ChevronDown, Filter, User, Star, MapPin } from "lucide-react";
import TopNav from "@/components/langing/top";
import Footer from "@/components/langing/Footer";
import { AllServices } from "@/data/services";
import { useProviders } from "@/hooks/useTrade";
import { Provider } from "@/types/trade";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const CUSTOM_DARK_BLUE = "#1A233B";

// ---------- HERE API CONFIG ----------
const API_URL = "https://autocomplete.search.hereapi.com/v1/autocomplete";
const API_KEY = process.env.NEXT_PUBLIC_HERE_API_KEY as string;

interface AddressItem {
  id: string;
  address: {
    label: string;
    countryCode?: string;
    countryName?: string;
    state?: string;
    countyCode?: string;
    county?: string;
    city?: string;
    postalCode?: string;
  };
}

interface AutocompleteResponse {
  items: AddressItem[];
}

// ---------- MOCK DATA ----------
interface Listing {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  description: string;
  isVerified: boolean;
  tags: string[];
  location: string;
}

// ---------- COMPONENTS ----------
interface DropdownProps {
  label: string;
  value: string;
  onClick: () => void;
}

const FilterDropdown: React.FC<DropdownProps> = ({ label, value, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center space-x-1 p-3 cursor-pointer text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
  >
    <span className="font-medium text-sm">{label}</span>
    <ChevronDown size={16} className="text-gray-500" />
  </div>
);

const ListingCard: React.FC<{ listing: Provider }> = ({ listing }) => (
  <div
    className="border border-gray-200 rounded-lg p-5 flex flex-col space-y-3 transition-shadow hover:shadow-lg bg-white cursor-pointer"
    onClick={() => (window.location.href = `/trade/${listing.user_id}`)}
  >
    <div className="flex items-start space-x-3">
      <div className="bg-gray-100 rounded-full">
        <img
          src={listing ? listing.image_url! : ""}
          alt=""
          className="w-14 h-14 rounded-full"
        />
      </div>
      <div className="flex-grow">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-base text-[#1A233B]">
            {listing.first_name} {listing.last_name}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-sm mt-0.5">
          <Star size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-gray-700">
            {listing.rating.toFixed(1)}
          </span>
          <span className="text-gray-500">
            ({listing.review_count.toLocaleString()})
          </span>
        </div>
      </div>
    </div>

    <p className="text-sm text-gray-500 line-clamp-3">
      {listing.about?.slice(0, 30)}...
    </p>

    <div className="pt-2 overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 min-w-max">
        {listing.services.map((tag) => (
          <span
            key={tag}
            className="whitespace-nowrap bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    <p className="text-xs text-gray-500 flex items-center space-x-1">
      <MapPin size={14} />{" "}
      <span>
        {listing.city}, {listing.state}, {listing.country}
      </span>
    </p>
  </div>
);

const PAGE_SIZE = 20;
const TradePersonListing: React.FC = () => {
  const searchParams = useSearchParams();
  const [selectedTrade, setSelectedTrade] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("All");
  const [location, setLocation] = useState<string>("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AddressItem[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [page, setPage] = useState(0);

  useEffect(() => {
    const serviceQuery = searchParams.get("service");
    if (serviceQuery && serviceQuery !== selectedTrade) {
      setSelectedTrade(serviceQuery);
    }
  }, [searchParams]);

  const minRating =
    selectedRating === "All" ? undefined : Number(selectedRating.split("-")[0]);

  const { data, isLoading, error, refetch } = useProviders({
    services: selectedTrade ? [selectedTrade] : undefined,
    search: debouncedSearch,
    city: location || "",
    state: undefined,
    country: undefined,
    min_rating: minRating,
    limit: PAGE_SIZE,
    offset: page * PAGE_SIZE,
  });
  const totalPages = data ? Math.ceil(data.total_count / PAGE_SIZE) : 0;

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const fetchAddresses = useCallback(async (q: string) => {
    if (!q.trim() || q.length <= 3) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}?q=${encodeURIComponent(q)}&apiKey=${API_KEY}`
      );
      const data: AutocompleteResponse = await res.json();
      setResults(data.items.slice(0, 5));
    } catch (err) {
      console.error("Autocomplete error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    fetchAddresses(value);
  };

  const handleSelect = (address: AddressItem["address"]) => {
    setLocation(address.city || "");
    setResults([]);
    setOpenDropdown(null);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    refetch();
  }, [selectedTrade, selectedRating, location, page, debouncedSearch]);

  const ratingOptions = [
    "All",
    "1-more",
    "2-more",
    "3-more",
    "4-more",
    "5-only",
  ];

  const handleClearFilters = () => {
    setSelectedTrade("");
    setSelectedRating("All");
    setLocation("");
  };

  // const handleSearch = () => {
  //   refetch();
  // };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800 relative">
      <TopNav />
      <br />
      <br />
      <br />

      <main className="px-4 py-10 max-w-7xl mx-auto relative">
        {/* --- Filters Section --- */}
        <div className="relative flex flex-wrap items-center justify-start mb-10 p-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <FilterDropdown
            label={selectedTrade || "Trade"}
            value={selectedTrade}
            onClick={() => toggleDropdown("trade")}
          />

          <FilterDropdown
            label={location || "Location"}
            value={location}
            onClick={() => toggleDropdown("location")}
          />

          <FilterDropdown
            label={`Rating: ${selectedRating}`}
            value={selectedRating}
            onClick={() => toggleDropdown("rating")}
          />

          <div className="hidden sm:block h-8 w-px bg-gray-200 mx-4"></div>
          <input
            type="text"
            placeholder="search for trades"
            className="p-2 mr-2 flex-grow min-w-[150px] border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#1A233B] outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <div className="flex-grow hidden lg:block"></div>
          <div className="mt-4 lg:mt-0 w-full lg:w-auto">
            <button
              className="flex items-center justify-center space-x-2 bg-[#1A233B] text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-opacity w-full lg:w-auto shadow-lg"
              style={{ backgroundColor: CUSTOM_DARK_BLUE }}
              onClick={handleClearFilters}
            >
              <Search size={18} />
              <span className="font-semibold text-sm">
                Clear Filter ({data?.total_count || 0})
              </span>
            </button>
          </div>

          {/* --- Trade Dropdown --- */}
          {openDropdown === "trade" && (
            <div className="absolute top-14 left-3 bg-white shadow-lg border border-gray-200 rounded-lg w-64 z-50 p-2">
              {AllServices.map((service) => (
                <div
                  key={service}
                  onClick={() => {
                    setSelectedTrade(service);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
                >
                  {service}
                </div>
              ))}
            </div>
          )}

          {/* --- HERE Autocomplete for Location --- */}
          {openDropdown === "location" && (
            <div className="absolute top-14 left-32 bg-white shadow-lg border border-gray-200 rounded-lg w-72 z-50 p-3">
              <input
                type="text"
                placeholder="Search location..."
                value={location}
                onChange={handleLocationChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-[#1A233B] outline-none"
              />
              {results.length > 0 && (
                <div className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-[calc(100%-1.5rem)] shadow-md divide-y divide-gray-100 max-h-60 overflow-y-auto">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-800"
                      onClick={() => handleSelect(item.address)}
                    >
                      {item.address.label}
                    </div>
                  ))}
                </div>
              )}
              {loading && (
                <p className="text-xs text-gray-500 mt-1">Searching...</p>
              )}
            </div>
          )}

          {openDropdown === "rating" && (
            <div className="absolute top-14 left-[280px] bg-white shadow-lg border border-gray-200 rounded-lg w-40 z-50 p-2">
              {ratingOptions.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSelectedRating(opt);
                    setOpenDropdown(null);
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 mb-6">
          {selectedTrade != "" ? (
            <h1
              className="text-3xl lg:text-4xl font-extrabold"
              style={{ color: CUSTOM_DARK_BLUE }}
            >
              {selectedTrade} Nearby
            </h1>
          ) : null}
          <p className="text-sm text-gray-600 pt-2">
            Showing {data?.total_count || 0} trade person professionals
          </p>
          <div className="w-full h-px bg-gray-200 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          {data?.data.map((listing) => (
            <ListingCard key={listing.user_id} listing={listing} />
          ))}
          {data?.total_count === 0 && (
            <p className="text-gray-500 col-span-full text-center py-10">
              No listings match your filters.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-3">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-2">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TradePersonListing;
