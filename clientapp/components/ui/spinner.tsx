import { LoaderCircleIcon } from "lucide-react-native";
import { useEffect } from "react";
import { Platform } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";
import { NativeOnlyAnimatedView } from "./native-only-animated-view";

const duration = 1000;

function Spinner({
  as,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Icon>, "as"> & {
  as?: React.ComponentProps<typeof Icon>["as"];
}) {
  const sv = useSharedValue("0deg");

  useEffect(() => {
    sv.value = withRepeat(
      withTiming("360deg", { duration, easing: Easing.linear }),
      -1,
    );
  }, [sv]);

  const style = useAnimatedStyle(
    () => ({
      transform: [{ rotate: sv.value }],
    }),
    [sv],
  );

  return (
    <NativeOnlyAnimatedView style={[{ alignSelf: "flex-start" }, style]}>
      <Icon
        as={as ?? LoaderCircleIcon}
        className={cn(
          "origin-center",
          Platform.select({ web: "animate-spin motion-reduce:animate-none" }),
          className,
        )}
        {...props}
      />
    </NativeOnlyAnimatedView>
  );
}

export { Spinner };
