"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/cn"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export function NavMain({
  items,
  label = "Platform"
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[],
  label?: string
}) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white">{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const [open, setOpen] = useState(false);
          if (item.items) {
            return (
              <Collapsible
                key={item.title}
                asChild
                open={pathname.startsWith(item.url) || item.items.some(current => pathname.startsWith(current.url)) || open}
                defaultOpen={pathname.startsWith(item.url) || item.items.some(current => pathname.startsWith(current.url))}
                className="group/collapsible"
              >
                <SidebarMenuItem className="text-white">
                  <CollapsibleTrigger asChild onClick={() => setOpen(true)} >
                    <SidebarMenuButton tooltip={item.title} className={cn("hover:!bg-indigo-400/30 hover:!text-white hover:backdrop-blur-sm dark:hover:bg-indigo-800", (pathname.startsWith(item.url) || item.items.some(current => pathname.startsWith(current.url))) && "bg-white/30 backdrop-blur-sm rounded-md text-white")}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="text-white">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild className={cn("hover:bg-indigo-300 dark:hover:bg-indigo-800 text-white", pathname.startsWith(subItem.url) && "bg-white/30 backdrop-blur-sm rounded-md text-white")}>
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
              <SidebarMenuButton onClick={() => router.push(item.url)} tooltip={item.title} className={cn("hover:bg-indigo-400/30 hover:text-white hover:backdrop-blur-sm dark:hover:bg-indigo-800", (pathname === item.url || pathname.startsWith(item.url)) && "bg-white/30 backdrop-blur-sm dark:bg-gray-500")}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
