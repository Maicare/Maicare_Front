"use client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { useLocalizedPath } from '@/hooks/common/useLocalizedPath';
import { cn } from '@/utils/cn';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react'

const NavMenuItem = ({ item }: {
    item: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
            isActive?: boolean
        }[]
    }
}) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const {currentLocale} = useLocalizedPath();
    const regex = new RegExp(`^${item.url}/\\d+(?:/[a-zA-Z]+)?$`);
    if (item.items) {
        const absUrl  = `/${currentLocale}${item.url}`;
        return (
            <Collapsible
                key={item.title}
                asChild
                open={pathname.includes(absUrl) || item.items.some(current => pathname.includes(current.url)) || open}
                defaultOpen={pathname.includes(absUrl) || item.items.some(current => pathname.includes(current.url))}
                className="group/collapsible"
            >
                <SidebarMenuItem className="text-white">
                    <CollapsibleTrigger asChild onClick={() => setOpen(true)} >
                        <SidebarMenuButton tooltip={item.title} className={cn("hover:!bg-indigo-400/30 hover:!text-white hover:backdrop-blur-sm dark:hover:bg-indigo-800", (pathname.includes(absUrl) || item.items.some(current => pathname.includes(current.url))) && "bg-white/30 backdrop-blur-sm rounded-md text-white")}>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub className="text-white">
                            {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild className={cn("hover:bg-indigo-300 dark:hover:bg-indigo-800 text-white", pathname.includes(subItem.url) && "bg-white/30 backdrop-blur-sm rounded-md text-white")}>
                                        <a href={subItem.url}>
                                            <span>{subItem.title}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }
    return (
        <SidebarMenuItem key={item.title} className=" rounded-md text-white">
            <SidebarMenuButton onClick={() => router.push("/"+currentLocale+item.url)} tooltip={item.title} className={cn("hover:bg-indigo-400/30 hover:text-white hover:backdrop-blur-sm dark:hover:bg-indigo-800", (pathname === "/"+currentLocale+item.url || pathname === "/"+currentLocale+item.url+"/new" || pathname === "/"+currentLocale+item.url+"/create" || regex.test(pathname) ) && "bg-white/30 backdrop-blur-sm dark:bg-gray-500")}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}
export default NavMenuItem