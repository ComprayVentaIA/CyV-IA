#!/bin/bash
# deploy.sh — Script de deploy manual en el VPS
# Uso: ./scripts/deploy.sh [image_tag]
# Si no se pasa tag, usa "latest"
set -euo pipefail

APP_DIR="/opt/cyv-automatizada"
IMAGE_TAG="${1:-latest}"

echo "=== CyV-Automatizada Deploy ==="
echo "Directorio : $APP_DIR"
echo "Image tag  : $IMAGE_TAG"
echo "Fecha/Hora : $(date)"
echo ""

cd "$APP_DIR"

# Cargar .env.prod para tener GITHUB_REPO disponible
if [ -f .env.prod ]; then
  export $(grep -v '^#' .env.prod | xargs)
fi

export IMAGE_TAG

# Pull de código (si deploy es vía git)
if [ -d .git ]; then
  echo "→ Actualizando código..."
  git pull --ff-only
fi

# Pull de imágenes
echo "→ Descargando imágenes Docker ($IMAGE_TAG)..."
docker-compose -f docker-compose.prod.yml pull backend frontend

# Deploy backend primero (dependencia del frontend)
echo "→ Reiniciando backend..."
docker-compose -f docker-compose.prod.yml up -d --no-deps --remove-orphans backend

# Esperar que el backend esté healthy antes de reiniciar el frontend
echo "→ Esperando health check del backend..."
for i in $(seq 1 12); do
  if docker exec cyv-backend wget -qO- http://localhost:3000/health/live > /dev/null 2>&1; then
    echo "   Backend OK ✓"
    break
  fi
  echo "   Intento $i/12 — esperando..."
  sleep 5
done

# Deploy frontend
echo "→ Reiniciando frontend..."
docker-compose -f docker-compose.prod.yml up -d --no-deps --remove-orphans frontend

# Limpiar imágenes viejas
echo "→ Limpiando imágenes no usadas..."
docker image prune -f

echo ""
echo "=== Deploy completado: $IMAGE_TAG ==="
docker-compose -f docker-compose.prod.yml ps
