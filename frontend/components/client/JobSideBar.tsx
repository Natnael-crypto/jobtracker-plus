import { useBidsByState } from "@/hooks/useBidStats";
import { SidebarBlock } from "./SidebarBlock";

export const JobSidebar: React.FC<{
  id: string;
  serviceCategory?: string;
  onSelectContractor: (id: string) => void;
}> = ({ id, onSelectContractor, serviceCategory }) => {
  const greenHeader = "bg-[#4B8344]";

  const { data, isLoading } = useBidsByState(id);

  if (isLoading || data === null) {
    return null;
  }

  return (
    <div className="space-y-6 md:sticky md:top-8 pt-8 md:pt-0">
      <SidebarBlock
        title="Bid Requests"
        contractors={data!.pending}
        onSelect={onSelectContractor}
        message="Contractors who are interested in your job"
        jobId={id}
        serviceCategoryId={serviceCategory}
      />

      <SidebarBlock
        title="Shortlisted"
        contractors={data!.shortlisted}
        onSelect={onSelectContractor}
        message="There are no contractors shortlisted at the moment."
        jobId={id}
        serviceCategoryId={serviceCategory}
      />

      <SidebarBlock
        title="Invitation"
        contractors={data!.invites}
        onSelect={onSelectContractor}
        message="There are no contractors invited at the moment."
        jobId={id}
        serviceCategoryId={serviceCategory}
      />

      <SidebarBlock
        title="Hired"
        contractors={data!.hired}
        onSelect={onSelectContractor}
        message="There are no contractors Hired at the moment."
        jobId={id}
        serviceCategoryId={serviceCategory}
      />

      <SidebarBlock
        title="Completed"
        contractors={data!.completed}
        onSelect={onSelectContractor}
        message="There are no contractors Hired at the moment."
        jobId={id}
        serviceCategoryId={serviceCategory}
      />

      <SidebarBlock
        title="Rejections"
        contractors={data!.rejected}
        onSelect={onSelectContractor}
        message="There are no contractors Rejected at the moment."
        jobId={id}
        serviceCategoryId={serviceCategory}
      />
    </div>
  );
};
