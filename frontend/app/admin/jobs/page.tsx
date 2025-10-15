"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useGetAllJobs } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AdminJobsPage() {
  const router = useRouter();

  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // NEW
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

  // Fetch jobs with filters
  const { data, isLoading, isError, refetch } = useGetAllJobs(
    limit,
    offset,
    search,
    status
  );
  const jobs = data?.jobs || [];
  const total = data?.total || 0;

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOffset(0);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value === "all" ? "" : value);
    setOffset(0);
  };

  const handleNextPage = () => setOffset((prev) => prev + limit);
  const handlePrevPage = () => setOffset((prev) => Math.max(prev - limit, 0));

  return (
    <div className="mx-auto p-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-semibold text-gray-900">All Jobs</h2>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <Input
            placeholder="Search by headline, description, or user"
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-72 border-gray-300 focus:border-green-500"
          />

          {/* Status Filter */}
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:border-green-500 bg-white">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> Loading jobs...
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-500 py-10">
          Failed to load jobs.{" "}
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Job List */}
      {!isLoading && !isError && (
        <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 bg-gray-100 font-semibold text-gray-700 text-sm px-4 py-3 sticky top-0">
            <div>Job Headline</div>
            <div>Category</div>
            <div>Budget</div>
            <div>Status</div>
            <div>Posted By</div>
            <div>Created</div>
          </div>

          {/* Table Rows */}
          <div>
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No jobs found</p>
            ) : (
              jobs.map((jobDetail, idx) => {
                const job = jobDetail.job;
                const user = jobDetail.created_by;

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(jobDetail)}
                    className={`grid grid-cols-6 items-center px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="truncate font-medium text-gray-900">
                      {job.headline ?? "Untitled"}
                    </div>

                    <div className="text-gray-600 truncate">
                      {job.service_category}
                    </div>

                    <div className="text-gray-700 font-medium">
                      {job.budget || "N/A"}
                    </div>

                    <div>
                      <Badge
                        className={
                          job.status === "open"
                            ? "bg-green-100 text-green-700"
                            : job.status === "closed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-blue-100 text-blue-700"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 truncate">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {user.image_url ? (
                          <img
                            src={user.image_url}
                            alt="user"
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-xs flex justify-center items-center h-full text-gray-500">
                            N/A
                          </span>
                        )}
                      </div>
                      <span className="truncate">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>

                    <div className="text-gray-500 text-sm">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* Pagination Controls */}
      {jobs.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={handlePrevPage}
            disabled={offset === 0}
          >
            Previous
          </Button>
          <span className="text-gray-600 text-sm">
            Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={jobs.length < limit}
          >
            Next
          </Button>
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl scrollbar-hide">
          {selectedJob && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  {selectedJob.job.headline}
                </DialogTitle>
                <DialogDescription>
                  {selectedJob.job.service_category} —{" "}
                  {selectedJob.job.service_specific}
                </DialogDescription>
              </DialogHeader>

              <Separator className="my-3" />

              <div className="space-y-3">
                <p>
                  <strong>Budget:</strong> {selectedJob.job.budget}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    className={
                      selectedJob.job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : selectedJob.job.status === "closed"
                        ? "bg-gray-200 text-gray-700"
                        : "bg-blue-100 text-blue-700"
                    }
                  >
                    {selectedJob.job.status}
                  </Badge>
                </p>
                <p>
                  <strong>Posted:</strong>{" "}
                  {new Date(selectedJob.job.created_at).toLocaleString()}
                </p>

                <p className="text-gray-700">
                  <strong>Description:</strong> <br />
                  {selectedJob.job.description || "No description"}
                </p>

                <Separator className="my-3" />

                <div>
                  <h4 className="font-semibold mb-2">Posted By</h4>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedJob.created_by.image_url}
                      alt="poster"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {selectedJob.created_by.first_name}{" "}
                        {selectedJob.created_by.last_name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {selectedJob.created_by.phone_number}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bids */}
                {selectedJob.bids && selectedJob.bids.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <h4 className="font-semibold mb-2">Bids</h4>
                      <div className="space-y-2">
                        {selectedJob.bids.map((bid: any) => (
                          <div
                            key={bid.bid_id}
                            className="flex items-center justify-between border p-2 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={bid.user_detail.image_url}
                                alt="bidder"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">
                                  {bid.user_detail.first_name}{" "}
                                  {bid.user_detail.last_name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {bid.user_detail.phone_number}
                                </p>
                              </div>
                            </div>
                            <Badge className="capitalize">{bid.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Invites */}
                {selectedJob.invites && selectedJob.invites.length > 0 && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <h4 className="font-semibold mb-2">Invitations</h4>
                      <div className="space-y-2">
                        {selectedJob.invites.map((invite: any) => (
                          <div
                            key={invite.invite_id}
                            className="flex items-center justify-between border p-2 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={invite.user_detail.image_url}
                                alt="invitee"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">
                                  {invite.user_detail.first_name}{" "}
                                  {invite.user_detail.last_name}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {invite.user_detail.phone_number}
                                </p>
                              </div>
                            </div>
                            <Badge className="capitalize">
                              {invite.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
