export const dynamic = "force-dynamic";

import ClientSidebar from "@/components/client/sidebar";
import TopNav from "@/components/client/topnav";
import { requireRole } from "@/lib/guards";

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireRole("client");
  return (
    <div className="flex h-screen bg-white">
      <div className="flex-shrink-0">
        <ClientSidebar />
      </div>

      <div className="flex flex-col flex-grow">
        <TopNav />
        <div className="flex-1 overflow-y-auto ">{children}</div>
      </div>
    </div>
  );
}
