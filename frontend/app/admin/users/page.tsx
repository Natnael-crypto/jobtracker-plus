"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UsersFilters } from "@/types/admin";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useUsers } from "@/hooks/useAdmin";

export default function UsersPage() {
  const [filters, setFilters] = useState<UsersFilters>({
    limit: 20,
    offset: 0,
  });
  const router = useRouter();

  const { data, isLoading } = useUsers(filters);
  const users = data?.data || [];

  const handleChange = (key: keyof UsersFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }));
  };

  return (
    <div className="p-6 min-h-screen text-gray-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-black">Manage Users</h1>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {/* Search Field - Wider */}
        <div className="md:col-span-2">
          <Input
            placeholder="Search by email or phone"
            onChange={(e) => handleChange("search", e.target.value)}
            className="bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 w-full text-sm rounded-xl transition-all"
          />
        </div>

        {/* Role */}
        <Select onValueChange={(v) => handleChange("role", v)}>
          <SelectTrigger className="bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 w-full text-sm rounded-xl transition-all">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client">Client</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select onValueChange={(v) => handleChange("status", v)}>
          <SelectTrigger className="bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 w-full text-sm rounded-xl transition-all">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Email Verified */}
        <Select
          onValueChange={(v) => handleChange("email_verified", v === "true")}
        >
          <SelectTrigger className="bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 w-full text-sm rounded-xl transition-all">
            <SelectValue placeholder="Email Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>

        {/* Identity Verified */}
        <Select
          onValueChange={(v) => handleChange("identity_verified", v === "true")}
        >
          <SelectTrigger className="bg-white border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 w-full text-sm rounded-xl transition-all">
            <SelectValue placeholder="Identity Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Verified</SelectItem>
            <SelectItem value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-6 h-6 text-green-500" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-500 py-20">No users found</div>
      ) : (
        <Card className="rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-6 bg-gray-100 font-semibold text-gray-700 text-sm px-4 py-3 sticky top-0">
            <div>User</div>
            <div>Role</div>
            <div>Status</div>
            <div>Email Verified</div>
            <div>ID Verified</div>
            <div>Created</div>
          </div>

          {/* Rows */}
          <div>
            {users.map((user, idx) => (
              <div
                key={idx}
                onClick={() =>
                  router.push(
                    `/admin/users/${
                      user.role === "business" ? "business" : "client"
                    }/${encodeURIComponent(user.id ?? "id")}`
                  )
                }
                className={`grid grid-cols-6 items-center px-4 py-3 text-sm hover:bg-gray-50 transition cursor-pointer ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {user.image_url ? (
                      <img
                        src={user.image_url}
                        alt="user"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">N/A</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {user.phone ?? "No phone"}
                    </span>
                    <span className="text-gray-500 text-xs truncate max-w-[120px]">
                      {user.email ?? "No email"}
                    </span>
                  </div>
                </div>

                <div className="text-gray-600">{user.role}</div>
                <div>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>
                <div>
                  <Badge
                    className={
                      user.email_verified
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                  >
                    {user.email_verified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <Badge
                    className={
                      user.identity_verified
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }
                  >
                    {user.identity_verified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="text-gray-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
