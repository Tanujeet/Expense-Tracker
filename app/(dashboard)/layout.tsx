import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // apna content wala sidebar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        {/* Sidebar with navigation */}
        <AppSidebar />

        {/* Right side main content */}
        <div className="flex flex-col flex-1">
          {/* Optional Navbar */}
          {/* <Navbar /> */}

          <main className="flex-1 p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
