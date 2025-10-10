"use client";

import React from "react";

const projects = [
  {
    label: "House extensions",
    imageUrl: "/image-3.svg",
  },
  {
    label: "Loft conversion",
    imageUrl: "/image4.svg",
  },
  {
    label: "House refurbishment",
    imageUrl: "/image5.svg",
  },
];

const ProjectCard = ({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl: string;
}) => (
  <div className="flex flex-col items-center">
    <img
      src={imageUrl}
      alt={label}
      className="w-full aspect-square object-cover mb-2 rounded"
    />
    <span className="text-sm text-center font-semibold text-[#0A194F]">
      {label}
    </span>
  </div>
);

const BuildDreamHouseSection = () => {
  const primaryColor = "text-[#0A194F]";
  const primaryTextColor = "text-gray-700";

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 my-10">
      <h1
        className={`text-3xl lg:text-4xl font-extrabold mb-8 ${primaryColor}`}
      >
        Build Your Dream House
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="relative w-full md:w-[60%] lg:w-[58%] shadow-xl rounded overflow-hidden">
          <img
            src="/main.svg"
            alt="Luxurious living room interior"
            className="w-full h-full object-cover min-h-[400px]"
          />
          <button
            className="absolute bottom-4 right-4 bg-white text-sm font-semibold text-[#0A194F] px-4 py-2 rounded-sm shadow-md transition duration-300 hover:bg-gray-100"
            onClick={() => console.log("Enquire Now clicked")}
          >
            Enquire Now
          </button>
        </div>

        <div className="w-full md:w-[40%] lg:w-[42%] flex flex-col space-y-6">
          <p className={`text-sm leading-relaxed ${primaryTextColor}`}>
            A complete refurbishment of a house of any size is a major
            undertaking. That's why we work with you every step of the way. To
            start with, we'll help you determine the feasibility of the proposed
            plans and timetable the project.
          </p>

          <div className="w-full h-auto rounded overflow-hidden shadow-md">
            <img
              src="/main2.svg"
              alt="Woman using a tablet in a modern kitchen"
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildDreamHouseSection;
