import { useMutation } from "@tanstack/react-query";
import { Redirect, router, useFocusEffect } from "expo-router";
import Head from "expo-router/head";
import { useCallback, useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { SignIn2faForm } from "@/components/sign-in-2fa-form";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { FailedLoginError } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function TwoFactorSignInScreen() {
  const {
    isSignedIn,
    isPendingSignIn,
    signInWithTwoFactor,
    clearPendingSignIn,
  } = useAuth();

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!skipClearPendingSignInRef.current) {
          clearPendingSignIn();
        }
        skipClearPendingSignInRef.current = false;
      };
    }, [clearPendingSignIn]),
  );

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ twoFactorCode }: { twoFactorCode: string }) =>
      ensureMinDuration(signInWithTwoFactor({ twoFactorCode })).catch(
        (error) =>
          error instanceof FailedLoginError
            ? Promise.reject(new Error("Authenticator code is incorrect."))
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
  const skipClearPendingSignInRef = useRef(false);

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

  function handleUseRecoveryCode() {
    skipClearPendingSignInRef.current = true;
    return router.replace("/sign-in/2fa/recovery-code");
  }

  return (
    <>
      <Head>
        <title>Two-factor authentication</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <SignIn2faForm
            onSubmit={mutate}
            onUseRecoveryCode={handleUseRecoveryCode}
            isPending={isPending}
            isError={isError}
            error={error?.message}
          />
        </View>
      </ScrollView>
    </>
  );
}
