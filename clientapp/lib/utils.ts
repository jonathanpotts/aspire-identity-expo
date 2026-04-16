import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
