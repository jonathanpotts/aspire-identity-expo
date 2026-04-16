using System.Net;
using AspireIdentityExpo.ApiService.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;

namespace AspireIdentityExpo.ApiService.Auth;

public class LoggingEmailSender(IConfiguration configuration, ILogger<LoggingEmailSender> logger)
    : IEmailSender<ApplicationUser>
{
    private readonly string _clientAppUrl =
        configuration["CLIENTAPP_URL"]
        ?? throw new InvalidOperationException("CLIENTAPP_URL configuration value is required.");

    private readonly ILogger<LoggingEmailSender> _logger = logger;

    public async Task SendConfirmationLinkAsync(
        ApplicationUser user,
        string email,
        string confirmationLink
    )
    {
        if (!_logger.IsEnabled(LogLevel.Information))
        {
            return;
        }

        _logger.LogInformation(
            "Confirmation link for {Email}: {ConfirmationLink}",
            email,
            WebUtility.HtmlDecode(confirmationLink)
        );
    }

    public Task SendPasswordResetCodeAsync(ApplicationUser user, string email, string resetCode)
    {
        if (!_logger.IsEnabled(LogLevel.Information))
        {
            return Task.CompletedTask;
        }

        _logger.LogInformation("Password reset code for {Email}: {ResetCode}", email, resetCode);

        var query = new Dictionary<string, string?>
        {
            ["email"] = email,
            ["resetCode"] = resetCode,
        };
        var url = QueryHelpers.AddQueryString($"{_clientAppUrl}/reset-password", query);

        _logger.LogInformation("Password reset URL for {Email}: {ResetUrl}", email, url);

        return Task.CompletedTask;
    }

    // This method is only called by the built-in Blazor Identity UI, which this project does not use.
    // Throwing here ensures we get an immediate, visible failure if this path is ever hit unexpectedly.
    public Task SendPasswordResetLinkAsync(ApplicationUser user, string email, string resetLink)
    {
        throw new NotImplementedException();
    }
}
