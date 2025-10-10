"use client";

import React from "react";

const HappinessPledgeBadge = () => (
  <div className="flex items-center space-x-2">
    <svg
      className="w-5 h-5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C12 21 3 17 3 10V5L12 1L21 5V10C21 17 12 21 12 21Z"
        fill="#e6f0e9"
        stroke="#1E613C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.5L11 15L15.5 10.5"
        stroke="#1E613C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="text-sm font-semibold text-[#1E613C]">
      Happiness pledge
    </span>
  </div>
);

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  footer?: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  footer,
}) => (
  <div className="flex flex-col space-y-4">
    <h3 className="text-xl font-bold text-[#1E613C] leading-snug tracking-tight">
      {title}
    </h3>
    <p className="text-base text-[#595959] leading-relaxed">{description}</p>
    {footer && <div className="pt-2">{footer}</div>}
  </div>
);

const Section3 = () => {
  return (
    <div className="bg-gray-50 pt-12 pb-20 md:pt-20 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 md:mb-16">
          <h2 className="text-4xl sm:text-[2.6rem] font-bold text-[#595959] tracking-tight leading-none">
            Your satisfaction,
            <span className="font-extrabold text-[#333333]">guaranteed</span>
          </h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
          <FeatureCard
            title="Customer Satisfaction"
            description={
              <>
                If you're not satisfied,
                <a
                  href="#"
                  className="font-normal text-[#595959] underline hover:text-[#1E613C] transition duration-150"
                >
                  we'll work to make it right.
                </a>
              </>
            }
            footer={<HappinessPledgeBadge />}
          />

          <FeatureCard
            title="Vetted Tradespeople"
            description="Taskers are always background checked before joining the platform."
          />

          <FeatureCard
            title="Dedicated Support"
            description="Friendly service when you need us – every day of the week."
          />
        </div>
      </div>
    </div>
  );
};

export default Section3;
