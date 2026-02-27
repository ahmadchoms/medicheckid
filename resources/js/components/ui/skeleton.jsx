import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
    return (
        <div
            data-slot="skeleton"
            className={cn(
                "bg-accent/50 animate-pulse rounded-md border border-border",
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
