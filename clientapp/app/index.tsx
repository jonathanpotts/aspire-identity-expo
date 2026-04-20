import { router, Stack } from "expo-router";
import Head from "expo-router/head";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth";

export default function HomeScreen() {
  const { isSignedIn } = useAuth();

  function handleButtonPress() {
    router.push(isSignedIn ? "/protected" : "/sign-in");
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Stack.Screen options={{ title: "Home" }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <View className="gap-6">
            <Button className="w-full" onPress={handleButtonPress}>
              <Text>{isSignedIn ? "Go to Protected" : "Sign in"}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
