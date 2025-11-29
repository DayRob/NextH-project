# Script de vérification de la configuration Docker NextH
Write-Host "🔍 Vérification de la configuration NextH..." -ForegroundColor Cyan

# Vérifier si Docker est installé
try {
    $dockerVersion = docker --version 2>$null
    Write-Host "✅ Docker installé: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé. Veuillez l'installer depuis https://docs.docker.com/get-docker/" -ForegroundColor Red
    exit 1
}

# Vérifier si Docker Compose est installé
try {
    $composeVersion = docker-compose --version 2>$null
    Write-Host "✅ Docker Compose installé: $composeVersion" -ForegroundColor Green
} catch {
    try {
        $composeVersion = docker compose version 2>$null
        Write-Host "✅ Docker Compose (plugin) installé: $composeVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker Compose n'est pas installé. Veuillez l'installer depuis https://docs.docker.com/compose/install/" -ForegroundColor Red
        exit 1
    }
}

# Vérifier les fichiers de configuration
$filesToCheck = @("docker-compose.yml", "docker-compose.dev.yml", "docker.env.example", "frontend/Dockerfile", "backend/Dockerfile")
foreach ($file in $filesToCheck) {
    if (!(Test-Path $file)) {
        Write-Host "❌ Fichier manquant: $file" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Tous les fichiers Docker sont présents" -ForegroundColor Green

# Vérifier si .env existe
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env manquant. Copiez docker.env.example vers .env et configurez vos variables." -ForegroundColor Yellow
    Write-Host "   Copy-Item docker.env.example .env" -ForegroundColor Yellow
    exit 1
}

# Vérifier les variables d'environnement essentielles
$requiredVars = @("NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY")
$envContent = Get-Content ".env" -ErrorAction SilentlyContinue
foreach ($var in $requiredVars) {
    $varExists = $envContent | Where-Object { $_ -match "^$var=" }
    if (!$varExists) {
        Write-Host "⚠️  Variable d'environnement manquante: $var" -ForegroundColor Yellow
        Write-Host "   Veuillez l'ajouter dans votre fichier .env" -ForegroundColor Yellow
        exit 1
    }
}
Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

Write-Host "" -ForegroundColor White
Write-Host "✅ Configuration Docker vérifiée avec succès!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "🚀 Pour lancer l'application:" -ForegroundColor Cyan
Write-Host "   npm run prod    # Mode production" -ForegroundColor White
Write-Host "   npm run dev     # Mode développement" -ForegroundColor White
Write-Host "" -ForegroundColor White
Write-Host "📱 L'application sera accessible sur:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3001" -ForegroundColor White
