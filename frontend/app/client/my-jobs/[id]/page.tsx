"use client";

import React, { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useGetJob } from "@/hooks/useJob";
import LoadingPage from "@/components/common/LoadingPage";
import { JobDetailSection } from "@/components/client/JobDetailSection";
import { JobSidebar } from "@/components/client/JobSideBar";

const JobDetailPage: React.FC = () => {
  const params = useParams();
  const jobId = params.id as string;
  const [activeUser, setActiveUser] = useState("");

  const { data, isLoading } = useGetJob(jobId);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen antialiased font-sans">
      <header className="py-4 md:py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a
            href="/client/my-jobs"
            className="text-green-700 hover:text-green-800 font-medium flex items-center text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Go back to My Jobs
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="md:grid md:grid-cols-12 md:gap-10">
          <section className="md:col-span-8">
            <JobDetailSection job={data!} activeUser={activeUser} />
          </section>

          <aside className="md:col-span-4 mt-12 md:mt-0">
            <JobSidebar
              id={jobId}
              onSelectContractor={setActiveUser}
              serviceCategory={data?.service_category}
            />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JobDetailPage;
