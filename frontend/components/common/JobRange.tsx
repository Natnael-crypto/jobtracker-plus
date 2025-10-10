"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useBusinessRange } from "@/hooks/useBusinessRange";

export default function JobRadius() {
  const [radius, setRadius] = useState(10);
  const { data, isLoading, error, update } = useBusinessRange();

  const handleRadiusChange = (value: number) => {
    if (value < 1) value = 1;
    if (value > 100) value = 100;
    setRadius(value);
  };

  useEffect(() => {
    if (!isLoading) {
      setRadius(data!.range_km);
    }
  }, [data]);

  const handleSave = async () => {
    try {
      await update({ range_km: radius });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Job Search Radius
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{radius} km</span>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={radius}
          onChange={(e) => handleRadiusChange(Number(e.target.value))}
          className="w-full accent-green-500 cursor-pointer bg-gray-200"
        />

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={100}
            value={radius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-24 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-black text-gray-900"
          />
          <span className="text-gray-600 text-sm">km</span>
        </div>

        <div className="pt-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded"
            onClick={handleSave}
          >
            {isLoading ? "Saving ..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
