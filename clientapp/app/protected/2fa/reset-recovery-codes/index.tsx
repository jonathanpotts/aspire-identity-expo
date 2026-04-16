import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { ResetRecoveryCodesForm } from "@/components/reset-recovery-codes-form";
import { useAuth } from "@/context/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function ResetRecoveryCodesScreen() {
  const { resetRecoveryCodes } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: () => ensureMinDuration(resetRecoveryCodes()),
    onSuccess: () => {
      router.replace("/protected/2fa/reset-recovery-codes/recovery-codes");
    },
  });

  return (
    <>
      <Head>
        <title>Reset recovery codes</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <ResetRecoveryCodesForm
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
