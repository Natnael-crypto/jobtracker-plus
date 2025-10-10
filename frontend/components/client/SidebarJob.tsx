import { BookingData } from "@/app/client/post-job/page";

interface SidebarProps {
  data: BookingData;
}

interface DetailRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon }) => {
  const isPlaceholder = value === "Not Set";

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center">
        {icon && <span className="mr-2 text-gray-400">{icon}</span>}
        <span className="text-gray-500 text-sm">{label}</span>
      </div>
      <span
        className={`font-medium text-right text-sm line-clamp-1  ${
          isPlaceholder ? "text-gray-300" : "text-gray-800"
        }`}
      >
        {isPlaceholder ? "---" : value}
      </span>
    </div>
  );
};

export const SidebarJob: React.FC<SidebarProps> = ({ data }) => {
  const budgetValue =
    data.budget === "Not Set" ? "---" : data.budget.replace("£", "£");

  return (
    <div className="w-full p-4 space-y-6">
      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Booking Details
        </h2>
        <DetailRow
          label="Title"
          value={data.headline || data.serviceDetails || "---"}
        />
        <DetailRow label="Service" value={data.service} />
        <DetailRow label="Service Details" value={data.serviceDetails} />
        <DetailRow
          label="Description"
          value={
            data.description.substring(0, 30) +
              (data.description.length > 40 ? "..." : "") || data.serviceDetails
          }
        />

        <div className="border-t border-gray-100 my-4" />

        <DetailRow label="Timeline" value={data.timeline} />
        <DetailRow
          label="Area"
          value={data.location ? ` ${data.location}` : "---"}
        />
      </div>

      <div className="bg-white p-6 rounded shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Budget Summary
        </h2>
        <DetailRow label="Total" value={budgetValue} />
        <DetailRow label="Procurement" value="Material & Labour" />
      </div>

      {data.hasPhotos === "Yes" && (
        <div className="grid grid-cols-2 gap-4">
          {data.imageUrls.map((image_url, index) => (
            <div
              key={index}
              className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <img src={image_url} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
