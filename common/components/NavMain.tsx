"use client"

import {  type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import NavMenuItem from "./navMenuItem"

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

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white">{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavMenuItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
