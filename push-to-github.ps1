# EXAME AI NEWS — Push para GitHub
# Execute este script no PowerShell como Administrador

Set-Location "c:\Users\Montreal\Documents\GitHub\teste exame"

Write-Host "=== EXAME AI NEWS — Setup GitHub ===" -ForegroundColor Cyan

# 1. Instalar GitHub CLI (se nao tiver)
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "`n[1/5] Instalando GitHub CLI..." -ForegroundColor Yellow
    winget install --id GitHub.cli --silent --accept-package-agreements --accept-source-agreements
    # Recarregar PATH
    $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")
} else {
    Write-Host "`n[1/5] GitHub CLI ja instalado." -ForegroundColor Green
}

# 2. Autenticar no GitHub
Write-Host "`n[2/5] Autenticando no GitHub (sera aberto o navegador)..." -ForegroundColor Yellow
gh auth login --web --git-protocol https

# 3. Inicializar git
Write-Host "`n[3/5] Inicializando repositorio git..." -ForegroundColor Yellow
git init
git add .
git commit -m "feat: EXAME AI NEWS - plataforma fullstack enterprise com IA

Stack: Next.js 14 + NestJS + PostgreSQL + Redis + BullMQ + OpenAI
- Monorepo pnpm + Turborepo
- Auth JWT + Refresh Token Rotation
- Feed inteligente com infinite scroll
- Editor TipTap + Dashboard Admin
- WebSocket (breaking news)
- Recommendations engine
- Docker Compose + GitHub Actions CI"

# 4. Criar repo e fazer push
Write-Host "`n[4/5] Criando repositorio no GitHub e fazendo push..." -ForegroundColor Yellow
gh repo create exame-ai-news `
  --public `
  --description "Plataforma fullstack enterprise de noticias com IA — Next.js 14 + NestJS + PostgreSQL + Redis + OpenAI" `
  --source=. `
  --remote=origin `
  --push

# 5. Confirmar
Write-Host "`n[5/5] Concluido!" -ForegroundColor Green
Write-Host "Repositorio disponivel em: https://github.com/italoog/exame-ai-news" -ForegroundColor Cyan
Write-Host "`nPressione qualquer tecla para fechar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
