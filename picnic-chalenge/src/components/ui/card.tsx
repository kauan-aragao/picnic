import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white text-black shadow-sm dark:bg-white dark:text-black p-4",
        className
      )}
      {...props}
    />
  );
}
