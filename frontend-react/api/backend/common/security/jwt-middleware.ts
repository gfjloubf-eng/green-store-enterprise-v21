import TokenService from '../../services/auth-token-service';
import TokenBlacklistRepository from '../../repositories/token-blacklist-repository';
import SessionService from '../../services/auth-session-service';
import { InvalidTokenError, UnauthorizedError } from './errors';

export async function validateAccessToken(token: string) {
  const v = TokenService.verify(token);
  if (!v.valid || !v.payload) throw new InvalidTokenError(v.error ?? 'invalid_token');
  if (v.payload.typ !== 'access') throw new InvalidTokenError('invalid_token_type');

  // check jti blacklist if present
  const jti = v.payload.jti as string | undefined;
  if (jti) {
    const black = await TokenBlacklistRepository.isBlacklistedByJti(jti);
    if (black) throw new UnauthorizedError('token_revoked');
  }

  // check session revocation for refresh tokens mapped session (access tokens may not have jti)
  const sub = v.payload.sub as string | undefined;
  if (!sub) throw new UnauthorizedError('missing_sub');

  // if access token contains session jti under sid claim, validate
  const sid = v.payload.sid as string | undefined;
  if (sid) {
    const revoked = await SessionService.isRevoked(sid);
    if (revoked) throw new UnauthorizedError('session_revoked');
  }

  return v.payload;
}

export default validateAccessToken;