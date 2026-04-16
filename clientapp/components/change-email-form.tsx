import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
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
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ChangeEmailFormProps = {
  onSubmit: (data: { newEmail: string }) => void | Promise<void>;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const formSchema = z.object({
  newEmail: z.email("Invalid email").min(1, "Email is required"),
});

export function ChangeEmailForm({
  onSubmit,
  isPending,
  isError,
  error,
}: ChangeEmailFormProps) {
  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newEmail: "",
    },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Change email
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Please fill in the details to update your email. We&apos;ll send a
            verification link to the new address before the change takes effect
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
              name="newEmail"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>New email</Label>
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
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
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
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Changing email...</Text>
                </View>
              ) : (
                <Text>Change email</Text>
              )}
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}
