"use client";
import { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/common/components/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import NotificationDropdown from "@/components/common/Header/notification-dropdown";
// import DropdownNotification from "@/components/common/Header/DropdownNotification";

export default function RootLayout({ children }: { children: ReactNode }) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="dark:bg-[#292929] bg-c_gray dark:text-slate-300 w-full">
          <div className="flex h-screen overflow-hidden">
            {/* <!-- ===== Sidebar Start ===== --> */}
            {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
            {/* <!-- ===== Sidebar End ===== --> */}

            {/* <!-- ===== Content Area Start ===== --> */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {/* <!-- ===== Header Start ===== --> */}
              {/* <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}
              <header className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-sidebar text-sidebar-foreground dark:bg-[#18181b] navbar-img">
                <div className="flex items-center gap-2 px-4 text-white">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Jouw Applicatie Bouwen
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage className="text-sidebar-foreground text-white">Data Ophalen</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </div>
                <div className="mr-8">
                  {/* <DropdownNotification /> */}
                  <NotificationDropdown />
                </div>
              </header>
              {/* <!-- ===== Header End ===== --> */}

              {/* <!-- ===== Main Content Start ===== --> */}
              <main>
                <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">{children}</div>
              </main>
              {/* <!-- ===== Main Content End ===== --> */}
            </div>
            {/* <!-- ===== Content Area End ===== --> */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
