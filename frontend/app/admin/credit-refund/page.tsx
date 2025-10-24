"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useAdminCreditRefunds,
  useAdminJobDetail,
  useRefundResponse,
} from "@/hooks/useCredit";
import { CreditRefund, CreditUsage, JobDetailResponse } from "@/types/credit";

export default function AdminRefundRequestsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<
    CreditRefund | undefined
  >(undefined);
  const [adminReason, setAdminReason] = useState("");
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const { data, isLoading, refetch } = useAdminCreditRefunds(
    page,
    limit,
    status,
    search
  );
  const { mutate: handleRefundResponse, isPending } = useRefundResponse();

  const totalPages = data?.total_pages || 1;
  const refunds = data?.data || [];

  const handleSelectRefund = (id: string) => {
    setId(id);
    setOpen(true);
    setSelectedRefund(refunds.find((r) => r.id === id));
  };

  const handleAction = (action: "accept" | "reject") => {
    if (!selectedRefund) return;
    handleRefundResponse({
      id: id,
      status: action === "accept" ? "approved" : "rejected",
      admin_reason: adminReason,
    });
    setOpen(false);
    setAdminReason("");
  };

  return (
    <div className="min-h-screen bg-white text-black p-6 mx-auto">
      <div className="">
        <h1 className="text-2xl font-semibold mb-6">Refund Requests</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <Input
            placeholder="Search by user or job title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-400 w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-400 rounded p-2 bg-white text-gray-700"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <Button
            onClick={() => {
              setPage(1);
              refetch();
            }}
            className="border border-black bg-white text-black hover:bg-black hover:text-white"
          >
            Apply Filters
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-gray-300 bg-white">
          {isLoading ? (
            <div className="p-6 text-center text-gray-600">
              Loading refund requests...
            </div>
          ) : refunds.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No refund requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm text-gray-800">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="p-3 text-left">Job Title</th>
                    <th className="p-3 text-left">User Reason</th>
                    <th className="p-3 text-left">Admin Reason</th>
                    <th className="p-3 text-left">Credit</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Created At</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {refunds.map((refund) => (
                    <tr
                      key={refund.id}
                      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="p-3">{refund.job_title}</td>
                      <td className="p-3 truncate max-w-xs">
                        {refund.user_reason}
                      </td>
                      <td className="p-3 truncate max-w-xs">
                        {refund.admin_reason}
                      </td>
                      <td className="p-3">{3}</td>
                      <td className="p-3">{refund.status}</td>
                      <td className="p-3">
                        {new Date(refund.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        <Button
                          variant="outline"
                          onClick={() => handleSelectRefund(refund.id)}
                          className="border border-gray-400 text-gray-800 hover:bg-black hover:text-white"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center p-4 border-t border-gray-300">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border border-black bg-white text-black hover:bg-black hover:text-white"
              >
                Prev
              </Button>
              <Button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border border-black bg-white text-black hover:bg-black hover:text-white"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Job Detail Modal */}
      {id != "" && (
        <RefundModal
          open={open}
          id={id}
          onClose={() => setOpen(false)}
          refund={selectedRefund!}
          adminReason={adminReason}
          setAdminReason={setAdminReason}
          handleAction={handleAction}
          isPending={isPending}
        />
      )}
    </div>
  );
}

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  refund: CreditRefund;
  id: string;
  adminReason: string;
  setAdminReason: (val: string) => void;
  handleAction: (action: "accept" | "reject") => void;
  isPending: boolean;
}

function RefundModal({
  open,
  onClose,
  refund,
  adminReason,
  id,
  setAdminReason,
  handleAction,
  isPending,
}: RefundModalProps) {
  const { data: jobDetail, isLoading } = useAdminJobDetail(id);

  if (refund !== undefined && refund.admin_reason != "") {
    adminReason = refund.admin_reason;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border border-gray-400 bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Refund Request Detail
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Review job details and the user’s reason before responding.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 text-center text-gray-600">
            Loading job details...
          </div>
        ) : jobDetail ? (
          <div className="space-y-3 text-sm text-gray-800">
            <div>
              <p className="font-medium text-gray-900">Job Title:</p>
              <p>{jobDetail.job_title}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">Job Description:</p>
              <p className="text-gray-700">{jobDetail.job_description}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">User Info:</p>
              <p>{jobDetail.user_name}</p>
              <p className="text-gray-600">{jobDetail.user_email}</p>
              <p className="text-gray-600">{jobDetail.phone}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">User Reason:</p>
              <p className="text-gray-700">{refund.user_reason}</p>
            </div>
            <div>
              <p className="font-medium text-gray-900 mb-1">Admin Reason</p>
              <Textarea
                value={adminReason}
                onChange={(e) => setAdminReason(e.target.value)}
                placeholder="Write your reason for approving or rejecting..."
                className="border border-gray-400 text-black bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-gray-600">
            No job details found.
          </div>
        )}

        {refund.status === "pending" && (
          <div className="flex justify-end gap-2 pt-4">
            <Button
              onClick={() => handleAction("reject")}
              disabled={isPending}
              className="border border-gray-500 text-gray-100 hover:bg-black hover:text-white"
            >
              Reject
            </Button>
            <Button
              onClick={() => handleAction("accept")}
              disabled={isPending}
              className="border border-black bg-black text-white hover:bg-white hover:text-black"
            >
              Accept
            </Button>
          </div>
        )}
        {refund.status === "approved" ? (
          <div className="flex justify-end gap-2 pt-4">
            Refund Request Was <strong>Approved</strong>
          </div>
        ) : (
          <div className="flex justify-end gap-2 pt-4">
            Refund Request Was <strong>Rejected</strong>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
