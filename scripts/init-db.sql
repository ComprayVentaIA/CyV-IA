-- Ejecutado una sola vez al crear el container de postgres en producción
-- Crea extensiones necesarias

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- búsqueda de texto fuzzy
