import { JobDetailItem } from "@/types/jobs";

export const RightPanel = (job: JobDetailItem) => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Budget Summary
        </h2>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <span className="font-medium">Total</span>
            <span className="font-bold text-gray-900">{job.budget}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Procurement</span>
            <span className="text-gray-500">Material & Labour</span>
          </div>
        </div>

        {/* Images */}
        {job.images && job.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
              Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {job.images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm group"
                >
                  <img
                    src={url}
                    alt={`Job image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Optional overlay for UX */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
