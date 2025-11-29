# Script de vérification rapide de l'état Docker NextH
Write-Host "Verification de l'etat Docker NextH..." -ForegroundColor Cyan

# Vérifier si les conteneurs tournent
try {
    $containers = docker-compose -f docker-compose.dev.yml ps --format "table {{.Name}}`t{{.Status}}`t{{.Ports}}"
    Write-Host "Etat des conteneurs :" -ForegroundColor Green
    Write-Host $containers
} catch {
    Write-Host "Impossible de verifier les conteneurs. Sont-ils demarres ?" -ForegroundColor Red
    Write-Host "Lancez: docker-compose -f docker-compose.dev.yml up -d" -ForegroundColor Yellow
    exit 1
}

# Tester les endpoints
Write-Host "" -ForegroundColor White
Write-Host "Test des endpoints :" -ForegroundColor Cyan

# Test Backend
try {
    $backendResponse = Invoke-WebRequest -Uri "http://localhost:3002/health" -TimeoutSec 5 -ErrorAction Stop
    if ($backendResponse.StatusCode -eq 200) {
        Write-Host "Backend API: http://localhost:3002 (OK)" -ForegroundColor Green
    } else {
        Write-Host "Backend API: http://localhost:3002 (Status: $($backendResponse.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Backend API: http://localhost:3002 (Indisponible)" -ForegroundColor Red
}

# Test Frontend
try {
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:3003" -TimeoutSec 5 -ErrorAction Stop
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "Frontend: http://localhost:3003 (OK)" -ForegroundColor Green
    } else {
        Write-Host "Frontend: http://localhost:3003 (Status: $($frontendResponse.StatusCode))" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Frontend: http://localhost:3003 (Indisponible)" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "Commandes utiles :" -ForegroundColor Cyan
Write-Host "  Arreter: docker-compose -f docker-compose.dev.yml down" -ForegroundColor White
Write-Host "  Logs:    docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor White
Write-Host "  Redemarrer: docker-compose -f docker-compose.dev.yml restart" -ForegroundColor White
