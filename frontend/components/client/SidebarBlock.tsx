import { useState } from "react";
import { UserProfile } from "@/types/jobBid";
import { ContractorRecommendation } from "./ContractorRecommendation";

export const SidebarBlock: React.FC<{
  title: string;
  contractors?: UserProfile[] | null;
  onSelect: (id: string) => void;
  message: string;
  jobId?: string;
  serviceCategoryId?: string;
}> = ({ title, contractors, onSelect, message, jobId, serviceCategoryId }) => {
  const [page, setPage] = useState(1);
  const limit = 5;

  const validContractors = Array.isArray(contractors) ? contractors : [];
  const totalPages = Math.ceil(validContractors.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContractors = validContractors.slice(startIndex, endIndex);

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg">
      <div className="bg-[#5BBB7B] py-5 rounded-t-lg text-white text-sm">
        <p className="text-center text-md font-medium">{title}</p>
      </div>

      <div className="p-4 space-y-3">
        {validContractors.length === 0 && (
          <p className="text-gray-500 text-sm">{message}</p>
        )}

        {validContractors.length > 0 &&
          paginatedContractors.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelect(c.id)}
              className="cursor-pointer hover:bg-gray-50 rounded-lg transition"
            >
              <ContractorRecommendation contractor={c} />
            </div>
          ))}

        {validContractors.length > limit && (
          <div className="flex items-center justify-between pt-3">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className={`px-3 py-1 text-sm rounded-md border transition ${
                page === 1
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-[#0029FF] border-gray-300 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            <p className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className={`px-3 py-1 text-sm rounded-md border transition ${
                page === totalPages
                  ? "text-gray-400 border-gray-200 cursor-not-allowed"
                  : "text-[#0029FF] border-gray-300 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        )}

        <a
          href={`/trade/invite/${jobId}?service=${serviceCategoryId || ""}`}
          className="text-[#0029FF] underline hover:text-blue-600 block text-sm mt-3"
        >
          Discover and invite contractors
        </a>
      </div>
    </div>
  );
};
