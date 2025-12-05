import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  variant: "blue" | "green" | "orange" | "purple";
}

const variantStyles = {
  blue: "bg-[hsl(var(--stat-blue))] border-blue-200",
  green: "bg-[hsl(var(--stat-green))] border-green-200",
  orange: "bg-[hsl(var(--stat-orange))] border-orange-200",
  purple: "bg-[hsl(var(--stat-purple))] border-purple-200",
};

const iconStyles = {
  blue: "text-[hsl(var(--stat-blue-icon))] bg-blue-100",
  green: "text-[hsl(var(--stat-green-icon))] bg-green-100",
  orange: "text-[hsl(var(--stat-orange-icon))] bg-orange-100",
  purple: "text-[hsl(var(--stat-purple-icon))] bg-purple-100",
};

export function StatCard({ title, value, subtitle, icon: Icon, variant }: StatCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-xl border transition-all hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", iconStyles[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
