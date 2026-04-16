import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
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
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ResetPasswordFormProps = {
  onSubmit: (data: {
    email: string;
    newPassword: string;
    resetCode: string;
  }) => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
  email?: string;
  resetCode?: string;
};

function createFormSchema(hasEmail: boolean, hasResetCode: boolean) {
  return z.object({
    email: hasEmail
      ? z.string()
      : z.email("Invalid email").min(1, "Email is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character",
      ),
    resetCode: hasResetCode
      ? z.string()
      : z.string().min(1, "Verification code is required"),
  });
}

export function ResetPasswordForm({
  onSubmit,
  isPending,
  isError,
  error,
  email,
  resetCode,
}: ResetPasswordFormProps) {
  const passwordInputRef = React.useRef<TextInput>(null);
  const codeInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  const hasEmail = !!email;
  const hasResetCode = !!resetCode;

  const formSchema = React.useMemo(
    () => createFormSchema(hasEmail, hasResetCode),
    [hasEmail, hasResetCode],
  );

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email ?? "",
      newPassword: "",
      resetCode: resetCode ?? "",
    },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Reset password
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Please fill in the details to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="gap-6">
          <View className={cn({ "-mt-6": !isError })}>
            {isError && (
              <Alert key={error} icon={AlertCircleIcon} variant="destructive">
                <AlertTitle>{error}</AlertTitle>
              </Alert>
            )}
          </View>
          <View className="gap-6">
            {!hasEmail && (
              <Controller
                control={control}
                name="email"
                render={({
                  field: { ref, name, value, onChange, onBlur, disabled },
                  fieldState: { invalid, error },
                }) => (
                  <View className="gap-1.5">
                    <Label htmlFor={name}>Email</Label>
                    <Input
                      ref={ref}
                      id={name}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!disabled}
                      placeholder="m@example.com"
                      keyboardType="email-address"
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onSubmitEditing={onEmailSubmitEditing}
                      returnKeyType="next"
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
            )}
            <Controller
              control={control}
              name="newPassword"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <View className="flex-row items-center">
                    <Label htmlFor={name}>New password</Label>
                  </View>
                  <Input
                    ref={(instance) => {
                      ref(instance);
                      passwordInputRef.current = instance;
                    }}
                    id={name}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!disabled}
                    secureTextEntry
                    autoComplete="new-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType={hasResetCode ? "send" : "next"}
                    submitBehavior="submit"
                    onSubmitEditing={
                      hasResetCode
                        ? handleSubmit(onSubmit)
                        : onPasswordSubmitEditing
                    }
                    aria-invalid={invalid}
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
            {!hasResetCode && (
              <Controller
                control={control}
                name="resetCode"
                render={({
                  field: { ref, name, value, onChange, onBlur, disabled },
                  fieldState: { invalid, error },
                }) => (
                  <View className="gap-1.5">
                    <Label htmlFor={name}>Verification code</Label>
                    <Input
                      ref={(instance) => {
                        ref(instance);
                        codeInputRef.current = instance;
                      }}
                      id={name}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      editable={!disabled}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="send"
                      onSubmitEditing={handleSubmit(onSubmit)}
                      aria-invalid={invalid}
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
            )}
            <Button
              className="w-full"
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Resetting password...</Text>
                </View>
              ) : (
                <Text>Reset password</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
