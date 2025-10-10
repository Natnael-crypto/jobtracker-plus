import { JobDetailItem } from "@/types/jobs";

export default function Description(job: JobDetailItem) {
  return (
    <div className="flex flex-col items-start justify-center p-2 h-full space-y-10">
      <div className="rounded-lg  divide-y divide-gray-100">
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
              Headline
            </h3>
            <p className="text-gray-900 font-semibold">
              {job.headline
                ? job.headline.charAt(0).toUpperCase() + job.headline.slice(1)
                : ""}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Service
            </h3>
            <p className="text-gray-900 font-semibold">
              {job.service_category}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Service Details
            </h3>
            <p className="text-gray-900">{job.service_specific}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Timeline
            </h3>
            <p className="text-gray-900">{job.time}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Budget
            </h3>
            <p className="text-gray-900">{job.budget}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-1">
              Location
            </h3>
            <p className="text-gray-900">{job.city}</p>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">
            Description
          </h3>
          <p className="text-gray-900 whitespace-pre-line break-words break-normal word-break-normal">
            {job.description}
          </p>
        </div>

        {job.images && job.images.length > 0 && (
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
              Images
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {job.images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200"
                >
                  <img
                    src={url}
                    alt={`Job image ${idx + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
