"use client";

import React, { useState } from "react";

interface PortfolioItem {
  image_url: string;
}

interface ProviderDetail {
  Portfolio: PortfolioItem[];
}

const ImageGallery: React.FC<{ profile: ProviderDetail }> = ({ profile }) => {
  const images = profile?.Portfolio || [];
  const [selectedImage, setSelectedImage] = useState<string>(
    images[0]?.image_url || ""
  );

  if (!images.length) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-xl text-gray-500">
        No images available
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-4 
        gap-3 max-h-[500px]
        mb-8
      "
    >
      {/* Main Image */}
      <div className="md:col-span-3 relative overflow-hidden rounded-xl">
        <img
          src={selectedImage}
          alt="Main portfolio view"
          className="w-full h-[500px] object-cover rounded-xl transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div
        className="
          hidden md:flex flex-col 
          space-y-2 overflow-y-auto 
          max-h-[500px] rounded-xl 
          border border-gray-100 p-1
        "
      >
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img.image_url)}
            className={`
              relative flex-shrink-0 rounded-lg overflow-hidden 
              border-2 transition-all duration-200 
              ${
                selectedImage === img.image_url
                  ? "border-blue-600"
                  : "border-transparent hover:border-gray-300"
              }
            `}
          >
            <img
              src={img.image_url}
              alt={`Portfolio ${idx + 1}`}
              className="w-full h-28 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
