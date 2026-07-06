import type { HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-white/10 bg-white/[0.055] shadow-soft backdrop-blur-xl", className)} {...props} />;
}

export function MetricCard({
  label,
  value,
  tone = "cyan"
}: {
  label: string;
  value: string;
  tone?: "cyan" | "lime" | "danger" | "white";
}) {
  const tones = {
    cyan: "text-cyan",
    lime: "text-lime",
    danger: "text-danger",
    white: "text-white"
  };
  return (
    <Card className="min-h-24 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className={`mt-3 break-words text-2xl font-bold ${tones[tone]}`}>{value}</p>
    </Card>
  );
}
