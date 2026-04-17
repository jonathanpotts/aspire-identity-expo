import { Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ForgotPasswordSentScreen() {
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
          <View className="gap-6">
            <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
              <CardHeader>
                <CardTitle className="text-center text-xl sm:text-start">
                  Check your email
                </CardTitle>
                <CardDescription className="text-center sm:text-start">
                  If an account with that email exists, you&apos;ll receive a
                  link to reset your password shortly
                </CardDescription>
              </CardHeader>
            </Card>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
