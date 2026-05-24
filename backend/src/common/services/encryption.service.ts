import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;      // 96-bit IV — recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit auth tag

@Injectable()
export class EncryptionService implements OnModuleInit {
  private readonly logger = new Logger(EncryptionService.name);
  private key: Buffer;
  private available = false;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const keyHex = this.config.get<string>('encryption.key', '');
    const env = this.config.get<string>('nodeEnv', 'development');

    if (!keyHex || keyHex.length !== 64) {
      this.logger.warn(
        '⚠️  ENCRYPTION_KEY not set or invalid — running in degraded mode. Set ENCRYPTION_KEY (openssl rand -hex 32) for production.',
      );
      // Fallback key — tokens stored unencrypted until proper key is set
      this.key = Buffer.from('0'.repeat(64), 'hex');
    } else {
      this.key = Buffer.from(keyHex, 'hex');
      this.available = true;
      this.logger.log('🔐 EncryptionService initialized');
    }
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, this.key, iv, { authTagLength: AUTH_TAG_LENGTH });
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Stored format: hex(iv):hex(authTag):hex(ciphertext)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(stored: string): string {
    // Handle legacy plain-text tokens (transition period)
    if (!stored.includes(':')) {
      this.logger.warn('Decrypting a plain-text token — re-encrypt on next save');
      return stored;
    }

    const parts = stored.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format');
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');

    const decipher = createDecipheriv(ALGORITHM, this.key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }

  isConfigured(): boolean {
    return this.available;
  }
}
