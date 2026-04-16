import * as Clipboard from "expo-clipboard";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { toast } from "@/hooks/use-toast";

type RecoveryCodesCardProps = {
  codes: string[];
  onDone: () => void;
};

export function RecoveryCodesCard({ codes, onDone }: RecoveryCodesCardProps) {
  async function handleCopy() {
    const success = await Clipboard.setStringAsync(codes.join("\n"));
    toast({
      title: success
        ? "Recovery codes copied!"
        : "Couldn't copy recovery codes",
      variant: success ? "default" : "destructive",
    });
  }
  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Recovery codes
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            You&apos;ll only see these once, so store them somewhere safe. Use
            one to sign in if you lose access to your authenticator app. Each
            code can only be used once
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-1.5">
            <View className="flex flex-row flex-wrap justify-center gap-6 rounded-md border border-border p-6 shadow-sm shadow-black/5">
              {codes.map((code, index) => (
                <View key={index}>
                  <Text className="font-mono slashed-zero tracking-widest">
                    {code}
                  </Text>
                </View>
              ))}
            </View>
            <Button variant="secondary" className="w-full" onPress={handleCopy}>
              <Text>Copy recovery codes</Text>
            </Button>
          </View>
          <Button className="w-full" onPress={onDone}>
            <Text>Done</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
