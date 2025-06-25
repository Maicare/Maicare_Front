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
import { sidebarClientLinks, sidebarEmployeeLinks, sidebarLinks, sidebarLocationLinks } from "../data/sidebar.data"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useClient } from "@/hooks/client/use-client";
import { useLocation } from "@/hooks/location/use-location";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();
    const { clientId, employeeId,locationId } = useParams();
    const isClient = pathname.startsWith("/clients/") && pathname !== "/clients/" && pathname !== "/clients/new";
    const isEmployee = pathname.startsWith("/employees/") && pathname !== "/employees/" && pathname !== "/employees/new";
    const isLocation = pathname.startsWith("/locations/") && pathname !== "/locations/";
    const [user, setUser] = useState({ first_name: "Loading", last_name: "", email: "", id: parseInt(employeeId as string) ?? parseInt(clientId as string) ?? parseInt(locationId as string), profile_picture: "/images/avatar-1.jpg" });

    const [isLoading, setIsLoading] = useState(false);
    const { readOne } = useEmployee({ autoFetch: false });
    const { readOne: readClient } = useClient({ autoFetch: false });
    const { readOne: readLocation } = useLocation({ autoFetch: false });
    useEffect(() => {
        const fetchEmployee = async (id: number) => {
            setIsLoading(true);
            const data = await readOne(id);
            setUser({ ...data, profile_picture: data.profile_picture ?? "/images/avatar-1.jpg" });
            setIsLoading(false);
        }
        const fetchClient = async (id: number) => {
            setIsLoading(true);
            const data = await readClient(id);
            setUser({ ...data, profile_picture: data.profile_picture ?? "/images/avatar-1.jpg" });
            setIsLoading(false);
        }
        const fetchLocation = async (id: number) => {
            setIsLoading(true);
            const data = await readLocation(id);
            setUser({ first_name:data.name,last_name:"",email:data.address,id:data.id, profile_picture: "/images/avatar-1.jpg" });
            setIsLoading(false);
        }
        if (isEmployee) {
            const employeeId = pathname.split("/")[2];
            if (employeeId) fetchEmployee(+employeeId);
        } else if (isClient) {
            const clientId = pathname.split("/")[2];
            if (clientId) fetchClient(+clientId);
        } else if (isLocation) {
            const locationId = pathname.split("/")[2];
            if (locationId) fetchLocation(+locationId);
        }
    }
        , [isEmployee, isClient,isLocation, pathname]);


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
                    <NavMain items={isEmployee ? sidebarEmployeeLinks({ first_name: "Loading", last_name: "", id: parseInt(employeeId as string) ?? parseInt(clientId as string) }) : isClient ? sidebarClientLinks({ first_name: "Loading", last_name: "", id: parseInt(employeeId as string) ?? parseInt(clientId as string) }) : isLocation ? sidebarLocationLinks({ first_name: "Loading", last_name: "", id: parseInt(locationId as string) ?? parseInt(clientId as string) ?? parseInt(employeeId as string) }) : sidebarLinks} label={isEmployee ? "Medewerker" : isClient ? "Clienten" : isLocation ? "Locatie" : "Dashboard"} />
                </SidebarContent>
                <SidebarFooter>
                    <ThemeSwitcher />
                    <NavUser user={{ name: user.first_name + " " + user.last_name, email: user.email, avatar: user.profile_picture || "/images/avatar-1.jpg" }} />
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
                <NavMain items={isEmployee ? sidebarEmployeeLinks(user) : isClient ? sidebarClientLinks(user) : isLocation ? sidebarLocationLinks(user) : sidebarLinks} label={isEmployee ? "Medewerker" : isClient ? "Clienten" : isLocation ? "Locatie" : "Dashboard"} />
            </SidebarContent>
            <SidebarFooter>
                <ThemeSwitcher />
                <NavUser user={{ name: user.first_name + " " + user.last_name, email: user.email, avatar: user.profile_picture || "/images/avatar-1.jpg" }} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
