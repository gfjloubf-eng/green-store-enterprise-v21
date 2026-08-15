import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { JWT_SECRET, ACCESS_TOKEN_EXP_SECONDS, REFRESH_TOKEN_EXP_SECONDS, TOKEN_ISSUER } from './auth-constants';

function base64url(input: Buffer | string): string {
  const b = typeof input === 'string' ? Buffer.from(input) : input;
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function sign(payload: string): string {
  const hmac = createHmac('sha256', JWT_SECRET);
  hmac.update(payload);
  return base64url(hmac.digest());
}

export type JwtPayload = Record<string, any>;

export class TokenService {
  private readonly issuer = TOKEN_ISSUER;

  constructor() {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET must be configured');
    }
  }

  createAccessToken(subject: string, extra: Record<string, any> = {}, expiresInSec = ACCESS_TOKEN_EXP_SECONDS): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresInSec;
    const payload = { iss: this.issuer, sub: subject, iat, exp, ...extra, typ: 'access' };

    const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
    const signature = sign(encoded);
    return `${encoded}.${signature}`;
  }

  createRefreshToken(subject: string, jti?: string, extra: Record<string, any> = {}, expiresInSec = REFRESH_TOKEN_EXP_SECONDS): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + expiresInSec;
    const id = jti ?? randomBytes(16).toString('hex');
    const payload = { iss: this.issuer, sub: subject, iat, exp, jti: id, ...extra, typ: 'refresh' };

    const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
    const signature = sign(encoded);
    return `${encoded}.${signature}`;
  }

  verify(token: string): { valid: boolean; payload?: JwtPayload; error?: string } {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { valid: false, error: 'malformed' };
      const [encodedHeader, encodedPayload, signature] = parts;
      const signed = `${encodedHeader}.${encodedPayload}`;
      const expected = sign(signed);
      const expectedBuffer = Buffer.from(expected, 'base64url');
      const signatureBuffer = Buffer.from(signature, 'base64url');
      if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
        return { valid: false, error: 'invalid signature' };
      }

      const payloadJson = Buffer.from(encodedPayload, 'base64').toString('utf8');
      const payload = JSON.parse(payloadJson);
      if (payload.iss !== this.issuer) return { valid: false, error: 'invalid_issuer' };
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && now > payload.exp) return { valid: false, error: 'expired' };
      return { valid: true, payload };
    } catch (err: any) {
      return { valid: false, error: err?.message ?? 'invalid token' };
    }
  }
}

export default new TokenService();
