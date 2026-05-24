#!/bin/bash
# backup-db.sh — Backup diario de PostgreSQL a Cloudflare R2
# Cron sugerido: 0 3 * * * /opt/cyv-automatizada/scripts/backup-db.sh >> /var/log/cyv-backup.log 2>&1
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${TIMESTAMP}.sql.gz"
BACKUP_DIR="/tmp/cyv-backups"
RETAIN_DAYS=7

# Cargar variables de entorno de producción
if [ -f /opt/cyv-automatizada/.env.prod ]; then
  export $(grep -v '^#' /opt/cyv-automatizada/.env.prod | xargs)
fi

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Iniciando backup → $BACKUP_FILE"

# Dump comprimido desde el container de postgres
docker exec cyv-postgres pg_dump \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  --no-password \
  --clean \
  --if-exists \
  | gzip > "$BACKUP_DIR/$BACKUP_FILE"

BACKUP_SIZE=$(du -sh "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
echo "[$(date)] Backup generado: $BACKUP_SIZE"

# Subir a R2 usando AWS CLI (compatible con R2)
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" \
  "s3://${R2_BUCKET_NAME}/backups/$BACKUP_FILE" \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --region auto

echo "[$(date)] Backup subido a R2: backups/$BACKUP_FILE"

# Eliminar backups locales viejos
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +1 -delete

# Eliminar backups remotos de más de RETAIN_DAYS días
CUTOFF_DATE=$(date -d "-${RETAIN_DAYS} days" +%Y%m%d)
AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
aws s3 ls "s3://${R2_BUCKET_NAME}/backups/" \
  --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
  --region auto \
  | awk '{print $4}' \
  | while read -r file; do
      file_date=$(echo "$file" | grep -oP '\d{8}' | head -1)
      if [[ -n "$file_date" && "$file_date" < "$CUTOFF_DATE" ]]; then
        AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID" \
        AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY" \
        aws s3 rm "s3://${R2_BUCKET_NAME}/backups/$file" \
          --endpoint-url "https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com" \
          --region auto
        echo "[$(date)] Backup antiguo eliminado: $file"
      fi
    done

echo "[$(date)] Backup completado exitosamente."
