"use client";

import React, { useState, useMemo } from "react";
import {
  ACCENT_COLOR,
  Card,
  FormStepProps,
  LIGHT_BORDER,
} from "@/app/client/post-job/page";
import { Services } from "@/data/services";

export interface ServiceItemProps {
  title: string;
  subtitle?: string;
  selected: boolean;
  onSelect: () => void;
  isCategory?: boolean;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
  title,
  subtitle,
  selected,
  onSelect,
  isCategory = false,
}) => {
  return (
    <div
      onClick={isCategory ? onSelect : undefined}
      className={`flex items-center justify-between p-4 mb-3 rounded border transition-all cursor-pointer ${
        selected
          ? "text-[#5BBB7B] border-green-400 bg-green-50"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="ml-2">
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {!isCategory && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); // prevent category toggle
            onSelect();
          }}
          style={{
            backgroundColor: selected ? "#E5F3E9" : ACCENT_COLOR,
            color: selected ? ACCENT_COLOR : "white",
            borderColor: selected ? ACCENT_COLOR : "transparent",
          }}
          className={`py-2 px-4 rounded-full text-sm font-semibold transition-colors duration-200 border ${
            selected ? "hover:bg-green-100" : "hover:bg-green-700"
          }`}
        >
          {selected ? "Remove" : "Select"}
        </button>
      )}
    </div>
  );
};

export const Step1Form: React.FC<FormStepProps> = ({
  data,
  updateData,
  nextStep,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleSelectService = (service: string, details: string) => {
    if (data.service === service && data.serviceDetails === details) {
      updateData({ service: "", serviceDetails: "" });
    } else {
      updateData({ service, serviceDetails: details });
    }
  };

  const allSubcategories = useMemo(() => {
    return Services.flatMap((category) =>
      category.subcategories.map((sub) => ({
        categoryName: category.name,
        ...sub,
      }))
    );
  }, []);

  const displayedServices = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();

    if (!lower) return []; // empty means we show all main categories

    const matches = allSubcategories.filter(
      (sub) =>
        sub.name.toLowerCase().includes(lower) ||
        sub.description.toLowerCase().includes(lower) ||
        sub.categoryName.toLowerCase().includes(lower)
    );

    const ranked = matches.sort((a, b) => {
      const aName = a.name.toLowerCase().includes(lower) ? 1 : 0;
      const bName = b.name.toLowerCase().includes(lower) ? 1 : 0;
      const aDesc = a.description.toLowerCase().includes(lower) ? 1 : 0;
      const bDesc = b.description.toLowerCase().includes(lower) ? 1 : 0;
      const aCat = a.categoryName.toLowerCase().includes(lower) ? 1 : 0;
      const bCat = b.categoryName.toLowerCase().includes(lower) ? 1 : 0;

      return bName - aName || bDesc - aDesc || bCat - aCat;
    });

    return ranked.slice(0, 8);
  }, [searchTerm, allSubcategories]);

  const isNextDisabled = !data.service || !data.serviceDetails;

  return (
    <Card title="Service Details" className="h-full rounded shadow-sm">
      {/* Search Input */}
      <div className="mb-8">
        <label htmlFor="service-search" className="sr-only">
          Search services
        </label>
        <input
          id="service-search"
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setExpandedCategory(null);
          }}
          placeholder="Search services (e.g., Plumbing, Carpentry...)"
          className="w-full p-3 border rounded-lg focus:ring-1 focus:ring-green-500 focus:border-green-500"
          style={{ borderColor: LIGHT_BORDER }}
        />
      </div>

      {/* If searching, show filtered subcategories */}
      {searchTerm.trim() ? (
        displayedServices.length === 0 ? (
          <p className="text-gray-500 text-sm">No services found.</p>
        ) : (
          displayedServices.map((sub) => (
            <ServiceItem
              key={sub.id}
              title={sub.name}
              subtitle={`${sub.description} (${sub.categoryName})`}
              selected={
                data.service === sub.categoryName &&
                data.serviceDetails === sub.name
              }
              onSelect={() => handleSelectService(sub.categoryName, sub.name)}
            />
          ))
        )
      ) : (
        // No search → show main categories + expand subcategories
        <div>
          {Services.map((category) => (
            <div key={category.id} className="mb-4">
              <ServiceItem
                title={category.name}
                selected={expandedCategory === category.name}
                onSelect={() =>
                  setExpandedCategory((prev) =>
                    prev === category.name ? null : category.name
                  )
                }
                isCategory
              />
              {expandedCategory === category.name && (
                <div className="ml-6 border-l border-gray-100 pl-4 mt-2 transition-all">
                  {category.subcategories.map((sub) => (
                    <ServiceItem
                      key={sub.id}
                      title={sub.name}
                      subtitle={sub.description}
                      selected={
                        data.service === category.name &&
                        data.serviceDetails === sub.name
                      }
                      onSelect={() =>
                        handleSelectService(category.name, sub.name)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Next button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={nextStep}
          disabled={isNextDisabled}
          style={{ backgroundColor: isNextDisabled ? "#BEE3C4" : ACCENT_COLOR }}
          className={`w-1/3 py-2 rounded-full text-white font-bold transition-colors ${
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
