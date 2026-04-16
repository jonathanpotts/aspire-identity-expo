import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          title: "",
        }}
      />
    </>
  );
}
