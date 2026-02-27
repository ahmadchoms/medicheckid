import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold cursor-pointer transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs",
                primary:
                    "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-xs",
                destructive:
                    "bg-destructive text-white shadow-sm hover:bg-destructive/90 active:shadow-xs",
                outline:
                    "border-1.5 border-border bg-card text-foreground shadow-xs hover:bg-background hover:border-primary hover:text-primary",
                secondary:
                    "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80",
                ghost: "text-muted-foreground hover:bg-background hover:text-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
                xs: "h-6 gap-1 rounded-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
                sm: "h-8 rounded-sm gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
                lg: "h-10 rounded-md px-6 text-base has-[>svg]:px-4",
                xl: "h-12 rounded-lg px-8 py-3 text-base has-[>svg]:px-6",
                icon: "size-9",
                "icon-xs":
                    "size-6 rounded-sm [&_svg:not([class*='size-'])]:size-3",
                "icon-sm": "size-8",
                "icon-lg": "size-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
);

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}

export { Button, buttonVariants };
