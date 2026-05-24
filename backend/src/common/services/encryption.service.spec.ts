import { EncryptionService } from './encryption.service';
import { ConfigService } from '@nestjs/config';

function makeService(keyHex = 'a'.repeat(64)): EncryptionService {
  const config = {
    get: jest.fn((key: string, def?: unknown) => {
      if (key === 'encryption.key') return keyHex;
      if (key === 'nodeEnv') return 'test';
      return def;
    }),
  } as unknown as ConfigService;
  const svc = new EncryptionService(config);
  svc.onModuleInit();
  return svc;
}

describe('EncryptionService', () => {
  it('round-trips plaintext through encrypt/decrypt', () => {
    const svc = makeService();
    const original = 'EAABsbCS1iHgBO_meta_token';
    expect(svc.decrypt(svc.encrypt(original))).toBe(original);
  });

  it('produces different ciphertext each call due to random IV', () => {
    const svc = makeService();
    expect(svc.encrypt('same')).not.toBe(svc.encrypt('same'));
  });

  it('returns legacy plain-text unchanged (backward compat)', () => {
    const svc = makeService();
    expect(svc.decrypt('legacy_token_without_colons')).toBe('legacy_token_without_colons');
  });

  it('throws on tampered ciphertext (GCM auth tag mismatch)', () => {
    const svc = makeService();
    const [iv, tag, data] = svc.encrypt('secret').split(':');
    const tampered = `${iv}:${tag}:${data.slice(0, -2)}ff`;
    expect(() => svc.decrypt(tampered)).toThrow();
  });

  it('isConfigured returns true when key is set', () => {
    expect(makeService().isConfigured()).toBe(true);
  });

  it('isConfigured returns false when key is missing', () => {
    expect(makeService('').isConfigured()).toBe(false);
  });
});
