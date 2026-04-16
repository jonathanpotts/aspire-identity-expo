using AspireIdentityExpo.ApiService.Auth;
using AspireIdentityExpo.ApiService.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add PostgreSQL + EF Core via Aspire integration (connects to "appdb" resource).
builder.AddNpgsqlDbContext<ApplicationDbContext>("appdb");

// Add services to the container.
builder.Services.AddProblemDetails();

builder.Services.AddAuthorization();

builder.Services.AddSingleton<IEmailSender<ApplicationUser>, LoggingEmailSender>();

// Add ASP.NET Core Identity with API endpoints backed by EF Core + PostgreSQL.
builder
    .Services.AddIdentityApiEndpoints<ApplicationUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddCors(options =>
{
    var allowedOrigins =
        builder
            .Configuration["Cors:AllowedOrigins"]
            ?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
        ?? [];

    if (allowedOrigins.Length > 0)
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        });
    }
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();

    app.MapGet("/", () => Results.Redirect("/scalar")).ExcludeFromDescription();
}

app.MapDefaultEndpoints();
app.MapAuthEndpoints();

// Apply pending Identity migrations on startup.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await db.Database.MigrateAsync();
}

app.Run();
