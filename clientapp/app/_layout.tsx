import "@/global.css";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useLayoutEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/context/auth";
import { NAV_THEME } from "@/lib/theme";

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [hasMounted, setHasMounted] = useState(false);

  useLayoutEffect(() => {
    setHasMounted(true);
  }, []);

  // Prevent rendering until after mount so NativeWind has resolved the
  // system color scheme, avoiding a flash of the wrong theme on first paint.
  if (!hasMounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? "light"]}>
        <AuthProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <RootNavigator />
          <Toaster />
          <PortalHost />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="sign-in/index" />
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="protected" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="forgot-password/index" />
        <Stack.Screen name="forgot-password/sent" />
      </Stack.Protected>
    </Stack>
  );
}
