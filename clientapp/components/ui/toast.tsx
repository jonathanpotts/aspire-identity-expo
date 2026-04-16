import * as ToastPrimitive from "@rn-primitives/toast";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react-native";
import { X } from "lucide-react-native";
import * as React from "react";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  cn(
    "w-full flex-row items-start gap-3 rounded-lg border p-4 shadow-md shadow-black/10",
  ),
  {
    variants: {
      variant: {
        default: "border-border bg-background",
        destructive: "border-destructive/40 bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type ToastVariantProps = VariantProps<typeof toastVariants>;

function Toast({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Root> & ToastVariantProps) {
  return (
    <ToastPrimitive.Root
      role="alert"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
}

function ToastTitle({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title> & ToastVariantProps) {
  return (
    <ToastPrimitive.Title
      className={cn(
        "text-sm font-semibold leading-snug tracking-tight",
        variant === "destructive"
          ? "text-destructive-foreground"
          : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Description> &
  ToastVariantProps) {
  return (
    <ToastPrimitive.Description
      className={cn(
        "text-sm leading-relaxed opacity-90",
        variant === "destructive"
          ? "text-destructive-foreground"
          : "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ToastAction({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Action> & ToastVariantProps) {
  return (
    <ToastPrimitive.Action
      className={cn(
        "shrink-0 rounded-md border px-3 py-1.5 transition-colors",
        variant === "destructive"
          ? "border-destructive-foreground/40 active:bg-destructive-foreground/10"
          : "border-border active:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

function ToastActionText({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Title> & ToastVariantProps) {
  return (
    <ToastPrimitive.Title
      className={cn(
        "text-sm font-medium",
        variant === "destructive"
          ? "text-destructive-foreground"
          : "text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function ToastIcon({
  className,
  variant,
  icon,
}: {
  icon: LucideIcon;
  className?: string;
} & ToastVariantProps) {
  return (
    <Icon
      as={icon}
      className={cn(
        "size-5 shrink-0",
        variant === "destructive"
          ? "text-destructive-foreground"
          : "text-foreground",
        className,
      )}
    />
  );
}

function ToastClose({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof ToastPrimitive.Close> & ToastVariantProps) {
  return (
    <ToastPrimitive.Close
      className={cn(
        "shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 active:opacity-100",
        className,
      )}
      {...props}
    >
      <Icon
        as={X}
        className={cn(
          "size-4",
          variant === "destructive"
            ? "text-destructive-foreground"
            : "text-foreground",
        )}
      />
    </ToastPrimitive.Close>
  );
}

export {
  Toast,
  ToastAction,
  ToastActionText,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastTitle,
};
