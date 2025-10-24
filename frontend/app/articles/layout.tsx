import Footer from "@/components/langing/Footer";
import TopNav from "@/components/langing/top";

export default async function BusinessLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-white">
      <div className="flex flex-col flex-grow">
        <TopNav />
        <br />
        <br />
        <div className="flex-1  h-screen  overflow-y-auto ">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
