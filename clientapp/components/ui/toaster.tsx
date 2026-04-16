import { Portal } from "@rn-primitives/portal";
import * as React from "react";
import { Platform, View } from "react-native";
import {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import {
  Toast,
  ToastAction,
  ToastActionText,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/components/ui/toast";
import {
  useToast,
  type ToastData,
  type ToastPosition,
} from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export type { ToastPosition };

const EXIT_DURATION = 150;

function ToasterItem({
  id,
  title,
  description,
  variant,
  duration = 5000,
  position,
  dismissible = false,
  action,
  icon,
}: ToastData) {
  const { dismiss } = useToast();
  const [exiting, setExiting] = React.useState(false);
  const exitTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = React.useCallback(() => {
    if (exitTimerRef.current != null) return; // already exiting
    setExiting(true);
    exitTimerRef.current = setTimeout(() => dismiss(id), EXIT_DURATION);
  }, [dismiss, id]);

  React.useEffect(() => {
    const timer = setTimeout(handleDismiss, duration);
    return () => clearTimeout(timer);
  }, [handleDismiss, duration]);

  const isTop = position ? position.startsWith("top") : true;

  return (
    <NativeOnlyAnimatedView
      entering={isTop ? FadeInUp.duration(200) : FadeInDown.duration(200)}
      exiting={
        isTop
          ? FadeOutUp.duration(EXIT_DURATION)
          : FadeOutDown.duration(EXIT_DURATION)
      }
    >
      <Toast
        open
        onOpenChange={(open) => {
          if (!open) handleDismiss();
        }}
        type="foreground"
        variant={variant}
        className={cn(
          Platform.select({
            web: {
              "duration-200 animate-in fade-in motion-reduce:animate-none":
                !exiting,
              "slide-in-from-top-4": !exiting && isTop,
              "slide-in-from-bottom-4": !exiting && !isTop,
              "duration-150 animate-out fade-out fill-mode-forwards motion-reduce:animate-none":
                exiting,
              "slide-out-to-top-4": exiting && isTop,
              "slide-out-to-bottom-4": exiting && !isTop,
            },
          }),
        )}
      >
        <View className="flex-1 gap-1">
          <View className="flex-row items-center gap-2">
            {icon ? <ToastIcon icon={icon} variant={variant} /> : null}
            {title ? <ToastTitle variant={variant}>{title}</ToastTitle> : null}
          </View>
          {description ? (
            <ToastDescription
              variant={variant}
              className={icon ? "ps-7" : undefined}
            >
              {description}
            </ToastDescription>
          ) : null}
        </View>
        <View className="flex-row items-center gap-2">
          {action ? (
            <ToastAction
              variant={variant}
              onPress={() => {
                action.onPress();
                dismiss(id);
              }}
            >
              <ToastActionText variant={variant}>
                {action.label}
              </ToastActionText>
            </ToastAction>
          ) : null}
          {dismissible ? <ToastClose variant={variant} /> : null}
        </View>
      </Toast>
    </NativeOnlyAnimatedView>
  );
}

export function Toaster({
  position: defaultPosition = "top-center",
}: {
  position?: ToastPosition;
}) {
  const { toasts } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  // Group toasts by their resolved position
  const groups = new Map<ToastPosition, ToastData[]>();
  for (const t of toasts) {
    const pos = t.position ?? defaultPosition;
    if (!groups.has(pos)) groups.set(pos, []);
    groups.get(pos)!.push(t);
  }

  return (
    <Portal name="toaster">
      {Array.from(groups.entries()).map(([pos, group]) => {
        const isTop = pos.startsWith("top");
        const isLeft = pos.endsWith("left");
        const isRight = pos.endsWith("right");
        const isCenter = pos.endsWith("center");

        return (
          <View
            key={pos}
            className={cn("absolute z-50 w-80 max-w-[90%] gap-2", {
              "self-center": isCenter,
              "left-4": isLeft,
              "right-4": isRight,
            })}
            style={{
              top: isTop ? insets.top + 16 : undefined,
              bottom: !isTop ? insets.bottom + 16 : undefined,
            }}
          >
            {(isTop ? group : [...group].reverse()).map((t) => (
              <ToasterItem key={t.id} {...t} />
            ))}
          </View>
        );
      })}
    </Portal>
  );
}
