var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres").WithDataVolume().WithPgAdmin();
var appDb = postgres.AddDatabase("appdb");

var apiService = builder
    .AddProject<Projects.AspireIdentityExpo_ApiService>("apiservice")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WithReference(appDb)
    .WaitFor(appDb);

var clientApp = builder
    .AddJavaScriptApp("clientapp", "../clientapp", "start")
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(3001, targetPort: 8081)
    .WithExternalHttpEndpoints()
    .WithEnvironment("EXPO_PUBLIC_API_URL", apiService.GetEndpoint("http"))
    .WaitFor(apiService)
    .ExcludeFromManifest();

if (builder.ExecutionContext.IsRunMode)
{
    apiService.WithEnvironment("CLIENTAPP_URL", clientApp.GetEndpoint("http"));
    apiService.WithEnvironment("CORS__ALLOWEDORIGINS", clientApp.GetEndpoint("http"));
}
else
{
    var clientAppUrl = builder.AddParameter("clientapp-url");

    apiService.WithEnvironment("CLIENTAPP_URL", clientAppUrl);
    apiService.WithEnvironment("CORS__ALLOWEDORIGINS", clientAppUrl);
}

builder.Build().Run();
