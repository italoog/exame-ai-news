@echo off
cd /d "c:\Users\Montreal\Documents\GitHub\teste exame"

echo === EXAME AI NEWS - Push to GitHub ===

echo.
echo [1/6] Initializing git repository...
git init
if %errorlevel% neq 0 (echo Already initialized or error, continuing...)

echo.
echo [2/6] Staging all files...
git add .

echo.
echo [3/6] Committing...
git commit -m "feat: EXAME AI NEWS - initial commit" -m "Stack: Next.js 14 + NestJS + PostgreSQL + Redis + BullMQ + OpenAI" -m "- Monorepo pnpm + Turborepo" -m "- Auth JWT + Refresh Token Rotation" -m "- Feed inteligente com infinite scroll" -m "- Editor TipTap + Dashboard Admin" -m "- WebSocket (breaking news)" -m "- Recommendations engine" -m "- Docker Compose + GitHub Actions CI" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo [4/6] Setting branch to main...
git branch -M main

echo.
echo [5/6] Adding remote origin...
git remote add origin https://github.com/italoog/exame-ai-news.git
if %errorlevel% neq 0 (
    echo Remote already exists, updating URL...
    git remote set-url origin https://github.com/italoog/exame-ai-news.git
)

echo.
echo [6/6] Pushing to GitHub...
git push -u origin main

echo.
echo === Done! Check https://github.com/italoog/exame-ai-news ===
pause
