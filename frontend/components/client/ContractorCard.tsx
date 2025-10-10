import { useGetUserBid, useUpdateBidStatus } from "@/hooks/useBidStats";
import {
  useGetInvitationsByJobUserID,
  useUpdateInviteStatus,
} from "@/hooks/useJobInvitations";
import { useUserProfileDetail } from "@/hooks/usePortfolio";
import { Star, UserPlus } from "lucide-react";

const StarRating = ({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) => (
  <div className="flex items-center text-sm">
    <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1" />
    <span className="font-semibold text-gray-800 mr-1">
      {rating.toFixed(1)}
    </span>
    <span className="text-gray-500">({reviews} reviews)</span>
  </div>
);

export const ContractorCard: React.FC<{ id: string; jobId: string }> = ({
  id,
  jobId,
}) => {
  const profilePlaceholder = (
    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
      <UserPlus className="w-6 h-6 text-gray-500" />
    </div>
  );

  const { data: profile, isLoading: profileLoading } = useUserProfileDetail(id);

  const { mutate: updateBidStatus, isPending } = useUpdateBidStatus();
  const { mutate: updateInviteStatus, isPending: isPendingInvite } =
    useUpdateInviteStatus();
  const { data: bidData, isLoading: bidLoading } = useGetUserBid(jobId, id);
  const { data: invitationData, isLoading: invitationLoading } =
    useGetInvitationsByJobUserID({
      job_id: jobId,
      user_id: profile?.user_profile.user_id || "",
    });

  const engagement = bidData ?? invitationData ?? null;

  if (
    profileLoading ||
    bidLoading ||
    invitationLoading ||
    !profile ||
    !engagement
  ) {
    return null;
  }

  const handleStatusChange = (status: string) => {
    if (!engagement?.id) return;
    updateBidStatus({ bid_id: engagement.id, status });
    if (!isPending) window.location.reload();
  };

  const handleInvitationStatusChange = (status: string) => {
    if (!engagement?.id) return;
    updateInviteStatus({ invite_id: engagement.id, status });
    if (!isPending) window.location.reload();
  };

  return (
    <div className="p-4 rounded bg-white border border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          {profile.user_profile.image_url ? (
            <img
              src={profile.user_profile.image_url}
              className="w-12 h-12 rounded-full border border-gray-200 object-cover"
              alt="Contractor profile"
            />
          ) : (
            profilePlaceholder
          )}

          <div>
            <p className="font-semibold text-lg text-gray-800">
              {`${profile.user_profile.first_name} ${profile.user_profile.last_name}`}
            </p>
            <StarRating
              rating={profile.average_rate}
              reviews={profile.reviews?.length ?? 0}
            />
          </div>
        </div>

        {bidData ? (
          <div className="flex space-x-3 text-sm font-medium">
            {engagement.status === "shortlisted" ? (
              <button
                onClick={() => handleStatusChange("hired")}
                className="px-3 py-1.5 text-[#5BBB7B] hover:bg-green-100 transition whitespace-nowrap"
              >
                Hire
              </button>
            ) : engagement.status === "withdrawn" ||
              (engagement.status !== "hired" &&
                engagement.status !== "rejected" &&
                engagement.status !== "shortlisted" &&
                engagement.status !== "completed") ? (
              <button
                onClick={() => handleStatusChange("shortlisted")}
                className="px-3 py-1.5 text-[#5BBB7B] hover:bg-green-100 transition whitespace-nowrap"
              >
                Shortlist Now
              </button>
            ) : null}

            {["shortlisted", "pending", "rejected", "withdrawn"].includes(
              engagement.status
            ) ? (
              <button
                onClick={() => handleStatusChange("rejected")}
                className="px-3 py-1.5 text-red-700 hover:bg-red-100 transition whitespace-nowrap"
              >
                Reject Now
              </button>
            ) : engagement.status !== "shortlisted" &&
              engagement.status !== "completed" ? (
              <button
                onClick={() => handleStatusChange("completed")}
                className="px-3 py-1.5 text-red-700 hover:bg-red-100 transition whitespace-nowrap"
              >
                Complete Job
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("completed")}
                disabled={true}
                className="px-3 py-1.5 text-red-700 hover:bg-red-100 transition whitespace-nowrap"
              >
                Completed
              </button>
            )}
          </div>
        ) : (
          <div className="flex space-x-3 text-sm font-medium">
            {engagement.status === "pending" ? (
              <button
                onClick={() => handleInvitationStatusChange("hired")}
                disabled={true}
                className="px-3 py-1.5 text-[#5BBB7B] hover:bg-green-100 transition whitespace-nowrap"
              >
                Pending For Acceptance
              </button>
            ) : engagement.status === "accepted" ? (
              <button
                onClick={() => handleInvitationStatusChange("hired")}
                className="px-3 py-1.5 text-[#5BBB7B] hover:bg-green-100 transition whitespace-nowrap"
              >
                Hire
              </button>
            ) : null}

            {engagement.status === "accepted" ? (
              <button
                onClick={() => handleInvitationStatusChange("rejected")}
                className="px-3 py-1.5 text-red-700 hover:bg-red-100 transition whitespace-nowrap"
              >
                Reject Now
              </button>
            ) : engagement.status === "hired" ? (
              <button
                onClick={() => handleInvitationStatusChange("completed")}
                className="px-3 py-1.5 text-green-700 hover:bg-green-100 transition whitespace-nowrap"
              >
                Complete Job
              </button>
            ) : engagement.status === "withdrawn" ? (
              <button
                onClick={() => handleInvitationStatusChange("completed")}
                disabled={true}
                className="px-3 py-1.5 text-red-700 hover:bg-red-100 transition whitespace-nowrap"
              >
                Withdrawn
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Type definitions
export interface JobInvitation {
  id: string;
  job_id: string;
  business_id: string;
  status: "pending" | "accepted" | "hired" | "rejected" | "withdrawn";
  created_at: string;
}

export interface Bid {
  id: string;
  job_id: string;
  user_id: string;
  status: string;
  created_at: string;
}
