import { Redirect, useFocusEffect } from "expo-router";
import Head from "expo-router/head";
import { useCallback } from "react";
import { ScrollView, View } from "react-native";
import { RecoveryCodesCard } from "@/components/recovery-codes-card";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";

export default function RecoveryCodesScreen() {
  const { recoveryCodes, clearRecoveryCodes, signOut } = useAuth();

  useFocusEffect(
    useCallback(() => {
      return () => clearRecoveryCodes();
    }, [clearRecoveryCodes]),
  );

  if (!recoveryCodes) {
    return <Redirect href="/protected" />;
  }

  async function handleDone() {
    toast({
      title:
        "Two-factor authentication enabled! Please sign in again to continue.",
    });
    await signOut();
  }

  return (
    <>
      <Head>
        <title>Recovery codes</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <RecoveryCodesCard codes={recoveryCodes} onDone={handleDone} />
        </View>
      </ScrollView>
    </>
  );
}
