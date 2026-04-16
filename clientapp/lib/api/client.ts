import * as Device from "expo-device";
import { Platform } from "react-native";

export type HttpValidationProblemDetails = {
  detail?: null | string;
  errors?: Record<string, string[]>;
  instance?: string | null;
  status?: number;
  title?: string | null;
  type?: string | null;
};

let accessToken: string | null = null;
let refreshCallback: (() => Promise<string | null>) | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setRefreshCallback(
  callback: (() => Promise<string | null>) | null,
) {
  refreshCallback = callback;
}

function getApiUrl() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    return undefined;
  }

  // In development, if the app is running on an Android emulator and the API URL
  // points to localhost, we need to replace it with the special IP address that
  // allows the emulator to access the host machine's localhost.
  if (__DEV__) {
    if (Platform.OS !== "android" || Device.isDevice || !URL.canParse(apiUrl)) {
      return apiUrl;
    }

    const url = new URL(apiUrl);

    if (
      url.hostname.toLowerCase() === "localhost" ||
      url.hostname === "127.0.0.1"
    ) {
      url.hostname = "10.0.2.2";
      return url.toString();
    }
  }

  return apiUrl;
}

const apiUrl = getApiUrl();

const DEFAULT_TIMEOUT_MS = 10_000;

export async function sendRequest(
  route: string,
  options?: Omit<RequestInit, "credentials">,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  if (!apiUrl) {
    throw new Error("The API URL is not defined.");
  }

  const base = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
  const path = route.startsWith("/") ? route : `/${route}`;
  const url = `${base}${path}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  options?.signal?.addEventListener(
    "abort",
    () => {
      clearTimeout(timeoutId);
      controller.abort(options.signal!.reason);
    },
    { signal: controller.signal },
  );

  const signal = controller.signal;

  try {
    // If a token refresh is already in flight, wait for it so we send the
    // request with the latest token instead of racing ahead with a stale one.
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
    }

    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        Accept: "application/json, application/problem+json",
        ...options?.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    });

    if (response.status === 401 && refreshCallback && !isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshCallback().finally(() => {
        isRefreshing = false;
        refreshPromise = null;
      });

      const newToken = await refreshPromise;
      if (newToken) {
        return await fetch(url, {
          ...options,
          signal,
          headers: {
            Accept: "application/json, application/problem+json",
            ...options?.headers,
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });
      }
    }

    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("Unable to connect. Please try again.");
    }
    throw err;
  }
}

export function sendJsonRequest(
  route: string,
  body: unknown,
  options?: Omit<RequestInit, "credentials" | "body">,
  timeoutMs = DEFAULT_TIMEOUT_MS,
) {
  return sendRequest(
    route,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: JSON.stringify(body),
    },
    timeoutMs,
  );
}
