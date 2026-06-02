import { router } from "expo-router";
import {
  AtSignIcon,
  KeyRoundIcon,
  LogOutIcon,
  MailWarningIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/screen";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { List } from "@/components/ui/list";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";

export default function ProtectedScreen() {
  const { session, signOut, resendConfirmationEmail } = useAuth();
  const [isSendingConfirmation, setIsSendingConfirmation] = useState(false);

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
      <Screen options={{ title: "Account" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="items-center p-4 py-8 sm:py-6 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm gap-6">
          {/* Unconfirmed email banner */}
          {session && !session.isEmailConfirmed && (
            <Alert icon={MailWarningIcon}>
              <AlertTitle>Confirm your email</AlertTitle>
              <AlertDescription>
                Check your inbox for a confirmation link.
              </AlertDescription>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onPress={handleResendConfirmationEmail}
                disabled={isSendingConfirmation}
              >
                <Text>Resend email</Text>
              </Button>
            </Alert>
          )}

          {/* Profile header */}
          <View className="flex-row items-center gap-4 px-1">
            <Avatar alt="" className="size-10">
              <AvatarFallback>
                {session?.email?.length ? (
                  <Text>{session.email.charAt(0).toUpperCase()}</Text>
                ) : (
                  <Icon as={UserIcon} />
                )}
              </AvatarFallback>
            </Avatar>
            <View className="flex-1 gap-0.5">
              <Text className="text-sm font-medium">My account</Text>
              {session ? (
                <Text variant="muted">{session.email}</Text>
              ) : (
                <Skeleton className="mt-1 h-3.5 w-44" />
              )}
            </View>
          </View>

          <Separator />

          <List
            sections={[
              {
                title: "Account",
                items: [
                  {
                    icon: AtSignIcon,
                    label: "Change email",
                    onPress: () => router.push("/protected/change-email"),
                  },
                  {
                    icon: KeyRoundIcon,
                    label: "Change password",
                    onPress: () => router.push("/protected/change-password"),
                  },
                ],
              },
              {
                title: "Security",
                items: [
                  {
                    icon: ShieldIcon,
                    label: "Two-factor authentication",
                    onPress: () => router.push("/protected/2fa"),
                  },
                ],
              },
              {
                items: [
                  {
                    icon: LogOutIcon,
                    label: "Sign out",
                    onPress: handleSignOut,
                    variant: "destructive",
                    showChevron: false,
                  },
                ],
              },
            ]}
          />
        </View>
      </ScrollView>
    </>
  );
}
