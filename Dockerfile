# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["SmartHire.API/SmartHire.API.csproj", "SmartHire.API/"]
COPY ["SmartHire.Core/SmartHire.Core.csproj", "SmartHire.Core/"]
COPY ["SmartHire.Infrastructure/SmartHire.Infrastructure.csproj", "SmartHire.Infrastructure/"]

RUN dotnet restore "SmartHire.API/SmartHire.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/SmartHire.API"
RUN dotnet build "SmartHire.API.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "SmartHire.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SmartHire.API.dll"]
