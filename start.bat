@echo off
echo ========================================
echo   EvolveAI - Iniciando Aplicacao
echo ========================================
echo.

REM Verificar se o backend esta configurado
if not exist "backend\.env" (
    echo [AVISO] Arquivo .env nao encontrado no backend!
    echo Copiando .env.example para .env...
    copy backend\.env.example backend\.env
    echo.
    echo [IMPORTANTE] Edite backend\.env e configure JWT_SECRET!
    echo.
    pause
)

REM Iniciar backend
echo [1/2] Iniciando Backend...
start "EvolveAI Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Iniciar frontend
echo [2/2] Iniciando Frontend...
start "EvolveAI Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Aplicacao iniciada com sucesso!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Pressione qualquer tecla para fechar...
pause >nul
