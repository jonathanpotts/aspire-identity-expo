import { clsx, type ClassValue } from "clsx";
import { formatHex, formatHex8, parse } from "culori";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatColor(color: string) {
  const parsedColor = parse(color);

  if (!parsedColor) {
    return color;
  }

  return parsedColor.alpha !== undefined && parsedColor.alpha !== 1
    ? formatHex8(parsedColor)
    : formatHex(parsedColor);
}

export async function ensureMinDuration<T>(
  promise: Promise<T>,
  ms: number = 600,
): Promise<T> {
  const [result] = await Promise.allSettled([
    promise,
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);

  if (result.status === "rejected") {
    throw result.reason;
  }

  return result.value;
}
