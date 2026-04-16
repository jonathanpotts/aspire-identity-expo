import { useQuery } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth";
import { getTwoFactor } from "@/lib/api/auth";

export default function TwoFactorScreen() {
  const { session } = useAuth();

  const { data } = useQuery({
    queryKey: ["2fa"],
    queryFn: () => getTwoFactor(),
    enabled: !!session,
  });

  function handleConfigure2fa() {
    if (data?.isTwoFactorEnabled) {
      router.push("/protected/2fa/disable");
    } else {
      router.push("/protected/2fa/setup");
    }
  }

  function handleResetRecoveryCodes() {
    router.push("/protected/2fa/reset-recovery-codes");
  }

  return (
    <>
      <Head>
        <title>Two-factor authentication</title>
      </Head>
      <Stack.Screen options={{ headerTitle: "Two-factor authentication" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <View className="gap-6">
            <View className="gap-1.5">
              <Button
                className="w-full"
                onPress={handleConfigure2fa}
                disabled={!data}
              >
                <Text>
                  {data
                    ? data.isTwoFactorEnabled
                      ? "Disable two-factor authentication"
                      : "Setup two-factor authentication"
                    : "Loading..."}
                </Text>
              </Button>
              {data?.isTwoFactorEnabled && (
                <Button className="w-full" onPress={handleResetRecoveryCodes}>
                  <Text>Reset recovery codes</Text>
                </Button>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
