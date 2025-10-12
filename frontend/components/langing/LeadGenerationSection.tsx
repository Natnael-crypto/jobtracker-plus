import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { AllServices } from "@/data/services";

// ✅ Reusable feature item
const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center space-x-3 py-1.5">
    <Check className="w-5 h-5 text-gray-800 flex-shrink-0" />
    <span className="text-lg font-normal text-gray-700">{text}</span>
  </div>
);

// ✅ Utility function to split array into chunks
function chunkArray<T>(array: T[], chunks: number): T[][] {
  const perChunk = Math.ceil(array.length / chunks);
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += perChunk) {
    result.push(array.slice(i, i + perChunk));
  }
  return result;
}

const LeadGenerationSection: React.FC = () => {
  const columns = 4;

  // ✅ Divide services evenly into 4 columns
  const tradeColumns = chunkArray(AllServices, columns);

  return (
    <section className="font-sans antialiased bg-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden mb-16 lg:mb-24">
          <div className="lg:w-1/2 flex-shrink-0">
            <div className="w-full h-80 lg:h-full bg-cover bg-center">
              <img
                src="/pricing.svg"
                alt="Construction worker talking on phone"
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Searching For Leads?
            </h2>

            <p className="text-base text-gray-600 mb-8 sm:mb-10 max-w-lg">
              Grow your business with BWC. BWC is the reliable way to get more
              of the work you want! Sign up for free to receive a steady stream
              of local job opportunities that match your skills. Take on big
              jobs or smaller gap fillers — it&apos;s up to you.
            </p>

            <div className="space-y-2 mb-10 sm:mb-12">
              <FeatureItem text="Full control of bidding for jobs" />
              <FeatureItem text="No commitment" />
              <FeatureItem text="We fix 4 out of 5 cars at the roadside" />
            </div>

            <button
              className="inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white 
                         font-semibold text-lg rounded-xl shadow-lg hover:bg-gray-700 transition duration-300"
              aria-label="Get Started"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Services Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 sm:mb-12">
            Any trade, anytime, anywhere
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-8 lg:gap-x-12">
            {tradeColumns.map((columnTrades, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {columnTrades.map((trade: any, tradeIndex: number) => (
                  <p
                    key={tradeIndex}
                    className="text-base text-gray-600 hover:text-gray-900 cursor-pointer transition-colors"
                  >
                    {typeof trade === "string" ? trade : trade.name}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadGenerationSection;
