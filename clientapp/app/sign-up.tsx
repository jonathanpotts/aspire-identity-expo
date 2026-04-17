import { useMutation } from "@tanstack/react-query";
import { Redirect, router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { SignUpForm } from "@/components/sign-up-form";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { register } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function SignUpScreen() {
  const { isSignedIn, signIn } = useAuth();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      ensureMinDuration(
        register({ email, password }).then(() =>
          signIn({ email, password })
            .then(() => true)
            .catch(() => false),
        ),
      ),
    onSuccess: (signedIn) => {
      toast({ title: "You have successfully signed up!" });
      if (signedIn) {
        if (router.canDismiss()) {
          router.dismissAll();
        }
        router.replace("/protected");
      } else {
        router.replace("/sign-in");
      }
    },
  });

  if (isSignedIn && !isPending) {
    return <Redirect href="/protected" />;
  }

  function handleSignIn() {
    router.push("/sign-in");
  }

  return (
    <>
      <Head>
        <title>Sign up</title>
      </Head>
      <Stack.Screen options={{ headerTitle: "Sign up" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <SignUpForm
            onSubmit={mutate}
            onSignIn={handleSignIn}
            isPending={isPending}
            isError={isError}
            error={error?.message}
          />
        </View>
      </ScrollView>
    </>
  );
}
