import type { LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";

const TOAST_LIMIT = 3;
const DEFAULT_DURATION = 5000;

type ToastVariant = "default" | "destructive";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  action?: ToastAction;
  icon?: LucideIcon;
};

type AddToastInput = Omit<ToastData, "id">;

type Listener = (toasts: ToastData[]) => void;

const listeners = new Set<Listener>();
let memToasts: ToastData[] = [];
let counter = 0;

function notify(updated: ToastData[]) {
  memToasts = updated;
  listeners.forEach((cb) => cb(memToasts));
}

function addToast(input: AddToastInput): string {
  const id = String(++counter);
  const next = [
    { id, duration: DEFAULT_DURATION, ...input },
    ...memToasts,
  ].slice(0, TOAST_LIMIT);
  notify(next);
  return id;
}

function dismissToast(id?: string) {
  notify(id ? memToasts.filter((t) => t.id !== id) : []);
}

export const toast = Object.assign(addToast, {
  destructive(input: Omit<AddToastInput, "variant">) {
    return addToast({ ...input, variant: "destructive" });
  },
});

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>(memToasts);

  useEffect(() => {
    listeners.add(setToasts);
    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return { toasts, dismiss: dismissToast };
}
