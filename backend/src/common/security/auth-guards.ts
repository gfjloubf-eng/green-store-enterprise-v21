import validateAccessToken from './jwt-middleware';
import { UnauthorizedError } from './errors';

export async function guardRequireAuth(authorizationHeader?: string) {
  if (!authorizationHeader) throw new UnauthorizedError('missing_authorization');
  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') throw new UnauthorizedError('bad_authorization_header');
  const token = parts[1];
  const payload = await validateAccessToken(token);
  return payload;
}

export async function guardOptionalAuth(authorizationHeader?: string) {
  if (!authorizationHeader) return null;
  try {
    const p = await guardRequireAuth(authorizationHeader);
    return p;
  } catch (e) {
    return null;
  }
}

export default { guardRequireAuth, guardOptionalAuth };