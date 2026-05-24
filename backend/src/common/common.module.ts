import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { EncryptionService } from './services/encryption.service';
import { CacheService } from './services/cache.service';

@Global()
@Module({
  providers: [EmailService, EncryptionService, CacheService],
  exports: [EmailService, EncryptionService, CacheService],
})
export class CommonModule {}
