import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import {
  KeyRoundIcon,
  ShieldCheckIcon,
  ShieldOffIcon,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { buttonVariants } from "@/components/ui/button";
import { List } from "@/components/ui/list";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth";
import { getTwoFactor } from "@/lib/api/auth";
import { cn } from "@/lib/utils";

export default function TwoFactorScreen() {
  const { session } = useAuth();

  const { data } = useQuery({
    queryKey: ["2fa"],
    queryFn: () => getTwoFactor(),
    enabled: !!session,
  });

  const isEnabled = data?.isTwoFactorEnabled;

  return (
    <>
      <Head>
        <title>Two-factor authentication</title>
      </Head>
      <Stack.Screen options={{ title: "Two-factor authentication" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="items-center p-4 py-8 sm:py-6 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm gap-6">
          {!data ? (
            <View
              style={{ pointerEvents: "none" }}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "overflow-hidden py-6",
              )}
            >
              <Skeleton className="absolute inset-0" />
            </View>
          ) : (
            <List
              sections={[
                {
                  items: [
                    {
                      icon: isEnabled ? ShieldCheckIcon : ShieldOffIcon,
                      label: isEnabled
                        ? "Disable two-factor authentication"
                        : "Set up two-factor authentication",
                      onPress: () =>
                        router.push(
                          isEnabled
                            ? "/protected/2fa/disable"
                            : "/protected/2fa/setup",
                        ),
                    },
                    ...(isEnabled
                      ? [
                          {
                            icon: KeyRoundIcon,
                            label: "Reset recovery codes",
                            onPress: () =>
                              router.push(
                                "/protected/2fa/reset-recovery-codes",
                              ),
                          },
                        ]
                      : []),
                  ],
                },
              ]}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}
