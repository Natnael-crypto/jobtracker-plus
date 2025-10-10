import { formatDateToReadable } from "@/lib/date_converter";
import { JobDetailItem } from "@/types/jobs";

const MapPinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

const ClockIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export const JobItem: React.FC<{
  job: JobDetailItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ job, isActive, onClick }) => {
  const activeStyles = isActive
    ? "bg-[#f0f9f1] border-l-4 border-[#16a34a] text-gray-900" // Light green background, green border
    : "hover:bg-gray-50 border-l-4 border-transparent text-gray-700";

  return (
    <div
      className={`relative p-3 cursor-pointer transition duration-150 ease-in-out ${activeStyles}`}
      onClick={onClick}
    >
      <h3
        className={`text-sm font-semibold mb-1 ${
          isActive ? "text-gray-900" : "text-gray-800"
        }`}
      >
        {job.headline}
      </h3>
      <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
        <div className="flex items-center">
          <MapPinIcon className="w-3 h-3 mr-1" />
          <span>{job.city}</span>
        </div>
        <div className="flex items-center">
          <ClockIcon className="w-3 h-3 mr-1" />
          <span>Posted {formatDateToReadable(job.created_at)}</span>
        </div>
      </div>
      <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <span className="text-[#16a34a] mr-1">•</span>
        {job.service_category}
      </div>
    </div>
  );
};
