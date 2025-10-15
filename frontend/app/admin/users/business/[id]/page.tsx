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

  const { data, isLoading } = useUserByIDBusiness(id);
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

      <div className="max-w-5xl mx-auto space-y-2 justify-center">
        {jobs && jobs.length === 0 ? (
          <p className="text-gray-500 text-center">No jobs found</p>
        ) : (
          jobs &&
          jobs.map((job, i) => (
            <Card
              key={i}
              className="border border-gray-200 bg-white rounded hover:shadow-md transition cursor-pointer shadow-none"
            >
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between gap-2">
                  <CardTitle className="text-lg font-semibold text-black">
                    {job.Job?.headline ?? "No headline"}
                  </CardTitle>
                  <Badge className="bg-green-500 text-white capitalize self-start md:self-center">
                    {job.Status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {job.Job?.service_category} → {job.Job?.service_specific}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Budget: {job.Job?.budget}
                </p>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
