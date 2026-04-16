using AspireIdentityExpo.ApiService.Data;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;

namespace AspireIdentityExpo.ApiService.Auth;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/auth").WithTags("Auth");
        group.MapIdentityApi<ApplicationUser>();

        group.MapPost("/logout", LogoutAsync).RequireAuthorization();

        return app;
    }

    public static async Task<Ok> LogoutAsync(SignInManager<ApplicationUser> signInManager)
    {
        await signInManager.ForgetTwoFactorClientAsync();
        await signInManager.SignOutAsync();
        return TypedResults.Ok();
    }
}
