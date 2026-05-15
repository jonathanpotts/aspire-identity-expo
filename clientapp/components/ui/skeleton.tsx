import * as React from "react";
import { Platform, View } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { NativeOnlyAnimatedView } from "./native-only-animated-view";

const duration = 1000;

function Skeleton({
  className,
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

  const style = useAnimatedStyle(
    () => ({
      opacity: sv.value,
    }),
    [sv],
  );
  return (
    <NativeOnlyAnimatedView style={style}>
      <View
        className={cn(
          "bg-secondary dark:bg-muted rounded-md",
          Platform.select({ web: "animate-pulse motion-reduce:animate-none" }),
          className,
        )}
        {...props}
      />
    </NativeOnlyAnimatedView>
  );
}

export { Skeleton };
