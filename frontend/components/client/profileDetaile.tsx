import { useUserProfileDetail } from "@/hooks/usePortfolio";
import { Dot } from "lucide-react";

export const ProfileDetails: React.FC<{
  id: string;
}> = ({ id }) => {
  const { data, isLoading } = useUserProfileDetail(id);

  if (isLoading || data === null) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-gray-200 pb-6">
        <div className="pr-4 border-r border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">
            Educations
          </h3>

          {data?.education &&
            data?.education.map((education, idx) => (
              <div className="flex space-x-1">
                <Dot className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-black text-sm whitespace-pre-line leading-relaxed">
                    {education.title[0].toUpperCase() +
                      education.title.slice(1)}
                  </p>
                  <p className="text-gray-700 text-md">{education.institute}</p>
                  <p className="text-gray-500 text-xs">
                    {education.start_year}-{education.end_year}
                  </p>
                </div>
              </div>
            ))}
        </div>
        <div className="pr-4 border-r border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">Awards</h3>

          {data?.awards &&
            data?.awards.map((award, idx) => (
              <div className="flex space-x-1">
                <Dot className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-black text-sm whitespace-pre-line leading-relaxed">
                    {award.title[0].toUpperCase() + award.title.slice(1)}
                  </p>
                  <p className="text-gray-700 text-md">{award.institute}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="pr-4 border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">Services</h3>

          {data?.services &&
            data?.services.map((service, idx) => (
              <div className="flex space-x-1">
                <Dot className="w-4 h-4 text-gray-500" />
                <p className="text-gray-800 text-sm whitespace-pre-line leading-relaxed">
                  {service.service_name}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">About</h2>
        <div className="flex items-start space-x-4">
          <p className="text-gray-600 leading-relaxed max-w-lg whitespace-pre-line">
            {data?.business_introduction.description}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Portfolio</h2>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data?.portfolio &&
              data?.portfolio.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-full h-32 rounded-md overflow-hidden border border-gray-200"
                >
                  <img
                    src={url.image_url}
                    alt={`Job image ${idx + 1}`}
                    className="object-cover"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
