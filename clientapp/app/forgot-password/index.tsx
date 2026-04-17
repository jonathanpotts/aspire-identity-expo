import { useMutation } from "@tanstack/react-query";
import { Redirect, router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { useAuth } from "@/context/auth";
import { forgotPassword } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function ForgotPasswordScreen() {
  const { isSignedIn } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ email }: { email: string }) =>
      ensureMinDuration(forgotPassword({ email })),
    onSuccess: () => {
      router.replace("/forgot-password/sent");
    },
  });

  if (isSignedIn && !isPending) {
    return <Redirect href="/protected" />;
  }

  return (
    <>
      <Head>
        <title>Forgot password?</title>
      </Head>
      <Stack.Screen options={{ headerTitle: "Forgot password?" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <ForgotPasswordForm
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
