import * as React from "react";
import { Platform, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";

const duration = 1000;

function Skeleton({
  className,
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  const sv = useSharedValue(1);

  React.useEffect(() => {
    sv.value = withRepeat(
      withTiming(0.5, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [sv]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: sv.value,
    }),
    [sv],
  );

  if (Platform.OS === "web") {
    return (
      <View
        className={cn(
          "bg-secondary dark:bg-muted animate-pulse rounded-md motion-reduce:animate-none",
          className,
        )}
        style={style}
        {...props}
      />
    );
  }

  return (
    <Animated.View
      className={cn("bg-secondary dark:bg-muted rounded-md", className)}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}

export { Skeleton };
