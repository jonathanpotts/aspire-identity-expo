import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { View, type TextInput } from "react-native";
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

type ChangePasswordFormProps = {
  onSubmit: (data: {
    oldPassword: string;
    newPassword: string;
  }) => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const formSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
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
});

export function ChangePasswordForm({
  onSubmit,
  isPending,
  isError,
  error,
}: ChangePasswordFormProps) {
  const newPasswordInputRef = React.useRef<TextInput>(null);

  function onOldPasswordSubmitEditing() {
    newPasswordInputRef.current?.focus();
  }

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    return onSubmit({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Change password
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Please fill in the details to update your password
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
            <Controller
              control={control}
              name="oldPassword"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>Current password</Label>
                  <Input
                    ref={ref}
                    id={name}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!disabled}
                    secureTextEntry
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    submitBehavior="submit"
                    onSubmitEditing={onOldPasswordSubmitEditing}
                    aria-invalid={invalid}
                    className={cn({
                      "!dark:ring-destructive/40 !border-destructive !ring-destructive/20":
                        invalid,
                    })}
                  />
                  <View className={cn({ "-mt-1.5": !error })}>
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
            <Controller
              control={control}
              name="newPassword"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>New password</Label>
                  <Input
                    ref={(instance) => {
                      ref(instance);
                      newPasswordInputRef.current = instance;
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
                    returnKeyType="send"
                    submitBehavior="submit"
                    onSubmitEditing={handleSubmit(handleFormSubmit)}
                    aria-invalid={invalid}
                    className={cn({
                      "!dark:ring-destructive/40 !border-destructive !ring-destructive/20":
                        invalid,
                    })}
                  />
                  <View className={cn({ "-mt-1.5": !error })}>
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
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Changing password...</Text>
                </View>
              ) : (
                <Text>Change password</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
