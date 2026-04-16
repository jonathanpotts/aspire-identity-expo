import * as SecureStorage from "expo-secure-store";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { toast } from "@/hooks/use-toast";
import {
  getInfo,
  login,
  logout,
  refresh,
  RequiresTwoFactorError,
  resendConfirmationEmail,
  updateTwoFactor,
  type AccessTokenResponse,
  type LoginRequest,
} from "@/lib/api/auth";
import { setAccessToken, setRefreshCallback } from "@/lib/api/client";

const TOKEN_REFRESH_THRESHOLD_MS = 60_000;

const STORAGE_KEY_ACCESS_TOKEN = "accessToken";
const STORAGE_KEY_REFRESH_TOKEN = "refreshToken";
const STORAGE_KEY_TOKEN_EXPIRES_AT = "tokenExpiresAt";
// On web, tokens are stored in HTTP-only cookies inaccessible to JS.
// This localStorage key is a hint that a session cookie may exist,
// so hydration knows to call getInfo() and verify the session on page load.
const STORAGE_KEY_IS_SIGNED_IN = "isSignedIn";

const HYDRATE_TIMEOUT_MS = 3_000;

export interface AuthSession {
  email: string;
  isEmailConfirmed: boolean;
}

interface AuthContextValue {
  session: AuthSession | null;
  isSignedIn: boolean;
  isLoading: boolean;
  isPendingSignIn: boolean;
  recoveryCodes: string[] | null;
  signIn: (request: LoginRequest) => Promise<void>;
  signInWithTwoFactor: ({
    twoFactorCode,
    twoFactorRecoveryCode,
  }: {
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
  }) => Promise<void>;
  clearPendingSignIn: () => void;
  enableTwoFactor: (twoFactorCode: string) => Promise<boolean>;
  resetRecoveryCodes: () => Promise<void>;
  clearRecoveryCodes: () => void;
  resendConfirmationEmail: () => Promise<void>;
  signOut: () => Promise<void>;
}

async function saveTokens(tokenResponse: AccessTokenResponse) {
  await SecureStorage.setItemAsync(
    STORAGE_KEY_ACCESS_TOKEN,
    tokenResponse.accessToken,
  );
  await SecureStorage.setItemAsync(
    STORAGE_KEY_REFRESH_TOKEN,
    tokenResponse.refreshToken,
  );
  await SecureStorage.setItemAsync(
    STORAGE_KEY_TOKEN_EXPIRES_AT,
    (Date.now() + tokenResponse.expiresIn * 1000).toString(),
  );
  setAccessToken(tokenResponse.accessToken);
}

async function clearTokens() {
  await SecureStorage.deleteItemAsync(STORAGE_KEY_ACCESS_TOKEN);
  await SecureStorage.deleteItemAsync(STORAGE_KEY_REFRESH_TOKEN);
  await SecureStorage.deleteItemAsync(STORAGE_KEY_TOKEN_EXPIRES_AT);
  setAccessToken(null);
}

async function loadTokens() {
  const [accessToken, refreshToken, tokenExpiresAt] = await Promise.all([
    SecureStorage.getItemAsync(STORAGE_KEY_ACCESS_TOKEN),
    SecureStorage.getItemAsync(STORAGE_KEY_REFRESH_TOKEN),
    SecureStorage.getItemAsync(STORAGE_KEY_TOKEN_EXPIRES_AT),
  ]);
  return {
    accessToken,
    refreshToken,
    expiresAt: tokenExpiresAt !== null ? parseInt(tokenExpiresAt, 10) : 0,
  };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSignIn, setPendingSignIn] = useState<LoginRequest | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);

  const forceSignOut = useCallback(async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem(STORAGE_KEY_IS_SIGNED_IN);
    } else {
      await clearTokens();
    }
    setSession(null);
    setPendingSignIn(null);
    toast({ title: "You have been signed out." });
  }, []);

  const handleTokenRefresh = useCallback(async () => {
    const { refreshToken } = await loadTokens();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await refresh({ refreshToken: refreshToken });
      await saveTokens(response);
      return response.accessToken;
    } catch {
      await forceSignOut();
      return null;
    }
  }, [forceSignOut]);

  useEffect(() => {
    async function hydrate() {
      let wasSignedIn = false;

      if (Platform.OS !== "web") {
        setRefreshCallback(handleTokenRefresh);
      }

      try {
        if (Platform.OS === "web") {
          wasSignedIn = localStorage.getItem(STORAGE_KEY_IS_SIGNED_IN) !== null;
        } else {
          const { accessToken, refreshToken, expiresAt } = await loadTokens();

          let needsRefresh = false;

          if (refreshToken) {
            needsRefresh =
              !accessToken ||
              Date.now() >= expiresAt - TOKEN_REFRESH_THRESHOLD_MS;

            if (needsRefresh) {
              try {
                const response = await refresh(
                  { refreshToken },
                  HYDRATE_TIMEOUT_MS,
                );
                await saveTokens(response);
                wasSignedIn = true;
              } catch {
                await clearTokens();
              }
            }
          }

          if (!wasSignedIn && !needsRefresh && accessToken) {
            setAccessToken(accessToken);
            wasSignedIn = true;
          }
        }
      } catch {}

      if (!wasSignedIn) {
        setIsLoading(false);
        return;
      }

      try {
        const info = await getInfo(HYDRATE_TIMEOUT_MS);
        setSession({
          email: info.email,
          isEmailConfirmed: info.isEmailConfirmed,
        });
      } catch {
        await forceSignOut();
      } finally {
        setIsLoading(false);
      }
    }

    hydrate();

    return () => {
      if (Platform.OS !== "web") {
        setRefreshCallback(null);
      }
    };
  }, [handleTokenRefresh, forceSignOut]);

  async function signIn(request: LoginRequest) {
    try {
      if (Platform.OS === "web") {
        await login(request, true);
        localStorage.setItem(STORAGE_KEY_IS_SIGNED_IN, "");
      } else {
        const accessTokenResponse = await login(request);
        if (!accessTokenResponse) {
          throw new Error("Failed to obtain access token.");
        }
        await saveTokens(accessTokenResponse);
      }
      clearPendingSignIn();
    } catch (error) {
      if (!(error instanceof RequiresTwoFactorError)) {
        throw error;
      }

      // Store credentials for the pending 2FA step.
      // Must be cleared via clearPendingSignIn() after the 2FA step completes or the user cancels.
      setPendingSignIn(request);
      throw error;
    }

    const info = await getInfo();
    setSession({ email: info.email, isEmailConfirmed: info.isEmailConfirmed });
  }

  function signInWithTwoFactor({
    twoFactorCode,
    twoFactorRecoveryCode,
  }: {
    twoFactorCode?: string;
    twoFactorRecoveryCode?: string;
  }) {
    if (!pendingSignIn) {
      throw new Error("No pending sign-in found.");
    }

    return signIn({
      ...pendingSignIn,
      twoFactorCode,
      twoFactorRecoveryCode: twoFactorRecoveryCode,
    });
  }

  function clearPendingSignIn() {
    setPendingSignIn(null);
  }

  async function enableTwoFactor(twoFactorCode: string) {
    const result = await updateTwoFactor({
      enable: true,
      resetRecoveryCodes: true,
      twoFactorCode,
    });
    setRecoveryCodes(result.recoveryCodes ?? null);
    return result.isTwoFactorEnabled;
  }

  async function resetRecoveryCodes() {
    const result = await updateTwoFactor({
      resetRecoveryCodes: true,
    });
    setRecoveryCodes(result.recoveryCodes ?? null);
  }

  function clearRecoveryCodes() {
    setRecoveryCodes(null);
  }

  async function handleResendConfirmationEmail() {
    if (!session) {
      throw new Error("No session found.");
    }
    await resendConfirmationEmail({ email: session.email });
  }

  async function signOut() {
    await logout();

    if (Platform.OS === "web") {
      localStorage.removeItem(STORAGE_KEY_IS_SIGNED_IN);
    } else {
      await clearTokens();
    }
    setSession(null);
    clearPendingSignIn();
    clearRecoveryCodes();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        isSignedIn: !!session,
        isLoading,
        isPendingSignIn: !!pendingSignIn,
        recoveryCodes,
        signIn,
        signInWithTwoFactor,
        clearPendingSignIn,
        enableTwoFactor,
        resetRecoveryCodes,
        clearRecoveryCodes,
        resendConfirmationEmail: handleResendConfirmationEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
