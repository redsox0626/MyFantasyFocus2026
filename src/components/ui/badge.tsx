import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums",
  {
    variants: {
      variant: {
        default: "bg-subtle text-fg",
        muted: "bg-subtle text-muted",
        mine: "bg-mine text-mine-fg",
        theirs: "bg-theirs text-theirs-fg",
        shared: "bg-shared text-shared-fg",
        outline: "shadow-border text-muted",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
