import {
  sendJsonRequest,
  sendRequest,
  type HttpValidationProblemDetails,
} from "./client";

export class FailedLoginError extends Error {
  constructor() {
    super("The provided credentials are incorrect.");
    this.name = "FailedLoginError";
  }
}

export class LockedOutError extends Error {
  constructor() {
    super("Too many failed attempts. Please try again later.");
    this.name = "LockedOutError";
  }
}

export class RequiresTwoFactorError extends Error {
  constructor() {
    super("Two-factor authentication code is required.");
    this.name = "RequiresTwoFactorError";
  }
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
};

export type AccessTokenResponse = {
  tokenType?: string | null;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export type RefreshRequest = {
  refreshToken: string;
};

export type ResendConfirmationEmailRequest = {
  email: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  email: string;
  newPassword: string;
  resetCode: string;
};

export type TwoFactorRequest = {
  enable?: boolean | null;
  forgetMachine?: boolean;
  resetRecoveryCodes?: boolean;
  resetSharedKey?: boolean;
  twoFactorCode?: string | null;
};

export type TwoFactorResponse = {
  isMachineRemembered: boolean;
  isTwoFactorEnabled: boolean;
  recoveryCodesLeft: number;
  sharedKey: string;
  recoveryCodes?: string[];
};

export type InfoResponse = {
  email: string;
  isEmailConfirmed: boolean;
};

export type InfoRequest = {
  newEmail?: string | null;
  newPassword?: string | null;
  oldPassword?: string | null;
};

export async function register(request: RegisterRequest, timeoutMs?: number) {
  const response = await sendJsonRequest(
    "/auth/register",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    if (response.status === 400) {
      const problemDetails =
        (await response.json()) as HttpValidationProblemDetails;

      const errors = problemDetails.errors;
      if (errors) {
        if ("InvalidEmail" in errors) {
          throw new Error("Email is invalid.");
        }
        if (
          "PasswordTooShort" in errors ||
          "PasswordRequiresNonAlphanumeric" in errors ||
          "PasswordRequiresDigit" in errors ||
          "PasswordRequiresLower" in errors ||
          "PasswordRequiresUpper" in errors ||
          "PasswordRequiresUniqueChars" in errors
        ) {
          throw new Error("Password does not meet requirements.");
        }
        if ("DuplicateUserName" in errors) {
          throw new Error("This email is already in use.");
        }
      }
    }

    throw new Error("Unable to sign up. Please try again.");
  }
}

export async function login(
  request: LoginRequest,
  useCookies = false,
  useSessionCookies = false,
  timeoutMs?: number,
) {
  const params = new URLSearchParams();
  if (useCookies) {
    params.append("useCookies", "true");
  }
  if (useSessionCookies) {
    params.append("useSessionCookies", "true");
  }
  const queryString = params.size ? `?${params}` : "";

  const response = await sendJsonRequest(
    `/auth/login${queryString}`,
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    if (response.status === 401) {
      const problemDetails =
        (await response.json()) as HttpValidationProblemDetails;

      if (problemDetails.detail === "Failed") {
        throw new FailedLoginError();
      }
      if (problemDetails.detail === "LockedOut") {
        throw new LockedOutError();
      }
      if (problemDetails.detail === "RequiresTwoFactor") {
        throw new RequiresTwoFactorError();
      }
    }

    throw new Error("Unable to sign in. Please try again.");
  }

  const contentType = response.headers.get("Content-Type");
  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json() as Promise<AccessTokenResponse>;
}

export async function refresh(request: RefreshRequest, timeoutMs?: number) {
  const response = await sendJsonRequest(
    "/auth/refresh",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    throw new Error("Unable to refresh access token. Please sign in again.");
  }

  return response.json() as Promise<AccessTokenResponse>;
}

export async function resendConfirmationEmail(
  request: ResendConfirmationEmailRequest,
  timeoutMs?: number,
) {
  const response = await sendJsonRequest(
    "/auth/resendConfirmationEmail",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    throw new Error("Unable to resend confirmation email. Please try again.");
  }
}

export async function forgotPassword(
  request: ForgotPasswordRequest,
  timeoutMs?: number,
) {
  const response = await sendJsonRequest(
    "/auth/forgotPassword",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    throw new Error("Unable to send reset email. Please try again.");
  }
}

export async function resetPassword(
  request: ResetPasswordRequest,
  timeoutMs?: number,
) {
  const response = await sendJsonRequest(
    "/auth/resetPassword",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    throw new Error("Unable to reset password. Please try again.");
  }
}

export function getTwoFactor(timeoutMs?: number) {
  return updateTwoFactor({}, timeoutMs);
}

export async function updateTwoFactor(
  request: TwoFactorRequest,
  timeoutMs?: number,
) {
  const response = await sendJsonRequest(
    "/auth/manage/2fa",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    if (response.status === 400) {
      const problemDetails =
        (await response.json()) as HttpValidationProblemDetails;

      const errors = problemDetails.errors;
      if (errors) {
        if ("InvalidTwoFactorCode" in errors) {
          throw new Error("Authenticator code is invalid.");
        }
      }
    }

    throw new Error(
      "Unable to update two-factor authentication settings. Please try again.",
    );
  }

  return response.json() as Promise<TwoFactorResponse>;
}

export async function getInfo(timeoutMs?: number) {
  const response = await sendRequest("/auth/manage/info", undefined, timeoutMs);

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please sign in again.");
    }

    throw new Error("Unable to retrieve user info.");
  }

  return response.json() as Promise<InfoResponse>;
}

export async function updateInfo(request: InfoRequest, timeoutMs?: number) {
  const response = await sendJsonRequest(
    "/auth/manage/info",
    request,
    {
      method: "POST",
    },
    timeoutMs,
  );

  if (!response.ok) {
    if (response.status === 400) {
      const problemDetails =
        (await response.json()) as HttpValidationProblemDetails;

      const errors = problemDetails.errors;
      if (errors) {
        if ("InvalidEmail" in errors) {
          throw new Error("New email is invalid.");
        }
        if ("OldPasswordRequired" in errors) {
          throw new Error("Old password is required to set a new password.");
        }
        if ("PasswordMismatch" in errors) {
          throw new Error("Old password is incorrect.");
        }
        if (
          "PasswordTooShort" in errors ||
          "PasswordRequiresNonAlphanumeric" in errors ||
          "PasswordRequiresDigit" in errors ||
          "PasswordRequiresLower" in errors ||
          "PasswordRequiresUpper" in errors ||
          "PasswordRequiresUniqueChars" in errors
        ) {
          throw new Error("New password does not meet requirements.");
        }
      }
    }

    throw new Error("Unable to update user info. Please try again.");
  }

  return response.json() as Promise<InfoResponse>;
}

export async function logout(timeoutMs?: number) {
  const response = await sendRequest(
    "/auth/logout",
    { method: "POST" },
    timeoutMs,
  );

  if (!response.ok) {
    throw new Error("Unable to sign out. Please try again.");
  }
}
