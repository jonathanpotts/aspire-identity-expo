import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import Head from "expo-router/head";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Setup2faForm } from "@/components/setup-2fa-form";
import { useAuth } from "@/context/auth";
import { toast } from "@/hooks/use-toast";
import { getTwoFactor } from "@/lib/api/auth";
import { ensureMinDuration } from "@/lib/utils";

export default function Setup2faScreen() {
  const { session, enableTwoFactor } = useAuth();

  const { data } = useQuery({
    queryKey: ["2fa"],
    queryFn: () => getTwoFactor(),
    enabled: !!session,
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ code }: { code: string }) =>
      ensureMinDuration(enableTwoFactor(code)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["2fa"] });
      router.replace("/protected/2fa/setup/recovery-codes");
    },
  });

  useEffect(() => {
    if (data?.isTwoFactorEnabled) {
      toast({
        title: "Two-factor authentication is already enabled.",
      });
      router.replace("/protected");
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Setup two-factor authentication</title>
      </Head>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="sm:flex-1 items-center justify-center p-4 py-8 sm:py-4 sm:p-6"
        keyboardDismissMode="interactive"
      >
        <View className="w-full max-w-sm">
          <Setup2faForm
            email={session?.email}
            sharedKey={data?.sharedKey}
            onSubmit={mutate}
            isPending={isPending}
            isError={isError}
            error={error?.message}
          />
        </View>
      </ScrollView>
    </>
  );
}
