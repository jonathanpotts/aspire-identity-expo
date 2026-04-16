import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { ResetPasswordForm } from "@/components/reset-password-form";
import { useAuth } from "@/context/auth";
import { resetPassword } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function ResetPasswordScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { email, resetCode } = useLocalSearchParams<{
    email?: string;
    resetCode?: string;
  }>();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      email,
      newPassword,
      resetCode,
    }: {
      email: string;
      newPassword: string;
      resetCode: string;
    }) => ensureMinDuration(resetPassword({ email, newPassword, resetCode })),
    onSuccess: async () => {
      if (isSignedIn) {
        await signOut();
      }
    },
  });

  return (
    <>
      <Head>
        <title>Reset password</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <ResetPasswordForm
            onSubmit={mutate}
            isPending={isPending}
            isError={isError}
            error={error?.message}
            email={email}
            resetCode={resetCode}
          />
        </View>
      </ScrollView>
    </>
  );
}
