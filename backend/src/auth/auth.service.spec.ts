import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

const mockQuery = jest.fn();
const mockDb = { query: mockQuery };
const mockJwt = { sign: jest.fn().mockReturnValue('signed.access.token') } as unknown as JwtService;
const mockConfig = { get: jest.fn().mockReturnValue('test') } as unknown as ConfigService;
const mockEmail = { sendVerification: jest.fn(), sendPasswordReset: jest.fn() };

function makeService(): AuthService {
  return new AuthService(mockDb as any, mockJwt, mockConfig, mockEmail as any);
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AuthService.validateUser', () => {
  it('returns null when user not found', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const svc = makeService();
    expect(await svc.validateUser('x@test.com', 'pass')).toBeNull();
  });

  it('returns null when password does not match', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: '1', email: 'x@test.com', password_hash: '$2a$12$wrong', role: 'user', status: 'active', email_verified: true }],
    });
    const svc = makeService();
    expect(await svc.validateUser('x@test.com', 'wrongpass')).toBeNull();
  });
});

describe('AuthService.refresh', () => {
  it('throws UnauthorizedException for unknown token', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] });
    const svc = makeService();
    await expect(svc.refresh('unknown-token')).rejects.toThrow(UnauthorizedException);
  });

  it('rotates token — revokes old, issues new', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ id: 'rt-1', user_id: 'u-1', email: 'a@b.com', role: 'user' }] })
      .mockResolvedValueOnce({ rows: [] }) // UPDATE revoked
      .mockResolvedValueOnce({ rows: [] }); // INSERT new token

    const svc = makeService();
    const result = await svc.refresh('valid-raw-token');

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(mockJwt.sign).toHaveBeenCalledWith({ sub: 'u-1', email: 'a@b.com', role: 'user' });
  });
});

describe('AuthService.register', () => {
  it('throws ConflictException when email already exists', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: 'existing' }] });
    const svc = makeService();
    await expect(svc.register({ email: 'a@b.com', password: 'pass', fullName: 'Test' } as any))
      .rejects.toThrow(ConflictException);
  });
});

describe('AuthService.login', () => {
  it('throws UnauthorizedException when email not verified', async () => {
    const svc = makeService();
    await expect(svc.login({ email_verified: false, status: 'active' }))
      .rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when account is suspended', async () => {
    const svc = makeService();
    await expect(svc.login({ email_verified: true, status: 'suspended' }))
      .rejects.toThrow(UnauthorizedException);
  });
});
