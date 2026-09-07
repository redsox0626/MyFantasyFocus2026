import { useState } from "react";
import { sleeperAvatarUrl } from "@/lib/fantasy/constants";
import { initials } from "@/lib/fantasy/parse";
import { cn } from "@/lib/utils";

export function SleeperAvatar({
  name,
  avatar,
  size = "md",
}: {
  name: string;
  avatar?: string | null;
  size?: "sm" | "md";
}) {
  const [failed, setFailed] = useState(false);
  const src = sleeperAvatarUrl(avatar);
  const dim = size === "sm" ? "size-8 text-[10px]" : "size-10 text-xs";
  if (!src || failed) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-subtle font-medium text-fg",
          dim,
        )}
        aria-hidden
      >
        {initials(name)}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      width={size === "sm" ? 32 : 40}
      height={size === "sm" ? 32 : 40}
      className={cn("shrink-0 rounded-full bg-subtle object-cover", dim)}
      onError={() => setFailed(true)}
    />
  );
}
