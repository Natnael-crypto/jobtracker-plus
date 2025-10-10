import {
  ACCENT_COLOR,
  BookingData,
  Card,
  FormStepProps,
  LIGHT_BORDER,
} from "@/app/client/post-job/page";
import { AddressRequest } from "@/types/jobs";
import { useState, useCallback } from "react";

export interface RadioOptionProps {
  label: string;
  checked: boolean;
  onClick: () => void;
}

export const RadioOption: React.FC<RadioOptionProps> = ({
  label,
  checked,
  onClick,
}) => (
  <div
    className={`flex items-center justify-between p-3 mb-3 border rounded-xl cursor-pointer transition-all ${
      checked
        ? "border-2 border-green-500 bg-green-50"
        : "border-gray-200 hover:border-gray-300"
    }`}
    onClick={onClick}
  >
    <span className="ml-2 text-gray-700">{label}</span>
    <div
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
        checked ? "border-green-500" : "border-gray-400"
      }`}
    >
      {checked && <div className="w-2 h-2 bg-green-500 rounded-full" />}
    </div>
  </div>
);

const API_URL = "https://autocomplete.search.hereapi.com/v1/autocomplete";
const API_KEY = "g5fjfHaWQ6gq3O2wBMn3kCN6IYq7t0BIvfzRF6ZZ6wQ" as string;

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

export const PRICE_RANGES = [
  "Under £100",
  "Under £250",
  "Under £500",
  "Under £1,000",
  "Under £2,000",
  "Under £4,000",
  "Under £8,000",
  "Under £15,000",
  "Under £30,000",
  "Over £30,000",
  "Not Sure",
];

interface AutocompleteResponse {
  items: AddressItem[];
}

export const Step2Form: React.FC<FormStepProps> = ({
  data,
  updateData,
  nextStep,
}) => {
  const isNextDisabled =
    data.timeline === "Not Set" ||
    data.budget === "Not Set" ||
    data.location === "";

  const [results, setResults] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);

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
    updateData({ location: value });
    fetchAddresses(value);
  };

  const handleSelect = (address: {
    label: string;
    countryCode?: string;
    countryName?: string;
    state?: string;
    countyCode?: string;
    county?: string;
    city?: string;
    postalCode?: string;
  }) => {
    updateData({ location: address.label });
    updateData({
      address: {
        label: address.label,
        countryCode: address.countryCode || "",
        countryName: address.countryName || "",
        state: address.state || "",
        countyCode: address.countyCode || "",
        county: address.county || "",
        city: address.city || "",
        postalCode: address.postalCode || "",
      },
    });
    setResults([]);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ timeline: e.target.value }); // Store actual date string (YYYY-MM-DD)
  };

  const selectedTimeline = data.timeline;

  return (
    <Card title="Other details" className="h-full rounded shadow-sm relative">
      <h3 className="font-medium text-gray-800 mt-8 mb-4">
        Enter your location
      </h3>
      <div className="space-y-4 relative">
        <div>
          <input
            type="text"
            placeholder="Address Line 1"
            value={data.location || ""}
            onChange={handleLocationChange}
            className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
            style={{ borderColor: LIGHT_BORDER }}
          />
          {results.length > 0 && (
            <div className="absolute z-50 bg-white border border-gray-200 rounded-md mt-1 w-full shadow-md divide-y divide-gray-100">
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
      </div>

      <br />

      <h3 className="font-medium text-gray-800 mb-4">
        When would you like the work to commence?
      </h3>
      {["As soon as possible", "Flexible"].map((option) => (
        <RadioOption
          key={option}
          label={option}
          checked={selectedTimeline === option}
          onClick={() =>
            updateData({ timeline: option as BookingData["timeline"] })
          }
        />
      ))}

      {/* Special case for Specific Date */}
      <div className="mb-4">
        <RadioOption
          label="Specific date"
          checked={
            !!selectedTimeline && /^\d{4}-\d{2}-\d{2}$/.test(selectedTimeline)
          }
          onClick={() => {
            // If no date selected yet, default to today
            if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedTimeline)) {
              const today = new Date().toISOString().split("T")[0];
              updateData({ timeline: today });
            }
          }}
        />
        {selectedTimeline && /^\d{4}-\d{2}-\d{2}$/.test(selectedTimeline) && (
          <input
            type="date"
            value={selectedTimeline}
            onChange={handleDateChange}
            className="mt-2 p-2 border rounded-lg w-full sm:w-1/2 focus:ring-1 focus:ring-green-500 focus:border-green-500"
          />
        )}
      </div>

      <h3 className="font-medium text-gray-800 mt-8 mb-4">
        Select the right level of budget for this work?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 r-2">
        {PRICE_RANGES.map((option) => (
          <RadioOption
            key={option}
            label={option}
            checked={data.budget === option}
            onClick={() =>
              updateData({ budget: option as BookingData["budget"] })
            }
          />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={nextStep}
          disabled={isNextDisabled}
          style={{ backgroundColor: isNextDisabled ? "#BEE3C4" : ACCENT_COLOR }}
          className={`w-1/3 py-3 rounded-xl text-white font-bold transition-colors ${
            isNextDisabled
              ? "cursor-not-allowed"
              : "hover:bg-green-700 shadow-md"
          }`}
        >
          Next
        </button>
      </div>
    </Card>
  );
};
