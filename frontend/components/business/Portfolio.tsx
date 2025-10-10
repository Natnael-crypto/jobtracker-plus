"use client";

import {
  useDeletePortfolioImage,
  useGetMyPortfolio,
  useUploadPortfolioImage,
} from "@/hooks/usePortfolio";
import { X } from "lucide-react";
import React, { useRef } from "react";

const PortfolioPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: portfolio = [], isLoading } = useGetMyPortfolio();
  const uploadMutation = useUploadPortfolioImage();
  const deleteMutation = useDeletePortfolioImage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (portfolio.length >= 10) {
      alert("You can upload up to 10 images only.");
      return;
    }

    const file = e.target.files[0];
    await uploadMutation.mutateAsync(file);
    e.target.value = ""; // reset input
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 md:p-8 rounded border border-gray-100">
      <header className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          Portfolio
        </h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-green-600 hover:text-green-700 font-medium"
          disabled={portfolio.length >= 10}
        >
          + Add Photo
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {portfolio.map((img) => (
          <div
            key={img.id}
            className="relative group rounded overflow-hidden border shadow-sm"
          >
            <img
              src={img.image_url}
              alt="portfolio"
              className="object-cover w-full h-40"
            />
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
            >
              <X />
            </button>
          </div>
        ))}
      </div>
      {portfolio.length < 1 && (
        <div className="text-gray-500 text-center text-sm">
          upload portfolio image for your business
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
