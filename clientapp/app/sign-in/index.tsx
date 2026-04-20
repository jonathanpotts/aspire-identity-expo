import { useMutation } from "@tanstack/react-query";
import { Redirect, router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { SignInForm } from "@/components/sign-in-form";
import { useAuth } from "@/context/auth";
import { FailedLoginError, RequiresTwoFactorError } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function SignInScreen() {
  const { signIn, isSignedIn } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        await ensureMinDuration(signIn({ email, password }));
      } catch (error) {
        if (error instanceof RequiresTwoFactorError) {
          return true;
        }
        if (error instanceof FailedLoginError) {
          throw new Error("Email or password is incorrect.");
        }
        throw error;
      }
      return false;
    },
    onSuccess: (requiresTwoFactor) => {
      if (requiresTwoFactor) {
        router.push("/sign-in/2fa");
        return;
      }
      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/protected");
    },
  });

  if (isSignedIn && !isPending) {
    return <Redirect href="/protected" />;
  }

  function handleForgotPassword() {
    router.push("/forgot-password");
  }

  function handleSignUp() {
    router.push("/sign-up");
  }

  return (
    <>
      <Head>
        <title>Sign in to your app</title>
      </Head>
      <Stack.Screen options={{ title: "Sign in" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <SignInForm
            onSubmit={mutate}
            onForgotPassword={handleForgotPassword}
            onSignUp={handleSignUp}
            isPending={isPending}
            isError={isError}
            error={error?.message}
          />
        </View>
      </ScrollView>
    </>
  );
}
