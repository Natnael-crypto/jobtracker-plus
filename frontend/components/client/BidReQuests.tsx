import { ContractorRecommendation } from "./ContractorRecommendation";

export const BidRequestSection: React.FC<{
  jobId: string;
  className: string;
}> = ({ jobId, className }) => {
  const onSelectContractor = (id: string) => {
    console.log("Selected contractor:", id);
  };
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className={`p-4 text-white font-semibold ${className}`}>{title}</div>
      <div className="p-4 space-y-3">
        {contractors.length === 0 ? (
          <p className="text-sm text-gray-600">No contractors available.</p>
        ) : (
          contractors.map((c) => (
            <div
              key={c.id}
              onClick={() => onSelectContractor(c)}
              className="cursor-pointer hover:bg-gray-50 rounded-lg transition"
            >
              <ContractorRecommendation contractor={c} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
