import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { ChangeEmailForm } from "@/components/change-email-form";
import { toast } from "@/hooks/use-toast";
import { updateInfo } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function ChangeEmailScreen() {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ newEmail }: { newEmail: string }) =>
      ensureMinDuration(updateInfo({ newEmail })),
    onSuccess: () => {
      toast({
        title: "Check your inbox to verify your new email address.",
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
        <title>Change email</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <ChangeEmailForm
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
