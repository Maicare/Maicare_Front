"use client"

import * as React from "react"
import { ChevronsUpDown, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useColorMode from "@/hooks/common/useColorMode"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/utils/cn"

export function ThemeSwitcher() {
    const [_colorMode, setColorMode] = useColorMode();
    const { isMobile,open } = useSidebar();
    return (
        <SidebarMenu>
            <SidebarMenuItem className="bg-white/30 backdrop-blur-sm rounded-md ">
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={"data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-indigo-300 dark:hover:bg-indigo-800"}
                        >
                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-slate-100 dark:text-black",!open && "hover:bg-indigo-300 dark:hover:bg-indigo-800 dark:hover:text-white")}>
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </div>
                            <div className={cn("grid flex-1 text-left text-sm leading-tight ",!open && "hidden")}>
                                <span className="truncate text-white dark:text-black">Toggle theme</span>
                            </div>
                            <ChevronsUpDown className={cn("ml-auto size-4 text-white",!open && "hidden")} />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuItem onClick={() => typeof setColorMode === "function" && setColorMode("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => typeof setColorMode === "function" && setColorMode("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => typeof setColorMode === "function" && setColorMode("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>

    )
}
