"use client";

import { useSearchParams } from "next/navigation";
import { Loader2, Mail, Phone, UserCircle } from "lucide-react";
import { useUserByIDBusiness, useUserByIDClient } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";

  const { data, isLoading } = useUserByIDClient(id);

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin w-6 h-6 text-green-500" />
      </div>
    );

  if (!data)
    return (
      <div className="text-center text-gray-500 py-20">User not found</div>
    );

  const { user, jobs } = data;

  return (
    <div className="p-6 min-h-screen bg-gray-50 text-gray-900">
      {/* --- User Profile --- */}
      <Card className="max-w-5xl mx-auto mb-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 pb-0">
          <img
            src={user.image_url || "/default-avatar.png"}
            alt="user"
            className="w-24 h-24 rounded-full bg-gray-200 object-cover"
          />
          <div className="flex flex-col text-center md:text-left">
            <CardTitle className="text-2xl font-semibold text-black capitalize">
              {user.first_name} {user.last_name}
            </CardTitle>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge
                className={
                  user.status === "active"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }
              >
                {user.status}
              </Badge>
              <Badge
                className={
                  user.role === "business"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }
              >
                {user.role}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-6 grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            <span>{user.phone || "No phone"}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-gray-500" />
            <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge
              className={
                user.email_verified
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }
            >
              {user.email_verified ? "Email Verified" : "Email Unverified"}
            </Badge>
            <Badge
              className={
                user.identity_verified
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }
            >
              {user.identity_verified ? "ID Verified" : "ID Unverified"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* --- User Jobs --- */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold text-black mb-4">User Jobs</h2>

        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs found</p>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job, i) => (
              <Card
                key={i}
                className="border border-gray-200 bg-white rounded hover:shadow-md transition cursor-pointer shadow-none"
              >
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between gap-2">
                    <CardTitle className="text-lg font-semibold text-black">
                      {job.job.headline}
                    </CardTitle>
                    <Badge className="bg-green-500 text-white capitalize self-start md:self-center">
                      {job.job.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.job.service_category} → {job.job.service_specific}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Budget: {job.job.budget}
                  </p>
                </CardHeader>

                <CardContent className="pt-2 text-gray-700">
                  <p className="text-sm mb-4 line-clamp-3">
                    {job.job.description}
                  </p>

                  {"bids" in job && job.bids != null && job.bids.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-black mb-2">
                        Bids
                      </h4>
                      <div className="grid gap-2">
                        {job.bids.map((bid, bi) => (
                          <div
                            key={bi}
                            className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  bid.user_detail.image_url ||
                                  "/default-avatar.png"
                                }
                                alt="bidder"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-black text-sm">
                                  {bid.user_detail.first_name}{" "}
                                  {bid.user_detail.last_name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {bid.user_detail.phone_number}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-500 text-white text-xs">
                              {bid.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {"invites" in job &&
                    Array.isArray(job.invites) &&
                    job.invites.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-black mb-2">
                          Invites
                        </h4>
                        <div className="grid gap-2">
                          {job.invites != null &&
                            job.invites.map((invite, ii) => (
                              <div
                                key={ii}
                                className="flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={
                                      invite.user_detail?.image_url ||
                                      "/default-avatar.png"
                                    }
                                    alt="invitee"
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="font-medium text-black text-sm">
                                      {invite.user_detail?.first_name}{" "}
                                      {invite.user_detail?.last_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {invite.user_detail?.phone_number}
                                    </p>
                                  </div>
                                </div>
                                <Badge className="bg-green-500 text-white text-xs">
                                  {invite.status}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
