"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";

export default function LocalTime({
  timeZone,
  label,
}: {
  timeZone: string;
  label: string;
}) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date(), timeZone));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <span suppressHydrationWarning>
      {time} {label}
    </span>
  );
}
