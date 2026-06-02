import { Redirect, router } from "expo-router";
import {
  FingerprintIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Screen } from "@/components/screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/context/auth";

const features = [
  {
    icon: KeyRoundIcon,
    title: "Email & password",
    description: "Secure credential-based sign-in with account recovery.",
  },
  {
    icon: SmartphoneIcon,
    title: "Two-factor auth",
    description: "TOTP authenticator app support and backup recovery codes.",
  },
  {
    icon: FingerprintIcon,
    title: "Account management",
    description: "Change your email and password from within the app.",
  },
  {
    icon: ShieldCheckIcon,
    title: "ASP.NET Core Identity",
    description:
      "Powered by battle-tested identity infrastructure on the backend.",
  },
] as const;

export default function HomeScreen() {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Redirect href="/protected" />;
  }

  return (
    <>
      <Screen options={{ title: "Home", headerShown: false }} webTitle="" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="items-center p-6 pt-16 pb-12 sm:p-10"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm gap-10">
          {/* Hero */}
          <View className="gap-4">
            <Badge variant="secondary" className="self-start">
              <Text>Aspire + ASP.NET Core Identity + Expo</Text>
            </Badge>
            <Text variant="h1" className="text-start">
              A place to start.
            </Text>
            <Text variant="lead" className="text-start">
              A full-stack reference app for authentication and account
              management with React Native and ASP.NET Core.
            </Text>
          </View>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full"
            onPress={() => router.push("/sign-in")}
          >
            <Text>Sign in</Text>
          </Button>

          <Separator />

          {/* Features */}
          <View className="gap-6">
            <Text
              variant="small"
              className="text-muted-foreground tracking-widest uppercase"
            >
              What&apos;s included
            </Text>
            <View className="gap-5">
              {features.map((feature) => (
                <View
                  key={feature.title}
                  className="flex-row items-start gap-4"
                >
                  <View className="border-border mt-0.5 rounded border p-2">
                    <Icon
                      as={feature.icon}
                      className="text-foreground size-4"
                    />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text variant="small">{feature.title}</Text>
                    <Text variant="muted">{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
