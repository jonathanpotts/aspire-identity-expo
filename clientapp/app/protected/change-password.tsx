import { useMutation } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { ChangePasswordForm } from "@/components/change-password-form";
import { toast } from "@/hooks/use-toast";
import { updateInfo } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function ChangePasswordScreen() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => ensureMinDuration(updateInfo({ oldPassword, newPassword })),
    onSuccess: () => {
      toast({
        title: "Password changed successfully.",
      });
      if (router.canDismiss()) {
        router.dismissTo("/protected");
        return;
      }
      router.replace("/protected");
    },
  });

  return (
    <>
      <Head>
        <title>Change password</title>
      </Head>
      <Stack.Screen options={{ title: "Change password" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <ChangePasswordForm
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
