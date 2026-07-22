#!/bin/bash
# ============================================
# UMAIN Platform - Push to GitHub
# ============================================
# Ejecutar este script desde tu máquina local
# donde tengas acceso a GitHub

set -e

echo "🚀 UMAIN Platform - Push to GitHub"
echo "=================================="
echo ""

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "UMAIN_PROJECT_SPEC.md" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio raíz de umain-platform"
    exit 1
fi

# 2. Verificar estado del repositorio
echo "📋 Estado actual del repositorio:"
git status
echo ""

# 3. Verificar remote
echo "🔗 Remote configurado:"
git remote -v
echo ""

# 4. Si no hay remote, agregarlo
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "➕ Agregando remote de GitHub..."
    git remote add origin https://github.com/villainslabs-git/umain-platform.git
fi

# 5. Fetch últimos cambios
echo "📥 Fetching últimos cambios..."
git fetch origin

# 6. Verificar rama actual
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Rama actual: $CURRENT_BRANCH"

# 7. Si no estamos en feature/design-v2, crearla o cambiar a ella
if [ "$CURRENT_BRANCH" != "feature/design-v2" ]; then
    echo "🔀 Cambiando a feature/design-v2..."
    git checkout -b feature/design-v2 2>/dev/null || git checkout feature/design-v2
fi

# 8. Mostrar commits a pushar
echo ""
echo "📝 Commits a pushar:"
git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline -10
echo ""

# 9. Confirmar push
read -p "¿Hacer push a GitHub? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Haciendo push a GitHub..."
    git push origin feature/design-v2
    
    echo ""
    echo "✅ Push completado!"
    echo ""
    echo "📊 Próximos pasos:"
    echo "   1. Ve a https://github.com/villainslabs-git/umain-platform"
    echo "   2. Crea un Pull Request de feature/design-v2 → main"
    echo "   3. O ejecuta: deploy_website(website_id='dd02a241-61d3-41c0-9151-d8aaf1f81f75')"
    echo ""
else
    echo "❌ Push cancelado"
fi
