import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircleIcon, LoaderCircleIcon } from "lucide-react-native";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import * as z from "zod";
import { Alert, AlertTitle } from "@/components/ui/alert";
// import { SocialConnections } from "@/components/social-connections";
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
// import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SignUpFormProps = {
  onSubmit: (data: { email: string; password: string }) => void | Promise<void>;
  onSignIn: () => void;
  isPending: boolean;
  isError: boolean;
  error?: string;
};

const formSchema = z.object({
  email: z.email("Invalid email"),
  password: z
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

export function SignUpForm({
  onSubmit,
  onSignIn,
  isPending,
  isError,
  error,
}: SignUpFormProps) {
  const passwordInputRef = React.useRef<TextInput>(null);

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
    disabled: isPending,
    reValidateMode: "onBlur",
  });

  return (
    <View className="gap-6">
      <Card className="border-border/0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
        <CardHeader>
          <CardTitle className="text-center text-xl sm:text-start">
            Create your account
          </CardTitle>
          <CardDescription className="text-center sm:text-start">
            Welcome! Please fill in the details to get started
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
            <Controller
              control={control}
              name="password"
              render={({
                field: { ref, name, value, onChange, onBlur, disabled },
                fieldState: { invalid, error },
              }) => (
                <View className="gap-1.5">
                  <Label htmlFor={name}>Password</Label>
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
                    returnKeyType="send"
                    onSubmitEditing={handleSubmit(onSubmit)}
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
              disabled={isPending}
            >
              {isPending ? (
                <View className="flex-row items-center justify-center gap-2">
                  <Icon
                    as={LoaderCircleIcon}
                    className="origin-center animate-spin motion-reduce:animate-none"
                  />
                  <Text>Signing up...</Text>
                </View>
              ) : (
                <Text>Continue</Text>
              )}
            </Button>
          </View>
          <View className="mx-auto flex flex-row flex-wrap items-center gap-1">
            <Text className="text-sm text-muted-foreground">
              Already have an account?
            </Text>
            <Pressable onPress={onSignIn}>
              <Text className="text-sm underline underline-offset-4">
                Sign in
              </Text>
            </Pressable>
          </View>
          {/* <View className="flex-row items-center">
            <Separator className="flex-1" />
            <Text className="px-4 text-sm text-muted-foreground">or</Text>
            <Separator className="flex-1" />
          </View>
          <SocialConnections /> */}
        </CardContent>
      </Card>
    </View>
  );
}
