import { zodResolver } from "@hookform/resolvers/zod";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
import { Controller, useForm } from "react-hook-form";
import { Platform, View } from "react-native";
import QrCode from "react-qr-code";
import * as z from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type SetupTwoFactorFormProps = {
  email?: string;
  sharedKey?: string;
  onSubmit: (data: { code: string }) => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const ISSUER = "MyApp";

const formSchema = z.object({
  code: z
    .string()
    .transform((value) => value.replace(/\s|-/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{6}$/, "Invalid code format")
        .min(6, "Code must be 6 digits"),
    ),
});

export function Setup2faForm({
  email,
  sharedKey,
  onSubmit,
  isPending,
  isError,
  error,
}: SetupTwoFactorFormProps) {
  const hasData = !!email && !!sharedKey;
  const encodedEmail = email ? encodeURIComponent(email) : undefined;
  const url = `otpauth://totp/${ISSUER}:${encodedEmail}?secret=${sharedKey}&issuer=${ISSUER}`;

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "" },
    disabled: !hasData || isPending,
    reValidateMode: "onBlur",
  });

  const secretGroups = sharedKey?.match(/.{1,4}/g);
  const secretLine1 = secretGroups?.slice(0, 4).join(" ") ?? "";
  const secretLine2 = secretGroups?.slice(4).join(" ") ?? "";

  async function handleLink() {
    try {
      await Linking.openURL(url);
    } catch {
      alert(
        "Unable to open authenticator app. Please make sure you have an authenticator app installed and try again.",
      );
    }
  }

  async function handleCopy() {
    if (!sharedKey) {
      return;
    }

    const success = await Clipboard.setStringAsync(sharedKey);
    toast({
      title: success ? "Code copied!" : "Couldn't copy the code",
      variant: success ? "default" : "destructive",
    });
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Setup two-factor authentication
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Please scan the QR code below and enter the code from your
            authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className="mx-auto w-64 gap-1.5">
            {hasData ? (
              <View className="aspect-square items-center justify-center rounded-md border border-border bg-white shadow-sm shadow-black/5">
                <QrCode size={224} value={url} />
              </View>
            ) : (
              <Skeleton className="aspect-square rounded-md border border-border shadow-sm shadow-black/5" />
            )}
            {Platform.OS !== "web" && (
              <Button
                variant="ghost"
                className="w-full"
                onPress={handleLink}
                disabled={!hasData}
              >
                <Text className="font-normal">On your phone?</Text>
              </Button>
            )}
          </View>
          <View className="gap-1.5">
            <Text className="text-sm text-muted-foreground">
              Can&apos;t scan the QR code? Enter the following code in your
              authenticator app:
            </Text>
            {hasData ? (
              <View className="rounded-md border border-border p-1 shadow-sm shadow-black/5">
                <Text className="text-center font-mono slashed-zero tracking-widest">
                  {secretLine1}
                  {"\n"}
                  {secretLine2}
                </Text>
              </View>
            ) : (
              <Skeleton className="rounded-md border border-border p-1 shadow-sm shadow-black/5">
                <Text className="select-none"> {"\n"} </Text>
              </Skeleton>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onPress={handleCopy}
              disabled={!hasData}
            >
              <Text>Copy code</Text>
            </Button>
          </View>
          <View className={cn({ "-mt-6": !isError })}>
            {isError && (
              <Alert key={error} icon={AlertCircleIcon} variant="destructive">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </View>
          <View className="gap-6">
            <Controller
              control={control}
              name="code"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>Authenticator code</Label>
                  <Input
                    ref={ref}
                    id={name}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!disabled}
                    placeholder="000000"
                    keyboardType="number-pad"
                    autoComplete="one-time-code"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSubmit(onSubmit)}
                    returnKeyType="send"
                    submitBehavior="submit"
                    aria-invalid={invalid}
                    className={cn({
                      "!dark:ring-destructive/40 !border-destructive !ring-destructive/20":
                        invalid,
                    })}
                  />
                  <View
                    className={cn({
                      "-mt-1.5": !error,
                    })}
                  >
                    {error && (
                      <Text
                        key={error.message}
                        role="alert"
                        className="text-sm text-destructive"
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />
            <Button
              className="w-full"
              onPress={handleSubmit(onSubmit)}
              disabled={!hasData || isPending}
            >
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Setting up...</Text>
                </View>
              ) : (
                <Text>Continue</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
