import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SignIn2faFormProps = {
  onSubmit: (data: { twoFactorCode: string }) => void | Promise<void>;
  onUseRecoveryCode: () => void;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const formSchema = z.object({
  twoFactorCode: z
    .string()
    .transform((value) => value.replace(/\s|-/g, ""))
    .pipe(
      z
        .string()
        .regex(/^\d{6}$/, "Invalid code format")
        .min(6, "Code must be 6 digits"),
    ),
});

export function SignIn2faForm({
  onSubmit,
  onUseRecoveryCode,
  isPending,
  isError,
  error,
}: SignIn2faFormProps) {
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { twoFactorCode: "" },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border sm:bg-card bg-transparent shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-left">
            Two-factor authentication
          </CardTitle>
          <CardDescription className="text-center sm:text-left">
            Please enter the code from your authenticator app to continue
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
            <Controller
              control={control}
              name="twoFactorCode"
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
                    invalid={invalid}
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
                        className="text-destructive text-sm"
                      >
                        {error.message}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />
            <View className="gap-1.5">
              <Button
                className="w-full"
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? (
                  <View className="flex-row items-center justify-center gap-2">
                    <Spinner />
                    <Text>Signing in...</Text>
                  </View>
                ) : (
                  <Text>Continue</Text>
                )}
              </Button>
              <Button variant="ghost" onPress={onUseRecoveryCode}>
                <Text className="font-normal">
                  Can&apos;t access your authenticator app?
                </Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
