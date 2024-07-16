import { Navbar } from "@/components/global/Navbar";
import { Sidebar } from "@/components/global/Sidebar";
import { PlaylistProvider } from "@/contexts/playlistContext";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PlaylistProvider>
      <Navbar />
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar className="hidden lg:block" />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              {children}
            </div>
          </div>
        </div>
      </div>
    </PlaylistProvider>
  );
};

export default DashboardLayout;
