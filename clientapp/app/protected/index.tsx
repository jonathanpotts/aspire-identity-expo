import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";

export default function ProtectedScreen() {
  const { session, signOut, resendConfirmationEmail } = useAuth();
  const [isSendingConfirmation, setIsSendingConfirmation] = useState(false);

  function handleManage2fa() {
    router.push("/protected/2fa");
  }

  function handleChangePassword() {
    router.push("/protected/change-password");
  }

  function handleChangeEmail() {
    router.push("/protected/change-email");
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  async function handleResendConfirmationEmail() {
    setIsSendingConfirmation(true);
    try {
      await resendConfirmationEmail();
      toast({ title: "Confirmation email sent. Please check your inbox." });
    } catch (error) {
      toast({
        title:
          error instanceof Error
            ? error.message
            : "Unable to resend confirmation email.",
      });
    } finally {
      setIsSendingConfirmation(false);
    }
  }

  return (
    <>
      <Head>
        <title>Protected</title>
      </Head>
      <Stack.Screen options={{ headerTitle: "Protected" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <View className="gap-6">
            <View className="mx-auto flex flex-row gap-2">
              <Text>Email:</Text>
              {session ? (
                <Text>{session.email}</Text>
              ) : (
                <Skeleton className="w-56" />
              )}
            </View>
            <View className="gap-1.5">
              {session && !session.isEmailConfirmed && (
                <Button
                  className="w-full"
                  onPress={handleResendConfirmationEmail}
                  disabled={isSendingConfirmation}
                >
                  <Text>Resend confirmation email</Text>
                </Button>
              )}
              <Button className="w-full" onPress={handleManage2fa}>
                <Text>Manage two-factor authentication</Text>
              </Button>
              <Button className="w-full" onPress={handleChangeEmail}>
                <Text>Change email</Text>
              </Button>
              <Button className="w-full" onPress={handleChangePassword}>
                <Text>Change password</Text>
              </Button>
              <Button className="w-full" onPress={handleSignOut}>
                <Text>Sign out</Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
