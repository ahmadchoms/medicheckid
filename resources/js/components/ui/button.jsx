import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-clinical-md text-sm font-semibold cursor-pointer transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-clinical-primary/30 focus-visible:ring-offset-2 aria-invalid:ring-clinical-danger/20 aria-invalid:border-clinical-danger",
  {
    variants: {
      variant: {
        default: "bg-clinical-primary text-white shadow-clinical-sm hover:bg-clinical-primary-hover hover:shadow-clinical-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-clinical-xs",
        primary:
          "bg-clinical-primary text-white shadow-clinical-sm hover:bg-clinical-primary-hover hover:shadow-clinical-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-clinical-xs",
        destructive:
          "bg-clinical-danger text-white shadow-clinical-sm hover:bg-clinical-danger/90 active:shadow-clinical-xs",
        outline:
          "border-1.5 border-clinical-border-strong bg-white shadow-clinical-xs hover:bg-clinical-bg hover:border-clinical-primary hover:text-clinical-primary",
        secondary:
          "bg-clinical-bg text-clinical-text border border-clinical-border hover:bg-clinical-border/50",
        ghost:
          "text-clinical-text-secondary hover:bg-clinical-bg hover:text-clinical-text",
        link: "text-clinical-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-clinical-sm px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-clinical-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-clinical-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-clinical-lg px-8 py-3 text-base has-[>svg]:px-6",
        icon: "size-9",
        "icon-xs": "size-6 rounded-clinical-sm [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
