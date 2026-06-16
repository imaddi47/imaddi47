"use client";

import { useEffect, useState } from "react";

/** Live local time in a given IANA timezone, hh:mm. */
export function Clock({ tz = "Asia/Kolkata", label = "IST" }: { tz?: string; label?: string }) {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [tz]);

  return (
    <span className="marginalia tabular-nums">
      {time || "--:--"} <span className="opacity-60">{label}</span>
    </span>
  );
}
