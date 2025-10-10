import BusinessSidebar from "@/components/business/sidebar";
import TopNav from "@/components/business/topnav";
import { requireRole } from "@/lib/guards";

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("business");
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-shrink-0">
        <BusinessSidebar />
      </div>

      <div className="flex flex-col flex-grow">
        <TopNav />
        <div className="flex-1 overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
}
