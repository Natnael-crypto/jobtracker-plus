"use client";

import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useUpdateUserAddress, useUserAddress } from "@/hooks/userAddress";
import { add } from "date-fns";
import { UpdateUserAddressRequest } from "@/types/user";

interface AddressItem {
  id: string;
  title: string;
  address: {
    label: string;
    countryName: string;
    countryCode: string;
    city: string;
    county: string;
    state: string;
    street?: string;
    postalCode?: string;
    houseNumber?: string;
  };
}

interface AutocompleteResponse {
  items: AddressItem[];
}

const API_URL = "https://autocomplete.search.hereapi.com/v1/autocomplete";
const API_KEY = "g5fjfHaWQ6gq3O2wBMn3kCN6IYq7t0BIvfzRF6ZZ6wQ" as string;

export default function AddressAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(false);

  const { data: address, isLoading } = useUserAddress();
  const { mutate: updateAddress } = useUpdateUserAddress();

  useEffect(() => {
    if (address != null && address != undefined && isLoading == false) {
      setQuery(address.street);
    }
  }, [address]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchAddresses(value);
  };

  const handleSelect = (item: AddressItem) => {
    setQuery(item.address.label);
    const addressRequest: UpdateUserAddressRequest = {
      street: item.address.label || "",
      city: item.address.city,
      state: item.address.state,
      country: item.address.countryName,
      zip: item.address.postalCode || "",
    };
    updateAddress(addressRequest);
    setResults([]);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Address</h2>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search address..."
          value={query}
          onChange={handleChange}
          className="border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black text-gray-900 placeholder:text-gray-400"
        />

        {results.length > 0 && (
          <Card className="absolute w-full mt-2 bg-white shadow-md border border-gray-200 divide-y divide-gray-100 z-50">
            {results.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-800"
                )}
                onClick={() => handleSelect(item)}
              >
                {item.address.label}
              </div>
            ))}
          </Card>
        )}
        {loading && <p className="text-xs text-gray-500 mt-1">Searching...</p>}
      </div>
    </div>
  );
}
