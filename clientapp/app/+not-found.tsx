import { Link } from "expo-router";
import { View } from "react-native";
import { Screen } from "@/components/screen";
import { Text } from "@/components/ui/text";

export default function NotFoundScreen() {
  return (
    <>
      <Screen options={{ title: "Oops!" }} />
      <View>
        <Text>This screen doesn&apos;t exist.</Text>

        <Link href="/">
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
