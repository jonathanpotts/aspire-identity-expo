import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
import { View } from "react-native";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ResetRecoveryCodesFormProp = {
  onSubmit: () => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

export function ResetRecoveryCodesForm({
  onSubmit,
  isPending,
  isError,
  error,
}: ResetRecoveryCodesFormProp) {
  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Reset recovery codes
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Generate a new set of recovery codes. Your current codes will no
            longer work once you reset them
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="gap-6">
            <View className={cn({ "-mt-6": !isError })}>
              {isError && (
                <Alert key={error} icon={AlertCircleIcon} variant="destructive">
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
            </View>
            <Button className="w-full" onPress={onSubmit} disabled={isPending}>
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Resetting recovery codes...</Text>
                </View>
              ) : (
                <Text>Reset recovery codes</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
