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

type SignIn2faRecoveryCodeFormProps = {
  onSubmit: (data: { twoFactorRecoveryCode: string }) => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const formSchema = z.object({
  twoFactorRecoveryCode: z
    .string()
    .transform((value) => value.trim().toUpperCase())
    .pipe(
      z.string().regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/, "Invalid recovery code"),
    ),
});

export function SignIn2faRecoveryCodeForm({
  onSubmit,
  isPending,
  isError,
  error,
}: SignIn2faRecoveryCodeFormProps) {
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { twoFactorRecoveryCode: "" },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  return (
    <View className="gap-6">
      <Card className="border-border/0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Use a recovery code
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Please enter your recovery code to continue
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
              name="twoFactorRecoveryCode"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>Recovery code</Label>
                  <Input
                    ref={ref}
                    id={name}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!disabled}
                    placeholder="XXXXX-XXXXX"
                    autoCapitalize="characters"
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
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
