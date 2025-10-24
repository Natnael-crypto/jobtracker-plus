export const dynamic = "force-dynamic";

import AdminSidebar from "@/components/admin/sidebar";
import { requireRole } from "@/lib/guards";

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("admin");
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex flex-col flex-grow">
        {/* <TopNav /> */}
        <br />
        <div className="flex-1 overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
}
