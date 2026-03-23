import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CanteensStudentView from "./CanteensStudentView";

const APP_TIMEZONE = process.env.CANTEEN_TIMEZONE || "Asia/Kolkata";

function normalizeDay(value: string): string | null {
  const v = value.trim().toUpperCase();
  const map: Record<string, string> = {
    SUN: "SUN",
    SUNDAY: "SUN",
    MON: "MON",
    MONDAY: "MON",
    TUE: "TUE",
    TUESDAY: "TUE",
    WED: "WED",
    WEDNESDAY: "WED",
    THU: "THU",
    THUR: "THU",
    THURSDAY: "THU",
    FRI: "FRI",
    FRIDAY: "FRI",
    SAT: "SAT",
    SATURDAY: "SAT",
  };
  return map[v] ?? null;
}

function parseWorkingDays(raw: string): string[] {
  let values: unknown = raw;
  try {
    values = JSON.parse(raw);
  } catch {
    // Backward compatibility: allow comma-separated strings
    values = raw.split(",");
  }

  if (!Array.isArray(values)) return [];
  return values
    .map((v) => normalizeDay(String(v)))
    .filter((v): v is string => Boolean(v));
}

function parseTimeToMinutes(raw: string): number | null {
  const value = raw.trim().toUpperCase();

  // 24h format: HH:mm or HH:mm:ss
  const match24 = value.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const h = Number(match24[1]);
    const m = Number(match24[2]);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return h * 60 + m;
    return null;
  }

  // 12h format: h:mm AM/PM
  const match12 = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (match12) {
    let h = Number(match12[1]);
    const m = Number(match12[2]);
    const period = match12[3];
    if (h < 1 || h > 12 || m < 0 || m > 59) return null;
    if (period === "AM") h = h % 12;
    if (period === "PM") h = (h % 12) + 12;
    return h * 60 + m;
  }

  return null;
}

function getNowInTimezone(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? "0");

  return {
    day: normalizeDay(weekday) ?? "SUN",
    minutes: hour * 60 + minute,
  };
}

// Determine if canteen is currently open based on working days + hours.
function isOpenNow(canteen: {
  workingDays: string;
  openingTime: string;
  closingTime: string;
}): boolean {
  const { day: today, minutes: nowMinutes } = getNowInTimezone(APP_TIMEZONE);
  const workingDays = parseWorkingDays(canteen.workingDays);
  const openMinutes = parseTimeToMinutes(canteen.openingTime);
  const closeMinutes = parseTimeToMinutes(canteen.closingTime);

  if (openMinutes === null || closeMinutes === null) return false;
  if (workingDays.length > 0 && !workingDays.includes(today)) return false;

  // Same-day hours (e.g. 09:00 to 18:00)
  if (closeMinutes > openMinutes) {
    return nowMinutes >= openMinutes && nowMinutes < closeMinutes;
  }

  // Overnight hours (e.g. 18:00 to 02:00)
  if (closeMinutes < openMinutes) {
    return nowMinutes >= openMinutes || nowMinutes < closeMinutes;
  }

  // open === close: treat as closed for safety
  return false;
}

export default async function CanteensPage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const canteens = await prisma.canteen.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const processedCanteens = canteens.map((c) => ({
    ...c,
    isOpenNow: isOpenNow(c),
  }));
  return <CanteensStudentView canteens={processedCanteens} />;
}
