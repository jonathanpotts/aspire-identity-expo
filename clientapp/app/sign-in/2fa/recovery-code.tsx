import { useMutation } from "@tanstack/react-query";
import { Redirect, router, Stack, useFocusEffect } from "expo-router";
import Head from "expo-router/head";
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { SignIn2faRecoveryCodeForm } from "@/components/sign-in-2fa-recovery-code-form";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { FailedLoginError } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function TwoFactorRecoveryCodeSignInScreen() {
  const {
    isSignedIn,
    isPendingSignIn,
    signInWithTwoFactor,
    clearPendingSignIn,
  } = useAuth();

  useFocusEffect(
    useCallback(() => {
      return () => clearPendingSignIn();
    }, [clearPendingSignIn]),
  );

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({
      twoFactorRecoveryCode,
    }: {
      twoFactorRecoveryCode: string;
    }) =>
      ensureMinDuration(signInWithTwoFactor({ twoFactorRecoveryCode })).catch(
        (error) =>
          error instanceof FailedLoginError
            ? Promise.reject(new Error("Recovery code is incorrect."))
            : Promise.reject(error),
      ),
    onSuccess: () => {
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/protected");
    },
  });

  const isPendingSignInRef = useRef(isPendingSignIn);

  useEffect(() => {
    if (!isPendingSignInRef.current) {
      toast({
        title:
          "The two-factor authentication session has expired. Please sign in again.",
      });
      router.replace("/sign-in");
    }
  }, []);

  if (isSignedIn && !isPending) {
    return <Redirect href="/protected" />;
  }

  return (
    <>
      <Head>
        <title>Use a recovery code</title>
      </Head>
      <Stack.Screen options={{ title: "Use a recovery code" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <SignIn2faRecoveryCodeForm
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
