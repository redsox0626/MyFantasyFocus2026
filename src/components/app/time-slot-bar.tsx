import { useState } from "react";
import { ChevronDown, Radio } from "lucide-react";
import { KICKOFF_WINDOWS } from "@/lib/fantasy/constants";
import type { TimeFilter, TimeSlot } from "@/lib/fantasy/types";
import { cn } from "@/lib/utils";

export function TimeSlotBar({
  value,
  onChange,
  counts,
  liveCount = 0,
}: {
  value: TimeFilter;
  onChange: (slot: TimeFilter) => void;
  counts?: Partial<Record<TimeSlot, number>>;
  liveCount?: number;
}) {
  const [open, setOpen] = useState(false);
  const windowSelected = value !== "All" && value !== "Live";

  return (
    <div className="space-y-2">
      <div className="flex gap-2" role="tablist" aria-label="Kickoff window">
        <button
          type="button"
          role="tab"
          aria-selected={value === "Live"}
          onClick={() => onChange("Live")}
          className={cn(
            "flex h-11 min-w-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm",
            "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
            value === "Live" ? "bg-mine text-mine-fg" : "bg-surface text-muted shadow-border hover:text-fg",
          )}
        >
          <Radio className={cn("size-3.5", liveCount > 0 && value !== "Live" && "text-mine")} />
          Live
          <span className="tabular-nums opacity-80">{liveCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === "All"}
          onClick={() => onChange("All")}
          className={cn(
            "h-11 shrink-0 rounded-full px-4 text-sm",
            "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
            value === "All" ? "bg-primary text-primary-foreground" : "bg-surface text-muted shadow-border hover:text-fg",
          )}
        >
          All
        </button>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-sm",
            "transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.96]",
            windowSelected ? "bg-primary text-primary-foreground" : "bg-surface text-muted shadow-border hover:text-fg",
          )}
        >
          <span className="truncate">{windowSelected ? value : "Other windows"}</span>
          <ChevronDown className={cn("size-4 shrink-0 transition-transform duration-150", open && "rotate-180")} />
        </button>
      </div>
      {open ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {KICKOFF_WINDOWS.map((slot) => {
            const selected = value === slot;
            const count = counts?.[slot];
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  onChange(slot);
                  setOpen(false);
                }}
                className={cn(
                  "flex h-11 items-center justify-between rounded-xl px-3 text-left text-sm",
                  selected ? "bg-primary text-primary-foreground" : "bg-surface text-fg shadow-border",
                )}
              >
                <span className="truncate">{slot}</span>
                {typeof count === "number" ? <span className="tabular-nums text-xs opacity-70">{count}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
