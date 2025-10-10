import { UserProfile } from "@/types/jobBid";
import { ChevronLeft, Star, UserPlus } from "lucide-react";

export const ContractorRecommendation: React.FC<{
  contractor: UserProfile;
}> = ({ contractor }) => (
  <a
    href="#"
    className="flex items-center justify-between hover:bg-gray-50 p-2 -m-2 rounded-lg transition cursor-pointer"
  >
    <div className="flex items-center space-x-3">
      <div className="flex items-center justify-center flex-shrink-0">
        {contractor.image_url == "" ? (
          <UserPlus className="w-4 h-4 text-gray-500" />
        ) : (
          <img
            src={contractor.image_url}
            alt=""
            className="rounded-full w-10 h-10 border-1 border-gray-300"
          />
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 overflow-hidden whitespace-nowrap">
          {contractor.first_name + " " + contractor.last_name}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
          <span className="mr-1">{contractor.average_rating?.toFixed(1)}</span>
          <span>({contractor.review_count})</span>
        </div>
      </div>
    </div>
    <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
  </a>
);
