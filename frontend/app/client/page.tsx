"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetClientDashboard,
  useGetDashboard,
  useGetProfileViews,
} from "@/hooks/useDashboard";
import { useFetchEvents } from "@/hooks/useEvents";
import {
  useCreateVerificationSession,
  useVerified,
} from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";

// --- Helper Components ---
const StatCard: React.FC<{
  title: string;
  value: string | number;
  subText?: string;
  image?: string;
}> = ({ title, value, subText, image }) => (
  <Card className="hover:shadow-md transition-all border border-gray-100 py-0 shadow-none rounded">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>
        {subText && <p className="text-sm text-gray-400 mt-1">{subText}</p>}
        {title === "Badge" && (
          <Badge
            variant="outline"
            className="mt-2 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-50"
          >
            Complete verification
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-center mt-2">
        <img src={image} alt="" />
      </div>
    </CardContent>
  </Card>
);

const VerificationBox: React.FC = () => {
  const { data: verified } = useVerified();
  const { mutate: createVerificationSession } = useCreateVerificationSession();
  return (
    <Card className="hover:shadow-md transition-all border border-gray-100 py-0 shadow-none rounded">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">Badge</p>
          <div className="text-3xl font-bold text-gray-800 my-1 ">
            {verified != undefined && verified?.verified === true
              ? "Verified"
              : "Not Verified"}
          </div>

          {verified != undefined && verified?.verified === false ? (
            <Button
              onClick={() => createVerificationSession()}
              className="bg-green-600 hover:bg-green-700 text-white w-[150px] py-2 rounded-md font-semibold"
            >
              Verify Identity
            </Button>
          ) : (
            <Badge
              variant="outline"
              className="mt-2 text-blue-600 border-blue-200 cursor-pointer hover:bg-blue-50"
            >
              Complete verification
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-center mt-2">
          <img src="/success.svg" alt="" />
        </div>
      </CardContent>
    </Card>
  );
};

const ScheduleListItem: React.FC<{ item: any }> = ({ item }) => (
  <div className="relative pl-6 pb-4 last:pb-0">
    <div
      className={cn("absolute left-0 top-2 w-2 h-2 rounded-full bg-green-500")}
    ></div>
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-700">{item.title}</p>
          <span className="text-xs text-gray-400">
            {item.start_time} - {item.end_time}
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        )}
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const [dayFilter, setDayFilter] = useState<number>(7);

  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetClientDashboard();
  const { data: events, isLoading: eventsLoading } = useFetchEvents(
    new Date().toLocaleString()
  );

  const stats = dashboardData
    ? [
        {
          title: "Total Jobs",
          value: dashboardData.CompletedJobs,
          image: "/contract.svg",
        },

        {
          title: "Completed Jobs",
          value: dashboardData.CompletedJobs,
          image: "/contract.svg",
        },

        {
          title: "In Queue Jobs",
          value: dashboardData.OpenJobs,
          image: "/sandclock-2.svg",
        },
        {
          title: "Awarded Jobs",
          value: dashboardData.AwardedJobs,
          image: "/review.svg",
        },
        {
          title: "Total Responses",
          value: dashboardData.TotalResponse,
          image: "/review.svg",
        },
      ]
    : [];

  return (
    <div className="min-h-screen p-6 lg:p-10 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back! Here's your performance overview.
        </p>
      </header>

      <main className="space-y-8">
        {/* --- Stats Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))
            : stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule */}
          <Card className="lg:col-span-1 border border-gray-100 hover:shadow-md transition-all shadow-none rounded">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <Skeleton className="h-48 w-full rounded-md" />
              ) : (
                <div className="space-y-4">
                  {events && events.length > 0 ? (
                    events.map((item, i) => (
                      <div
                        key={i}
                        className="group hover:bg-gray-50 p-2 rounded-lg transition"
                      >
                        <ScheduleListItem item={item} />
                        {i < events.length - 1 && (
                          <Separator className="my-2" />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">
                      No events scheduled for today.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
