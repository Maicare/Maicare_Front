"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "./NavUser"
import Image from "next/image"
import { NavMain } from "./NavMain"
import { ThemeSwitcher } from "./ThemeSwitcher"
import { sidebarClientLinks, sidebarEmployeeLinks, sidebarLinks } from "../data/sidebar.data"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useClient } from "@/hooks/client/use-client";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();
    const {clientId,employeeId} = useParams();
    const isClient = pathname.startsWith("/clients/") && pathname !== "/clients/";
    const isEmployee = pathname.startsWith("/employees/") && pathname !== "/employees/";
    const [user, setUser] = useState({first_name:"Loading",last_name:"",id:parseInt(employeeId as string) ?? parseInt(clientId as string)});
    
    const [isLoading, setIsLoading] = useState(false);
    const { readOne } = useEmployee({ autoFetch: false });
    const { readOne:readClient } = useClient({ autoFetch: false });
    useEffect(() => {
        const fetchEmployee = async (id: number) => {
            setIsLoading(true);
            const data = await readOne(id);
            setUser(data);
            setIsLoading(false);
        }
        const fetchClient = async (id: number) => {
            setIsLoading(true);
            const data = await readClient(id);
            setUser(data);
            setIsLoading(false);
        }
        if (isEmployee) {
            const employeeId = pathname.split("/")[2];
            if (employeeId) fetchEmployee(+employeeId);
        }else if (isClient) {
            const clientId = pathname.split("/")[2];
            if (clientId) fetchClient(+clientId);
        } 
    }
        , [isEmployee]);

    if (isLoading) {
        return (
            <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => router.push("/dashboard")}
                            size="lg"
                            className="text-white bg-white/30 backdrop-blur-sm rounded-md data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:h-14 hover:bg-indigo-300 dark:hover:bg-indigo-800"
                        >
                            <div className="flex aspect-square data-[state=open]:size-12 size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
                                {
                                    open ?
                                        <Image height={48} width={48} alt="Logo." src={"/images/logo/logo.ico"} />
                                        :
                                        <Image height={30} width={30} alt="Logo." src={"/images/logo/logo.ico"} />
                                }
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    MaiCare
                                </span>
                                <span className="truncate text-xs">Admin</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={isEmployee ? sidebarEmployeeLinks({first_name:"Loading",last_name:"",id:parseInt(employeeId as string) ?? parseInt(clientId as string)}) : isClient ? sidebarClientLinks({first_name:"Loading",last_name:"",id:parseInt(employeeId as string) ?? parseInt(clientId as string)}) : sidebarLinks} label={isEmployee ? "Medewerker" : isClient ? "Clienten" : "Dashboard"} />
            </SidebarContent>
            <SidebarFooter>
                <ThemeSwitcher />
                <NavUser user={{ name: "bourichi taha", email: "bourichi.taha@gmail.com", avatar: "/images/avatar-1.jpg" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
        );
    }
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => router.push("/dashboard")}
                            size="lg"
                            className="text-white bg-white/30 backdrop-blur-sm rounded-md data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:h-14 hover:bg-indigo-300 dark:hover:bg-indigo-800"
                        >
                            <div className="flex aspect-square data-[state=open]:size-12 size-8 items-center justify-center rounded-lg bg-transparent text-sidebar-primary-foreground">
                                {
                                    open ?
                                        <Image height={48} width={48} alt="Logo." src={"/images/logo/logo.ico"} />
                                        :
                                        <Image height={30} width={30} alt="Logo." src={"/images/logo/logo.ico"} />
                                }
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    MaiCare
                                </span>
                                <span className="truncate text-xs">Admin</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={isEmployee ? sidebarEmployeeLinks(user) : isClient ? sidebarClientLinks(user) : sidebarLinks} label={isEmployee ? "Medewerker" : isClient ? "Clienten" : "Dashboard"} />
            </SidebarContent>
            <SidebarFooter>
                <ThemeSwitcher />
                <NavUser user={{ name: "bourichi taha", email: "bourichi.taha@gmail.com", avatar: "/images/avatar-1.jpg" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
