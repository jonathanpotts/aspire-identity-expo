import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { Disable2faForm } from "@/components/disable-2fa-form";
import { toast } from "@/hooks/use-toast";
import { updateTwoFactor } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function DisableTwoFactorScreen() {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () =>
      ensureMinDuration(
        updateTwoFactor({
          enable: false,
          resetRecoveryCodes: true,
          resetSharedKey: true,
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa"] });
      toast({
        title: "Two-factor authentication has been disabled.",
      });
      router.replace("/protected");
    },
  });

  return (
    <>
      <Head>
        <title>Disable two-factor authentication</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <Disable2faForm
            onSubmit={mutate}
            isPending={isPending}
            isError={isError}
            error={error?.message}
          />
        </View>
      </ScrollView>
    </>
  );
}
