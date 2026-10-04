"use client";
import { useEffect, useState } from "react";
const format = () =>
  new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
/** Live Kerala (IST) time; renders a placeholder until mounted to avoid hydration mismatch. */
export default function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30000);
    return () => window.clearInterval(id);
  }, []);
  return <time>{time ?? "--:--"}</time>;
}
