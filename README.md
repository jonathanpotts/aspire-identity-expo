# aspire-identity-expo

[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.19.0+-5FA04E?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE.md)

Example project using [Aspire](https://aspire.dev/) with an [Expo](https://expo.dev/) ([React Native](https://reactnative.dev/)) frontend and an [ASP.NET Core](https://dotnet.microsoft.com/apps/aspnet/apis) backend that uses [ASP.NET Core Identity](https://learn.microsoft.com/aspnet/core/security/authentication/identity) for authentication backed by [PostgreSQL](https://www.postgresql.org/).

## 📋 Requirements

This project requires the following:

- [.NET](https://dotnet.microsoft.com/) SDK 10.0 or later
- [Node.js](https://nodejs.org/) 20.19.0 or later
- [Docker Desktop](https://www.docker.com/) or [Podman](https://podman.io/)

## 🚀 Running

To run this project, do the following:

1. Start Docker Desktop or Podman if it is not already running
2. Use one of the following:
   - **.NET CLI**: In the `AspireIdentityExpo.AppHost` directory, run `dotnet run` and then open the dashboard using the URL output to the console.
   - **[Aspire CLI](https://aspire.dev/reference/cli/overview/)**: In the repo directory, run `aspire run` and then open the dashboard using the URL output to the console.
   - **Code Editor/IDE**: Use the run command in a code editor or IDE such as [Visual Studio Code](https://code.visualstudio.com/).

## 🗂️ Projects

### AspireIdentityExpo.AppHost

An [Aspire AppHost](https://aspire.dev/get-started/app-host/) which handles orchestration and hosts the [Aspire dashboard](https://aspire.dev/dashboard/overview/).

**Uses:**

- **[Aspire.Hosting.PostgreSQL](https://aspire.dev/integrations/databases/postgres/postgres-host/)** - Handles starting up the PostgreSQL container (with pgAdmin) and providing the database to the API service
- **[Aspire.Hosting.JavaScript](https://aspire.dev/integrations/frameworks/javascript/)** - Handles launching and configuring the Expo frontend

### AspireIdentityExpo.ApiService

An ASP.NET Core [minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/apis) backend that exposes [ASP.NET Core Identity API endpoints](https://learn.microsoft.com/aspnet/core/security/authentication/identity-api-authorization) for authentication and account management.

> [!NOTE]
> The `LoggingEmailSender` is used in place of a real email sender. Instead of sending emails, it logs confirmation links and password reset codes as structured log entries, which are accessible from the **Structured** tab in the Aspire dashboard. For production use, replace it with a real `IEmailSender<ApplicationUser>` implementation.

**Uses:**

- **[Aspire.Npgsql.EntityFrameworkCore.PostgreSQL](https://aspire.dev/integrations/databases/efcore/postgres/postgresql-get-started/)** - Handles configuring the Entity Framework Core connection to PostgreSQL
- **[Microsoft.AspNetCore.Identity.EntityFrameworkCore](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization)** - Provides cookie-based and token-based authentication with support for email confirmation, password reset, two-factor authentication (TOTP), and recovery codes
- **[Scalar.AspNetCore](https://scalar.com/)** - Provides an interactive API reference in development

### clientapp

An Expo frontend supporting web, iOS, and Android that authenticates users via the ASP.NET Core Identity API endpoints.

> [!NOTE]
> On **web**, HTTP-only cookies are used instead of tokens as a security best practice. On **native**, tokens are persisted via `expo-secure-store`.

**Features:**

- 👤 Sign up and sign in
- 📧 Email confirmation
- 🔑 Forgot password and password reset
- 📱 Two-factor authentication (TOTP) setup and sign-in
- 🛡️ Recovery code management
- ✏️ Change email and change password
- 🔒 Protected routes

**Uses:**

- **[Expo](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)** - Provides the [React Native](https://reactnative.dev/) app framework and file-based routing
- **[NativeWind](https://www.nativewind.dev/)** - Applies [Tailwind CSS](https://tailwindcss.com/) styles to React Native components
- **[React Native Reusables](https://reactnativereusables.com/)** - Provides [shadcn/ui](https://ui.shadcn.com/)-inspired universal components for React Native
- **[TanStack Query](https://tanstack.com/query/)** - Handles server state and data fetching
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** - Manages form state and validation
- **[expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/)** - Persists auth tokens securely on native platforms
- **[Lucide React Native](https://lucide.dev/)** - Provides icons
