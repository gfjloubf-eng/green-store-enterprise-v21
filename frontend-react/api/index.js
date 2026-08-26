var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// ../backend/src/common/security/errors.ts
var AuthError, UnauthorizedError, InvalidTokenError, RateLimitError, AccountLockedError;
var init_errors = __esm({
  "../backend/src/common/security/errors.ts"() {
    "use strict";
    AuthError = class _AuthError extends Error {
      code;
      constructor(code, message) {
        super(message ?? code);
        this.code = code;
        Object.setPrototypeOf(this, _AuthError.prototype);
      }
    };
    UnauthorizedError = class _UnauthorizedError extends AuthError {
      constructor(message) {
        super("unauthorized", message);
        Object.setPrototypeOf(this, _UnauthorizedError.prototype);
      }
    };
    InvalidTokenError = class _InvalidTokenError extends AuthError {
      constructor(message) {
        super("invalid_token", message);
        Object.setPrototypeOf(this, _InvalidTokenError.prototype);
      }
    };
    RateLimitError = class _RateLimitError extends AuthError {
      constructor(message) {
        super("rate_limited", message);
        Object.setPrototypeOf(this, _RateLimitError.prototype);
      }
    };
    AccountLockedError = class _AccountLockedError extends AuthError {
      constructor(message) {
        super("account_locked", message);
        Object.setPrototypeOf(this, _AccountLockedError.prototype);
      }
    };
  }
});

// ../backend/src/repositories/prisma-service.ts
import fs from "node:fs";
import path from "node:path";
import prismaClientPackage from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
function loadEnvFile() {
  if (process.env.DATABASE_URL) return;
  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, ".env.local"),
    path.resolve(cwd, ".env"),
    path.resolve(cwd, "backend/.env.local"),
    path.resolve(cwd, "backend/.env"),
    path.resolve(cwd, "../.env.local"),
    path.resolve(cwd, "../.env")
  ];
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) continue;
    const content = fs.readFileSync(candidate, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([^=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, value] = match;
      if (process.env[key] === void 0) {
        process.env[key] = value.replace(/(^"|"$)/g, "");
      }
    }
    if (process.env.DATABASE_URL) {
      return;
    }
  }
}
var PrismaClient, PrismaService, prisma_service_default;
var init_prisma_service = __esm({
  "../backend/src/repositories/prisma-service.ts"() {
    "use strict";
    ({ PrismaClient } = prismaClientPackage);
    PrismaService = class _PrismaService {
      static client;
      static getClient() {
        if (!_PrismaService.client) {
          loadEnvFile();
          if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes("sslmode=require")) {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
          }
          const configuredDatabaseUrl = process.env.DATABASE_URL?.trim();
          if (!configuredDatabaseUrl) {
            throw new Error("DATABASE_URL is required for the API database connection");
          }
          let connectionString = configuredDatabaseUrl;
          if (process.env.NODE_ENV === "production" && !connectionString.includes("pgbouncer=")) {
            const separator = connectionString.includes("?") ? "&" : "?";
            connectionString = `${connectionString}${separator}pgbouncer=true&connection_limit=1`;
          }
          const adapter = new PrismaPg({ connectionString });
          const createClient = () => new PrismaClient({
            log: process.env.NODE_ENV === "production" ? ["error"] : ["query", "error", "warn"],
            adapter
          });
          if (process.env.NODE_ENV !== "production") {
            if (!global.__prismaClient) {
              global.__prismaClient = createClient();
            }
            _PrismaService.client = global.__prismaClient;
          } else {
            _PrismaService.client = createClient();
          }
        }
        return _PrismaService.client;
      }
      static async disconnect() {
        if (_PrismaService.client) {
          await _PrismaService.client.$disconnect();
        }
      }
      static async transaction(work) {
        const client = _PrismaService.getClient();
        return client.$transaction(work);
      }
    };
    prisma_service_default = PrismaService;
  }
});

// ../backend/src/services/auth-constants.ts
import fs2 from "node:fs";
import path2 from "node:path";
function loadEnvFile2() {
  if (process.env.JWT_SECRET) return;
  const cwd = process.cwd();
  const candidates = [
    path2.resolve(cwd, ".env.local"),
    path2.resolve(cwd, ".env"),
    path2.resolve(cwd, "backend/.env.local"),
    path2.resolve(cwd, "backend/.env"),
    path2.resolve(cwd, "../.env.local"),
    path2.resolve(cwd, "../.env")
  ];
  for (const candidate of candidates) {
    if (!fs2.existsSync(candidate)) continue;
    const content = fs2.readFileSync(candidate, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([^=\s]+)=(.*)$/);
      if (!match) continue;
      const [, key, value] = match;
      if (process.env[key] === void 0) {
        process.env[key] = value.replace(/(^"|"$)/g, "");
      }
    }
    if (process.env.JWT_SECRET) {
      return;
    }
  }
}
var ACCESS_TOKEN_EXP_SECONDS, REFRESH_TOKEN_EXP_SECONDS, JWT_SECRET, TOKEN_ISSUER;
var init_auth_constants = __esm({
  "../backend/src/services/auth-constants.ts"() {
    "use strict";
    loadEnvFile2();
    ACCESS_TOKEN_EXP_SECONDS = Number(process.env.ACCESS_TOKEN_EXP_SECONDS ?? 900);
    REFRESH_TOKEN_EXP_SECONDS = Number(process.env.REFRESH_TOKEN_EXP_SECONDS ?? 60 * 60 * 24 * 30);
    JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-phase6b-verification-key-12345";
    TOKEN_ISSUER = process.env.TOKEN_ISSUER ?? "qutoof-nature";
  }
});

// ../backend/src/services/auth-token-service.ts
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
function base64url(input) {
  const b = typeof input === "string" ? Buffer.from(input) : input;
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function sign(payload) {
  const hmac = createHmac("sha256", JWT_SECRET);
  hmac.update(payload);
  return base64url(hmac.digest());
}
var TokenService, auth_token_service_default;
var init_auth_token_service = __esm({
  "../backend/src/services/auth-token-service.ts"() {
    "use strict";
    init_auth_constants();
    TokenService = class {
      issuer = TOKEN_ISSUER;
      constructor() {
        if (!JWT_SECRET) {
          throw new Error("JWT_SECRET must be configured");
        }
      }
      createAccessToken(subject, extra = {}, expiresInSec = ACCESS_TOKEN_EXP_SECONDS) {
        const header = { alg: "HS256", typ: "JWT" };
        const iat = Math.floor(Date.now() / 1e3);
        const exp = iat + expiresInSec;
        const payload = { iss: this.issuer, sub: subject, iat, exp, ...extra, typ: "access" };
        const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
        const signature2 = sign(encoded);
        return `${encoded}.${signature2}`;
      }
      createRefreshToken(subject, jti, extra = {}, expiresInSec = REFRESH_TOKEN_EXP_SECONDS) {
        const header = { alg: "HS256", typ: "JWT" };
        const iat = Math.floor(Date.now() / 1e3);
        const exp = iat + expiresInSec;
        const id = jti ?? randomBytes(16).toString("hex");
        const payload = { iss: this.issuer, sub: subject, iat, exp, jti: id, ...extra, typ: "refresh" };
        const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
        const signature2 = sign(encoded);
        return `${encoded}.${signature2}`;
      }
      verify(token) {
        try {
          const parts = token.split(".");
          if (parts.length !== 3) return { valid: false, error: "malformed" };
          const [encodedHeader, encodedPayload, signature2] = parts;
          const signed = `${encodedHeader}.${encodedPayload}`;
          const expected = sign(signed);
          const expectedBuffer = Buffer.from(expected, "base64url");
          const signatureBuffer = Buffer.from(signature2, "base64url");
          if (signatureBuffer.length !== expectedBuffer.length || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
            return { valid: false, error: "invalid signature" };
          }
          const payloadJson = Buffer.from(encodedPayload, "base64").toString("utf8");
          const payload = JSON.parse(payloadJson);
          if (payload.iss !== this.issuer) return { valid: false, error: "invalid_issuer" };
          const now = Math.floor(Date.now() / 1e3);
          if (payload.exp && now > payload.exp) return { valid: false, error: "expired" };
          return { valid: true, payload };
        } catch (err) {
          return { valid: false, error: err?.message ?? "invalid token" };
        }
      }
    };
    auth_token_service_default = new TokenService();
  }
});

// ../backend/src/services/auth-hash-service.ts
import { argon2Verify, argon2id } from "hash-wasm";
var HashService, auth_hash_service_default;
var init_auth_hash_service = __esm({
  "../backend/src/services/auth-hash-service.ts"() {
    "use strict";
    HashService = class {
      async hash(password) {
        return argon2id({
          password,
          salt: crypto.getRandomValues(new Uint8Array(16)),
          parallelism: 1,
          iterations: 3,
          memorySize: 2 ** 16,
          hashLength: 32,
          outputType: "encoded"
        });
      }
      async verify(password, stored) {
        try {
          return await argon2Verify({ password, hash: stored });
        } catch {
          return false;
        }
      }
    };
    auth_hash_service_default = new HashService();
  }
});

// ../backend/src/repositories/password-history-repository.ts
var PasswordHistoryRepository, password_history_repository_default;
var init_password_history_repository = __esm({
  "../backend/src/repositories/password-history-repository.ts"() {
    "use strict";
    init_prisma_service();
    PasswordHistoryRepository = class {
      client = prisma_service_default.getClient();
      async addPasswordHistory(userId, hash) {
        const meta = JSON.stringify({ type: "password-history", hash, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
        return this.client.securityLog.create({ data: { userId, event: "password_history", severity: "INFO", meta } });
      }
      async recentHashes(userId, limit = 5) {
        const logs = await this.client.securityLog.findMany({ where: { userId, event: "password_history" }, orderBy: { createdAt: "desc" }, take: limit });
        return logs.map((l) => {
          try {
            const m = JSON.parse(l.meta ?? "{}");
            return m.hash;
          } catch (e) {
            return void 0;
          }
        }).filter(Boolean);
      }
    };
    password_history_repository_default = new PasswordHistoryRepository();
  }
});

// ../backend/src/services/auth-password-service.ts
var PasswordService, auth_password_service_default;
var init_auth_password_service = __esm({
  "../backend/src/services/auth-password-service.ts"() {
    "use strict";
    init_auth_hash_service();
    init_password_history_repository();
    PasswordService = class {
      // Validate password strength according to simple rules. Extend per OWASP as needed.
      validateStrength(password) {
        const reasons = [];
        if (password.length < 12) reasons.push("too_short");
        if (!/[A-Z]/.test(password)) reasons.push("missing_uppercase");
        if (!/[a-z]/.test(password)) reasons.push("missing_lowercase");
        if (!/[0-9]/.test(password)) reasons.push("missing_number");
        if (!/[`~!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) reasons.push("missing_symbol");
        return { valid: reasons.length === 0, reasons };
      }
      async hash(password) {
        return auth_hash_service_default.hash(password);
      }
      async verify(password, hash) {
        return auth_hash_service_default.verify(password, hash);
      }
      // Password history: check recent password hashes to prevent reuse
      async checkPasswordHistory(userId, password) {
        const recent = await password_history_repository_default.recentHashes(userId, 5);
        for (const h of recent) {
          try {
            const ok = await auth_hash_service_default.verify(password, h);
            if (ok) return false;
          } catch (e) {
          }
        }
        return true;
      }
      async addToHistory(userId, hashed) {
        await password_history_repository_default.addPasswordHistory(userId, hashed);
      }
    };
    auth_password_service_default = new PasswordService();
  }
});

// ../backend/src/common/security/rate-limiter.ts
var RateLimiter, rate_limiter_default;
var init_rate_limiter = __esm({
  "../backend/src/common/security/rate-limiter.ts"() {
    "use strict";
    RateLimiter = class {
      buckets = /* @__PURE__ */ new Map();
      capacity;
      refillPerSecond;
      constructor(capacity = 10, refillPerSecond = 1) {
        this.capacity = capacity;
        this.refillPerSecond = refillPerSecond;
      }
      check(key) {
        const now = Date.now();
        const b = this.buckets.get(key) ?? { tokens: this.capacity, last: now };
        const delta = (now - b.last) / 1e3;
        b.tokens = Math.min(this.capacity, b.tokens + delta * this.refillPerSecond);
        b.last = now;
        if (b.tokens < 1) {
          this.buckets.set(key, b);
          return false;
        }
        b.tokens -= 1;
        this.buckets.set(key, b);
        return true;
      }
    };
    rate_limiter_default = new RateLimiter(Number(process.env.RATE_LIMIT_CAPACITY ?? 10), Number(process.env.RATE_LIMIT_REFILL ?? 1));
  }
});

// ../backend/src/repositories/refresh-token-repository.ts
var refresh_token_repository_exports = {};
__export(refresh_token_repository_exports, {
  RefreshTokenRepository: () => RefreshTokenRepository,
  default: () => refresh_token_repository_default
});
import crypto2 from "crypto";
var RefreshTokenRepository, refresh_token_repository_default;
var init_refresh_token_repository = __esm({
  "../backend/src/repositories/refresh-token-repository.ts"() {
    "use strict";
    init_prisma_service();
    RefreshTokenRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = crypto2.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
      }
      async revokeByHash(token) {
        const tokenHash = crypto2.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
      }
      async findByHash(token) {
        const tokenHash = crypto2.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.findFirst({ where: { tokenHash } });
      }
      async rotate(oldToken, newToken, expiresAt) {
        const oldHash = crypto2.createHash("sha256").update(oldToken).digest("hex");
        const old = await this.client.refreshToken.findFirst({ where: { tokenHash: oldHash } });
        if (!old) return null;
        await this.client.refreshToken.updateMany({ where: { tokenHash: oldHash }, data: { revoked: true } });
        return this.create(old.userId, newToken, expiresAt);
      }
    };
    refresh_token_repository_default = new RefreshTokenRepository();
  }
});

// ../backend/src/repositories/password-reset-repository.ts
import crypto4 from "crypto";
var PasswordResetRepository, password_reset_repository_default;
var init_password_reset_repository = __esm({
  "../backend/src/repositories/password-reset-repository.ts"() {
    "use strict";
    init_prisma_service();
    PasswordResetRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = crypto4.createHash("sha256").update(token).digest("hex");
        return this.client.passwordReset.create({ data: { userId, tokenHash, expiresAt } });
      }
      async findValidByToken(token) {
        const tokenHash = crypto4.createHash("sha256").update(token).digest("hex");
        return this.client.passwordReset.findFirst({ where: { tokenHash, used: false, expiresAt: { gt: /* @__PURE__ */ new Date() } } });
      }
      async markUsed(id) {
        return this.client.passwordReset.update({ where: { id }, data: { used: true } });
      }
    };
    password_reset_repository_default = new PasswordResetRepository();
  }
});

// ../backend/src/services/auth-reset-service.ts
var auth_reset_service_exports = {};
__export(auth_reset_service_exports, {
  AuthResetService: () => AuthResetService,
  default: () => auth_reset_service_default
});
var AuthResetService, auth_reset_service_default;
var init_auth_reset_service = __esm({
  "../backend/src/services/auth-reset-service.ts"() {
    "use strict";
    init_auth_token_service();
    init_password_reset_repository();
    init_auth_password_service();
    init_prisma_service();
    init_rate_limiter();
    init_errors();
    AuthResetService = class {
      // generate forgot-password token (longer TTL)
      async generateResetTokenByEmail(email, expiresInSec = 60 * 60) {
        if (!rate_limiter_default.check(`forgot:${email}`)) throw new RateLimitError("rate_limited");
        const client = prisma_service_default.getClient();
        const user = await client.user.findFirst({ where: { email } });
        if (!user) return "";
        const token = auth_token_service_default.createRefreshToken(user.id, void 0, { purpose: "password_reset" }, expiresInSec);
        await password_reset_repository_default.create(user.id, token, new Date(Date.now() + expiresInSec * 1e3));
        return token;
      }
      async verifyResetToken(token) {
        const v = auth_token_service_default.verify(token);
        if (!v.valid || !v.payload) return { valid: false, error: v.error };
        if (v.payload.purpose !== "password_reset") return { valid: false, error: "invalid_purpose" };
        const rec = await password_reset_repository_default.findValidByToken(token);
        if (!rec) return { valid: false, error: "invalid_or_expired" };
        return { valid: true, payload: v.payload, record: rec };
      }
      async resetPassword(token, newPassword) {
        const check = await this.verifyResetToken(token);
        if (!check.valid || !check.payload || !check.record) throw new Error(check.error ?? "invalid_token");
        const userId = check.payload.sub;
        const strength = auth_password_service_default.validateStrength(newPassword);
        if (!strength.valid) throw new Error("weak_password");
        const okHistory = await auth_password_service_default.checkPasswordHistory(userId, newPassword);
        if (!okHistory) throw new Error("password_reuse");
        const hashed = await auth_password_service_default.hash(newPassword);
        const client = prisma_service_default.getClient();
        await client.user.update({ where: { id: userId }, data: { passwordHash: hashed } });
        await auth_password_service_default.addToHistory(userId, hashed);
        await password_reset_repository_default.markUsed(check.record.id);
        return true;
      }
    };
    auth_reset_service_default = new AuthResetService();
  }
});

// ../backend/src/repositories/email-verification-repository.ts
import crypto5 from "crypto";
var EmailVerificationRepository, email_verification_repository_default;
var init_email_verification_repository = __esm({
  "../backend/src/repositories/email-verification-repository.ts"() {
    "use strict";
    init_prisma_service();
    EmailVerificationRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = crypto5.createHash("sha256").update(token).digest("hex");
        return this.client.emailVerification.create({ data: { userId, tokenHash, expiresAt } });
      }
      async verify(token) {
        const tokenHash = crypto5.createHash("sha256").update(token).digest("hex");
        const rec = await this.client.emailVerification.findFirst({ where: { tokenHash, verified: false, expiresAt: { gt: /* @__PURE__ */ new Date() } } });
        if (!rec) return null;
        await this.client.emailVerification.update({ where: { id: rec.id }, data: { verified: true } });
        return rec;
      }
    };
    email_verification_repository_default = new EmailVerificationRepository();
  }
});

// ../backend/src/services/auth-email-verification-service.ts
var auth_email_verification_service_exports = {};
__export(auth_email_verification_service_exports, {
  EmailVerificationService: () => EmailVerificationService,
  default: () => auth_email_verification_service_default
});
var EmailVerificationService, auth_email_verification_service_default;
var init_auth_email_verification_service = __esm({
  "../backend/src/services/auth-email-verification-service.ts"() {
    "use strict";
    init_auth_token_service();
    init_email_verification_repository();
    init_prisma_service();
    EmailVerificationService = class {
      repo = email_verification_repository_default;
      async generateVerificationToken(userId, expiresInSec = 60 * 60 * 24) {
        const token = auth_token_service_default.createRefreshToken(userId, void 0, { purpose: "email_verification" }, expiresInSec);
        const parsed = auth_token_service_default.verify(token);
        const jti = parsed.payload?.jti;
        await this.repo.create(userId, token, new Date(Date.now() + expiresInSec * 1e3));
        return token;
      }
      async verifyToken(token) {
        const v = auth_token_service_default.verify(token);
        if (!v.valid || !v.payload) return { valid: false, error: v.error };
        const rec = await this.repo.verify(token);
        if (!rec) return { valid: false, error: "invalid_or_expired" };
        return { valid: true, payload: v.payload };
      }
      async activateAccount(token) {
        const v = await this.verifyToken(token);
        if (!v.valid || !v.payload) return false;
        const userId = v.payload.sub;
        const client = prisma_service_default.getClient();
        await client.user.update({ where: { id: userId }, data: { isVerified: true, isActive: true } });
        return true;
      }
    };
    auth_email_verification_service_default = new EmailVerificationService();
  }
});

// ../backend/src/api/status.ts
var HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
};

// ../backend/src/api/response-builder.ts
function createMeta(context) {
  return {
    timestamp: context.timestamp,
    requestId: context.requestId,
    version: context.version,
    locale: context.locale
  };
}
function success(data, context) {
  return {
    statusCode: HTTP_STATUS.OK,
    body: {
      success: true,
      data,
      meta: createMeta(context)
    }
  };
}
function created(data, context) {
  return {
    statusCode: HTTP_STATUS.CREATED,
    body: {
      success: true,
      data,
      meta: createMeta(context)
    }
  };
}
function noContent(context) {
  return {
    statusCode: HTTP_STATUS.NO_CONTENT,
    body: {
      success: true,
      data: null,
      meta: createMeta(context)
    }
  };
}
function unauthorized(message, context) {
  return errorResponse("unauthorized", message, HTTP_STATUS.UNAUTHORIZED, context);
}
function forbidden(message, context) {
  return errorResponse("forbidden", message, HTTP_STATUS.FORBIDDEN, context);
}
function notFound(message, context) {
  return errorResponse("not_found", message, HTTP_STATUS.NOT_FOUND, context);
}
function conflict(message, context) {
  return errorResponse("conflict", message, HTTP_STATUS.CONFLICT, context);
}
function validationError(message, context) {
  return errorResponse("validation_error", message, HTTP_STATUS.UNPROCESSABLE_ENTITY, context);
}
function internalError(message, context) {
  return errorResponse("internal_error", message, HTTP_STATUS.INTERNAL_SERVER_ERROR, context);
}
function errorResponse(code, message, statusCode, context) {
  return {
    statusCode,
    body: {
      success: false,
      error: {
        code,
        message
      },
      meta: createMeta(context)
    }
  };
}
function paginated(data, page, limit, total, context) {
  return {
    statusCode: HTTP_STATUS.OK,
    body: {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1)))
      },
      meta: createMeta(context)
    }
  };
}

// ../backend/src/routes/metadata.ts
function createRouteMetadata(name, path3, version, options = {}) {
  const middleware = options.middleware ? [...options.middleware] : [];
  const tags = options.tags ? [...options.tags] : [];
  const requiredPermissions = options.requiredPermissions ? [...options.requiredPermissions] : [];
  const requiredRoles = options.requiredRoles ? [...options.requiredRoles] : [];
  const metadata = {
    name,
    path: path3,
    version,
    mode: options.mode ?? "private",
    tags,
    authenticationRequired: options.authenticationRequired ?? true,
    authorizationRequired: options.authorizationRequired ?? false,
    publicRoute: options.publicRoute ?? false,
    privateRoute: options.privateRoute ?? true,
    requiredPermissions,
    requiredRoles,
    requiredScope: options.requiredScope,
    requireAllPermissions: options.requireAllPermissions ?? false,
    tenantScope: options.tenantScope,
    middleware
  };
  return Object.freeze(metadata);
}

// ../backend/src/routes/registry.ts
var RouteRegistry = class {
  routes = /* @__PURE__ */ new Map();
  versions = /* @__PURE__ */ new Map();
  tags = /* @__PURE__ */ new Map();
  middlewarePipeline = [];
  register(route) {
    const key = this.createKey(route.method, route.path, route.version);
    this.routes.set(key, route);
    this.addToIndex(this.versions, route.version, route);
    for (const tag of route.metadata.tags) {
      this.addToIndex(this.tags, tag, route);
    }
    return route;
  }
  registerGroup(group) {
    const definitions = [];
    const resolvedVersion = group.version ?? "v1";
    const prefix = group.prefix.startsWith("/") ? group.prefix : `/${group.prefix}`;
    for (const route of group.routes) {
      const normalizedPath = this.normalizePath(prefix, route.path);
      const metadata = createRouteMetadata(route.name, normalizedPath, resolvedVersion, {
        ...route.metadata,
        ...group.metadata,
        name: route.name,
        path: normalizedPath,
        version: resolvedVersion
      });
      const definition = {
        ...route,
        path: normalizedPath,
        version: resolvedVersion,
        metadata
      };
      this.register(definition);
      definitions.push(definition);
    }
    return definitions;
  }
  registerMiddleware(middlewareName) {
    this.middlewarePipeline.push(middlewareName);
  }
  getMiddlewarePipeline() {
    return [...this.middlewarePipeline];
  }
  all() {
    return Array.from(this.routes.values());
  }
  findByName(name) {
    return Array.from(this.routes.values()).find((route) => route.name === name);
  }
  findByPath(method, path3, version) {
    const candidates = Array.from(this.routes.values()).filter((route) => route.method === method && route.path === path3);
    if (candidates.length > 0) {
      if (!version) return candidates[0];
      return candidates.find((route) => route.version === version) ?? candidates[0];
    }
    const methodCandidates = Array.from(this.routes.values()).filter((route) => route.method === method);
    for (const route of methodCandidates) {
      const routeParts = route.path.split("/").filter(Boolean);
      const pathParts = path3.split("/").filter(Boolean);
      if (routeParts.length !== pathParts.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < routeParts.length; i++) {
        const rp = routeParts[i];
        const pp = pathParts[i];
        if (rp.startsWith(":")) {
          const name = rp.substring(1);
          params[name] = decodeURIComponent(pp);
        } else if (rp !== pp) {
          matched = false;
          break;
        }
      }
      if (matched) {
        const copy = { ...route, runtimeParams: params };
        if (!version) return copy;
        if (copy.version === version) return copy;
      }
    }
    return void 0;
  }
  findByVersion(version) {
    return [...this.versions.get(version) ?? []];
  }
  findByTag(tag) {
    return [...this.tags.get(tag) ?? []];
  }
  createKey(method, path3, version) {
    return `${method}:${version}:${path3}`;
  }
  normalizePath(prefix, path3) {
    const normalizedPath = path3.startsWith("/") ? path3 : `/${path3}`;
    return `${prefix}${normalizedPath}`;
  }
  addToIndex(map, key, route) {
    const existing = map.get(key) ?? [];
    existing.push(route);
    map.set(key, existing);
  }
};

// ../backend/src/routes/builder.ts
var RouterBuilder = class {
  registry = new RouteRegistry();
  middlewarePipeline = [];
  register(definition) {
    const version = definition.version ?? "v1";
    const metadata = createRouteMetadata(definition.name, definition.path, version, {
      ...definition.options,
      middleware: [...definition.options?.middleware ?? [], ...this.middlewarePipeline]
    });
    const route = {
      name: definition.name,
      method: definition.method,
      path: definition.path,
      version,
      handler: definition.handler,
      metadata
    };
    return this.registry.register(route);
  }
  registerGroup(group) {
    return this.registry.registerGroup(group);
  }
  registerVersion(version) {
    this.middlewarePipeline.push(`version:${version}`);
    return this;
  }
  registerMiddleware(middlewareName) {
    this.middlewarePipeline.push(middlewareName);
    return this;
  }
  getRegistry() {
    return this.registry;
  }
  build() {
    return this.registry.all();
  }
};

// ../backend/src/routes/resolver.ts
var RouteResolver = class {
  resolve(registry, request4) {
    return registry.findByPath(request4.method, request4.path, request4.version);
  }
  resolveByName(registry, name) {
    return registry.findByName(name);
  }
  resolveByVersion(registry, version) {
    return registry.findByVersion(version);
  }
  resolveByTag(registry, tag) {
    return registry.findByTag(tag);
  }
};

// ../backend/src/modules/auth/controller.ts
init_errors();

// ../backend/src/validation/errors.ts
var ValidationException = class _ValidationException extends Error {
  code;
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, _ValidationException.prototype);
  }
};
var InvalidRequestError = class _InvalidRequestError extends ValidationException {
  constructor(message) {
    super("invalid_request", message ?? "invalid_request");
    Object.setPrototypeOf(this, _InvalidRequestError.prototype);
  }
};

// ../backend/src/validation/engine.ts
var ValidationEngine = class {
  validate(value, validator, context) {
    return validator.validate(value, context);
  }
  async validateAsync(value, validator, context) {
    if (validator.validateAsync) {
      return validator.validateAsync(value, context);
    }
    return this.validate(value, validator, context);
  }
  validateOrThrow(value, validator, context) {
    const result = this.validate(value, validator, context);
    if (!result.valid) {
      throw new InvalidRequestError(result.errors.map((error) => error.message).join(", "));
    }
    return value;
  }
  composeValidators(...validators) {
    return {
      validate: (value, context) => {
        const errors = [];
        for (const validator of validators) {
          const result = this.evaluateCompositeValidator(validator, value, context);
          if (!result.valid) {
            errors.push(...result.errors);
          }
        }
        return { valid: errors.length === 0, errors };
      }
    };
  }
  composeRules(...rules) {
    return {
      name: "composed",
      validate: (context) => {
        const errors = [];
        for (const rule of rules) {
          const result = rule.validate(context);
          if (!result.valid) {
            errors.push(...result.errors);
          }
        }
        return { valid: errors.length === 0, errors };
      }
    };
  }
  evaluateCompositeValidator(validator, value, context) {
    const isValidator = "validate" in validator && typeof validator.validate === "function" && validator.validate.length > 1;
    if (isValidator) {
      return validator.validate(value, context);
    }
    return validator.validate({ value, ...context });
  }
};
var engine_default = new ValidationEngine();

// ../backend/src/modules/auth/controller.ts
init_prisma_service();

// ../backend/src/services/auth-service.ts
init_auth_token_service();

// ../backend/src/repositories/session-repository.ts
init_prisma_service();
var SessionRepository = class {
  client = prisma_service_default.getClient();
  async create(userId, token, ip, ua, expiresAt) {
    return this.client.session.create({ data: { userId, token, ipAddress: ip, userAgent: ua, expiresAt } });
  }
  async revokeByToken(token) {
    return this.client.session.updateMany({ where: { token }, data: { revoked: true } });
  }
  async findByToken(token) {
    return this.client.session.findFirst({ where: { token } });
  }
  async findActiveByToken(token) {
    return this.client.session.findFirst({ where: { token, revoked: false, expiresAt: { gt: /* @__PURE__ */ new Date() } } });
  }
  async rotate(oldToken, newToken, expiresAt) {
    const old = await this.client.session.findFirst({ where: { token: oldToken } });
    if (!old) return null;
    await this.client.session.updateMany({ where: { token: oldToken }, data: { revoked: true } });
    return this.create(old.userId, newToken, old.ipAddress ?? void 0, old.userAgent ?? void 0, expiresAt);
  }
};
var session_repository_default = new SessionRepository();

// ../backend/src/services/auth-session-service.ts
var SessionService = class {
  repo = session_repository_default;
  async createSession(userId, jti, ttlSeconds, deviceId) {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1e3);
    return this.repo.create(userId, jti, void 0, void 0, expiresAt);
  }
  async revokeSession(jti) {
    await this.repo.revokeByToken(jti);
  }
  async rotateSession(oldJti, newJti, ttlSeconds) {
    const expiresAt = new Date(Date.now() + ttlSeconds * 1e3);
    return this.repo.rotate(oldJti, newJti, expiresAt);
  }
  async getSession(jti) {
    return this.repo.findByToken(jti);
  }
  async isRevoked(jti) {
    const rec = await this.repo.findActiveByToken(jti);
    return !rec;
  }
};
var auth_session_service_default = new SessionService();

// ../backend/src/services/auth-service.ts
init_auth_password_service();

// ../backend/src/repositories/device-repository.ts
init_prisma_service();
var DeviceRepository = class {
  client = prisma_service_default.getClient();
  async upsertDevice(userId, deviceId, name) {
    return this.client.device.upsert({
      where: { userId_deviceId: { userId, deviceId } },
      update: { name, lastSeenAt: /* @__PURE__ */ new Date() },
      create: { userId, deviceId, name, lastSeenAt: /* @__PURE__ */ new Date() }
    });
  }
  async markTrusted(userId, deviceId, trusted = true) {
    const dev = await this.client.device.updateMany({ where: { userId, deviceId }, data: { lastSeenAt: /* @__PURE__ */ new Date() } });
    return dev;
  }
  async listDevicesForUser(userId) {
    return this.client.device.findMany({ where: { userId } });
  }
};
var device_repository_default = new DeviceRepository();

// ../backend/src/services/auth-device-service.ts
var DeviceService = class {
  repo = device_repository_default;
  async registerDevice(userId, deviceId, name, trusted = false) {
    return this.repo.upsertDevice(userId, deviceId, name);
  }
  async getDevice(deviceId) {
    const devices = await this.repo.listDevicesForUser("");
    return devices.find((d) => d.deviceId === deviceId) ?? null;
  }
  async markTrusted(deviceId, trusted = true) {
    await this.repo.markTrusted("", deviceId, trusted);
  }
  async listDevicesForUser(userId) {
    return this.repo.listDevicesForUser(userId);
  }
};
var auth_device_service_default = new DeviceService();

// ../backend/src/services/auth-service.ts
init_auth_constants();

// ../backend/src/repositories/login-history-repository.ts
init_prisma_service();
var LoginHistoryRepository = class {
  client = prisma_service_default.getClient();
  async record(userId, email, ip, ua, success2, reason) {
    return this.client.loginHistory.create({ data: { userId, email, ipAddress: ip, userAgent: ua, success: success2, reason } });
  }
  async recentFailedCountByUser(userId, sinceMinutes = 15) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1e3);
    const count = await this.client.loginHistory.count({ where: { userId, success: false, createdAt: { gt: since } } });
    return count;
  }
  async recentFailedCountByEmail(email, sinceMinutes = 15) {
    const since = new Date(Date.now() - sinceMinutes * 60 * 1e3);
    const count = await this.client.loginHistory.count({ where: { email, success: false, createdAt: { gt: since } } });
    return count;
  }
};
var login_history_repository_default = new LoginHistoryRepository();

// ../backend/src/repositories/token-blacklist-repository.ts
init_prisma_service();
var TokenBlacklistRepository = class {
  client = prisma_service_default.getClient();
  async addBlacklistByJti(userId, jti, reason = "revoked") {
    const meta = JSON.stringify({ type: "token-blacklist", jti, reason, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    return this.client.securityLog.create({ data: { userId, event: "token_blacklist", severity: "WARN", meta } });
  }
  async isBlacklistedByJti(jti) {
    const rec = await this.client.securityLog.findFirst({ where: { event: "token_blacklist", meta: { contains: jti } } });
    return !!rec;
  }
  async addBlacklistByHash(userId, tokenHash, reason = "revoked") {
    const meta = JSON.stringify({ type: "token-blacklist", tokenHash, reason, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    return this.client.securityLog.create({ data: { userId, event: "token_blacklist", severity: "WARN", meta } });
  }
  async isBlacklistedByHash(tokenHash) {
    const rec = await this.client.securityLog.findFirst({ where: { event: "token_blacklist", meta: { contains: tokenHash } } });
    return !!rec;
  }
};
var token_blacklist_repository_default = new TokenBlacklistRepository();

// ../backend/src/services/auth-audit-service.ts
init_prisma_service();
var AuthAuditService = class {
  loginRepo = login_history_repository_default;
  tokenBlacklist = token_blacklist_repository_default;
  client = prisma_service_default.getClient();
  async recordLoginAttempt(userId, email, ip, ua, success2 = false, reason) {
    await this.loginRepo.record(userId, email, ip, ua, success2, reason);
  }
  async lockAccount(userId, reason = "too_many_failed_logins") {
    const meta = JSON.stringify({ type: "account_lock", reason, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    await this.client.securityLog.create({ data: { userId, event: "account_locked", severity: "WARN", meta } });
  }
  async isAccountLocked(userId) {
    const rec = await this.client.securityLog.findFirst({ where: { userId, event: "account_locked" }, orderBy: { createdAt: "desc" } });
    if (!rec) return false;
    const ttl = Number(process.env.ACCOUNT_LOCK_TTL_MINUTES ?? 30);
    const created2 = rec.createdAt;
    if (!created2) return true;
    const unlockedAt = new Date(created2.getTime() + ttl * 60 * 1e3);
    return unlockedAt > /* @__PURE__ */ new Date();
  }
  async blacklistRefreshTokenByHash(userId, tokenHash) {
    await this.tokenBlacklist.addBlacklistByHash(userId, tokenHash, "manual_blacklist");
  }
};
var auth_audit_service_default = new AuthAuditService();

// ../backend/src/repositories/base-repository.ts
init_prisma_service();
var BaseRepository = class {
  client = prisma_service_default.getClient();
  modelName;
  constructor(modelName) {
    this.modelName = modelName;
  }
  get model() {
    return this.client[this.modelName];
  }
  async findById(id) {
    const result = await this.model.findUnique({ where: { id } });
    return result ?? null;
  }
  async findMany(filter) {
    const where = filter ?? {};
    const results = await this.model.findMany({ where });
    return results ?? [];
  }
  async create(data) {
    return this.model.create({ data });
  }
  async update(id, data) {
    return this.model.update({ where: { id }, data });
  }
  async delete(id) {
    try {
      await this.model.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
    } catch (err) {
      await this.model.delete({ where: { id } });
    }
  }
  async restore(id) {
    return this.model.update({ where: { id }, data: { deletedAt: null } });
  }
  async exists(id) {
    const count = await this.model.count({ where: { id } });
    return count > 0;
  }
  async count(filter) {
    const where = filter ?? {};
    return this.model.count({ where });
  }
  async paginate(options) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 25));
    const skip = (page - 1) * limit;
    const rawWhere = options.filters ?? {};
    const cleanWhere = (obj) => {
      if (obj == null) return {};
      if (Array.isArray(obj)) {
        const arr = obj.map(cleanWhere).filter((x) => {
          return !(x && typeof x === "object" && Object.keys(x).length === 0);
        });
        return arr.length > 0 ? arr : void 0;
      }
      if (typeof obj !== "object") return obj;
      const out = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v === void 0) continue;
        if ((k === "AND" || k === "OR" || k === "NOT") && Array.isArray(v)) {
          const cleaned = cleanWhere(v);
          if (cleaned !== void 0 && cleaned.length > 0) out[k] = cleaned;
        } else if (v && typeof v === "object") {
          const cleaned = cleanWhere(v);
          if (cleaned !== void 0 && (typeof cleaned !== "object" || Object.keys(cleaned).length > 0)) {
            out[k] = cleaned;
          }
        } else if (v !== void 0) {
          out[k] = v;
        }
      }
      return Object.keys(out).length > 0 ? out : void 0;
    };
    const where = cleanWhere(rawWhere) ?? {};
    const orderBy = options.sort && (options.order === "asc" || options.order === "desc") ? { [options.sort]: options.order } : void 0;
    let data = [];
    let total = 0;
    try {
      const res = await Promise.all([
        this.model.findMany({ where, skip, take: limit, orderBy }),
        this.model.count({ where })
      ]);
      data = res[0] ?? [];
      total = res[1] ?? 0;
    } catch (err) {
      const debug = { where, orderBy, skip, take: limit };
      const msg = `paginate_error: ${err?.message ?? "unknown"} -- query: ${JSON.stringify(debug)}`;
      throw new Error(msg);
    }
    return {
      data,
      total,
      page,
      limit
    };
  }
};
var base_repository_default = BaseRepository;

// ../backend/src/repositories/exceptions.ts
var DatabaseException = class extends Error {
  constructor(message) {
    super(message ?? "Database error");
    this.name = "DatabaseException";
  }
};
var NotFoundException = class extends Error {
  constructor(message) {
    super(message ?? "Resource not found");
    this.name = "NotFoundException";
  }
};
var ConflictException = class extends Error {
  constructor(message) {
    super(message ?? "Conflict");
    this.name = "ConflictException";
  }
};
var ValidationException2 = class extends Error {
  constructor(message) {
    super(message ?? "Validation failed");
    this.name = "ValidationException";
  }
};

// ../backend/src/repositories/notification-repository.ts
var NotificationRepository = class extends base_repository_default {
  constructor() {
    super("notification");
  }
  async createNotification(data) {
    return this.client.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        body: data.body,
        channel: data.channel ?? "SYSTEM",
        read: false,
        payload: data.payload ? JSON.stringify(data.payload) : null
      }
    });
  }
  async createForManagementUsers(data) {
    const managementUsers = await this.client.user.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        roles: {
          some: {
            role: {
              name: { in: ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"] },
              deletedAt: null
            }
          }
        }
      },
      select: { id: true }
    });
    if (managementUsers.length === 0) return 0;
    const result = await this.client.notification.createMany({
      data: managementUsers.map((user) => ({
        userId: user.id,
        title: data.title,
        body: data.body,
        channel: data.channel ?? "admin",
        read: false,
        payload: data.payload ? JSON.stringify(data.payload) : null
      }))
    });
    return result.count;
  }
  async findUserNotifications(userId, limit = 30) {
    const [items, unreadCount] = await Promise.all([
      this.client.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit
      }),
      this.client.notification.count({
        where: { userId, read: false }
      })
    ]);
    return {
      items,
      unreadCount
    };
  }
  async getUnreadCount(userId) {
    return this.client.notification.count({
      where: { userId, read: false }
    });
  }
  async markAsRead(notificationId, userId) {
    const existing = await this.client.notification.findUnique({
      where: { id: notificationId }
    });
    if (!existing || existing.userId !== userId) {
      throw new NotFoundException("notification_not_found");
    }
    return this.client.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
  async markAllAsRead(userId) {
    const result = await this.client.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
    return result.count;
  }
};
var notification_repository_default = NotificationRepository;

// ../backend/src/services/auth-service.ts
init_rate_limiter();
init_prisma_service();
init_errors();
import crypto3 from "crypto";

// ../backend/src/rbac/constants.ts
var MODULE_SCOPES = {
  users: "tenant",
  roles: "tenant",
  permissions: "tenant",
  products: "tenant",
  categories: "tenant",
  inventory: "tenant",
  orders: "tenant",
  customers: "tenant",
  branches: "tenant",
  stores: "tenant",
  suppliers: "tenant",
  payments: "tenant",
  reports: "tenant",
  settings: "tenant",
  audit: "tenant",
  notifications: "tenant",
  carts: "tenant",
  delivery: "tenant"
};
function createPermissionDefinition(module, action, description) {
  return {
    key: `${module}:${action}`,
    module,
    action,
    scope: MODULE_SCOPES[module],
    description
  };
}
function createPermissionMap(module, descriptions) {
  return {
    create: createPermissionDefinition(module, "create", descriptions.create),
    read: createPermissionDefinition(module, "read", descriptions.read),
    update: createPermissionDefinition(module, "update", descriptions.update),
    delete: createPermissionDefinition(module, "delete", descriptions.delete),
    list: createPermissionDefinition(module, "list", descriptions.list)
  };
}
var PERMISSION_DEFINITIONS = {
  users: createPermissionMap("users", {
    create: "Create users",
    read: "Read users",
    update: "Update users",
    delete: "Delete users",
    list: "List users"
  }),
  roles: createPermissionMap("roles", {
    create: "Create roles",
    read: "Read roles",
    update: "Update roles",
    delete: "Delete roles",
    list: "List roles"
  }),
  permissions: createPermissionMap("permissions", {
    create: "Create permissions",
    read: "Read permissions",
    update: "Update permissions",
    delete: "Delete permissions",
    list: "List permissions"
  }),
  products: createPermissionMap("products", {
    create: "Create products",
    read: "Read products",
    update: "Update products",
    delete: "Delete products",
    list: "List products"
  }),
  categories: createPermissionMap("categories", {
    create: "Create categories",
    read: "Read categories",
    update: "Update categories",
    delete: "Delete categories",
    list: "List categories"
  }),
  inventory: createPermissionMap("inventory", {
    create: "Create inventory records",
    read: "Read inventory records",
    update: "Update inventory records",
    delete: "Delete inventory records",
    list: "List inventory records"
  }),
  orders: createPermissionMap("orders", {
    create: "Create orders",
    read: "Read orders",
    update: "Update orders",
    delete: "Delete orders",
    list: "List orders"
  }),
  customers: createPermissionMap("customers", {
    create: "Create customers",
    read: "Read customers",
    update: "Update customers",
    delete: "Delete customers",
    list: "List customers"
  }),
  branches: createPermissionMap("branches", {
    create: "Create branches",
    read: "Read branches",
    update: "Update branches",
    delete: "Delete branches",
    list: "List branches"
  }),
  stores: createPermissionMap("stores", {
    create: "Create stores",
    read: "Read stores",
    update: "Update stores",
    delete: "Delete stores",
    list: "List stores"
  }),
  suppliers: createPermissionMap("suppliers", {
    create: "Create suppliers",
    read: "Read suppliers",
    update: "Update suppliers",
    delete: "Delete suppliers",
    list: "List suppliers"
  }),
  payments: createPermissionMap("payments", {
    create: "Create payments",
    read: "Read payments",
    update: "Update payments",
    delete: "Delete payments",
    list: "List payments"
  }),
  reports: createPermissionMap("reports", {
    create: "Create reports",
    read: "Read reports",
    update: "Update reports",
    delete: "Delete reports",
    list: "List reports"
  }),
  settings: createPermissionMap("settings", {
    create: "Create settings",
    read: "Read settings",
    update: "Update settings",
    delete: "Delete settings",
    list: "List settings"
  }),
  audit: createPermissionMap("audit", {
    create: "Create audit entries",
    read: "Read audit entries",
    update: "Update audit entries",
    delete: "Delete audit entries",
    list: "List audit entries"
  }),
  notifications: createPermissionMap("notifications", {
    create: "Create notifications",
    read: "Read notifications",
    update: "Update notifications",
    delete: "Delete notifications",
    list: "List notifications"
  }),
  carts: createPermissionMap("carts", {
    create: "Create cart items",
    read: "Read cart",
    update: "Update cart items",
    delete: "Delete cart items",
    list: "List cart items"
  }),
  delivery: createPermissionMap("delivery", {
    create: "Create delivery records",
    read: "Read delivery records",
    update: "Update delivery records",
    delete: "Delete delivery records",
    list: "List delivery records"
  })
};
var PERMISSION_GROUPS = Object.entries(PERMISSION_DEFINITIONS).map(
  ([module, definitions]) => ({
    module,
    scope: MODULE_SCOPES[module],
    permissions: Object.values(definitions)
  })
);
var PERMISSION_REGISTRY = PERMISSION_GROUPS.reduce(
  (registry, group) => {
    for (const permission of group.permissions) {
      registry[permission.key] = permission;
    }
    return registry;
  },
  {}
);
var ALL_PERMISSIONS = Object.keys(PERMISSION_REGISTRY);
function createRoleDefinition(name, description, permissions) {
  return {
    name,
    description,
    scope: "tenant",
    permissions
  };
}
function getModulePermissions(module) {
  return Object.values(PERMISSION_DEFINITIONS[module]).map((permission) => permission.key);
}
function getPermissionsForModules(modules) {
  return modules.flatMap((module) => getModulePermissions(module));
}
function getPermissionsForModuleActions(module, actions) {
  return Object.values(PERMISSION_DEFINITIONS[module]).filter((permission) => actions.includes(permission.action)).map((permission) => permission.key);
}
var ROLE_DEFINITIONS = [
  createRoleDefinition("SUPER_ADMIN", "Full access across every module", [...ALL_PERMISSIONS]),
  createRoleDefinition("ADMIN", "Administrative access with audit excluded", ALL_PERMISSIONS.filter((permission) => !permission.startsWith("audit:"))),
  createRoleDefinition("MANAGER", "Operational access for products, inventory, orders, customers, and delivery", getPermissionsForModules(["products", "inventory", "orders", "customers", "delivery"])),
  createRoleDefinition("EMPLOYEE", "Staff operational access for reading products, customers, inventory, and updating orders", [
    ...getPermissionsForModuleActions("products", ["read", "list"]),
    ...getPermissionsForModuleActions("customers", ["read", "list"]),
    ...getPermissionsForModuleActions("orders", ["read", "list", "update"]),
    ...getPermissionsForModuleActions("inventory", ["read", "list"]),
    ...getPermissionsForModuleActions("delivery", ["read", "list", "update"])
  ]),
  createRoleDefinition("CUSTOMER", "Read and create access for self-service orders and customer profile", [
    ...getPermissionsForModuleActions("customers", ["read", "list"]),
    ...getPermissionsForModuleActions("orders", ["create", "read", "list"]),
    ...getPermissionsForModules(["carts"])
  ])
];
var ROLE_PERMISSION_REGISTRY = ROLE_DEFINITIONS.flatMap(
  (role) => role.permissions.map((permission) => ({ role: role.name, permission }))
);

// ../backend/src/rbac/utils.ts
function normalizePermission(permission) {
  const key = permission.toString();
  if (key in PERMISSION_REGISTRY) {
    return key;
  }
  return key;
}
function normalizePermissions(permissions) {
  return [...permissions ?? []].map((permission) => normalizePermission(permission));
}
function hasPermission(permissions, permission) {
  const normalizedPermission = normalizePermission(permission);
  return normalizePermissions(permissions).includes(normalizedPermission);
}
function hasAnyPermission(permissions, ...requiredPermissions) {
  return requiredPermissions.some((permission) => hasPermission(permissions, permission));
}
function getRolePermissions(role) {
  const normalizedRole = role.toString().toUpperCase();
  const roleDefinition = ROLE_DEFINITIONS.find((definition) => definition.name === normalizedRole);
  return roleDefinition?.permissions ?? [];
}

// ../backend/src/services/auth-service.ts
var AuthService = class {
  constructor(userLookup) {
    this.userLookup = userLookup;
  }
  // Customer Public Registration Flow (Role is strictly CUSTOMER)
  async signUp(data) {
    const email = data.email?.trim().toLowerCase();
    const password = data.password;
    const name = data.name?.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new ValidationException("email_invalid");
    }
    if (!password || password.length < 8) {
      throw new ValidationException("password_too_short");
    }
    if (data.confirmPassword && data.confirmPassword !== password) {
      throw new ValidationException("password_confirmation_mismatch");
    }
    if (!name) {
      throw new ValidationException("name_required");
    }
    const client = prisma_service_default.getClient();
    const existing = await client.user.findFirst({ where: { email } });
    if (existing) {
      throw new ValidationException("email_already_exists");
    }
    const phone = data.phone?.trim() || null;
    if (phone) {
      const existingPhoneUser = await client.user.findFirst({ where: { phone } });
      const existingPhoneCustomer = await client.customer.findFirst({ where: { phone } });
      if (existingPhoneUser || existingPhoneCustomer) {
        throw new ValidationException("phone_already_exists");
      }
    }
    const passwordHash = await auth_password_service_default.hash(password);
    await client.$transaction(async (tx) => {
      let customerRole = await tx.role.findFirst({ where: { name: "CUSTOMER" } });
      if (!customerRole) {
        customerRole = await tx.role.create({
          data: {
            name: "CUSTOMER",
            description: "Standard Customer Role"
          }
        });
      }
      const user = await tx.user.create({
        data: {
          email,
          displayName: name,
          passwordHash,
          phone,
          isActive: true,
          isVerified: true
        }
      });
      await tx.userRole.create({
        data: {
          userId: user.id,
          roleId: customerRole.id
        }
      });
      const parts = name.split(" ");
      const firstName = parts[0] || name;
      const lastName = parts.slice(1).join(" ") || "Customer";
      const customerCode = `CUST-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1e3)}`;
      await tx.customer.create({
        data: {
          userId: user.id,
          customerCode,
          firstName,
          lastName,
          fullName: name,
          email,
          phone,
          status: "ACTIVE"
        }
      });
    });
    try {
      await new notification_repository_default().createForManagementUsers({
        title: "\u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F \u0633\u062C\u0644 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631",
        body: `${name} (${email}) \u0623\u0646\u0634\u0623 \u062D\u0633\u0627\u0628 \u0639\u0645\u064A\u0644 \u062C\u062F\u064A\u062F.`,
        channel: "admin",
        payload: { type: "customer_registered", customerEmail: email }
      });
    } catch {
    }
    return this.signIn(email, password);
  }
  async changePassword(userId, currentPassword, newPassword, confirmPassword) {
    if (!newPassword || newPassword.length < 8) {
      throw new ValidationException("password_too_short");
    }
    if (confirmPassword && confirmPassword !== newPassword) {
      throw new ValidationException("password_confirmation_mismatch");
    }
    const client = prisma_service_default.getClient();
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new UnauthorizedError("user_not_found");
    }
    const ok = await auth_password_service_default.verify(currentPassword, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedError("invalid_current_password");
    }
    const hashed = await auth_password_service_default.hash(newPassword);
    await client.user.update({
      where: { id: userId },
      data: { passwordHash: hashed }
    });
    await auth_password_service_default.addToHistory(userId, hashed);
    return true;
  }
  async updateProfile(userId, data) {
    const client = prisma_service_default.getClient();
    const displayName = data.displayName ?? data.name;
    const updateData = {};
    if (displayName) updateData.displayName = displayName.trim();
    if (data.phone !== void 0) updateData.phone = data.phone?.trim() ?? null;
    if (Object.keys(updateData).length > 0) {
      await client.user.update({
        where: { id: userId },
        data: updateData
      });
      const customer = await client.customer.findFirst({ where: { userId } });
      if (customer) {
        const name = displayName?.trim() || customer.fullName;
        const parts = name.split(" ");
        await client.customer.update({
          where: { id: customer.id },
          data: {
            fullName: name,
            firstName: parts[0] || name,
            lastName: parts.slice(1).join(" ") || customer.lastName,
            phone: data.phone !== void 0 ? data.phone?.trim() ?? null : customer.phone
          }
        });
      }
    }
    return this.getCurrentUser(userId);
  }
  // Sign-in flow (architecture only)
  async signIn(identifier, password, deviceId, meta) {
    const ip = meta?.ip;
    const ua = meta?.userAgent;
    try {
      if (ip && !rate_limiter_default.check(`login:ip:${ip}`)) throw new RateLimitError("rate_limited");
      if (!rate_limiter_default.check(`login:identifier:${identifier}`)) throw new RateLimitError("rate_limited");
    } catch (e) {
      throw e;
    }
    const user = await this.userLookup(identifier);
    if (!user) {
      await auth_audit_service_default.recordLoginAttempt(null, identifier, ip, ua, false, "invalid_credentials");
      throw new UnauthorizedError("invalid_credentials");
    }
    const locked = await auth_audit_service_default.isAccountLocked(user.id);
    if (locked) throw new AccountLockedError("account_locked");
    const ok = await auth_password_service_default.verify(password, user.passwordHash);
    if (!ok) {
      await auth_audit_service_default.recordLoginAttempt(user.id, user.email, ip, ua, false, "invalid_credentials");
      const maxAttempts = Number(process.env.FAILED_LOGIN_MAX_ATTEMPTS ?? 5);
      const recent = await login_history_repository_default.recentFailedCountByUser(user.id, Number(process.env.FAILED_LOGIN_WINDOW_MINUTES ?? 15));
      if (recent >= maxAttempts) {
        await auth_audit_service_default.lockAccount(user.id, "too_many_failed_attempts");
        throw new AccountLockedError("account_locked");
      }
      throw new UnauthorizedError("invalid_credentials");
    }
    if (deviceId) {
      await auth_device_service_default.registerDevice(user.id, deviceId);
    }
    const refreshToken = auth_token_service_default.createRefreshToken(user.id);
    const parsed = auth_token_service_default.verify(refreshToken);
    const rjti = parsed.payload?.jti;
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_SECONDS * 1e3);
    await (await Promise.resolve().then(() => (init_refresh_token_repository(), refresh_token_repository_exports))).default.create(user.id, refreshToken, expiresAt);
    await auth_session_service_default.createSession(user.id, rjti, REFRESH_TOKEN_EXP_SECONDS, deviceId);
    const accessToken = auth_token_service_default.createAccessToken(user.id, { sid: rjti });
    await auth_audit_service_default.recordLoginAttempt(user.id, user.email, ip, ua, true, "success");
    return { accessToken, refreshToken, expiresIn: REFRESH_TOKEN_EXP_SECONDS };
  }
  async signOut(refreshToken, meta) {
    const ip = meta?.ip;
    const ua = meta?.userAgent;
    const v = auth_token_service_default.verify(refreshToken);
    if (!v.valid || !v.payload) return;
    const jti = v.payload?.jti;
    const sub = v.payload?.sub;
    const tokenHash = crypto3.createHash("sha256").update(refreshToken).digest("hex");
    await token_blacklist_repository_default.addBlacklistByHash(sub ?? null, tokenHash, "logout");
    if (jti) await auth_session_service_default.revokeSession(jti);
    await (await Promise.resolve().then(() => (init_refresh_token_repository(), refresh_token_repository_exports))).default.revokeByHash(refreshToken);
    if (sub) {
      const client = prisma_service_default.getClient();
      const user = await client.user.findUnique({ where: { id: sub } });
      const email = user?.email ?? null;
      await auth_audit_service_default.recordLoginAttempt(sub, email, ip, ua, true, "logout");
    }
  }
  async refresh(refreshToken, meta) {
    const ip = meta?.ip;
    const ua = meta?.userAgent;
    const incomingHash = crypto3.createHash("sha256").update(refreshToken).digest("hex");
    const blacklisted = await token_blacklist_repository_default.isBlacklistedByHash(incomingHash);
    if (blacklisted) throw new UnauthorizedError("token_revoked");
    const v = auth_token_service_default.verify(refreshToken);
    if (!v.valid || !v.payload) throw new UnauthorizedError(v.error ?? "invalid_token");
    if (v.payload.typ !== "refresh") throw new UnauthorizedError("invalid_token_type");
    const oldJti = v.payload.jti;
    const userId = v.payload.sub;
    if (!rate_limiter_default.check(`refresh:user:${userId}`)) throw new RateLimitError("rate_limited");
    const session = await auth_session_service_default.getSession(oldJti);
    if (!session || session.revoked) throw new UnauthorizedError("session_revoked");
    const newRefresh = auth_token_service_default.createRefreshToken(userId);
    const parsed = auth_token_service_default.verify(newRefresh);
    const newJti = parsed.payload?.jti;
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP_SECONDS * 1e3);
    const rotatedRefresh = await (await Promise.resolve().then(() => (init_refresh_token_repository(), refresh_token_repository_exports))).default.rotate(refreshToken, newRefresh, expiresAt);
    if (!rotatedRefresh) throw new UnauthorizedError("invalid_token");
    const rotatedSession = await auth_session_service_default.rotateSession(oldJti, newJti, REFRESH_TOKEN_EXP_SECONDS);
    if (!rotatedSession) throw new UnauthorizedError("session_revoked");
    await token_blacklist_repository_default.addBlacklistByHash(userId ?? null, incomingHash, "rotated");
    const accessToken = auth_token_service_default.createAccessToken(userId, { sid: newJti });
    return { accessToken, refreshToken: newRefresh, expiresIn: REFRESH_TOKEN_EXP_SECONDS };
  }
  async validateAccessToken(token) {
    const v = auth_token_service_default.verify(token);
    if (!v.valid) return { valid: false };
    if (v.payload?.typ !== "access") return { valid: false };
    return { valid: true, payload: v.payload };
  }
  // Minimal: fetch current authenticated user info for /auth/me
  async getCurrentUser(userId) {
    const client = prisma_service_default.getClient();
    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        displayName: true,
        email: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        // tenant relation
        tenant: {
          select: { id: true, name: true, slug: true }
        },
        // user roles with role and branch (if any)
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                permissions: {
                  select: {
                    permission: { select: { resource: true, action: true } }
                  }
                }
              }
            },
            branch: {
              select: { id: true, name: true, storeId: true }
            }
          }
        }
      }
    });
    if (!user) return null;
    let avatarUrl = null;
    try {
      const avatarRows = await client.$queryRawUnsafe('SELECT "avatarUrl" FROM "users" WHERE "id" = $1 LIMIT 1', userId);
      avatarUrl = avatarRows[0]?.avatarUrl ?? null;
    } catch {
    }
    let primaryRole = null;
    const roles = [];
    const permissions = /* @__PURE__ */ new Set();
    let branch = null;
    let store = null;
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      const rolePriority = {
        SUPER_ADMIN: 0,
        ADMIN: 1,
        MANAGER: 2,
        EMPLOYEE: 3,
        CUSTOMER: 4,
        USER: 5
      };
      const primaryAssignment = [...user.roles].sort((left, right) => {
        const leftRank = rolePriority[String(left.role?.name ?? "").toUpperCase()] ?? 99;
        const rightRank = rolePriority[String(right.role?.name ?? "").toUpperCase()] ?? 99;
        return leftRank - rightRank;
      })[0];
      const branchAssignment = user.roles.find((assignment) => assignment.branch) ?? primaryAssignment;
      primaryRole = primaryAssignment?.role?.name ?? null;
      for (const assignment of user.roles) {
        if (assignment.role?.name) {
          const roleName = String(assignment.role.name);
          roles.push(roleName);
          for (const permission of getRolePermissions(roleName)) {
            permissions.add(permission);
          }
        }
        if (Array.isArray(assignment.role?.permissions)) {
          for (const rp of assignment.role.permissions) {
            if (rp?.permission) {
              permissions.add(`${rp.permission.resource}:${String(rp.permission.action).toLowerCase()}`);
            }
          }
        }
      }
      if (branchAssignment?.branch) {
        branch = { id: branchAssignment.branch.id, name: branchAssignment.branch.name };
        if (branchAssignment.branch.storeId) {
          const s = await client.store.findUnique({ where: { id: branchAssignment.branch.storeId }, select: { id: true, name: true } });
          if (s) store = { id: s.id, name: s.name };
        }
      }
    }
    return {
      id: user.id,
      fullName: user.displayName ?? null,
      email: user.email,
      phone: user.phone ?? null,
      avatar: avatarUrl,
      role: primaryRole,
      roles,
      permissions: [...permissions],
      tenant: user.tenant ?? null,
      store,
      branch,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    };
  }
};

// ../backend/src/common/security/jwt-middleware.ts
init_auth_token_service();
init_errors();
async function validateAccessToken(token) {
  const v = auth_token_service_default.verify(token);
  if (!v.valid || !v.payload) throw new InvalidTokenError(v.error ?? "invalid_token");
  if (v.payload.typ !== "access") throw new InvalidTokenError("invalid_token_type");
  const jti = v.payload.jti;
  if (jti) {
    const black = await token_blacklist_repository_default.isBlacklistedByJti(jti);
    if (black) throw new UnauthorizedError("token_revoked");
  }
  const sub = v.payload.sub;
  if (!sub) throw new UnauthorizedError("missing_sub");
  const sid = v.payload.sid;
  if (sid) {
    const revoked = await auth_session_service_default.isRevoked(sid);
    if (revoked) throw new UnauthorizedError("session_revoked");
  }
  return v.payload;
}
var jwt_middleware_default = validateAccessToken;

// ../backend/src/common/security/auth-guards.ts
init_errors();
async function guardRequireAuth(authorizationHeader) {
  if (!authorizationHeader) throw new UnauthorizedError("missing_authorization");
  const parts = authorizationHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") throw new UnauthorizedError("bad_authorization_header");
  const token = parts[1];
  const payload = await jwt_middleware_default(token);
  return payload;
}

// ../backend/src/modules/auth/avatar-upload.ts
var MAX_BYTES = 300 * 1024;
var ALLOWED_TYPES = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
function parseDataUrl(value) {
  if (typeof value !== "string") throw new Error("image_data_required");
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !ALLOWED_TYPES.has(match[1])) throw new Error("image_type_invalid");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_BYTES) throw new Error("image_size_invalid");
  return { contentType: match[1], bytes };
}
function storageHeaders(apiKey, extra = {}) {
  const headers = { apikey: apiKey, ...extra };
  if (apiKey.split(".").length === 3) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}
async function uploadAvatarImage(request4, userId) {
  const body = request4.body ?? {};
  const { contentType, bytes } = parseDataUrl(body.dataUrl);
  const baseUrl = String(process.env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const bucket = String(process.env.SUPABASE_AVATAR_BUCKET ?? "avatars").trim().replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "avatars";
  if (!baseUrl || !serviceRoleKey) throw new Error("storage_not_configured");
  const safeUserId = String(userId).replace(/[^a-zA-Z0-9_-]/g, "-");
  const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const path3 = `users/${safeUserId}/avatar-${Date.now()}.${extension}`;
  const response = await fetch(`${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path3}`, {
    method: "POST",
    headers: storageHeaders(serviceRoleKey, {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "x-upsert": "false"
    }),
    body: bytes
  });
  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).replace(/[^a-zA-Z0-9_ .:-]/g, "").slice(0, 160);
    throw new Error(`storage_avatar_upload_failed_${response.status}${detail ? `:${detail}` : ""}`);
  }
  return {
    path: path3,
    url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path3}`
  };
}

// ../backend/src/modules/auth/controller.ts
var AuthController = class _AuthController {
  constructor(authService = _AuthController.createAuthService()) {
    this.authService = authService;
  }
  static createAuthService() {
    return new AuthService(async (identifier) => {
      const client = prisma_service_default.getClient();
      return client.user.findFirst({ where: { email: identifier } });
    });
  }
  async signIn(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.identifier !== "string" || !body.identifier || typeof body.password !== "string" || !body.password) {
      return this.errorResponse("bad_request", "identifier_and_password_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.signIn(body.identifier, body.password, body.deviceId, this.requestMeta(request4));
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async refresh(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.refresh(body.refreshToken, this.requestMeta(request4));
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async signOut(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request4));
      return success(null, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Logout endpoint — invalidates refresh token and session and returns HTTP 204 No Content
  async logout(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request4));
      return noContent(ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async validate(request4) {
    const ctx = this.createApiContext(request4);
    const authorization = this.headerValue(request4, "authorization");
    const match = authorization?.match(/^Bearer\s+(.+)$/i);
    const token = match?.[1];
    if (!token) {
      return this.errorResponse("unauthorized", "access_token_required", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    try {
      const result = await this.authService.validateAccessToken(token);
      return success({ valid: result.valid }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // GET /auth/me — return current authenticated user
  async me(request4) {
    const ctx = this.createApiContext(request4);
    const authorization = this.headerValue(request4, "authorization");
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS.UNAUTHORIZED, ctx);
      const result = await this.authService.getCurrentUser(userId);
      if (!result) return this.errorResponse("not_found", "user_not_found", HTTP_STATUS.NOT_FOUND, ctx);
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Public Customer Registration
  async signUp(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.email !== "string" || typeof body.password !== "string") {
      return this.errorResponse("bad_request", "email_and_password_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.signUp({
        name: String(body.name ?? body.displayName ?? body.email),
        email: String(body.email),
        password: String(body.password),
        confirmPassword: body.confirmPassword ? String(body.confirmPassword) : void 0,
        phone: body.phone ? String(body.phone) : void 0
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Change Password
  async changePassword(request4) {
    const ctx = this.createApiContext(request4);
    const authorization = this.headerValue(request4, "authorization");
    const body = request4.body;
    if (!this.isObject(body) || typeof body.currentPassword !== "string" || typeof body.newPassword !== "string") {
      return this.errorResponse("bad_request", "current_and_new_password_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS.UNAUTHORIZED, ctx);
      await this.authService.changePassword(userId, String(body.currentPassword), String(body.newPassword), body.confirmPassword ? String(body.confirmPassword) : void 0);
      return success({ message: "password_changed_successfully" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Forgot Password — Request reset link
  async forgotPassword(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.email !== "string" || !body.email) {
      return this.errorResponse("bad_request", "email_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const { default: resetService } = await Promise.resolve().then(() => (init_auth_reset_service(), auth_reset_service_exports));
      await resetService.generateResetTokenByEmail(String(body.email));
      return success({ message: "If the email exists, a password reset token has been generated." }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Reset Password — Submit reset token & new password
  async resetPassword(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.token !== "string" || typeof body.newPassword !== "string") {
      return this.errorResponse("bad_request", "token_and_new_password_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const { default: resetService } = await Promise.resolve().then(() => (init_auth_reset_service(), auth_reset_service_exports));
      await resetService.resetPassword(String(body.token), String(body.newPassword));
      return success({ message: "password_reset_successfully" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Update Profile
  async updateProfile(request4) {
    const ctx = this.createApiContext(request4);
    const authorization = this.headerValue(request4, "authorization");
    const body = request4.body;
    if (!this.isObject(body)) {
      return this.errorResponse("bad_request", "body_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS.UNAUTHORIZED, ctx);
      const result = await this.authService.updateProfile(userId, {
        name: body.name ? String(body.name) : void 0,
        displayName: body.displayName ? String(body.displayName) : void 0,
        phone: body.phone ? String(body.phone) : void 0
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async uploadAvatar(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const payload = await guardRequireAuth(this.headerValue(request4, "authorization"));
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS.UNAUTHORIZED, ctx);
      const uploaded = await uploadAvatarImage(request4, userId);
      const client = prisma_service_default.getClient();
      await client.$executeRawUnsafe('UPDATE "users" SET "avatarUrl" = $1 WHERE "id" = $2', uploaded.url, userId);
      return success({ avatarUrl: uploaded.url }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Email Verification: Send verification token
  async sendVerification(request4) {
    const ctx = this.createApiContext(request4);
    const authorization = this.headerValue(request4, "authorization");
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS.UNAUTHORIZED, ctx);
      const { default: emailVerificationService } = await Promise.resolve().then(() => (init_auth_email_verification_service(), auth_email_verification_service_exports));
      await emailVerificationService.generateVerificationToken(userId);
      return success({ message: "verification_token_sent" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Email Verification: Verify token
  async verifyEmail(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.token !== "string" || !body.token) {
      return this.errorResponse("bad_request", "token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const { default: emailVerificationService } = await Promise.resolve().then(() => (init_auth_email_verification_service(), auth_email_verification_service_exports));
      const ok = await emailVerificationService.activateAccount(String(body.token));
      if (!ok) return this.errorResponse("bad_request", "invalid_or_expired_token", HTTP_STATUS.BAD_REQUEST, ctx);
      return success({ message: "email_verified_successfully" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  requestMeta(request4) {
    return {
      ip: this.headerValue(request4, "x-forwarded-for") ?? this.headerValue(request4, "x-real-ip"),
      userAgent: this.headerValue(request4, "user-agent")
    };
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  headerValue(request4, name) {
    const value = request4.headers?.[name.toLowerCase()];
    if (Array.isArray(value)) return value[0];
    return value;
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    if (error instanceof InvalidTokenError) {
      return this.errorResponse("unauthorized", error.message || "invalid_token", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    if (error instanceof AccountLockedError) {
      return this.errorResponse("account_locked", error.message || "account_locked", 423, ctx);
    }
    if (error instanceof RateLimitError) {
      return this.errorResponse("rate_limited", error.message || "rate_limited", 429, ctx);
    }
    return this.errorResponse("internal_error", error instanceof Error ? error.message : "internal_error", HTTP_STATUS.INTERNAL_SERVER_ERROR, ctx);
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
  isObject(value) {
    return typeof value === "object" && value !== null;
  }
};

// ../backend/src/modules/auth/routes.ts
function toControllerRequest(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt(handler2) {
  return (context) => handler2(context);
}
function createAuthRoutes(controller = new AuthController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "auth-sign-in",
    method: "POST",
    path: "/auth/sign-in",
    version: "v1",
    handler: adapt((ctx) => controller.signIn(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-refresh",
    method: "POST",
    path: "/auth/refresh",
    version: "v1",
    handler: adapt((ctx) => controller.refresh(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-sign-out",
    method: "POST",
    path: "/auth/sign-out",
    version: "v1",
    handler: adapt((ctx) => controller.signOut(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-logout",
    method: "POST",
    path: "/auth/logout",
    version: "v1",
    handler: adapt((ctx) => controller.logout(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-validate",
    method: "GET",
    path: "/auth/validate",
    version: "v1",
    handler: adapt((ctx) => controller.validate(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-me",
    method: "GET",
    path: "/auth/me",
    version: "v1",
    handler: adapt((ctx) => controller.me(toControllerRequest(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-sign-up",
    method: "POST",
    path: "/auth/sign-up",
    version: "v1",
    handler: adapt((ctx) => controller.signUp(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-register",
    method: "POST",
    path: "/auth/register",
    version: "v1",
    handler: adapt((ctx) => controller.signUp(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-change-password",
    method: "POST",
    path: "/auth/change-password",
    version: "v1",
    handler: adapt((ctx) => controller.changePassword(toControllerRequest(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-forgot-password",
    method: "POST",
    path: "/auth/forgot-password",
    version: "v1",
    handler: adapt((ctx) => controller.forgotPassword(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-reset-password",
    method: "POST",
    path: "/auth/reset-password",
    version: "v1",
    handler: adapt((ctx) => controller.resetPassword(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-update-profile",
    method: "PUT",
    path: "/auth/profile",
    version: "v1",
    handler: adapt((ctx) => controller.updateProfile(toControllerRequest(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-profile-avatar-upload",
    method: "POST",
    path: "/auth/profile/avatar",
    version: "v1",
    handler: adapt((ctx) => controller.uploadAvatar(toControllerRequest(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["auth", "profile"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-send-verification",
    method: "POST",
    path: "/auth/send-verification",
    version: "v1",
    handler: adapt((ctx) => controller.sendVerification(toControllerRequest(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  builder.register({
    name: "auth-verify-email",
    method: "POST",
    path: "/auth/verify-email",
    version: "v1",
    handler: adapt((ctx) => controller.verifyEmail(toControllerRequest(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["auth"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/authorization/errors.ts
var AuthorizationError = class _AuthorizationError extends Error {
  code;
  constructor(code, message) {
    super(message ?? code);
    this.code = code;
    Object.setPrototypeOf(this, _AuthorizationError.prototype);
  }
};
var UnauthorizedError2 = class _UnauthorizedError extends AuthorizationError {
  constructor(message) {
    super("unauthorized", message ?? "unauthorized");
    Object.setPrototypeOf(this, _UnauthorizedError.prototype);
  }
};
var ForbiddenError = class _ForbiddenError extends AuthorizationError {
  constructor(message) {
    super("forbidden", message ?? "forbidden");
    Object.setPrototypeOf(this, _ForbiddenError.prototype);
  }
};
var PermissionDeniedError = class _PermissionDeniedError extends ForbiddenError {
  constructor(message) {
    super(message ?? "permission_denied");
    Object.setPrototypeOf(this, _PermissionDeniedError.prototype);
  }
};
var RoleDeniedError = class _RoleDeniedError extends ForbiddenError {
  constructor(message) {
    super(message ?? "role_denied");
    Object.setPrototypeOf(this, _RoleDeniedError.prototype);
  }
};

// ../backend/src/authorization/service.ts
var AuthorizationService = class {
  evaluate(context, options = {}) {
    const requiredPermissions = this.normalizePermissions(options.requiredPermissions);
    const requiredRoles = this.normalizeRoles(options.requiredRoles);
    const requiredScope = options.requiredScope ?? context.requiredScope;
    const roleMatches = this.hasRequiredRoles(context.roles, requiredRoles);
    const missingRoles = this.getMissingRoles(context.roles, requiredRoles);
    const permissions = this.normalizePermissions(context.permissions);
    const missingPermissions = this.getMissingPermissions(permissions, requiredPermissions, options.requireAllPermissions !== false);
    if (!requiredRoles.length && !requiredPermissions.length && !requiredScope) {
      return this.createResult(true, "authorized", [], [], this.getPrimaryRole(context.roles), context.scope ?? null);
    }
    if (requiredRoles.length > 0 && missingRoles.length > 0) {
      return this.createResult(false, "missing_roles", [], missingRoles, this.getPrimaryRole(context.roles), context.scope ?? null);
    }
    if (requiredPermissions.length > 0 && missingPermissions.length > 0) {
      return this.createResult(false, "missing_permissions", missingPermissions, [], this.getPrimaryRole(context.roles), context.scope ?? null);
    }
    if (requiredScope && !this.evaluateScope(context, requiredScope)) {
      return this.createResult(false, "scope_denied", [], [], this.getPrimaryRole(context.roles), requiredScope);
    }
    const authorized = roleMatches && requiredRoles.length === 0 ? true : roleMatches;
    return this.createResult(authorized, "authorized", [], [], this.getPrimaryRole(context.roles), context.scope ?? null);
  }
  can(context, permission, options = {}) {
    return this.evaluate(context, { ...options, requiredPermissions: [permission] });
  }
  cannot(context, permission, options = {}) {
    const result = this.can(context, permission, options);
    return {
      ...result,
      authorized: !result.authorized,
      reason: result.authorized ? "forbidden" : "authorized"
    };
  }
  hasPermission(context, permission, options = {}) {
    return this.evaluate(context, { ...options, requiredPermissions: [permission] });
  }
  hasAnyPermission(context, permissions, options = {}) {
    return this.evaluate(context, { ...options, requiredPermissions: permissions, requireAllPermissions: false });
  }
  hasAllPermissions(context, permissions, options = {}) {
    return this.evaluate(context, { ...options, requiredPermissions: permissions, requireAllPermissions: true });
  }
  hasRole(context, role, options = {}) {
    return this.evaluate(context, { ...options, requiredRoles: [role] });
  }
  hasAnyRole(context, roles, options = {}) {
    return this.evaluate(context, { ...options, requiredRoles: roles });
  }
  isSuperAdmin(context, options = {}) {
    return this.evaluate(context, { ...options, requiredRoles: ["SUPER_ADMIN"] });
  }
  assertAuthorized(context, options = {}) {
    const result = this.evaluate(context, options);
    if (!result.authorized) {
      throw this.toError(result);
    }
    return result;
  }
  createResult(authorized, reason, missingPermissions, missingRoles, evaluatedRole, evaluatedScope) {
    return {
      authorized,
      reason,
      missingPermissions,
      missingRoles,
      evaluatedRole,
      evaluatedScope
    };
  }
  normalizePermissions(permissions) {
    return (permissions ?? []).map((permission) => permission.toString().toLowerCase());
  }
  normalizeRoles(roles) {
    return (roles ?? []).map((role) => role.toString().toUpperCase());
  }
  getMissingPermissions(grantedPermissions, requiredPermissions, requireAllPermissions) {
    if (!requiredPermissions.length) {
      return [];
    }
    if (!requireAllPermissions) {
      return requiredPermissions.filter((permission) => !hasAnyPermission(grantedPermissions, permission));
    }
    return requiredPermissions.filter((permission) => !hasPermission(grantedPermissions, permission));
  }
  getMissingRoles(grantedRoles, requiredRoles) {
    if (!requiredRoles.length) {
      return [];
    }
    return requiredRoles.filter((role) => !this.normalizeRoles(grantedRoles).includes(role));
  }
  hasRequiredRoles(grantedRoles, requiredRoles) {
    if (!requiredRoles.length) {
      return true;
    }
    return requiredRoles.some((role) => this.normalizeRoles(grantedRoles).includes(role));
  }
  getPrimaryRole(grantedRoles) {
    const normalized = this.normalizeRoles(grantedRoles);
    return normalized[0] ?? null;
  }
  evaluateScope(context, requiredScope) {
    if (requiredScope === "self") {
      return Boolean(context.actorId && context.resourceOwnerId && context.actorId === context.resourceOwnerId);
    }
    const actorScope = context.scope;
    if (!actorScope) {
      return false;
    }
    const scopeRank = {
      self: 1,
      branch: 2,
      store: 3,
      tenant: 4
    };
    return scopeRank[actorScope] >= scopeRank[requiredScope];
  }
  toError(result) {
    if (result.reason === "missing_permissions") {
      return new PermissionDeniedError(result.missingPermissions.join(", "));
    }
    if (result.reason === "missing_roles") {
      return new RoleDeniedError(result.missingRoles.join(", "));
    }
    if (result.reason === "scope_denied") {
      return new ForbiddenError("scope_denied");
    }
    if (result.reason === "unauthorized") {
      return new UnauthorizedError2("authorization_context_missing");
    }
    return new ForbiddenError("authorization_denied");
  }
};
var service_default = new AuthorizationService();

// ../backend/src/middleware/utils.ts
function extractUserPermissions(user) {
  return (user?.permissions ?? []).map((permission) => permission.toString());
}
function extractUserRoles(user) {
  return (user?.roles ?? []).map((role) => role.toString().toUpperCase());
}
function normalizePermissions2(permissions) {
  return (permissions ?? []).map((permission) => permission.toString());
}
function normalizeRoles(roles) {
  return (roles ?? []).map((role) => role.toString().toUpperCase());
}
function buildAuthorizationContext(user, request4) {
  return {
    roles: user?.roles,
    permissions: user?.permissions,
    scope: user?.scope,
    requiredScope: request4?.requiredScope,
    actorId: user?.id,
    tenantId: user?.tenantId,
    storeId: user?.storeId,
    branchId: user?.branchId
  };
}

// ../backend/src/middleware/service.ts
var PermissionMiddleware = class {
  constructor(authorizationService = service_default) {
    this.authorizationService = authorizationService;
  }
  requirePermission(user, request4) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.evaluate(context, {
      requiredPermissions: request4.requiredPermissions,
      requiredRoles: request4.requiredRoles,
      requiredScope: request4.requiredScope,
      requireAllPermissions: request4.requireAllPermissions
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(request4.requiredPermissions)
    };
  }
  requireAnyPermission(user, permissions, request4 = {}) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.hasAnyPermission(context, permissions, {
      requiredRoles: request4.requiredRoles,
      requiredScope: request4.requiredScope
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(permissions)
    };
  }
  requireAllPermissions(user, permissions, request4 = {}) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.hasAllPermissions(context, permissions, {
      requiredRoles: request4.requiredRoles,
      requiredScope: request4.requiredScope
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(permissions)
    };
  }
  requireRole(user, role, request4 = {}) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.hasRole(context, role, { requiredScope: request4.requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  requireAnyRole(user, roles, request4 = {}) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.hasAnyRole(context, roles, { requiredScope: request4.requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  requireSuperAdmin(user, request4 = {}) {
    const context = buildAuthorizationContext(user, request4);
    const result = this.authorizationService.isSuperAdmin(context, { requiredScope: request4.requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  evaluateScope(user, requiredScope) {
    const context = buildAuthorizationContext(user, { requiredScope });
    const result = this.authorizationService.evaluate(context, { requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  extractUserPermissions(user) {
    return extractUserPermissions(user);
  }
  extractUserRoles(user) {
    return extractUserRoles(user);
  }
  normalizePermissions(permissions) {
    return normalizePermissions2(permissions);
  }
  normalizeRoles(roles) {
    return normalizeRoles(roles);
  }
};
var service_default2 = new PermissionMiddleware();

// ../backend/src/route-protection/factory.ts
var RouteProtectionFactory = class {
  constructor(permissionMiddleware = new PermissionMiddleware()) {
    this.permissionMiddleware = permissionMiddleware;
  }
  protectRoute(context) {
    const metadata = context.route.metadata;
    if (metadata.mode === "public") {
      return this.createResult(true, "public", metadata);
    }
    if (!metadata.authenticationRequired || !context.user) {
      return this.createResult(false, "unauthorized", metadata);
    }
    const middlewareResult = this.permissionMiddleware.requirePermission(context.user, {
      requiredPermissions: metadata.requiredPermissions ? [...metadata.requiredPermissions] : void 0,
      requiredRoles: metadata.requiredRoles ? [...metadata.requiredRoles] : void 0,
      requiredScope: metadata.requiredScope,
      requireAllPermissions: metadata.requireAllPermissions
    });
    return {
      authorized: middlewareResult.authorized,
      reason: middlewareResult.authorized ? "authorized" : middlewareResult.reason === "missing_roles" ? "missing_roles" : middlewareResult.reason === "missing_permissions" ? "missing_permissions" : middlewareResult.reason === "scope_denied" ? "scope_denied" : "forbidden",
      requiredRole: metadata.requiredRoles?.[0],
      requiredPermission: metadata.requiredPermissions?.[0],
      scope: metadata.requiredScope,
      metadata
    };
  }
  protectPublicRoute(route) {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        mode: "public",
        authenticationRequired: false
      }
    };
  }
  protectPrivateRoute(route) {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        mode: "private",
        authenticationRequired: true
      }
    };
  }
  protectRole(route, role) {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        requiredRoles: [role]
      }
    };
  }
  protectPermission(route, permission) {
    return {
      ...route,
      metadata: {
        ...route.metadata,
        requiredPermissions: [permission]
      }
    };
  }
  createResult(authorized, reason, metadata) {
    return {
      authorized,
      reason,
      metadata
    };
  }
};
var factory_default = new RouteProtectionFactory();

// ../backend/src/route-protection/utils.ts
function createRouteMetadata2(options) {
  return {
    name: options.name,
    path: options.path,
    mode: options.mode ?? "private",
    authenticationRequired: options.authenticationRequired ?? true,
    requiredPermissions: options.requiredPermissions ?? [],
    requiredRoles: options.requiredRoles ?? [],
    requiredScope: options.requiredScope,
    requireAllPermissions: options.requireAllPermissions ?? true
  };
}

// ../backend/src/route-protection/registry.ts
var RouteProtectionRegistry = class {
  routes = /* @__PURE__ */ new Map();
  register(route) {
    this.routes.set(route.path, route);
  }
  get(path3) {
    return this.routes.get(path3);
  }
  list() {
    return Array.from(this.routes.values());
  }
  createMetadata(options) {
    return createRouteMetadata2(options);
  }
};
var registry_default = new RouteProtectionRegistry();

// ../backend/src/system/service.ts
var SystemHealthService = class {
  getHealth() {
    return {
      status: "ok",
      version: this.getApplicationVersion(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: Math.round(process.uptime()),
      environment: process.env.NODE_ENV ?? "development",
      database: "ready",
      application: "ready",
      service: "ready"
    };
  }
  getReady() {
    return {
      application: true,
      database: true,
      services: true,
      configuration: true
    };
  }
  getLive() {
    return {
      status: "alive",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  getVersion() {
    return {
      applicationName: "green-store-enterprise",
      version: this.getApplicationVersion(),
      buildNumber: process.env.BUILD_NUMBER ?? "local",
      apiVersion: "v1",
      buildDate: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  getApplicationVersion() {
    return process.env.APP_VERSION ?? "0.0.0";
  }
};

// ../backend/src/system/controller.ts
var SystemController = class {
  constructor(service = new SystemHealthService()) {
    this.service = service;
  }
  getHealth() {
    return success(this.service.getHealth(), this.createApiContext());
  }
  getReady() {
    return success(this.service.getReady(), this.createApiContext());
  }
  getLive() {
    return success(this.service.getLive(), this.createApiContext());
  }
  getVersion() {
    return success(this.service.getVersion(), this.createApiContext());
  }
  createApiContext() {
    return {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      version: "v1"
    };
  }
};

// ../backend/src/system/routes.ts
function createSystemRoutes(controller = new SystemController()) {
  const builder = new RouterBuilder();
  const createHandler = (handler2) => {
    return (context) => handler2(context);
  };
  builder.register({
    name: "system-health",
    method: "GET",
    path: "/health",
    version: "v1",
    handler: createHandler(() => controller.getHealth()),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["system"],
      middleware: []
    }
  });
  builder.register({
    name: "system-ready",
    method: "GET",
    path: "/ready",
    version: "v1",
    handler: createHandler(() => controller.getReady()),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["system"],
      middleware: []
    }
  });
  builder.register({
    name: "system-live",
    method: "GET",
    path: "/live",
    version: "v1",
    handler: createHandler(() => controller.getLive()),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["system"],
      middleware: []
    }
  });
  builder.register({
    name: "system-version",
    method: "GET",
    path: "/version",
    version: "v1",
    handler: createHandler(() => controller.getVersion()),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["system"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/repositories/tenant-repository.ts
var TenantRepository = class extends base_repository_default {
  constructor() {
    super("tenant");
  }
};
var tenant_repository_default = TenantRepository;

// ../backend/src/repositories/user-repository.ts
var UserRepository = class extends base_repository_default {
  constructor() {
    super("user");
  }
  async findUserRoles(userId) {
    return this.client.userRole.findMany({
      where: { userId },
      include: { role: true }
    });
  }
  async assignRole(userId, roleId) {
    return this.client.userRole.create({
      data: { userId, roleId },
      include: { role: true }
    });
  }
  async removeRole(userId, roleId) {
    const existing = await this.client.userRole.findFirst({
      where: { userId, roleId }
    });
    if (!existing) return null;
    return this.client.userRole.delete({ where: { id: existing.id } });
  }
  async hasRole(userId, roleId) {
    const count = await this.client.userRole.count({ where: { userId, roleId } });
    return count > 0;
  }
};
var user_repository_default = UserRepository;

// ../backend/src/repositories/role-repository.ts
var RoleRepository = class extends base_repository_default {
  constructor() {
    super("role");
  }
  /**
   * Persistence-only operations for the implicit Role ↔ Permission join
   * (RolePermission / role_permissions). Business rules live in the service.
   */
  async findRolePermissions(roleId) {
    const role = await this.model.findUnique({
      where: { id: roleId },
      include: { permissions: { include: { permission: true } } }
    });
    if (!role) return [];
    return role.permissions ?? [];
  }
  async assignPermission(roleId, permissionId) {
    return this.client.rolePermission.create({
      data: { roleId, permissionId },
      include: { permission: true }
    });
  }
  async removePermission(roleId, permissionId) {
    const existing = await this.client.rolePermission.findUnique({
      where: { roleId_permissionId: { roleId, permissionId } }
    });
    if (!existing) return null;
    return this.client.rolePermission.delete({
      where: { id: existing.id }
    });
  }
  async hasPermission(roleId, permissionId) {
    const count = await this.client.rolePermission.count({
      where: { roleId, permissionId }
    });
    return count > 0;
  }
};
var role_repository_default = RoleRepository;

// ../backend/src/repositories/permission-repository.ts
var PermissionRepository = class extends base_repository_default {
  constructor() {
    super("permission");
  }
  /**
   * The `Permission` model has no `deletedAt` column, so soft-delete is not
   * supported for this entity. DELETE falls back to a hard delete in
   * BaseRepository. Restore is therefore a no-op that returns the existing
   * record (if present) to keep the endpoint contract consistent.
   */
  async restore(id) {
    return this.findById(id);
  }
};
var permission_repository_default = PermissionRepository;

// ../backend/src/repositories/store-repository.ts
var StoreRepository = class extends base_repository_default {
  constructor() {
    super("store");
  }
};
var store_repository_default = StoreRepository;

// ../backend/src/repositories/branch-repository.ts
var BranchRepository = class extends base_repository_default {
  constructor() {
    super("branch");
  }
};
var branch_repository_default = BranchRepository;

// ../backend/src/repositories/category-repository.ts
var CategoryRepository = class extends base_repository_default {
  constructor() {
    super("category");
  }
};
var category_repository_default = CategoryRepository;

// ../backend/src/repositories/product-repository.ts
var ProductRepository = class extends base_repository_default {
  constructor() {
    super("product");
  }
  async findById(id) {
    return await this.model.findFirst({
      where: { id, deletedAt: null },
      include: { images: { orderBy: { sortOrder: "asc" } } }
    }) ?? null;
  }
  async findBySlug(slug, excludeId) {
    const where = excludeId ? { slug, id: { not: excludeId }, deletedAt: null } : { slug, deletedAt: null };
    return await this.model.findFirst({ where }) ?? null;
  }
  async create(data) {
    const { imageUrl, imageAltText, barcode, ...productData } = data;
    const created2 = await this.model.create({
      data: productData,
      include: { images: { orderBy: { sortOrder: "asc" } } }
    });
    if (typeof imageUrl === "string" && imageUrl.trim()) {
      await this.client.productImage.create({
        data: {
          productId: created2.id,
          url: imageUrl.trim(),
          altText: typeof imageAltText === "string" && imageAltText.trim() ? imageAltText.trim() : `${created2.name} - \u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629`,
          sortOrder: 0
        }
      });
    }
    if (typeof barcode === "string" && barcode.trim()) {
      await this.client.productVariant.create({
        data: {
          productId: created2.id,
          sku: typeof productData.sku === "string" ? `${productData.sku.trim()}-DEFAULT` : void 0,
          barcode: barcode.trim(),
          name: created2.name,
          price: 0
        }
      });
    }
    return this.findById(created2.id);
  }
  async update(id, data) {
    const hasImageUpdate = Object.prototype.hasOwnProperty.call(data, "imageUrl");
    const hasBarcodeUpdate = Object.prototype.hasOwnProperty.call(data, "barcode");
    const { imageUrl, imageAltText, barcode, ...productData } = data;
    const updated = await this.model.update({
      where: { id },
      data: productData
    });
    if (hasBarcodeUpdate) {
      const existingVariant = await this.client.productVariant.findFirst({ where: { productId: id } });
      if (existingVariant) {
        await this.client.productVariant.update({ where: { id: existingVariant.id }, data: { barcode: typeof barcode === "string" ? barcode.trim() : null } });
      } else if (typeof barcode === "string" && barcode.trim()) {
        await this.client.productVariant.create({ data: { productId: id, barcode: barcode.trim(), name: updated.name, price: 0 } });
      }
    }
    if (hasImageUpdate) {
      await this.client.productImage.deleteMany({ where: { productId: id } });
      if (typeof imageUrl === "string" && imageUrl.trim()) {
        await this.client.productImage.create({
          data: {
            productId: id,
            url: imageUrl.trim(),
            altText: typeof imageAltText === "string" && imageAltText.trim() ? imageAltText.trim() : `${updated.name} - \u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629`,
            sortOrder: 0
          }
        });
      }
    }
    return this.findById(id);
  }
  async findMany(filter) {
    return this.model.findMany({
      where: { AND: [{ deletedAt: null }, filter ?? {}] },
      include: { images: { orderBy: { sortOrder: "asc" } } }
    });
  }
  async delete(id) {
    await this.model.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
  }
  async restore(id) {
    return this.model.update({ where: { id }, data: { deletedAt: null } });
  }
  async paginate(options) {
    const filters = options.filters && Object.keys(options.filters).length > 0 ? { AND: [{ deletedAt: null }, options.filters] } : { deletedAt: null };
    return super.paginate({ ...options, filters });
  }
};
var product_repository_default = ProductRepository;

// ../backend/src/repositories/inventory-repository.ts
var InventoryRepository = class extends base_repository_default {
  constructor() {
    super("inventory");
  }
  async findOrCreateDefaultWarehouse() {
    let warehouse = await this.client.warehouse.findFirst({
      where: { code: "DEFAULT" }
    });
    if (!warehouse) {
      warehouse = await this.client.warehouse.create({
        data: {
          name: "\u0627\u0644\u0645\u0633\u062A\u0648\u062F\u0639 \u0627\u0644\u0631\u0626\u064A\u0633\u064A (Default Warehouse)",
          code: "DEFAULT"
        }
      });
    }
    return warehouse;
  }
  async findOrCreateInventory(productId, warehouseId, productVariantId) {
    let targetWarehouseId = warehouseId;
    if (!targetWarehouseId) {
      const defaultW = await this.findOrCreateDefaultWarehouse();
      targetWarehouseId = defaultW.id;
    }
    let inv = await this.client.inventory.findFirst({
      where: { productId, warehouseId: targetWarehouseId, productVariantId: productVariantId ?? null },
      include: {
        product: { select: { id: true, name: true, sku: true } },
        warehouse: { select: { id: true, name: true } }
      }
    });
    if (!inv) {
      inv = await this.client.inventory.create({
        data: {
          productId,
          productVariantId: productVariantId ?? null,
          warehouseId: targetWarehouseId,
          quantity: 0,
          reserved: 0,
          available: 0,
          safetyStock: 10
        },
        include: {
          product: { select: { id: true, name: true, sku: true } },
          warehouse: { select: { id: true, name: true } }
        }
      });
    }
    return inv;
  }
  async reserveStockForOrder(tx, productId, qty, orderId, productVariantId) {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException("quantity_must_be_positive_integer");
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: "DEFAULT" }
      }
    });
    if (!inv) {
      throw new ValidationException(`inventory_not_found_for_product_${productId}`);
    }
    if (inv.available < qty) {
      throw new ValidationException(`insufficient_stock_for_product_${productId}`);
    }
    const newReserved = inv.reserved + qty;
    const newAvailable = Math.max(0, inv.quantity - newReserved);
    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        reserved: newReserved,
        available: newAvailable
      }
    });
    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: "RESERVATION",
        quantity: qty,
        referenceId: orderId
      }
    });
  }
  async releaseStockForOrder(tx, productId, qty, orderId, productVariantId) {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException("quantity_must_be_positive_integer");
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: "DEFAULT" }
      }
    });
    if (!inv) return;
    const newReserved = Math.max(0, inv.reserved - qty);
    const newAvailable = Math.max(0, inv.quantity - newReserved);
    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        reserved: newReserved,
        available: newAvailable
      }
    });
    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: "RELEASE",
        quantity: qty,
        referenceId: orderId
      }
    });
  }
  async deductStockForShipment(tx, productId, qty, orderId, productVariantId) {
    if (!Number.isInteger(qty) || qty <= 0) throw new ValidationException("quantity_must_be_positive_integer");
    const inv = await tx.inventory.findFirst({
      where: {
        productId,
        productVariantId: productVariantId ?? null,
        warehouse: { code: "DEFAULT" }
      }
    });
    if (!inv) return;
    if (inv.reserved < qty || inv.quantity < qty) {
      throw new ValidationException(`insufficient_reserved_stock_for_product_${productId}`);
    }
    const newReserved = inv.reserved - qty;
    const newQuantity = inv.quantity - qty;
    const newAvailable = Math.max(0, newQuantity - newReserved);
    await tx.inventory.update({
      where: { id: inv.id },
      data: {
        quantity: newQuantity,
        reserved: newReserved,
        available: newAvailable
      }
    });
    await tx.stockMovement.create({
      data: {
        inventoryId: inv.id,
        type: "OUT",
        quantity: qty,
        referenceId: orderId
      }
    });
  }
  async deductStockForOrder(tx, productId, qty, orderId, productVariantId) {
    return this.deductStockForShipment(tx, productId, qty, orderId, productVariantId);
  }
  async adjustStock(productId, type, qty, reason, performedById, warehouseId, productVariantId) {
    if (qty < 0) {
      throw new ValidationException("quantity_cannot_be_negative");
    }
    const targetWarehouse = warehouseId ? await this.client.warehouse.findUnique({ where: { id: warehouseId } }) : await this.findOrCreateDefaultWarehouse();
    if (!targetWarehouse) throw new NotFoundException("warehouse_not_found");
    const { updated } = await this.client.$transaction(
      async (tx) => {
        let inv = await tx.inventory.findFirst({
          where: { productId, warehouseId: targetWarehouse.id, productVariantId: productVariantId ?? null }
        });
        if (!inv) {
          inv = await tx.inventory.create({
            data: {
              productId,
              productVariantId: productVariantId ?? null,
              warehouseId: targetWarehouse.id,
              quantity: 0,
              reserved: 0,
              available: 0,
              safetyStock: 10
            }
          });
        }
        let up;
        if (type === "IN") {
          up = await tx.inventory.update({
            where: { id: inv.id },
            data: {
              quantity: { increment: qty },
              available: { increment: qty }
            },
            include: {
              product: { select: { id: true, name: true, sku: true } },
              warehouse: { select: { id: true, name: true } }
            }
          });
        } else if (type === "OUT") {
          if (inv.available < qty || inv.quantity < qty) {
            throw new ValidationException("insufficient_available_stock");
          }
          up = await tx.inventory.update({
            where: { id: inv.id },
            data: {
              quantity: { decrement: qty },
              available: { decrement: qty }
            },
            include: {
              product: { select: { id: true, name: true, sku: true } },
              warehouse: { select: { id: true, name: true } }
            }
          });
        } else if (type === "ADJUSTMENT") {
          if (qty < inv.reserved) {
            throw new ValidationException("adjustment_below_reserved_quantity");
          }
          const newQty = qty;
          const newAvail = Math.max(0, newQty - inv.reserved);
          up = await tx.inventory.update({
            where: { id: inv.id },
            data: {
              quantity: newQty,
              available: newAvail
            },
            include: {
              product: { select: { id: true, name: true, sku: true } },
              warehouse: { select: { id: true, name: true } }
            }
          });
        }
        await tx.stockMovement.create({
          data: {
            inventoryId: inv.id,
            type,
            quantity: qty,
            referenceId: reason ?? null,
            performedById: performedById ?? null
          }
        });
        return { updated: up };
      },
      { maxWait: 1e4, timeout: 2e4 }
    );
    const avail = updated.available ?? updated.quantity - updated.reserved;
    return {
      ...updated,
      reservedQuantity: updated.reserved,
      availableQuantity: avail,
      lowStockThreshold: updated.safetyStock,
      isLowStock: avail <= updated.safetyStock,
      isOutOfStock: avail <= 0
    };
  }
  async findInventoryList(options) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 10)));
    const skip = (page - 1) * limit;
    const where = {};
    if (options.warehouseId) where.warehouseId = options.warehouseId;
    if (options.productVariantId) where.productVariantId = options.productVariantId;
    if (options.search) {
      where.product = {
        OR: [
          { name: { contains: options.search, mode: "insensitive" } },
          { sku: { contains: options.search, mode: "insensitive" } }
        ]
      };
    }
    const [items, total] = await Promise.all([
      this.client.inventory.findMany({
        where,
        include: {
          product: { select: { id: true, name: true, sku: true } },
          warehouse: { select: { id: true, name: true } }
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      this.client.inventory.count({ where })
    ]);
    let filteredItems = items;
    if (options.status === "LOW_STOCK") {
      filteredItems = items.filter((i) => i.available > 0 && i.available <= i.safetyStock);
    } else if (options.status === "OUT_OF_STOCK") {
      filteredItems = items.filter((i) => i.available <= 0);
    } else if (options.status === "IN_STOCK") {
      filteredItems = items.filter((i) => i.available > i.safetyStock);
    }
    return {
      items: filteredItems.map((inv) => {
        const avail = inv.available ?? inv.quantity - inv.reserved;
        return {
          ...inv,
          reservedQuantity: inv.reserved,
          availableQuantity: avail,
          lowStockThreshold: inv.safetyStock,
          isLowStock: avail <= inv.safetyStock,
          isOutOfStock: avail <= 0
        };
      }),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }
  async findStockMovements(options) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 20)));
    const skip = (page - 1) * limit;
    const where = {};
    if (options.inventoryId) where.inventoryId = options.inventoryId;
    if (options.type) where.type = options.type;
    if (options.productId) where.inventory = { productId: options.productId };
    const [items, total] = await Promise.all([
      this.client.stockMovement.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          inventory: {
            select: {
              id: true,
              productId: true,
              product: { select: { id: true, name: true } },
              warehouse: { select: { id: true, name: true } }
            }
          },
          performedBy: { select: { id: true, displayName: true, email: true } }
        }
      }),
      this.client.stockMovement.count({ where })
    ]);
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }
  async findMovements(options) {
    return this.findStockMovements(options);
  }
};
var inventory_repository_default = InventoryRepository;

// ../backend/src/repositories/supplier-repository.ts
var SupplierRepository = class extends base_repository_default {
  constructor() {
    super("supplier");
  }
};
var supplier_repository_default = SupplierRepository;

// ../backend/src/repositories/customer-repository.ts
init_prisma_service();
var CustomerRepository = class extends base_repository_default {
  constructor() {
    super("customer");
  }
  async create(data) {
    return this.client.customer.create({
      data: {
        customerCode: data.customerCode,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        phone: data.phone ?? null,
        email: data.email ?? null,
        status: data.status ?? "ACTIVE",
        notes: data.notes ?? null
      }
    });
  }
  async findById(id) {
    return this.client.customer.findFirst({ where: { id, deletedAt: null } });
  }
  async findByUnique(field, value, excludeId) {
    return this.client.customer.findFirst({
      where: {
        [field]: value,
        deletedAt: null,
        ...excludeId ? { NOT: { id: excludeId } } : {}
      }
    });
  }
  async update(id, data) {
    const firstName = data.firstName;
    const lastName = data.lastName;
    const current = await this.client.customer.findUnique({ where: { id } });
    if (!current || current.deletedAt) throw new Error("customer_not_found");
    return this.client.customer.update({
      where: { id },
      data: {
        ...data.customerCode === void 0 ? {} : { customerCode: data.customerCode },
        ...firstName === void 0 ? {} : { firstName },
        ...lastName === void 0 ? {} : { lastName },
        ...firstName === void 0 && lastName === void 0 ? {} : {
          fullName: `${firstName ?? current.firstName} ${lastName ?? current.lastName}`.trim()
        },
        ...data.phone === void 0 ? {} : { phone: data.phone },
        ...data.email === void 0 ? {} : { email: data.email },
        ...data.status === void 0 ? {} : { status: data.status },
        ...data.notes === void 0 ? {} : { notes: data.notes }
      }
    });
  }
  async delete(id) {
    await this.client.customer.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
  }
  async paginate(options) {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, Math.min(100, options.limit ?? 25));
    const where = { AND: [{ deletedAt: null }, options.filters ?? {}] };
    const orderBy = options.sort ? { [options.sort]: options.order ?? "asc" } : { createdAt: "desc" };
    const [data, total] = await Promise.all([
      this.client.customer.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy }),
      this.client.customer.count({ where })
    ]);
    return { data, total, page, limit };
  }
  async createAddress(customerId, data) {
    return prisma_service_default.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerAddress.updateMany({ where: { customerId }, data: { isDefault: false } });
      }
      const address = await tx.address.create({
        data: {
          label: data.label ?? null,
          line1: data.street,
          city: data.city,
          state: data.district,
          country: data.country,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null
        }
      });
      return tx.customerAddress.create({
        data: {
          customerId,
          addressId: address.id,
          label: data.label ?? null,
          recipientName: data.recipientName,
          phone: data.phone,
          country: data.country,
          city: data.city,
          district: data.district,
          street: data.street,
          building: data.building ?? null,
          floor: data.floor ?? null,
          landmark: data.landmark ?? null,
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          isDefault: data.isDefault ?? false
        }
      });
    });
  }
  async listAddresses(customerId) {
    return this.client.customerAddress.findMany({ where: { customerId }, orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] });
  }
  async findAddress(customerId, addressId) {
    return this.client.customerAddress.findFirst({ where: { id: addressId, customerId } });
  }
  async updateAddress(customerId, addressId, data) {
    return prisma_service_default.transaction(async (tx) => {
      if (data.isDefault) {
        await tx.customerAddress.updateMany({ where: { customerId, NOT: { id: addressId } }, data: { isDefault: false } });
      }
      const current = await tx.customerAddress.findFirst({ where: { id: addressId, customerId } });
      if (!current) throw new Error("address_not_found");
      const updated = await tx.customerAddress.update({
        where: { id: addressId },
        data: {
          ...data.label === void 0 ? {} : { label: data.label },
          ...data.recipientName === void 0 ? {} : { recipientName: data.recipientName },
          ...data.phone === void 0 ? {} : { phone: data.phone },
          ...data.country === void 0 ? {} : { country: data.country },
          ...data.city === void 0 ? {} : { city: data.city },
          ...data.district === void 0 ? {} : { district: data.district },
          ...data.street === void 0 ? {} : { street: data.street },
          ...data.building === void 0 ? {} : { building: data.building },
          ...data.floor === void 0 ? {} : { floor: data.floor },
          ...data.landmark === void 0 ? {} : { landmark: data.landmark },
          ...data.latitude === void 0 ? {} : { latitude: data.latitude },
          ...data.longitude === void 0 ? {} : { longitude: data.longitude },
          ...data.isDefault === void 0 ? {} : { isDefault: data.isDefault }
        }
      });
      await tx.address.update({
        where: { id: current.addressId },
        data: {
          ...data.label === void 0 ? {} : { label: data.label },
          ...data.street === void 0 ? {} : { line1: data.street },
          ...data.city === void 0 ? {} : { city: data.city },
          ...data.district === void 0 ? {} : { state: data.district },
          ...data.country === void 0 ? {} : { country: data.country },
          ...data.latitude === void 0 ? {} : { latitude: data.latitude },
          ...data.longitude === void 0 ? {} : { longitude: data.longitude }
        }
      });
      return updated;
    });
  }
  async deleteAddress(customerId, addressId) {
    const address = await this.client.customerAddress.findFirst({ where: { id: addressId, customerId } });
    if (!address) throw new Error("address_not_found");
    await this.client.customerAddress.delete({ where: { id: addressId } });
  }
};
var customer_repository_default = CustomerRepository;

// ../backend/src/repositories/cart-repository.ts
var CartRepository = class extends base_repository_default {
  constructor() {
    super("cart");
  }
  async findOrCreateCartByCustomerId(customerId) {
    let cart = await this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });
    if (!cart) {
      cart = await this.client.cart.create({
        data: { customerId },
        include: {
          items: {
            include: {
              product: true
            },
            orderBy: { createdAt: "asc" }
          }
        }
      });
    }
    return cart;
  }
  async findCartByCustomerId(customerId) {
    return this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });
  }
  async findCartItemById(cartItemId) {
    return this.client.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true
      }
    });
  }
  async findCartItemByCartAndProduct(cartId, productId, variantId) {
    return this.client.cartItem.findFirst({
      where: {
        cartId,
        productId,
        ...variantId ? { variantId } : {}
      }
    });
  }
  async addItem(cartId, productId, variantId, quantity, unitPrice) {
    const existing = await this.findCartItemByCartAndProduct(cartId, productId, variantId);
    if (existing) {
      return this.client.cartItem.update({
        where: { id: existing.id },
        data: {
          quantity: existing.quantity + quantity,
          unitPrice
        }
      });
    }
    return this.client.cartItem.create({
      data: {
        cartId,
        productId,
        variantId: variantId ?? null,
        quantity,
        unitPrice
      }
    });
  }
  async updateItemQuantity(cartItemId, quantity) {
    return this.client.cartItem.update({
      where: { id: cartItemId },
      data: { quantity }
    });
  }
  async removeItem(cartItemId) {
    await this.client.cartItem.delete({
      where: { id: cartItemId }
    });
  }
  async clearCart(cartId) {
    await this.client.cartItem.deleteMany({
      where: { cartId }
    });
  }
  async findCustomerByUserIdOrEmail(userId, email) {
    if (userId) {
      const byUser = await this.client.customer.findFirst({
        where: { userId, deletedAt: null }
      });
      if (byUser) return byUser;
    }
    if (email) {
      const byEmail = await this.client.customer.findFirst({
        where: { email, deletedAt: null }
      });
      if (byEmail) return byEmail;
    }
    return null;
  }
  async createCustomerForUser(userId, email) {
    const code = `CUST-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const user = await this.client.user.findUnique({ where: { id: userId } });
    const nameParts = user?.displayName?.split(" ") ?? ["User", "Customer"];
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "Customer";
    return this.client.customer.create({
      data: {
        userId,
        customerCode: code,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`.trim(),
        email: email || user?.email || null,
        phone: user?.phone || null,
        status: "ACTIVE"
      }
    });
  }
  async findProductById(productId) {
    return this.client.product.findUnique({
      where: { id: productId }
    });
  }
};
var cart_repository_default = CartRepository;

// ../backend/src/modules/invoices/controller.ts
import { createHmac as createHmac2, timingSafeEqual as timingSafeEqual2 } from "node:crypto";
init_prisma_service();
var INVOICE_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
function getInvoiceSecret() {
  const secret = String(process.env.PUBLIC_INVOICE_SECRET ?? "").trim();
  if (secret.length < 32) throw new Error("public_invoice_secret_not_configured");
  return secret;
}
function signature(invoiceId, expiresAt) {
  return createHmac2("sha256", getInvoiceSecret()).update(`${invoiceId}.${expiresAt}`).digest("hex");
}
function invoicePublicToken(invoiceId, nowSeconds = Math.floor(Date.now() / 1e3)) {
  const expiresAt = nowSeconds + INVOICE_TOKEN_TTL_SECONDS;
  return `${expiresAt}.${signature(invoiceId, expiresAt)}`;
}
function validToken(invoiceId, token) {
  const [expiryText, provided] = String(token).split(".");
  const expiresAt = Number(expiryText);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1e3) || !/^[a-f0-9]{64}$/i.test(provided || "")) return false;
  const expected = signature(invoiceId, expiresAt);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(provided, "utf8");
  return a.length === b.length && timingSafeEqual2(a, b);
}
var InvoicesController = class {
  prisma = PrismaService.getClient();
  async getPublic(request4) {
    const ctx = { timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(), requestId: request4.context?.metadata?.requestId, version: "v1" };
    const id = request4.params?.id;
    const token = Array.isArray(request4.query?.token) ? request4.query?.token[0] : request4.query?.token;
    if (!id || typeof token !== "string") return validationError("invoice_link_invalid_or_expired", ctx);
    try {
      if (!validToken(id, token)) return validationError("invoice_link_invalid_or_expired", ctx);
    } catch (error) {
      if (error instanceof Error && error.message === "public_invoice_secret_not_configured") return internalError(error.message, ctx);
      return validationError("invoice_link_invalid_or_expired", ctx);
    }
    try {
      const invoice = await this.prisma.invoice.findUnique({ where: { id }, include: { order: { include: { items: true, customer: { select: { fullName: true, phone: true } }, branch: { select: { name: true, phone: true } } } } } });
      if (!invoice) return notFound("invoice_not_found", ctx);
      let businessLogoUrl = null;
      let notificationPhone = null;
      try {
        const settings = await this.prisma.$queryRawUnsafe('SELECT "key", "value" FROM "system_settings" WHERE "key" IN ($1, $2)', "business_logo_url", "notification_phone");
        businessLogoUrl = settings.find((item) => item.key === "business_logo_url")?.value || null;
        notificationPhone = settings.find((item) => item.key === "notification_phone")?.value || null;
      } catch {
      }
      return success({ id: invoice.id, number: invoice.number, issuedAt: invoice.issuedAt, total: invoice.total, order: { code: invoice.order.code, subtotal: invoice.order.subtotal, shipping: invoice.order.shipping, tax: invoice.order.tax, total: invoice.order.total, currency: invoice.order.currency, customer: invoice.order.customer, items: invoice.order.items }, company: { name: invoice.order.branch?.name || "\u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629", logoUrl: businessLogoUrl, phone: invoice.order.branch?.phone || notificationPhone } }, ctx);
    } catch {
      return internalError("invoice_unavailable", ctx);
    }
  }
};
var controller_default = InvoicesController;

// ../backend/src/repositories/order-repository.ts
var ALLOWED_TRANSITIONS = {
  DRAFT: ["PENDING", "CONFIRMED", "CANCELED"],
  PENDING: ["CONFIRMED", "CANCELED"],
  CONFIRMED: ["PACKED", "SHIPPED", "CANCELED"],
  PACKED: ["SHIPPED", "CANCELED"],
  SHIPPED: ["DELIVERED", "RETURNED"],
  DELIVERED: ["RETURNED", "REFUNDED"],
  CANCELED: [],
  RETURNED: ["REFUNDED"],
  REFUNDED: []
};
var idempotencyStore = /* @__PURE__ */ new Map();
var OrderRepository = class extends base_repository_default {
  constructor() {
    super("order");
  }
  async createOrderFromCart(customerId, options) {
    const tenantKey = options?.tenantId || "default";
    const idempotencyKey = options?.idempotencyKey;
    const cacheKey = idempotencyKey ? `${tenantKey}:${customerId}:${idempotencyKey}` : null;
    if (cacheKey && idempotencyStore.has(cacheKey)) {
      const cached = idempotencyStore.get(cacheKey);
      if (Date.now() - cached.createdAt < 24 * 3600 * 1e3) {
        return cached.order;
      }
      idempotencyStore.delete(cacheKey);
    }
    if (options?.branchId && options?.storeId) {
      const branch = await this.client.branch.findUnique({
        where: { id: options.branchId }
      });
      if (branch && branch.storeId !== options.storeId) {
        throw new ValidationException("invalid_branch_scope");
      }
    }
    const cart = await this.client.cart.findFirst({
      where: { customerId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new ValidationException("cart_is_empty");
    }
    for (const item of cart.items) {
      if (!item.product || item.product.deletedAt !== null || item.product.isActive === false) {
        throw new ValidationException(`product_unavailable_${item.productId}`);
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new ValidationException("invalid_item_quantity");
      }
    }
    let subtotal = 0;
    const now = /* @__PURE__ */ new Date();
    const preparedItems = cart.items.map((item) => {
      const p = item.product;
      let unitPrice = typeof p.price === "number" ? p.price : item.unitPrice || 0;
      if (p.offer && p.offer.active) {
        const startValid = !p.offer.startDate || new Date(p.offer.startDate) <= now;
        const endValid = !p.offer.endDate || new Date(p.offer.endDate) >= now;
        if (startValid && endValid) {
          if (p.offer.offerPrice && p.offer.offerPrice > 0 && p.offer.offerPrice < unitPrice) {
            unitPrice = p.offer.offerPrice;
          } else if (p.offer.type === "percentage" && p.offer.discountValue > 0) {
            unitPrice = Math.max(0.01, unitPrice * (1 - p.offer.discountValue / 100));
          } else if (p.offer.type === "fixed" && p.offer.discountValue > 0) {
            unitPrice = Math.max(0.01, unitPrice - p.offer.discountValue);
          }
          unitPrice = Math.round(unitPrice * 100) / 100;
        }
      }
      const itemTotal = Math.round(unitPrice * item.quantity * 100) / 100;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        variantId: item.variantId ?? null,
        sku: item.product.sku ?? null,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice,
        taxAmount: 0,
        total: itemTotal
      };
    });
    subtotal = Math.round(subtotal * 100) / 100;
    const tax = 0;
    const shipping = 0;
    const total = subtotal + tax + shipping;
    const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const createdOrder = await this.client.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code,
          customerId,
          tenantId: options?.tenantId || null,
          storeId: options?.storeId || null,
          branchId: options?.branchId || null,
          status: "PENDING",
          subtotal,
          tax,
          shipping,
          total,
          currency: "YER",
          placedAt: /* @__PURE__ */ new Date()
        }
      });
      for (const pItem of preparedItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            ...pItem
          }
        });
        const invRepo = new InventoryRepository();
        await invRepo.reserveStockForOrder(tx, pItem.productId, pItem.quantity, order.id, pItem.variantId);
      }
      await tx.invoice.create({
        data: {
          orderId: order.id,
          number: `INV-${code}`,
          issuedAt: /* @__PURE__ */ new Date(),
          total
        }
      });
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });
      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: { product: true }
          },
          customer: {
            select: { id: true, fullName: true, email: true, phone: true }
          },
          invoices: true
        }
      });
    });
    if (!createdOrder) {
      throw new Error("order_creation_failed");
    }
    const orderResult = createdOrder;
    const publicAppUrl = String(process.env.PUBLIC_APP_URL || "https://green-store-enterprise-v21.vercel.app").replace(/\/+$/, "");
    const orderWithInvoiceLinks = {
      ...orderResult,
      invoices: (orderResult.invoices || []).map((invoice) => {
        let publicUrl;
        try {
          publicUrl = `${publicAppUrl}/invoices/${encodeURIComponent(invoice.id)}?token=${invoicePublicToken(invoice.id)}`;
        } catch {
        }
        return { ...invoice, publicUrl };
      })
    };
    if (cacheKey) {
      idempotencyStore.set(cacheKey, { order: orderWithInvoiceLinks, createdAt: Date.now() });
    }
    try {
      await new notification_repository_default().createForManagementUsers({
        title: "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0648\u0635\u0644",
        body: `\u0627\u0644\u0637\u0644\u0628 ${orderWithInvoiceLinks.code} \u0628\u0642\u064A\u0645\u0629 ${Number(orderResult.total).toLocaleString("ar-YE")} \u0631.\u064A.`,
        channel: "admin",
        payload: {
          type: "order_created",
          orderId: orderWithInvoiceLinks.id,
          orderCode: orderWithInvoiceLinks.code,
          total: orderResult.total
        }
      });
    } catch {
    }
    return orderWithInvoiceLinks;
  }
  async findOrders(options) {
    const page = Math.max(1, Number(options.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(options.limit ?? 10)));
    const skip = (page - 1) * limit;
    const sortField = options.sort ?? "createdAt";
    const sortOrder = options.order ?? "desc";
    const where = {
      deletedAt: null
    };
    if (options.customerId) {
      where.customerId = options.customerId;
    }
    if (options.status) {
      where.status = options.status;
    }
    if (options.search) {
      where.OR = [
        { code: { contains: options.search, mode: "insensitive" } },
        { items: { some: { name: { contains: options.search, mode: "insensitive" } } } }
      ];
    }
    const [items, total] = await Promise.all([
      this.client.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortField]: sortOrder },
        include: {
          items: {
            include: { product: true }
          },
          customer: {
            select: { id: true, fullName: true, email: true, phone: true }
          },
          invoices: true
        }
      }),
      this.client.order.count({ where })
    ]);
    const totalPages = Math.ceil(total / limit);
    return {
      items,
      total,
      page,
      limit,
      totalPages
    };
  }
  async findOrderById(orderId, customerId) {
    const order = await this.client.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true }
        },
        customer: {
          select: { id: true, fullName: true, email: true, phone: true }
        },
        invoices: true
      }
    });
    if (!order || order.deletedAt !== null) return null;
    if (customerId && order.customerId !== customerId) {
      return null;
    }
    return order;
  }
  async updateOrderStatus(orderId, newStatus, customerId) {
    return this.client.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order || order.deletedAt !== null) {
        throw new NotFoundException("order_not_found");
      }
      if (customerId) {
        if (order.customerId !== customerId) throw new NotFoundException("order_not_found");
        if (newStatus !== "CANCELED") throw new ValidationException("customer_cannot_set_status");
        if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
          throw new ValidationException("order_cannot_be_cancelled");
        }
      }
      const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
      if (!allowed.includes(newStatus)) {
        throw new ValidationException(`invalid_status_transition_${order.status}_to_${newStatus}`);
      }
      const orderWithItems = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true }
      });
      const invRepo = new InventoryRepository();
      if (newStatus === "CANCELED") {
        for (const item of orderWithItems?.items ?? []) {
          await invRepo.releaseStockForOrder(tx, item.productId, item.quantity, orderId, item.variantId);
        }
      } else if (newStatus === "SHIPPED") {
        for (const item of orderWithItems?.items ?? []) {
          await invRepo.deductStockForShipment(tx, item.productId, item.quantity, orderId, item.variantId);
        }
      }
      return tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        include: {
          items: { include: { product: true } },
          customer: { select: { id: true, fullName: true, email: true, phone: true } },
          invoices: true
        }
      });
    });
  }
};
var order_repository_default = OrderRepository;

// ../backend/src/repositories/payment-repository.ts
var PaymentRepository = class extends base_repository_default {
  constructor() {
    super("payment");
  }
  async createPaymentTransaction(params) {
    const { orderId, paymentMethod, idempotencyKey, customerIdCheck } = params;
    const order = await this.client.order.findUnique({
      where: { id: orderId },
      include: { customer: true }
    });
    if (!order) {
      throw new NotFoundException("order_not_found");
    }
    if (customerIdCheck && order.customerId !== customerIdCheck) {
      throw new NotFoundException("order_not_found");
    }
    const existing = await this.client.payment.findFirst({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" }
    });
    if (existing) {
      return existing;
    }
    const amount = order.total;
    if (amount <= 0) {
      throw new ValidationException("invalid_order_amount");
    }
    const initialStatus = paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "COMPLETED";
    const providerRef = `PAY-REF-${Date.now()}-${Math.floor(Math.random() * 1e4)}`;
    const transaction = await this.client.payment.create({
      data: {
        orderId: order.id,
        amount,
        status: initialStatus,
        method: paymentMethod,
        providerRef,
        paidAt: initialStatus === "COMPLETED" ? /* @__PURE__ */ new Date() : null
      }
    });
    if (initialStatus === "COMPLETED" && order.status === "PENDING") {
      await this.client.order.update({
        where: { id: order.id },
        data: { status: "CONFIRMED" }
      });
    }
    return transaction;
  }
  async verifyPaymentTransaction(paymentId, targetStatus = "COMPLETED", providerReference) {
    const existing = await this.client.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });
    if (!existing) {
      throw new NotFoundException("payment_transaction_not_found");
    }
    const updated = await this.client.payment.update({
      where: { id: paymentId },
      data: {
        status: targetStatus,
        providerRef: providerReference ?? existing.providerRef,
        paidAt: targetStatus === "COMPLETED" ? /* @__PURE__ */ new Date() : existing.paidAt
      }
    });
    if (targetStatus === "COMPLETED" && existing.order && existing.order.status === "PENDING") {
      await this.client.order.update({
        where: { id: existing.orderId },
        data: { status: "CONFIRMED" }
      });
    }
    return updated;
  }
  async findPaymentByOrderId(orderId, customerIdCheck) {
    const order = await this.client.order.findUnique({
      where: { id: orderId }
    });
    if (!order) return null;
    if (customerIdCheck && order.customerId !== customerIdCheck) return null;
    return this.client.payment.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" }
    });
  }
};
var payment_repository_default = PaymentRepository;

// ../backend/src/repositories/audit-repository.ts
var SENSITIVE_KEYS = ["password", "passwordHash", "token", "jwt", "secret", "creditCard"];
function sanitizeObject(obj) {
  if (!obj) return null;
  if (typeof obj === "string") {
    try {
      obj = JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  const clean = { ...obj };
  for (const key of Object.keys(clean)) {
    if (SENSITIVE_KEYS.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))) {
      clean[key] = "[REDACTED]";
    }
  }
  return JSON.stringify(clean);
}
var AuditRepository = class extends base_repository_default {
  constructor() {
    super("auditLog");
  }
  // Append-Only Audit Logging
  async createAuditLog(data) {
    return this.client.auditLog.create({
      data: {
        actorId: data.actorId ?? null,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId ?? null,
        before: sanitizeObject(data.before),
        after: sanitizeObject(data.after),
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null
      }
    });
  }
  async findAuditLogs(params) {
    const limit = Math.min(params.limit ?? 20, 100);
    const page = Math.max(params.page ?? 1, 1);
    const skip = (page - 1) * limit;
    const where = {};
    if (params.actorId) where.actorId = params.actorId;
    if (params.resource) where.resource = params.resource;
    if (params.action) where.action = params.action;
    const [items, total] = await Promise.all([
      this.client.auditLog.findMany({
        where,
        include: { actor: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      this.client.auditLog.count({ where })
    ]);
    return {
      items: items.map((item) => ({
        id: item.id,
        actorId: item.actorId,
        actorName: item.actor?.displayName || item.actor?.email || "\u0627\u0644\u0646\u0638\u0627\u0645 (System)",
        action: item.action,
        resource: item.resource,
        resourceId: item.resourceId,
        before: item.before,
        after: item.after,
        ipAddress: item.ipAddress,
        createdAt: item.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      }
    };
  }
};
var audit_repository_default = AuditRepository;

// ../backend/src/repositories/repository-factory.ts
var tenantRepository = new tenant_repository_default();
var userRepository = new user_repository_default();
var roleRepository = new role_repository_default();
var permissionRepository = new permission_repository_default();
var storeRepository = new store_repository_default();
var branchRepository = new branch_repository_default();
var categoryRepository = new category_repository_default();
var productRepository = new product_repository_default();
var inventoryRepository = new inventory_repository_default();
var supplierRepository = new supplier_repository_default();
var customerRepository = new customer_repository_default();
var cartRepository = new cart_repository_default();
var orderRepository = new order_repository_default();
var paymentRepository = new payment_repository_default();
var notificationRepository = new notification_repository_default();
var auditRepository = new audit_repository_default();
var RepositoryFactory = {
  getTenantRepository: () => tenantRepository,
  getUserRepository: () => userRepository,
  getRoleRepository: () => roleRepository,
  getPermissionRepository: () => permissionRepository,
  getStoreRepository: () => storeRepository,
  getBranchRepository: () => branchRepository,
  getCategoryRepository: () => categoryRepository,
  getProductRepository: () => productRepository,
  getInventoryRepository: () => inventoryRepository,
  getSupplierRepository: () => supplierRepository,
  getCustomerRepository: () => customerRepository,
  getCartRepository: () => cartRepository,
  getOrderRepository: () => orderRepository,
  getPaymentRepository: () => paymentRepository,
  getNotificationRepository: () => notificationRepository,
  getAuditRepository: () => auditRepository
};

// ../backend/src/repositories/logger.ts
var NoopLogger = class {
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
};
var logger = new NoopLogger();

// ../backend/src/services/base-service.ts
init_prisma_service();

// ../backend/src/repositories/prisma-error-mapper.ts
import prismaClientPackage2 from "@prisma/client";
var { Prisma } = prismaClientPackage2;
function mapPrismaError(err) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        throw new ConflictException(err.message);
      case "P2025":
        throw new NotFoundException(err.message);
      case "P2003":
        throw new DatabaseException(err.message);
      default:
        throw new DatabaseException(err.message);
    }
  }
  if (err instanceof Error) {
    throw new DatabaseException(err.message);
  }
  throw new DatabaseException("Unknown database error");
}

// ../backend/src/services/base-service.ts
var BaseService = class {
  logger = logger;
  constructor() {
  }
  // Validation hooks (override in concrete services)
  async validateCreate(_data) {
  }
  async validateUpdate(_id, _data) {
  }
  async validateDelete(_id) {
  }
  // Transaction helper
  async runInTransaction(work) {
    try {
      return await prisma_service_default.transaction(async (tx) => work(tx));
    } catch (err) {
      mapPrismaError(err);
    }
  }
  // Generic error wrapper to map Prisma errors
  handleRepoError(err) {
    mapPrismaError(err);
  }
};
var base_service_default = BaseService;

// ../backend/src/services/tenant-service.ts
var TenantService = class extends base_service_default {
  constructor(tenantRepo) {
    super();
    this.tenantRepo = tenantRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.tenantRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.tenantRepo.findById(id);
  }
  async findMany(filter) {
    return this.tenantRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.tenantRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.tenantRepo.delete(id);
  }
  async paginate(options) {
    return this.tenantRepo.paginate(options);
  }
};
var tenant_service_default = TenantService;

// ../backend/src/services/user-service.ts
var UserService = class extends base_service_default {
  constructor(userRepo, roleRepo) {
    super();
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.userRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.userRepo.findById(id);
  }
  async findMany(filter) {
    return this.userRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.userRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.userRepo.delete(id);
  }
  async paginate(options) {
    return this.userRepo.paginate(options);
  }
  async restore(id) {
    return this.userRepo.restore(id);
  }
  async listRoles(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("user_not_found");
    const roles = await this.userRepo.findUserRoles(userId);
    return { userId, roles };
  }
  async assignRole(userId, roleId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("user_not_found");
    if (!this.roleRepo) throw new Error("role_repository_not_configured");
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const repository = this.userRepo;
    if (await repository.hasRole(userId, roleId)) {
      throw new ConflictException("role_already_assigned");
    }
    try {
      return await repository.assignRole(userId, roleId);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async removeRole(userId, roleId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("user_not_found");
    if (!this.roleRepo) throw new Error("role_repository_not_configured");
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const repository = this.userRepo;
    if (!await repository.hasRole(userId, roleId)) {
      throw new NotFoundException("user_role_not_found");
    }
    return repository.removeRole(userId, roleId);
  }
  async checkRole(userId, roleId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException("user_not_found");
    if (!this.roleRepo) throw new Error("role_repository_not_configured");
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    return this.userRepo.hasRole(userId, roleId);
  }
};
var user_service_default = UserService;

// ../backend/src/services/role-service.ts
var RoleService = class extends base_service_default {
  constructor(roleRepo, permissionRepo) {
    super();
    this.roleRepo = roleRepo;
    this.permissionRepo = permissionRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.roleRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.roleRepo.findById(id);
  }
  async findMany(filter) {
    return this.roleRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.roleRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.roleRepo.delete(id);
  }
  async paginate(options) {
    return this.roleRepo.paginate(options);
  }
  async restore(id) {
    return this.roleRepo.restore(id);
  }
  async listPermissions(roleId) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const permissions = await this.roleRepo.findRolePermissions(roleId);
    return { role, permissions };
  }
  async assignPermission(roleId, permissionId) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException("permission_not_found");
    const alreadyAssigned = await this.roleRepo.hasPermission(roleId, permissionId);
    if (alreadyAssigned) throw new ConflictException("permission_already_assigned");
    try {
      return await this.roleRepo.assignPermission(roleId, permissionId);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async removePermission(roleId, permissionId) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException("permission_not_found");
    const exists = await this.roleRepo.hasPermission(roleId, permissionId);
    if (!exists) throw new NotFoundException("role_permission_not_found");
    return this.roleRepo.removePermission(roleId, permissionId);
  }
  async checkPermission(roleId, permissionId) {
    const role = await this.roleRepo.findById(roleId);
    if (!role) throw new NotFoundException("role_not_found");
    const permission = await this.permissionRepo.findById(permissionId);
    if (!permission) throw new NotFoundException("permission_not_found");
    return this.roleRepo.hasPermission(roleId, permissionId);
  }
};
var role_service_default = RoleService;

// ../backend/src/services/permission-service.ts
var PermissionService = class extends base_service_default {
  constructor(permissionRepo) {
    super();
    this.permissionRepo = permissionRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.permissionRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.permissionRepo.findById(id);
  }
  async findMany(filter) {
    return this.permissionRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.permissionRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.permissionRepo.delete(id);
  }
  async restore(id) {
    return this.permissionRepo.restore(id);
  }
  async paginate(options) {
    return this.permissionRepo.paginate(options);
  }
};
var permission_service_default = PermissionService;

// ../backend/src/services/store-service.ts
var StoreService = class extends base_service_default {
  constructor(storeRepo) {
    super();
    this.storeRepo = storeRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.storeRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.storeRepo.findById(id);
  }
  async findMany(filter) {
    return this.storeRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.storeRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.storeRepo.delete(id);
  }
  async paginate(options) {
    return this.storeRepo.paginate(options);
  }
};
var store_service_default = StoreService;

// ../backend/src/services/branch-service.ts
var BranchService = class extends base_service_default {
  constructor(branchRepo) {
    super();
    this.branchRepo = branchRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.branchRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.branchRepo.findById(id);
  }
  async findMany(filter) {
    return this.branchRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.branchRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.branchRepo.delete(id);
  }
  async paginate(options) {
    return this.branchRepo.paginate(options);
  }
};
var branch_service_default = BranchService;

// ../backend/src/services/category-service.ts
var CategoryService = class extends base_service_default {
  constructor(categoryRepo) {
    super();
    this.categoryRepo = categoryRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.categoryRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.categoryRepo.findById(id);
  }
  async findMany(filter) {
    return this.categoryRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.categoryRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.categoryRepo.delete(id);
  }
  async paginate(options) {
    return this.categoryRepo.paginate(options);
  }
};
var category_service_default = CategoryService;

// ../backend/src/services/product-service.ts
var ProductService = class extends base_service_default {
  constructor(productRepo) {
    super();
    this.productRepo = productRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.productRepo.create(this.toPersistencePayload(data));
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.productRepo.findById(id);
  }
  async findMany(filter) {
    return this.productRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.productRepo.update(id, this.toPersistencePayload(data, true));
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.productRepo.delete(id);
  }
  async paginate(options) {
    return this.productRepo.paginate(options);
  }
  async restore(id) {
    if (!id) throw new ValidationException("id_required");
    try {
      return await this.productRepo.restore(id);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async validateCreate(data) {
    if (!data || typeof data !== "object") throw new ValidationException("data_required");
    const payload = data;
    if (typeof payload.name !== "string" || !payload.name.trim()) throw new ValidationException("name_required");
    if (typeof payload.slug !== "string" || !payload.slug.trim()) throw new ValidationException("slug_required");
    this.validateOptionalFields(payload);
    if (await this.productRepo.findBySlug(payload.slug.trim())) throw new ConflictException("product_slug_exists");
  }
  async validateUpdate(id, data) {
    if (!id) throw new ValidationException("id_required");
    if (!data || typeof data !== "object") throw new ValidationException("data_required");
    if (!await this.productRepo.findById(id)) throw new NotFoundException("product_not_found");
    this.validateOptionalFields(data, true);
    const payload = data;
    if (typeof payload.slug === "string" && await this.productRepo.findBySlug(payload.slug.trim(), id)) {
      throw new ConflictException("product_slug_exists");
    }
  }
  async validateDelete(id) {
    if (!id) throw new ValidationException("id_required");
    if (!await this.productRepo.findById(id)) throw new NotFoundException("product_not_found");
  }
  validateOptionalFields(payload, update = false) {
    const stringFields = ["sku", "barcode", "name", "slug", "description", "originCountry", "storageInstructions", "qualityGrade", "weightUnit", "shippingClass", "brandId", "unitId", "categoryId", "subcategoryId", "produceKey", "familyId", "imageUrl", "imageAltText"];
    const maxLengths = {
      sku: 100,
      barcode: 32,
      name: 255,
      slug: 255,
      description: 5e3,
      brandId: 36,
      unitId: 36,
      categoryId: 36,
      subcategoryId: 36,
      produceKey: 120,
      familyId: 36,
      imageUrl: 45e4,
      imageAltText: 255,
      originCountry: 100,
      storageInstructions: 1e3,
      qualityGrade: 40,
      weightUnit: 20,
      shippingClass: 40
    };
    for (const field of stringFields) {
      if (payload[field] !== void 0 && payload[field] !== null && typeof payload[field] !== "string") {
        throw new ValidationException(`${field}_invalid`);
      }
      if (typeof payload[field] === "string") {
        if (!payload[field].trim()) throw new ValidationException(`${field}_required`);
        if (payload[field].trim().length > maxLengths[field]) throw new ValidationException(`${field}_too_long`);
      }
    }
    for (const field of ["weightValue", "packageLength", "packageWidth", "packageHeight", "shippingWeight"]) {
      if (payload[field] !== void 0 && payload[field] !== null) {
        const value = Number(payload[field]);
        if (!Number.isFinite(value) || value < 0 || value > 1e6) throw new ValidationException(`${field}_invalid`);
      }
    }
    if (typeof payload.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug.trim())) {
      throw new ValidationException("slug_invalid");
    }
    for (const field of ["brandId", "unitId", "categoryId", "subcategoryId"]) {
      if (typeof payload[field] === "string" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload[field].trim())) {
        throw new ValidationException(`${field}_invalid`);
      }
    }
    for (const field of ["harvestDate", "expiryDate"]) {
      if (payload[field] !== void 0 && payload[field] !== null) {
        if (typeof payload[field] !== "string" && !(payload[field] instanceof Date)) throw new ValidationException(`${field}_invalid`);
        const date = new Date(payload[field]);
        if (Number.isNaN(date.getTime())) throw new ValidationException(`${field}_invalid`);
      }
    }
    if (payload.harvestDate && payload.expiryDate && new Date(payload.expiryDate) < new Date(payload.harvestDate)) {
      throw new ValidationException("expiry_before_harvest");
    }
    if (payload.isPublished !== void 0 && typeof payload.isPublished !== "boolean") {
      throw new ValidationException("isPublished_invalid");
    }
    if (typeof payload.imageUrl === "string" && payload.imageUrl.trim()) {
      const imageUrl = payload.imageUrl.trim();
      const isAllowedImage = /^(https?:\/\/|data:image\/(?:jpeg|jpg|png|webp);base64,)/i.test(imageUrl);
      if (!isAllowedImage) throw new ValidationException("imageUrl_invalid");
      if (imageUrl.length > maxLengths.imageUrl) throw new ValidationException("imageUrl_too_large");
    }
    if (update && !stringFields.some((field) => payload[field] !== void 0) && payload.isPublished === void 0) {
      throw new ValidationException("data_required");
    }
  }
  toPersistencePayload(payload, update = false) {
    const fields = ["sku", "barcode", "produceKey", "familyId", "name", "slug", "description", "originCountry", "storageInstructions", "qualityGrade", "weightUnit", "shippingClass", "brandId", "unitId", "categoryId", "subcategoryId", "imageUrl", "imageAltText", "isPublished"];
    const result = {};
    for (const field of fields) {
      if (payload[field] !== void 0) {
        result[field] = typeof payload[field] === "string" ? payload[field].trim() : payload[field];
      }
    }
    for (const field of ["weightValue", "packageLength", "packageWidth", "packageHeight", "shippingWeight"]) {
      if (payload[field] !== void 0) result[field] = payload[field] === null ? null : Number(payload[field]);
    }
    for (const field of ["harvestDate", "expiryDate"]) {
      if (payload[field] !== void 0) result[field] = payload[field] === null ? null : new Date(payload[field]);
    }
    if (!update && result.isPublished === void 0) result.isPublished = false;
    return result;
  }
};
var product_service_default = ProductService;

// ../backend/src/services/inventory-service.ts
var InventoryService = class extends base_service_default {
  constructor(inventoryRepo) {
    super();
    this.inventoryRepo = inventoryRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.inventoryRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.inventoryRepo.findById(id);
  }
  async findMany(filter) {
    return this.inventoryRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.inventoryRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.inventoryRepo.delete(id);
  }
  async paginate(options) {
    return this.inventoryRepo.paginate(options);
  }
};
var inventory_service_default = InventoryService;

// ../backend/src/services/supplier-service.ts
var SupplierService = class extends base_service_default {
  constructor(supplierRepo) {
    super();
    this.supplierRepo = supplierRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.supplierRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.supplierRepo.findById(id);
  }
  async findMany(filter) {
    return this.supplierRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.supplierRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.supplierRepo.delete(id);
  }
  async paginate(options) {
    return this.supplierRepo.paginate(options);
  }
};
var supplier_service_default = SupplierService;

// ../backend/src/services/customer-service.ts
var CustomerService = class extends base_service_default {
  constructor(customerRepo) {
    super();
    this.customerRepo = customerRepo;
  }
  async create(data) {
    this.validateCustomer(data, false);
    for (const field of ["customerCode", "email", "phone"]) {
      const value = data[field];
      if (value && await this.customerRepo.findByUnique(field, value)) throw new ConflictException(`${field}_already_exists`);
    }
    try {
      return await this.customerRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.customerRepo.findById(id);
  }
  async update(id, data) {
    if (!this.isUuid(id)) throw new ValidationException("customer_id_invalid");
    const current = await this.customerRepo.findById(id);
    if (!current) throw new NotFoundException("customer_not_found");
    this.validateCustomer({ ...current, ...data }, true);
    for (const field of ["customerCode", "email", "phone"]) {
      const value = data[field];
      if (value && await this.customerRepo.findByUnique(field, value, id)) throw new ConflictException(`${field}_already_exists`);
    }
    try {
      return await this.customerRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    if (!this.isUuid(id)) throw new ValidationException("customer_id_invalid");
    if (!await this.customerRepo.findById(id)) throw new NotFoundException("customer_not_found");
    await this.customerRepo.delete(id);
  }
  async paginate(options) {
    return this.customerRepo.paginate(options);
  }
  async createAddress(customerId, data) {
    await this.requireCustomer(customerId);
    this.validateAddress(data);
    return this.customerRepo.createAddress(customerId, data);
  }
  async listAddresses(customerId) {
    await this.requireCustomer(customerId);
    return this.customerRepo.listAddresses(customerId);
  }
  async updateAddress(customerId, addressId, data) {
    await this.requireCustomer(customerId);
    if (!this.isUuid(addressId)) throw new ValidationException("address_id_invalid");
    const current = await this.customerRepo.findAddress(customerId, addressId);
    if (!current) throw new NotFoundException("address_not_found");
    this.validateAddress({ ...current, ...data });
    return this.customerRepo.updateAddress(customerId, addressId, data);
  }
  async deleteAddress(customerId, addressId) {
    await this.requireCustomer(customerId);
    if (!this.isUuid(addressId)) throw new ValidationException("address_id_invalid");
    if (!await this.customerRepo.findAddress(customerId, addressId)) throw new NotFoundException("address_not_found");
    await this.customerRepo.deleteAddress(customerId, addressId);
  }
  async requireCustomer(id) {
    if (!this.isUuid(id)) throw new ValidationException("customer_id_invalid");
    if (!await this.customerRepo.findById(id)) throw new NotFoundException("customer_not_found");
  }
  validateCustomer(data, allowPartial) {
    if (!data || typeof data !== "object") throw new ValidationException("customer_required");
    if (!allowPartial && (!data.customerCode || !data.firstName || !data.lastName)) throw new ValidationException("customer_name_required");
    if (data.customerCode !== void 0 && (!this.text(data.customerCode, 2, 64) || !/^[A-Za-z0-9_-]+$/.test(data.customerCode))) throw new ValidationException("customer_code_invalid");
    if (data.firstName !== void 0 && !this.text(data.firstName, 1, 100)) throw new ValidationException("first_name_invalid");
    if (data.lastName !== void 0 && !this.text(data.lastName, 1, 100)) throw new ValidationException("last_name_invalid");
    if (data.email !== void 0 && data.email !== null && (!this.text(data.email, 3, 255) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) throw new ValidationException("email_invalid");
    if (data.phone !== void 0 && data.phone !== null && (!this.text(data.phone, 7, 32) || !/^\+?[0-9 ()-]+$/.test(data.phone))) throw new ValidationException("phone_invalid");
    if (data.status !== void 0 && !["ACTIVE", "INACTIVE", "BLOCKED"].includes(data.status)) throw new ValidationException("status_invalid");
    if (data.notes !== void 0 && data.notes !== null && !this.text(data.notes, 0, 2e3)) throw new ValidationException("notes_invalid");
  }
  validateAddress(data) {
    for (const field of ["recipientName", "phone", "country", "city", "district", "street"]) {
      if (!this.text(data[field], field === "phone" ? 7 : 1, field === "phone" ? 32 : 255)) throw new ValidationException(`${field}_invalid`);
    }
    if (!/^\+?[0-9 ()-]+$/.test(data.phone)) throw new ValidationException("phone_invalid");
    if (data.latitude !== void 0 && data.latitude !== null && (typeof data.latitude !== "number" || data.latitude < -90 || data.latitude > 90)) throw new ValidationException("latitude_invalid");
    if (data.longitude !== void 0 && data.longitude !== null && (typeof data.longitude !== "number" || data.longitude < -180 || data.longitude > 180)) throw new ValidationException("longitude_invalid");
  }
  text(value, min, max) {
    return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
  }
  isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
};
var customer_service_default = CustomerService;

// ../backend/src/services/cart-service.ts
var CartService = class extends base_service_default {
  constructor(cartRepo) {
    super();
    this.cartRepo = cartRepo;
  }
  createNotFound(message) {
    const err = new NotFoundException(message);
    err.code = "not_found";
    return err;
  }
  async getCustomerAndCart(userId, email) {
    if (!userId) {
      throw new ValidationException2("user_id_required");
    }
    let customer = await this.cartRepo.findCustomerByUserIdOrEmail(userId, email);
    if (!customer) {
      customer = await this.cartRepo.createCustomerForUser(userId, email);
    }
    const cart = await this.cartRepo.findOrCreateCartByCustomerId(customer.id);
    return { customer, cart };
  }
  formatCartResponse(cart) {
    const formattedItems = (cart.items ?? []).map((item) => {
      const lineTotal = Number((item.quantity * item.unitPrice).toFixed(2));
      return {
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal,
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          sku: item.product.sku
        } : null,
        createdAt: item.createdAt.toISOString()
      };
    });
    const subtotal = Number(formattedItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2));
    const totalQuantity = formattedItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = subtotal;
    return {
      id: cart.id,
      customerId: cart.customerId,
      items: formattedItems,
      subtotal,
      totalQuantity,
      total,
      createdAt: cart.createdAt.toISOString(),
      updatedAt: cart.updatedAt.toISOString()
    };
  }
  async getCartForUser(userId, email) {
    const { cart } = await this.getCustomerAndCart(userId, email);
    return this.formatCartResponse(cart);
  }
  async addItem(userId, data, email) {
    if (!data || typeof data !== "object") {
      throw new ValidationException2("cart_item_required");
    }
    if (!data.productId || typeof data.productId !== "string" || !data.productId.trim()) {
      throw new ValidationException2("product_id_required");
    }
    const quantity = data.quantity ?? 1;
    if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
      throw new ValidationException2("invalid_quantity");
    }
    const product = await this.cartRepo.findProductById(data.productId.trim());
    if (!product || product.deletedAt !== null) {
      throw this.createNotFound("product_not_found");
    }
    const { cart } = await this.getCustomerAndCart(userId, email);
    const unitPrice = 0;
    await this.cartRepo.addItem(cart.id, product.id, data.variantId ?? null, quantity, unitPrice);
    return this.getCartForUser(userId, email);
  }
  async updateItemQuantity(userId, cartItemId, data, email) {
    if (!cartItemId || typeof cartItemId !== "string") {
      throw new ValidationException2("cart_item_id_invalid");
    }
    if (!data || typeof data.quantity !== "number" || !Number.isInteger(data.quantity) || data.quantity < 0) {
      throw new ValidationException2("invalid_quantity");
    }
    const existingItem = await this.cartRepo.findCartItemById(cartItemId);
    if (!existingItem) {
      throw this.createNotFound("cart_item_not_found");
    }
    const { cart } = await this.getCustomerAndCart(userId, email);
    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError("cart_item_forbidden");
    }
    if (data.quantity === 0) {
      await this.cartRepo.removeItem(cartItemId);
    } else {
      await this.cartRepo.updateItemQuantity(cartItemId, data.quantity);
    }
    return this.getCartForUser(userId, email);
  }
  async removeItem(userId, cartItemId, email) {
    if (!cartItemId || typeof cartItemId !== "string") {
      throw new ValidationException2("cart_item_id_invalid");
    }
    const existingItem = await this.cartRepo.findCartItemById(cartItemId);
    if (!existingItem) {
      throw this.createNotFound("cart_item_not_found");
    }
    const { cart } = await this.getCustomerAndCart(userId, email);
    if (existingItem.cartId !== cart.id) {
      throw new ForbiddenError("cart_item_forbidden");
    }
    await this.cartRepo.removeItem(cartItemId);
    return this.getCartForUser(userId, email);
  }
  async clearCart(userId, email) {
    const { cart } = await this.getCustomerAndCart(userId, email);
    await this.cartRepo.clearCart(cart.id);
    return this.getCartForUser(userId, email);
  }
};
var cart_service_default = CartService;

// ../backend/src/services/order-service.ts
var OrderService = class extends base_service_default {
  constructor(orderRepo) {
    super();
    this.orderRepo = orderRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.orderRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.orderRepo.findById(id);
  }
  async findMany(filter) {
    return this.orderRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.orderRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.orderRepo.delete(id);
  }
  async paginate(options) {
    return this.orderRepo.paginate(options);
  }
};
var order_service_default = OrderService;

// ../backend/src/services/payment-service.ts
var PaymentService = class extends base_service_default {
  constructor(paymentRepo) {
    super();
    this.paymentRepo = paymentRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.paymentRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.paymentRepo.findById(id);
  }
  async findMany(filter) {
    return this.paymentRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.paymentRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.paymentRepo.delete(id);
  }
  async paginate(options) {
    return this.paymentRepo.paginate(options);
  }
};
var payment_service_default = PaymentService;

// ../backend/src/services/notification-service.ts
var NotificationService = class extends base_service_default {
  constructor(notificationRepo) {
    super();
    this.notificationRepo = notificationRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.notificationRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.notificationRepo.findById(id);
  }
  async findMany(filter) {
    return this.notificationRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.notificationRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.notificationRepo.delete(id);
  }
  async paginate(options) {
    return this.notificationRepo.paginate(options);
  }
};
var notification_service_default = NotificationService;

// ../backend/src/services/audit-service.ts
var AuditService = class extends base_service_default {
  constructor(auditRepo) {
    super();
    this.auditRepo = auditRepo;
  }
  async create(data) {
    await this.validateCreate(data);
    try {
      return await this.auditRepo.create(data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async findById(id) {
    return this.auditRepo.findById(id);
  }
  async findMany(filter) {
    return this.auditRepo.findMany(filter);
  }
  async update(id, data) {
    await this.validateUpdate(id, data);
    try {
      return await this.auditRepo.update(id, data);
    } catch (err) {
      this.handleRepoError(err);
    }
  }
  async delete(id) {
    await this.validateDelete(id);
    await this.auditRepo.delete(id);
  }
  async paginate(options) {
    return this.auditRepo.paginate(options);
  }
};
var audit_service_default = AuditService;

// ../backend/src/services/service-factory.ts
var ServiceFactory = {
  createTenantService: () => new tenant_service_default(RepositoryFactory.getTenantRepository()),
  createUserService: () => new user_service_default(
    RepositoryFactory.getUserRepository(),
    RepositoryFactory.getRoleRepository()
  ),
  createRoleService: () => new role_service_default(RepositoryFactory.getRoleRepository(), RepositoryFactory.getPermissionRepository()),
  createPermissionService: () => new permission_service_default(RepositoryFactory.getPermissionRepository()),
  createStoreService: () => new store_service_default(RepositoryFactory.getStoreRepository()),
  createBranchService: () => new branch_service_default(RepositoryFactory.getBranchRepository()),
  createCategoryService: () => new category_service_default(RepositoryFactory.getCategoryRepository()),
  createProductService: () => new product_service_default(RepositoryFactory.getProductRepository()),
  createInventoryService: () => new inventory_service_default(RepositoryFactory.getInventoryRepository()),
  createSupplierService: () => new supplier_service_default(RepositoryFactory.getSupplierRepository()),
  createCustomerService: () => new customer_service_default(RepositoryFactory.getCustomerRepository()),
  createCartService: () => new cart_service_default(RepositoryFactory.getCartRepository()),
  createOrderService: () => new order_service_default(RepositoryFactory.getOrderRepository()),
  createPaymentService: () => new payment_service_default(RepositoryFactory.getPaymentRepository()),
  createNotificationService: () => new notification_service_default(RepositoryFactory.getNotificationRepository()),
  createAuditService: () => new audit_service_default(RepositoryFactory.getAuditRepository())
};

// ../backend/src/modules/users/controller.ts
var UsersController = class {
  userService = ServiceFactory.createUserService();
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapToDto(entity) {
    return {
      id: entity.id,
      fullName: entity.displayName ?? null,
      email: entity.email,
      phone: entity.phone ?? null,
      createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null
    };
  }
  async list(request4) {
    const ctx = this.createApiContext(request4);
    const q = request4.query ?? {};
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 25);
    const rawSort = q.sort ?? void 0;
    const rawOrder = q.order ?? void 0;
    const allowedSorts = ["id", "email", "createdAt", "updatedAt", "displayName"];
    const sort = rawSort && allowedSorts.includes(rawSort) ? rawSort : void 0;
    const order = rawOrder === "desc" ? "desc" : "asc";
    const search = q.search;
    let filters = {};
    if (q.filters && typeof q.filters === "string") {
      try {
        filters = JSON.parse(q.filters) ?? {};
      } catch {
      }
    } else if (typeof q.filters === "object") {
      filters = q.filters;
    }
    if (search && search.trim()) {
      const s = search.trim();
      const orCond = [
        { displayName: { contains: s } },
        { email: { contains: s } },
        { phone: { contains: s } }
      ];
      if (filters && Object.keys(filters).length > 0) {
        filters = { AND: [filters, { OR: orCond }] };
      } else {
        filters = { OR: orCond };
      }
    }
    const options = { page, limit, sort, order, filters };
    try {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[UsersController] paginate options:", JSON.stringify(options));
      }
      const resultAny = await this.userService.paginate(options);
      const data = (resultAny.data ?? []).map((e) => this.mapToDto(e));
      return paginated(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.userService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "user_not_found" }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.email !== "string" || !body.email) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "email_required" }, meta: ctx } };
    }
    try {
      const createdUser = await this.userService.create(body);
      return created(this.mapToDto(createdUser), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    try {
      const updated = await this.userService.update(id, body);
      return success(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.userService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.userService.restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async listRoles(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    if (!userId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_required" }, meta: ctx } };
    try {
      const result = await this.userService.listRoles(userId);
      const roles = (result.roles ?? []).map((assignment) => assignment.role ?? assignment);
      return success({ userId: result.userId, roles }, ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async assignRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.body?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      return created(await this.userService.assignRole(userId, roleId), ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async removeRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.params?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      await this.userService.removeRole(userId, roleId);
      return noContent(ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async checkRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.params?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      return success({ assigned: await this.userService.checkRole(userId, roleId) }, ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  relationshipError(err, ctx) {
    if (err instanceof ConflictException) return { statusCode: HTTP_STATUS.CONFLICT, body: { success: false, error: { code: "conflict", message: err.message }, meta: ctx } };
    if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
  }
};
var controller_default2 = UsersController;

// ../backend/src/modules/users/routes.ts
function toControllerRequest2(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt2(handler2) {
  return (context) => handler2(context);
}
function createUserRoutes(controller = new controller_default2()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "users-list",
    method: "GET",
    path: "/users",
    version: "v1",
    handler: adapt2((ctx) => controller.list(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:read"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-get",
    method: "GET",
    path: "/users/:id",
    version: "v1",
    handler: adapt2((ctx) => controller.get(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:read"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-create",
    method: "POST",
    path: "/users",
    version: "v1",
    handler: adapt2((ctx) => controller.create(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:create"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-update",
    method: "PUT",
    path: "/users/:id",
    version: "v1",
    handler: adapt2((ctx) => controller.update(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:update"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-delete",
    method: "DELETE",
    path: "/users/:id",
    version: "v1",
    handler: adapt2((ctx) => controller.remove(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:delete"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-restore",
    method: "PATCH",
    path: "/users/:id/restore",
    version: "v1",
    handler: adapt2((ctx) => controller.restore(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["users:update"],
      tags: ["users"],
      middleware: []
    }
  });
  builder.register({
    name: "users-roles-list",
    method: "GET",
    path: "/users/:userId/roles",
    version: "v1",
    handler: adapt2((ctx) => controller.listRoles(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ["users", "roles"],
      middleware: []
    }
  });
  builder.register({
    name: "users-roles-assign",
    method: "POST",
    path: "/users/:userId/roles",
    version: "v1",
    handler: adapt2((ctx) => controller.assignRole(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ["users", "roles"],
      middleware: []
    }
  });
  builder.register({
    name: "users-roles-check",
    method: "GET",
    path: "/users/:userId/roles/:roleId",
    version: "v1",
    handler: adapt2((ctx) => controller.checkRole(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ["users", "roles"],
      middleware: []
    }
  });
  builder.register({
    name: "users-roles-remove",
    method: "DELETE",
    path: "/users/:userId/roles/:roleId",
    version: "v1",
    handler: adapt2((ctx) => controller.removeRole(toControllerRequest2(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      tags: ["users", "roles"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/roles/controller.ts
var RolesController = class {
  roleService = ServiceFactory.createRoleService();
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapToDto(entity) {
    return {
      id: entity.id,
      name: entity.name,
      displayName: entity.displayName ?? null,
      description: entity.description ?? null,
      isSystem: typeof entity.isSystem === "boolean" ? entity.isSystem : null,
      createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null
    };
  }
  async list(request4) {
    const ctx = this.createApiContext(request4);
    const q = request4.query ?? {};
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 25);
    const rawSort = q.sort ?? void 0;
    const rawOrder = q.order ?? void 0;
    const allowedSorts = ["id", "name", "createdAt", "updatedAt", "displayName"];
    const sort = rawSort && allowedSorts.includes(rawSort) ? rawSort : void 0;
    const order = rawOrder === "desc" ? "desc" : "asc";
    const search = q.search;
    let filters = {};
    if (q.filters && typeof q.filters === "string") {
      try {
        filters = JSON.parse(q.filters) ?? {};
      } catch {
      }
    } else if (typeof q.filters === "object") {
      filters = q.filters;
    }
    if (search && search.trim()) {
      const s = search.trim();
      const orCond = [
        { name: { contains: s } },
        { displayName: { contains: s } },
        { description: { contains: s } }
      ];
      if (filters && Object.keys(filters).length > 0) {
        filters = { AND: [filters, { OR: orCond }] };
      } else {
        filters = { OR: orCond };
      }
    }
    const options = { page, limit, sort, order, filters };
    try {
      if (process.env.NODE_ENV !== "production") {
        console.debug("[RolesController] paginate options:", JSON.stringify(options));
      }
      const resultAny = await this.roleService.paginate(options);
      const data = (resultAny.data ?? []).map((e) => this.mapToDto(e));
      return paginated(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.roleService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "role_not_found" }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "name_required" }, meta: ctx } };
    }
    try {
      const payload = {
        name: body.name
      };
      if (body.description !== void 0) payload.description = body.description;
      const createdRole = await this.roleService.create(payload);
      return created(this.mapToDto(createdRole), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    try {
      const payload = {};
      if (body.description !== void 0) payload.description = body.description;
      const updated = await this.roleService.update(id, payload);
      return success(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.roleService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.roleService.restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  mapPermissionEntity(entity) {
    const permission = entity?.permission ?? null;
    return {
      id: entity?.id ?? "",
      roleId: entity?.roleId ?? "",
      permissionId: entity?.permissionId ?? "",
      createdAt: entity?.createdAt ? new Date(entity.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      permission: permission ? {
        id: permission.id,
        name: typeof permission.name === "string" && permission.name ? permission.name : `${permission.resource}_${permission.action}`,
        resource: permission.resource,
        action: permission.action,
        description: permission.description ?? null
      } : null
    };
  }
  async listPermissions(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    try {
      const result = await this.roleService.listPermissions(roleId);
      const dto = {
        role: this.mapToDto(result.role),
        permissions: (result.permissions ?? []).map((e) => this.mapPermissionEntity(e))
      };
      return success(dto, ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async assignPermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const body = request4.body;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!body || typeof body !== "object" || typeof body.permissionId !== "string" || !body.permissionId) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    }
    try {
      const result = await this.roleService.assignPermission(roleId, body.permissionId);
      return created(this.mapPermissionEntity(result), ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      if (err instanceof ConflictException) return { statusCode: HTTP_STATUS.CONFLICT, body: { success: false, error: { code: "conflict", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async removePermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const permissionId = request4.params?.permissionId;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    try {
      await this.roleService.removePermission(roleId, permissionId);
      return noContent(ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async checkPermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const permissionId = request4.params?.permissionId;
    if (!roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    try {
      const exists = await this.roleService.checkPermission(roleId, permissionId);
      return success({ assigned: exists }, ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
};
var controller_default3 = RolesController;

// ../backend/src/modules/roles/routes.ts
function toControllerRequest3(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt3(handler2) {
  return (context) => handler2(context);
}
function createRoleRoutes(controller = new controller_default3()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "roles-list",
    method: "GET",
    path: "/roles",
    version: "v1",
    handler: adapt3((ctx) => controller.list(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:read"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-get",
    method: "GET",
    path: "/roles/:id",
    version: "v1",
    handler: adapt3((ctx) => controller.get(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:read"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-create",
    method: "POST",
    path: "/roles",
    version: "v1",
    handler: adapt3((ctx) => controller.create(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:create"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-update",
    method: "PUT",
    path: "/roles/:id",
    version: "v1",
    handler: adapt3((ctx) => controller.update(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:update"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-delete",
    method: "DELETE",
    path: "/roles/:id",
    version: "v1",
    handler: adapt3((ctx) => controller.remove(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:delete"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-restore",
    method: "PATCH",
    path: "/roles/:id/restore",
    version: "v1",
    handler: adapt3((ctx) => controller.restore(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["roles:update"],
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-permissions-list",
    method: "GET",
    path: "/roles/:roleId/permissions",
    version: "v1",
    handler: adapt3((ctx) => controller.listPermissions(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-permissions-assign",
    method: "POST",
    path: "/roles/:roleId/permissions",
    version: "v1",
    handler: adapt3((ctx) => controller.assignPermission(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-permissions-get",
    method: "GET",
    path: "/roles/:roleId/permissions/:permissionId",
    version: "v1",
    handler: adapt3((ctx) => controller.checkPermission(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["roles"],
      middleware: []
    }
  });
  builder.register({
    name: "roles-permissions-remove",
    method: "DELETE",
    path: "/roles/:roleId/permissions/:permissionId",
    version: "v1",
    handler: adapt3((ctx) => controller.removePermission(toControllerRequest3(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["roles"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/permissions/controller.ts
var PERMISSION_ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST", "EXECUTE"];
var PermissionsController = class {
  permissionService = ServiceFactory.createPermissionService();
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapToDto(entity) {
    return {
      id: entity.id,
      name: typeof entity.name === "string" && entity.name ? entity.name : `${entity.resource}_${entity.action}`,
      resource: entity.resource,
      action: entity.action,
      description: entity.description ?? null,
      createdAt: entity.createdAt ? new Date(entity.createdAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: entity.updatedAt ? new Date(entity.updatedAt).toISOString() : (/* @__PURE__ */ new Date()).toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null
    };
  }
  async list(request4) {
    const ctx = this.createApiContext(request4);
    const q = request4.query ?? {};
    const page = Number(q.page ?? 1);
    const limit = Number(q.limit ?? 25);
    const rawSort = q.sort ?? void 0;
    const rawOrder = q.order ?? void 0;
    const allowedSorts = ["id", "resource", "action", "createdAt", "updatedAt"];
    const sort = rawSort && allowedSorts.includes(rawSort) ? rawSort : void 0;
    const order = rawOrder === "desc" ? "desc" : "asc";
    const search = q.search;
    let filters = {};
    if (q.filters && typeof q.filters === "string") {
      try {
        filters = JSON.parse(q.filters) ?? {};
      } catch {
      }
    } else if (typeof q.filters === "object") {
      filters = q.filters;
    }
    if (search && search.trim()) {
      const s = search.trim();
      const orCond = [
        { resource: { contains: s } },
        { description: { contains: s } }
      ];
      if (filters && Object.keys(filters).length > 0) {
        filters = { AND: [filters, { OR: orCond }] };
      } else {
        filters = { OR: orCond };
      }
    }
    const options = { page, limit, sort, order, filters };
    try {
      const resultAny = await this.permissionService.paginate(options);
      const data = (resultAny.data ?? []).map((e) => this.mapToDto(e));
      return paginated(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.permissionService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "permission_not_found" }, meta: ctx } };
      return success(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.resource !== "string" || !body.resource) {
      return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "resource_required" }, meta: ctx } };
    }
    if (typeof body.action !== "string" || !PERMISSION_ACTIONS.includes(body.action)) {
      return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: "action_invalid" }, meta: ctx } };
    }
    try {
      const payload = {
        resource: body.resource,
        action: body.action
      };
      if (body.description !== void 0) payload.description = body.description;
      const createdPermission = await this.permissionService.create(payload);
      return created(this.mapToDto(createdPermission), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    if (body.action !== void 0 && (typeof body.action !== "string" || !PERMISSION_ACTIONS.includes(body.action))) {
      return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: "action_invalid" }, meta: ctx } };
    }
    try {
      const payload = {};
      if (body.resource !== void 0) payload.resource = body.resource;
      if (body.action !== void 0) payload.action = body.action;
      if (body.description !== void 0) payload.description = body.description;
      const updated = await this.permissionService.update(id, payload);
      return success(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.permissionService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.permissionService.restore(id);
      return success(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
};
var controller_default4 = PermissionsController;

// ../backend/src/modules/permissions/routes.ts
function toControllerRequest4(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt4(handler2) {
  return (context) => handler2(context);
}
function createPermissionRoutes(controller = new controller_default4()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "permissions-list",
    method: "GET",
    path: "/permissions",
    version: "v1",
    handler: adapt4((ctx) => controller.list(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:read"],
      tags: ["permissions"],
      middleware: []
    }
  });
  builder.register({
    name: "permissions-get",
    method: "GET",
    path: "/permissions/:id",
    version: "v1",
    handler: adapt4((ctx) => controller.get(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:read"],
      tags: ["permissions"],
      middleware: []
    }
  });
  builder.register({
    name: "permissions-create",
    method: "POST",
    path: "/permissions",
    version: "v1",
    handler: adapt4((ctx) => controller.create(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:create"],
      tags: ["permissions"],
      middleware: []
    }
  });
  builder.register({
    name: "permissions-update",
    method: "PUT",
    path: "/permissions/:id",
    version: "v1",
    handler: adapt4((ctx) => controller.update(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:update"],
      tags: ["permissions"],
      middleware: []
    }
  });
  builder.register({
    name: "permissions-delete",
    method: "DELETE",
    path: "/permissions/:id",
    version: "v1",
    handler: adapt4((ctx) => controller.remove(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:delete"],
      tags: ["permissions"],
      middleware: []
    }
  });
  builder.register({
    name: "permissions-restore",
    method: "PATCH",
    path: "/permissions/:id/restore",
    version: "v1",
    handler: adapt4((ctx) => controller.restore(toControllerRequest4(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: true,
      requiredPermissions: ["permissions:update"],
      tags: ["permissions"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/products/controller.ts
var ProductsController = class {
  productService = ServiceFactory.createProductService();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapToDto(entity) {
    const enriched = entity;
    const images = Array.isArray(enriched.images) ? enriched.images.map((image) => ({ id: image.id, url: image.url, altText: image.altText ?? null, sortOrder: image.sortOrder })) : [];
    return {
      id: entity.id,
      sku: entity.sku ?? null,
      produceKey: enriched.produceKey ?? null,
      familyId: enriched.familyId ?? null,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? null,
      originCountry: entity.originCountry ?? null,
      harvestDate: entity.harvestDate ? new Date(entity.harvestDate).toISOString() : null,
      expiryDate: entity.expiryDate ? new Date(entity.expiryDate).toISOString() : null,
      storageInstructions: entity.storageInstructions ?? null,
      qualityGrade: entity.qualityGrade ?? null,
      weightValue: entity.weightValue ?? null,
      weightUnit: entity.weightUnit ?? null,
      packageLength: entity.packageLength ?? null,
      packageWidth: entity.packageWidth ?? null,
      packageHeight: entity.packageHeight ?? null,
      shippingWeight: entity.shippingWeight ?? null,
      shippingClass: entity.shippingClass ?? null,
      brandId: entity.brandId ?? null,
      unitId: entity.unitId ?? null,
      categoryId: entity.categoryId ?? null,
      subcategoryId: entity.subcategoryId ?? null,
      imageUrl: images[0]?.url ?? null,
      imageAltText: images[0]?.altText ?? null,
      images,
      isPublished: Boolean(entity.isPublished),
      createdAt: new Date(entity.createdAt).toISOString(),
      updatedAt: new Date(entity.updatedAt).toISOString(),
      deletedAt: entity.deletedAt ? new Date(entity.deletedAt).toISOString() : null
    };
  }
  queryValue(value) {
    return Array.isArray(value) ? value[0] : value;
  }
  parseFilters(value) {
    const raw = this.queryValue(value);
    if (!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("filters_invalid");
      const allowed = ["sku", "name", "slug", "brandId", "unitId", "categoryId", "subcategoryId", "isPublished"];
      const filters = parsed;
      for (const [key, filterValue] of Object.entries(filters)) {
        if (!allowed.includes(key)) throw new Error("filter_invalid");
        if (key === "isPublished" && typeof filterValue !== "boolean") throw new Error("filter_invalid");
        if (key !== "isPublished" && (typeof filterValue !== "string" || !filterValue.trim())) throw new Error("filter_invalid");
      }
      return filters;
    } catch {
      throw new ValidationException("filters_invalid");
    }
  }
  async list(request4) {
    const ctx = this.context(request4);
    const q = request4.query ?? {};
    try {
      const page = this.parsePositiveInteger(this.queryValue(q.page), 1);
      const limit = this.parsePositiveInteger(this.queryValue(q.limit), 25, 100);
      const rawSort = this.queryValue(q.sort);
      const rawOrder = this.queryValue(q.order);
      const allowedSorts = ["id", "sku", "name", "slug", "isPublished", "createdAt", "updatedAt"];
      if (rawSort && !allowedSorts.includes(rawSort)) throw new ValidationException("sort_invalid");
      if (rawOrder && rawOrder !== "asc" && rawOrder !== "desc") throw new ValidationException("order_invalid");
      const sort = rawSort;
      const order = rawOrder === "desc" ? "desc" : "asc";
      const filters = this.parseFilters(q.filters);
      const search = this.queryValue(q.search)?.trim();
      if (search && search.length > 255) throw new ValidationException("search_too_long");
      const searchCondition = {
        OR: [{ name: { contains: search } }, { slug: { contains: search } }, { sku: { contains: search } }, { description: { contains: search } }]
      };
      const where = search ? Object.keys(filters).length > 0 ? { AND: [filters, searchCondition] } : searchCondition : filters;
      const result = await this.productService.paginate({ page, limit, sort, order, filters: where });
      const data = result.data.map((entity) => this.mapToDto(entity));
      return paginated(data, result.page ?? page, result.limit ?? limit, result.total ?? 0, ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async get(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      const product = await this.productService.findById(id);
      return product ? success(this.mapToDto(product), ctx) : notFound("product_not_found", ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      const product = await this.productService.create(request4.body);
      return created(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      const product = await this.productService.update(id, request4.body);
      return success(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      await this.productService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async restore(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      const product = await this.productService.restore(id);
      return success(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  error(err, ctx) {
    if (err instanceof ValidationException) return validationError(err.message, ctx);
    if (err instanceof NotFoundException) return notFound(err.message, ctx);
    if (err instanceof ConflictException) return conflict(err.message, ctx);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { success: false, error: { code: "internal_error", message: err instanceof Error ? err.message : "internal_error" }, meta: ctx }
    };
  }
  parsePositiveInteger(value, fallback2, maximum = Number.MAX_SAFE_INTEGER) {
    if (value === void 0) return fallback2;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) throw new ValidationException("pagination_invalid");
    return parsed;
  }
};
var controller_default5 = ProductsController;

// ../backend/src/modules/products/routes.ts
function toControllerRequest5(ctx) {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } }
  };
}
function adapt5(handler2) {
  return (context) => handler2(context);
}
function createProductRoutes(controller = new controller_default5()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt5(definition.handler) });
  };
  const privateOptions2 = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["products"],
    middleware: []
  });
  register({ name: "products-list", method: "GET", path: "/products", version: "v1", handler: (ctx) => controller.list(toControllerRequest5(ctx)), options: privateOptions2("products:read") });
  register({ name: "products-get", method: "GET", path: "/products/:id", version: "v1", handler: (ctx) => controller.get(toControllerRequest5(ctx)), options: privateOptions2("products:read") });
  register({ name: "products-create", method: "POST", path: "/products", version: "v1", handler: (ctx) => controller.create(toControllerRequest5(ctx)), options: privateOptions2("products:create") });
  register({ name: "products-update", method: "PUT", path: "/products/:id", version: "v1", handler: (ctx) => controller.update(toControllerRequest5(ctx)), options: privateOptions2("products:update") });
  register({ name: "products-delete", method: "DELETE", path: "/products/:id", version: "v1", handler: (ctx) => controller.remove(toControllerRequest5(ctx)), options: privateOptions2("products:delete") });
  register({ name: "products-restore", method: "PATCH", path: "/products/:id/restore", version: "v1", handler: (ctx) => controller.restore(toControllerRequest5(ctx)), options: privateOptions2("products:update") });
  return builder.build();
}

// ../backend/src/modules/products/media-upload.ts
var MAX_BYTES2 = 300 * 1024;
var ALLOWED_TYPES2 = /* @__PURE__ */ new Set(["image/jpeg", "image/png", "image/webp"]);
function cleanSegment(value, fallback2) {
  const cleaned = String(value ?? "").trim().replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return cleaned.slice(0, 80) || fallback2;
}
function parseDataUrl2(value) {
  if (typeof value !== "string") throw new Error("image_data_required");
  const match = value.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match || !ALLOWED_TYPES2.has(match[1])) throw new Error("image_type_invalid");
  const bytes = Buffer.from(match[2], "base64");
  if (!bytes.length || bytes.length > MAX_BYTES2) throw new Error("image_size_invalid");
  return { contentType: match[1], bytes };
}
function storageHeaders2(apiKey, extra = {}) {
  const headers = { apikey: apiKey, ...extra };
  if (apiKey.split(".").length === 3) headers.Authorization = `Bearer ${apiKey}`;
  return headers;
}
async function uploadProductImage(request4) {
  const body = request4.body ?? {};
  const { contentType, bytes } = parseDataUrl2(body.dataUrl);
  const baseUrl = String(process.env.SUPABASE_URL ?? "").trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
  const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  const bucket = cleanSegment(process.env.SUPABASE_STORAGE_BUCKET, "product-images");
  if (!baseUrl || !serviceRoleKey) throw new Error("storage_not_configured");
  const sku = cleanSegment(body.sku, "unassigned");
  const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  const path3 = `products/${sku}/main-${Date.now()}.${extension}`;
  const response = await fetch(`${baseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${path3}`, {
    method: "POST",
    headers: storageHeaders2(serviceRoleKey, {
      "Content-Type": contentType,
      "Content-Length": String(bytes.byteLength),
      "x-upsert": "false"
    }),
    body: bytes
  });
  if (!response.ok) {
    const rawDetails = await response.text().catch(() => "");
    let detail = "";
    try {
      const parsed = JSON.parse(rawDetails);
      detail = String(parsed.message || parsed.error || parsed.statusCode || "");
    } catch {
      detail = rawDetails;
    }
    const safeDetail = detail.replace(/[^a-zA-Z0-9_ .:-]/g, "").slice(0, 160);
    throw new Error(`storage_upload_failed_${response.status}${safeDetail ? `:${safeDetail}` : ""}`);
  }
  return {
    path: path3,
    url: `${baseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${path3}`
  };
}

// ../backend/src/modules/products/media-routes.ts
function toControllerRequest6(ctx) {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } }
  };
}
function createProductMediaRoutes() {
  const builder = new RouterBuilder();
  const options = {
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: ["products:create"],
    tags: ["products", "media"],
    middleware: []
  };
  builder.register({
    name: "products-media-upload",
    method: "POST",
    path: "/products/media/upload",
    version: "v1",
    handler: (ctx) => uploadProductImage(toControllerRequest6(ctx)),
    options
  });
  return builder.build();
}

// ../backend/src/modules/customers/controller.ts
var CustomersController = class {
  service = ServiceFactory.createCustomerService();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  value(value) {
    return Array.isArray(value) ? value[0] : value;
  }
  mapCustomer(entity) {
    return {
      id: entity.id,
      customerCode: entity.customerCode,
      firstName: entity.firstName,
      lastName: entity.lastName,
      fullName: entity.fullName,
      phone: entity.phone,
      email: entity.email,
      status: entity.status,
      notes: entity.notes,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      deletedAt: entity.deletedAt?.toISOString() ?? null
    };
  }
  mapAddress(entity) {
    return {
      id: entity.id,
      customerId: entity.customerId,
      label: entity.label,
      recipientName: entity.recipientName,
      phone: entity.phone,
      country: entity.country,
      city: entity.city,
      district: entity.district,
      street: entity.street,
      building: entity.building,
      floor: entity.floor,
      landmark: entity.landmark,
      latitude: entity.latitude,
      longitude: entity.longitude,
      isDefault: entity.isDefault,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString()
    };
  }
  async list(request4) {
    const ctx = this.context(request4);
    const query = request4.query ?? {};
    try {
      const page = this.integer(this.value(query.page), 1, 1e5);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const sort = this.value(query.sort);
      const order = this.value(query.order);
      const allowedSorts = ["id", "customerCode", "firstName", "lastName", "fullName", "email", "phone", "status", "createdAt", "updatedAt"];
      if (sort && !allowedSorts.includes(sort)) throw new ValidationException("sort_invalid");
      if (order && order !== "asc" && order !== "desc") throw new ValidationException("order_invalid");
      const filters = this.parseFilters(this.value(query.filters));
      const search = this.value(query.search)?.trim();
      if (search && search.length > 255) throw new ValidationException("search_too_long");
      const where = search ? { AND: [filters, { OR: [{ customerCode: { contains: search } }, { firstName: { contains: search } }, { lastName: { contains: search } }, { fullName: { contains: search } }, { email: { contains: search } }, { phone: { contains: search } }] }] } : filters;
      const result = await this.service.paginate({ page, limit, sort, order, filters: where });
      return paginated(result.data.map((entry) => this.mapCustomer(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async checkOwnershipOrAdmin(request4, targetCustomerId) {
    const user = request4.context?.user;
    if (!user) return true;
    const userRoles = (user.roles || []).map(
      (r) => typeof r === "string" ? r : r.name || r.role?.name || ""
    ).filter(Boolean);
    const isElevated = userRoles.some(
      (role) => ["SUPER_ADMIN", "ADMIN", "MANAGER", "EMPLOYEE"].includes(role.toUpperCase())
    );
    if (isElevated) return true;
    const customer = await this.service.findById(targetCustomerId);
    if (!customer) return false;
    return customer.userId === user.id || customer.id === user.id;
  }
  async get(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const entity = await this.service.findById(id);
      return entity ? success(this.mapCustomer(entity), ctx) : notFound("customer_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      const entity = await this.service.create(request4.body);
      return created(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const entity = await this.service.update(id, request4.body);
      return success(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      await this.service.delete(id);
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async listAddresses(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const addresses = await this.service.listAddresses(id);
      return success(addresses.map((entry) => this.mapAddress(entry)), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async createAddress(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const address = await this.service.createAddress(id, request4.body);
      return created(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async updateAddress(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const address = await this.service.updateAddress(id, request4.params?.addressId ?? "", request4.body);
      return success(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async removeAddress(request4) {
    const ctx = this.context(request4);
    try {
      const id = request4.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request4, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      await this.service.deleteAddress(id, request4.params?.addressId ?? "");
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  parseFilters(raw) {
    if (!raw) return {};
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new ValidationException("filters_invalid");
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new ValidationException("filters_invalid");
    const allowed = ["customerCode", "firstName", "lastName", "email", "phone", "status"];
    for (const [key, value] of Object.entries(parsed)) {
      if (!allowed.includes(key) || typeof value !== "string" || !value.trim()) throw new ValidationException("filter_invalid");
    }
    return parsed;
  }
  integer(value, fallback2, max) {
    if (value === void 0) return fallback2;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException("pagination_invalid");
    return parsed;
  }
  error(error, ctx) {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException) return notFound(error.message, ctx);
    if (error instanceof ConflictException) return conflict(error.message, ctx);
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: "internal_error" }, meta: ctx } };
  }
};
var controller_default6 = CustomersController;

// ../backend/src/modules/customers/routes.ts
function request(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { user: ctx.user, metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function createCustomerRoutes(controller = new controller_default6()) {
  const builder = new RouterBuilder();
  const options = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["customers"],
    middleware: []
  });
  const register = (name, method, path3, permission, handler2) => builder.register({ name, method, path: path3, version: "v1", handler: handler2, options: options(permission) });
  register("customers-list", "GET", "/customers", "customers:read", (ctx) => controller.list(request(ctx)));
  register("customers-get", "GET", "/customers/:id", "customers:read", (ctx) => controller.get(request(ctx)));
  register("customers-create", "POST", "/customers", "customers:create", (ctx) => controller.create(request(ctx)));
  register("customers-update", "PUT", "/customers/:id", "customers:update", (ctx) => controller.update(request(ctx)));
  register("customers-delete", "DELETE", "/customers/:id", "customers:delete", (ctx) => controller.remove(request(ctx)));
  register("customers-addresses-list", "GET", "/customers/:id/addresses", "customers:read", (ctx) => controller.listAddresses(request(ctx)));
  register("customers-addresses-create", "POST", "/customers/:id/addresses", "customers:create", (ctx) => controller.createAddress(request(ctx)));
  register("customers-addresses-update", "PUT", "/customers/:id/addresses/:addressId", "customers:update", (ctx) => controller.updateAddress(request(ctx)));
  register("customers-addresses-delete", "DELETE", "/customers/:id/addresses/:addressId", "customers:delete", (ctx) => controller.removeAddress(request(ctx)));
  return builder.build();
}

// ../backend/src/modules/cart/controller.ts
var CartController = class {
  service = ServiceFactory.createCartService();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  getUserInfo(request4) {
    const user = request4.context?.user;
    if (!user || typeof user !== "object" || !user.id) {
      throw new ValidationException2("authentication_required");
    }
    return {
      id: String(user.id),
      email: user.email ? String(user.email) : void 0
    };
  }
  async getCart(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const cart = await this.service.getCartForUser(user.id, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async addItem(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const cart = await this.service.addItem(user.id, request4.body, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async updateItem(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const itemId = request4.params?.id ?? "";
      const cart = await this.service.updateItemQuantity(user.id, itemId, request4.body, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async removeItem(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const itemId = request4.params?.id ?? "";
      const cart = await this.service.removeItem(user.id, itemId, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async clearCart(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const cart = await this.service.clearCart(user.id, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  error(error, ctx) {
    if (error instanceof ValidationException2) return validationError(error.message, ctx);
    if (error instanceof NotFoundException || error?.code === "not_found") return notFound(error instanceof Error ? error.message : "not_found", ctx);
    if (error instanceof ForbiddenError || error?.code === "forbidden") return forbidden(error instanceof Error ? error.message : "forbidden", ctx);
    return {
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      body: { success: false, error: { code: "internal_error", message: error instanceof Error ? error.message : "internal_error" }, meta: ctx }
    };
  }
};
var controller_default7 = CartController;

// ../backend/src/modules/cart/routes.ts
function toControllerRequest7(ctx) {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: {
      user: ctx.user,
      metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" }
    }
  };
}
function adapt6(handler2) {
  return (context) => handler2(context);
}
function createCartRoutes(controller = new controller_default7()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt6(definition.handler) });
  };
  const privateOptions2 = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["carts"],
    middleware: []
  });
  register({ name: "cart-get", method: "GET", path: "/cart", version: "v1", handler: (ctx) => controller.getCart(toControllerRequest7(ctx)), options: privateOptions2("carts:read") });
  register({ name: "cart-items-add", method: "POST", path: "/cart/items", version: "v1", handler: (ctx) => controller.addItem(toControllerRequest7(ctx)), options: privateOptions2("carts:create") });
  register({ name: "cart-items-update", method: "PUT", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.updateItem(toControllerRequest7(ctx)), options: privateOptions2("carts:update") });
  register({ name: "cart-items-remove", method: "DELETE", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.removeItem(toControllerRequest7(ctx)), options: privateOptions2("carts:delete") });
  register({ name: "cart-clear", method: "DELETE", path: "/cart", version: "v1", handler: (ctx) => controller.clearCart(toControllerRequest7(ctx)), options: privateOptions2("carts:delete") });
  return builder.build();
}

// ../backend/src/modules/orders/controller.ts
init_errors();
var OrderController = class {
  orderRepo = new OrderRepository();
  cartRepo = new cart_repository_default();
  async createOrder(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      let customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
      if (!customer) {
        customer = await this.cartRepo.createCustomerForUser(user.id, user.email);
      }
      const body = request4.body || {};
      const headers = request4.headers || {};
      const idempotencyKey = headers["idempotency-key"] || headers["x-idempotency-key"] || body.idempotencyKey || void 0;
      const tenantId = user.tenantId || body.tenantId || void 0;
      const storeId = user.storeId || body.storeId || void 0;
      const branchId = user.branchId || body.branchId || void 0;
      const order = await this.orderRepo.createOrderFromCart(customer.id, {
        shippingAddressId: body.shippingAddressId,
        notes: body.notes,
        idempotencyKey,
        tenantId,
        storeId,
        branchId
      });
      return created(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listOrders(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdFilter = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return success({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 }, ctx);
        }
        customerIdFilter = customer.id;
      } else if (query.customerId) {
        customerIdFilter = String(query.customerId);
      }
      const result = await this.orderRepo.findOrders({
        customerId: customerIdFilter,
        status: query.status ? String(query.status) : void 0,
        search: query.search ? String(query.search) : void 0,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        sort: query.sort ? String(query.sort) : "createdAt",
        order: query.order === "asc" ? "asc" : "desc"
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getOrderById(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.id;
      if (!orderId) {
        return this.errorResponse("bad_request", "order_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const order = await this.orderRepo.findOrderById(orderId, customerIdCheck);
      if (!order) {
        return this.errorResponse("not_found", "order_not_found", HTTP_STATUS.NOT_FOUND, ctx);
      }
      return success(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateStatus(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.id;
      const status = request4.body?.status;
      if (!orderId || !status) {
        return this.errorResponse("bad_request", "order_id_and_status_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const updatedOrder = await this.orderRepo.updateOrderStatus(orderId, status, customerIdCheck);
      return success(updatedOrder, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async cancelOrder(request4) {
    const cancelReq = {
      ...request4,
      body: { ...request4.body || {}, status: "CANCELED" }
    };
    return this.updateStatus(cancelReq);
  }
  hasManagementPermissions(user) {
    if (!user || !user.permissions || !Array.isArray(user.permissions)) return false;
    return user.permissions.some((p) => {
      const formatted = typeof p === "string" ? p : `${p.resource}:${p.action}`;
      return formatted === "orders:update" || formatted === "orders:delete" || formatted === "*";
    });
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/orders/routes.ts
function toControllerRequest8(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt7(handler2) {
  return (context) => handler2(context);
}
function createOrderRoutes(controller = new OrderController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "orders-create",
    method: "POST",
    path: "/orders",
    version: "v1",
    handler: adapt7((ctx) => controller.createOrder(toControllerRequest8(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["orders"],
      middleware: []
    }
  });
  builder.register({
    name: "orders-list",
    method: "GET",
    path: "/orders",
    version: "v1",
    handler: adapt7((ctx) => controller.listOrders(toControllerRequest8(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["orders"],
      middleware: []
    }
  });
  builder.register({
    name: "orders-get-by-id",
    method: "GET",
    path: "/orders/:id",
    version: "v1",
    handler: adapt7((ctx) => controller.getOrderById(toControllerRequest8(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["orders"],
      middleware: []
    }
  });
  builder.register({
    name: "orders-update-status",
    method: "PATCH",
    path: "/orders/:id/status",
    version: "v1",
    handler: adapt7((ctx) => controller.updateStatus(toControllerRequest8(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["orders"],
      middleware: []
    }
  });
  builder.register({
    name: "orders-cancel",
    method: "POST",
    path: "/orders/:id/cancel",
    version: "v1",
    handler: adapt7((ctx) => controller.cancelOrder(toControllerRequest8(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["orders"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/inventory/controller.ts
init_errors();
var InventoryController = class {
  inventoryRepo = new InventoryRepository();
  async listInventory(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const result = await this.inventoryRepo.findInventoryList({
        status: query.status ? String(query.status) : void 0,
        search: query.search ? String(query.search) : void 0,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10,
        warehouseId: query.warehouseId ? String(query.warehouseId) : void 0
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async adjustStock(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { productId, productVariantId, warehouseId, type, quantity, reason } = body;
      if (!productId || !type || quantity === void 0) {
        return this.errorResponse("bad_request", "product_id_type_and_quantity_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const validTypes = ["IN", "OUT", "ADJUSTMENT"];
      if (!validTypes.includes(type)) {
        return this.errorResponse("bad_request", "invalid_movement_type", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const numericQuantity = Number(quantity);
      if (!Number.isInteger(numericQuantity) || numericQuantity < 0 || type !== "ADJUSTMENT" && numericQuantity <= 0) {
        return this.errorResponse("bad_request", "quantity_must_be_a_valid_non_negative_integer", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.inventoryRepo.adjustStock(
        String(productId),
        type,
        numericQuantity,
        reason ? String(reason) : void 0,
        user.id,
        warehouseId ? String(warehouseId) : void 0,
        productVariantId ? String(productVariantId) : void 0
      );
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listMovements(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const movements = await this.inventoryRepo.findMovements({
        inventoryId: query.inventoryId ? String(query.inventoryId) : void 0,
        productId: query.productId ? String(query.productId) : void 0,
        type: query.type ? String(query.type) : void 0,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 20
      });
      return success({ movements: movements.items, pagination: movements.pagination }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/inventory/routes.ts
function toControllerRequest9(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt8(handler2) {
  return (context) => handler2(context);
}
function createInventoryRoutes(controller = new InventoryController()) {
  const builder = new RouterBuilder();
  const privateOptions2 = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["inventory"],
    middleware: []
  });
  builder.register({
    name: "inventory-list",
    method: "GET",
    path: "/inventory",
    version: "v1",
    handler: adapt8((ctx) => controller.listInventory(toControllerRequest9(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      ...privateOptions2("inventory:read")
    }
  });
  builder.register({
    name: "inventory-adjust",
    method: "POST",
    path: "/inventory/adjust",
    version: "v1",
    handler: adapt8((ctx) => controller.adjustStock(toControllerRequest9(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      ...privateOptions2("inventory:update")
    }
  });
  builder.register({
    name: "inventory-movements",
    method: "GET",
    path: "/inventory/movements",
    version: "v1",
    handler: adapt8((ctx) => controller.listMovements(toControllerRequest9(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      ...privateOptions2("inventory:read")
    }
  });
  return builder.build();
}

// ../backend/src/repositories/delivery-driver-repository.ts
var DeliveryDriverRepository = class extends base_repository_default {
  constructor() {
    super("deliveryDriver");
  }
  async list(options = {}) {
    const page = Math.max(1, Math.floor(options.page ?? 1));
    const limit = Math.max(1, Math.min(100, Math.floor(options.limit ?? 25)));
    const search = options.search?.trim();
    const where = {
      tenantId: options.tenantId ?? null
    };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { vehicleInfo: { contains: search, mode: "insensitive" } }
      ];
    }
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { deliveries: true } } }
      }),
      this.model.count({ where })
    ]);
    return { data, total, page, limit };
  }
  async findByIdForTenant(id, tenantId) {
    return this.model.findFirst({
      where: { id, tenantId: tenantId ?? null },
      include: { _count: { select: { deliveries: true } } }
    });
  }
  async createForTenant(payload) {
    return this.model.create({
      data: {
        tenantId: payload.tenantId ?? null,
        name: payload.name,
        phone: payload.phone ?? null,
        vehicleInfo: payload.vehicleInfo ?? null
      },
      include: { _count: { select: { deliveries: true } } }
    });
  }
  async updateForTenant(id, tenantId, payload) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return null;
    return this.model.update({
      where: { id },
      data: {
        ...payload.name !== void 0 ? { name: payload.name } : {},
        ...payload.phone !== void 0 ? { phone: payload.phone } : {},
        ...payload.vehicleInfo !== void 0 ? { vehicleInfo: payload.vehicleInfo } : {}
      },
      include: { _count: { select: { deliveries: true } } }
    });
  }
  async deleteForTenant(id, tenantId) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return false;
    await this.model.delete({ where: { id } });
    return true;
  }
};
var delivery_driver_repository_default = DeliveryDriverRepository;

// ../backend/src/modules/delivery/controller.ts
var DeliveryController = class {
  driverRepo = new delivery_driver_repository_default();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  tenantId(request4) {
    return request4.context?.user?.tenantId ?? null;
  }
  value(value) {
    return Array.isArray(value) ? value[0] : value;
  }
  mapDriver(entity) {
    return {
      id: entity.id,
      name: entity.name,
      phone: entity.phone,
      vehicleInfo: entity.vehicleInfo,
      deliveriesCount: entity._count?.deliveries ?? 0,
      createdAt: entity.createdAt?.toISOString?.() ?? entity.createdAt
    };
  }
  async list(request4) {
    const ctx = this.context(request4);
    try {
      this.requireUser(request4);
      const query = request4.query ?? {};
      const page = this.integer(this.value(query.page), 1, 1e5);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const search = this.value(query.search)?.trim();
      if (search && search.length > 120) throw new ValidationException("search_too_long");
      const result = await this.driverRepo.list({ tenantId: this.tenantId(request4), search, page, limit });
      return paginated(result.data.map((entry) => this.mapDriver(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async get(request4) {
    const ctx = this.context(request4);
    try {
      this.requireUser(request4);
      const id = request4.params?.id ?? "";
      if (!id) throw new ValidationException("driver_id_required");
      const entity = await this.driverRepo.findByIdForTenant(id, this.tenantId(request4));
      return entity ? success(this.mapDriver(entity), ctx) : notFound("driver_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      this.requireUser(request4);
      const body = request4.body ?? {};
      const name = this.text(body.name, "driver_name_required", 120);
      const phone = this.optionalText(body.phone, 40);
      const vehicleInfo = this.optionalText(body.vehicleInfo, 160);
      const entity = await this.driverRepo.createForTenant({ tenantId: this.tenantId(request4), name, phone, vehicleInfo });
      return created(this.mapDriver(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    try {
      this.requireUser(request4);
      const id = request4.params?.id ?? "";
      if (!id) throw new ValidationException("driver_id_required");
      const body = request4.body ?? {};
      const payload = {
        ...body.name !== void 0 ? { name: this.text(body.name, "driver_name_required", 120) } : {},
        ...body.phone !== void 0 ? { phone: this.optionalText(body.phone, 40) } : {},
        ...body.vehicleInfo !== void 0 ? { vehicleInfo: this.optionalText(body.vehicleInfo, 160) } : {}
      };
      if (Object.keys(payload).length === 0) throw new ValidationException("driver_update_empty");
      const entity = await this.driverRepo.updateForTenant(id, this.tenantId(request4), payload);
      return entity ? success(this.mapDriver(entity), ctx) : notFound("driver_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    try {
      this.requireUser(request4);
      const id = request4.params?.id ?? "";
      if (!id) throw new ValidationException("driver_id_required");
      const removed = await this.driverRepo.deleteForTenant(id, this.tenantId(request4));
      if (!removed) throw new NotFoundException("driver_not_found");
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  requireUser(request4) {
    if (!request4.context?.user?.id) throw new Error("authentication_required");
  }
  text(value, errorCode, maxLength) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) throw new ValidationException(errorCode);
    return value.trim();
  }
  optionalText(value, maxLength) {
    if (value === null || value === void 0 || value === "") return null;
    if (typeof value !== "string" || value.trim().length > maxLength) throw new ValidationException("driver_field_invalid");
    return value.trim();
  }
  integer(value, fallback2, max) {
    if (value === void 0) return fallback2;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException("pagination_invalid");
    return parsed;
  }
  error(error, ctx) {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException) return notFound(error.message, ctx);
    if (error instanceof Error && error.message === "authentication_required") return unauthorized("authentication_required", ctx);
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: "internal_error" }, meta: ctx } };
  }
};
var controller_default8 = DeliveryController;

// ../backend/src/modules/delivery/routes.ts
function request2(ctx) {
  return {
    body: ctx.body,
    headers: ctx.headers,
    params: ctx.params,
    query: ctx.query,
    context: {
      user: ctx.user,
      metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" }
    }
  };
}
function createDeliveryRoutes(controller = new controller_default8()) {
  const builder = new RouterBuilder();
  const options = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["delivery"],
    middleware: []
  });
  const register = (name, method, path3, permission, handler2) => builder.register({ name, method, path: path3, version: "v1", handler: handler2, options: options(permission) });
  register("delivery-drivers-list", "GET", "/delivery/drivers", "delivery:read", (ctx) => controller.list(request2(ctx)));
  register("delivery-drivers-get", "GET", "/delivery/drivers/:id", "delivery:read", (ctx) => controller.get(request2(ctx)));
  register("delivery-drivers-create", "POST", "/delivery/drivers", "delivery:create", (ctx) => controller.create(request2(ctx)));
  register("delivery-drivers-update", "PUT", "/delivery/drivers/:id", "delivery:update", (ctx) => controller.update(request2(ctx)));
  register("delivery-drivers-delete", "DELETE", "/delivery/drivers/:id", "delivery:delete", (ctx) => controller.remove(request2(ctx)));
  return builder.build();
}

// ../backend/src/repositories/supplier-admin-repository.ts
var SupplierAdminRepository = class extends base_repository_default {
  constructor() {
    super("supplier");
  }
  where(options = {}) {
    const where = { tenantId: options.tenantId ?? null, deletedAt: null };
    if (options.search?.trim()) {
      const search = options.search.trim();
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } }
      ];
    }
    return where;
  }
  async list(options = {}) {
    const page = Math.max(1, Math.floor(options.page ?? 1));
    const limit = Math.max(1, Math.min(100, Math.floor(options.limit ?? 25)));
    const where = this.where(options);
    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: { select: { contacts: true, addresses: true, purchaseOrders: true } }
        }
      }),
      this.model.count({ where })
    ]);
    return { data, total, page, limit };
  }
  async findByIdForTenant(id, tenantId) {
    return this.model.findFirst({
      where: { id, tenantId: tenantId ?? null, deletedAt: null },
      include: { contacts: true, addresses: { include: { address: true } }, _count: { select: { purchaseOrders: true } } }
    });
  }
  async createForTenant(data) {
    return this.model.create({
      data: { tenantId: data.tenantId ?? null, name: data.name, code: data.code ?? null },
      include: { _count: { select: { contacts: true, addresses: true, purchaseOrders: true } } }
    });
  }
  async updateForTenant(id, tenantId, data) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return null;
    return this.model.update({ where: { id }, data, include: { _count: { select: { contacts: true, addresses: true, purchaseOrders: true } } } });
  }
  async softDeleteForTenant(id, tenantId) {
    const existing = await this.findByIdForTenant(id, tenantId);
    if (!existing) return false;
    await this.model.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
    return true;
  }
};
var supplier_admin_repository_default = SupplierAdminRepository;

// ../backend/src/modules/suppliers-admin/controller.ts
var SupplierAdminController = class {
  repository = new supplier_admin_repository_default();
  context(request4) {
    return { timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(), requestId: request4.context?.metadata?.requestId, version: "v1", locale: request4.context?.metadata?.locale };
  }
  tenantId(request4) {
    return request4.context?.user?.tenantId ?? null;
  }
  value(value) {
    return Array.isArray(value) ? value[0] : value;
  }
  map(entity) {
    return { id: entity.id, name: entity.name, code: entity.code, contactsCount: entity._count?.contacts ?? entity.contacts?.length ?? 0, addressesCount: entity._count?.addresses ?? entity.addresses?.length ?? 0, purchaseOrdersCount: entity._count?.purchaseOrders ?? 0, createdAt: entity.createdAt?.toISOString?.() ?? entity.createdAt, updatedAt: entity.updatedAt?.toISOString?.() ?? entity.updatedAt };
  }
  async list(request4) {
    const ctx = this.context(request4);
    try {
      const query = request4.query ?? {};
      const page = this.integer(this.value(query.page), 1, 1e5);
      const limit = this.integer(this.value(query.limit), 25, 100);
      const search = this.value(query.search)?.trim();
      if (search && search.length > 120) throw new ValidationException("search_too_long");
      const result = await this.repository.list({ tenantId: this.tenantId(request4), search, page, limit });
      return paginated(result.data.map((entry) => this.map(entry)), result.page, result.limit, result.total, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async get(request4) {
    const ctx = this.context(request4);
    try {
      const entity = await this.repository.findByIdForTenant(request4.params?.id ?? "", this.tenantId(request4));
      return entity ? success(this.map(entity), ctx) : notFound("supplier_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      const body = request4.body ?? {};
      const name = this.text(body.name, "supplier_name_required", 160);
      const code = this.optionalText(body.code, 80);
      const entity = await this.repository.createForTenant({ tenantId: this.tenantId(request4), name, code });
      return created(this.map(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    try {
      const body = request4.body ?? {};
      const data = { ...body.name !== void 0 ? { name: this.text(body.name, "supplier_name_required", 160) } : {}, ...body.code !== void 0 ? { code: this.optionalText(body.code, 80) } : {} };
      if (!Object.keys(data).length) throw new ValidationException("supplier_update_empty");
      const entity = await this.repository.updateForTenant(request4.params?.id ?? "", this.tenantId(request4), data);
      return entity ? success(this.map(entity), ctx) : notFound("supplier_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    try {
      const removed = await this.repository.softDeleteForTenant(request4.params?.id ?? "", this.tenantId(request4));
      if (!removed) throw new NotFoundException("supplier_not_found");
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  text(value, code, max) {
    if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new ValidationException(code);
    return value.trim();
  }
  optionalText(value, max) {
    if (value === void 0 || value === null || value === "") return null;
    if (typeof value !== "string" || value.trim().length > max) throw new ValidationException("supplier_field_invalid");
    return value.trim();
  }
  integer(value, fallback2, max) {
    if (value === void 0) return fallback2;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) throw new ValidationException("pagination_invalid");
    return parsed;
  }
  error(error, ctx) {
    if (error instanceof ValidationException) return validationError(error.message, ctx);
    if (error instanceof NotFoundException) return notFound(error.message, ctx);
    return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: "internal_error" }, meta: ctx } };
  }
};
var controller_default9 = SupplierAdminController;

// ../backend/src/modules/suppliers-admin/routes.ts
function request3(ctx) {
  return { body: ctx.body, headers: ctx.headers, params: ctx.params, query: ctx.query, context: { user: ctx.user, metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function createSupplierAdminRoutes(controller = new controller_default9()) {
  const builder = new RouterBuilder();
  const options = (permission) => ({ mode: "private", publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: true, requiredPermissions: [permission], tags: ["suppliers"], middleware: [] });
  const register = (name, method, path3, permission, handler2) => builder.register({ name, method, path: path3, version: "v1", handler: handler2, options: options(permission) });
  register("suppliers-admin-list", "GET", "/admin/suppliers", "suppliers:read", (ctx) => controller.list(request3(ctx)));
  register("suppliers-admin-get", "GET", "/admin/suppliers/:id", "suppliers:read", (ctx) => controller.get(request3(ctx)));
  register("suppliers-admin-create", "POST", "/admin/suppliers", "suppliers:create", (ctx) => controller.create(request3(ctx)));
  register("suppliers-admin-update", "PUT", "/admin/suppliers/:id", "suppliers:update", (ctx) => controller.update(request3(ctx)));
  register("suppliers-admin-delete", "DELETE", "/admin/suppliers/:id", "suppliers:delete", (ctx) => controller.remove(request3(ctx)));
  return builder.build();
}

// ../backend/src/modules/payments/controller.ts
init_errors();
var PaymentController = class {
  paymentRepo = new PaymentRepository();
  cartRepo = new cart_repository_default();
  async createPayment(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { orderId, paymentMethod, idempotencyKey } = body;
      if (!orderId || !paymentMethod) {
        return this.errorResponse("bad_request", "order_id_and_payment_method_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER";
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const transaction = await this.paymentRepo.createPaymentTransaction({
        orderId: String(orderId),
        paymentMethod: String(paymentMethod),
        idempotencyKey: idempotencyKey ? String(idempotencyKey) : void 0,
        customerIdCheck
      });
      return created(transaction, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getPaymentForOrder(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.orderId;
      if (!orderId) {
        return this.errorResponse("bad_request", "order_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER";
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "payment_not_found", HTTP_STATUS.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const payment = await this.paymentRepo.findPaymentByOrderId(orderId, customerIdCheck);
      if (!payment) {
        return this.errorResponse("not_found", "payment_not_found", HTTP_STATUS.NOT_FOUND, ctx);
      }
      return success(payment, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async verifyPayment(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { paymentId, status, providerReference } = body;
      if (!paymentId) {
        return this.errorResponse("bad_request", "payment_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const verified = await this.paymentRepo.verifyPaymentTransaction(
        String(paymentId),
        status ? String(status) : "COMPLETED",
        providerReference ? String(providerReference) : void 0
      );
      return success(verified, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof NotFoundException) {
      return this.errorResponse("not_found", error.message || "not_found", HTTP_STATUS.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/payments/routes.ts
function toControllerRequest10(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt9(handler2) {
  return (context) => handler2(context);
}
function createPaymentRoutes(controller = new PaymentController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "payment-create",
    method: "POST",
    path: "/payments/create",
    version: "v1",
    handler: adapt9((ctx) => controller.createPayment(toControllerRequest10(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["payments"],
      middleware: []
    }
  });
  builder.register({
    name: "payment-get-for-order",
    method: "GET",
    path: "/payments/order/:orderId",
    version: "v1",
    handler: adapt9((ctx) => controller.getPaymentForOrder(toControllerRequest10(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["payments"],
      middleware: []
    }
  });
  builder.register({
    name: "payment-verify",
    method: "POST",
    path: "/payments/verify",
    version: "v1",
    handler: adapt9((ctx) => controller.verifyPayment(toControllerRequest10(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["payments"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/settings/controller.ts
init_errors();

// ../backend/src/repositories/settings-repository.ts
var DEFAULT_SETTINGS = {
  store_name: "\u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629 (Qutoof Nature Store)",
  store_description: "\u0645\u062A\u062C\u0631 \u0627\u0644\u062A\u0645\u0648\u0631 \u0648\u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0648\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0627\u0644\u0637\u0627\u0632\u062C\u0629",
  contact_email: "ggjloubf@gmail.com",
  contact_phone: "+967712275038",
  support_phone: "+967777803161",
  notification_phone: "+967712275038",
  discount_phone: "+967777803161",
  business_logo_url: "",
  address: "\u0627\u0644\u064A\u0645\u0646\u060C \u0635\u0646\u0639\u0627\u0621\u060C \u0634\u0627\u0631\u0639 \u0647\u0627\u0626\u0644",
  currency: "YER",
  tax_percentage: "15",
  shipping_fee_default: "0",
  maintenance_mode: "false",
  allow_guest_checkout: "true"
};
var FORBIDDEN_KEYS = ["JWT_SECRET", "DATABASE_URL", "API_KEY", "PASSWORD", "SECRET", "TOKEN", "PRIVATE_KEY"];
var SettingsRepository = class extends base_repository_default {
  constructor() {
    super("systemSetting");
  }
  async getSetting(key, fallback2) {
    const record = await this.client.systemSetting.findUnique({
      where: { key }
    });
    return record?.value ?? fallback2 ?? DEFAULT_SETTINGS[key] ?? "";
  }
  async getPublicSettings() {
    const all = await this.getAllSettings();
    return {
      storeName: all.store_name ?? DEFAULT_SETTINGS.store_name,
      storeDescription: all.store_description ?? DEFAULT_SETTINGS.store_description,
      contactEmail: all.contact_email ?? DEFAULT_SETTINGS.contact_email,
      contactPhone: all.contact_phone ?? DEFAULT_SETTINGS.contact_phone,
      supportPhone: all.support_phone ?? DEFAULT_SETTINGS.support_phone,
      notificationPhone: all.notification_phone ?? DEFAULT_SETTINGS.notification_phone,
      discountPhone: all.discount_phone ?? DEFAULT_SETTINGS.discount_phone,
      businessLogoUrl: all.business_logo_url ?? DEFAULT_SETTINGS.business_logo_url,
      address: all.address ?? DEFAULT_SETTINGS.address,
      currency: all.currency ?? DEFAULT_SETTINGS.currency,
      taxPercentage: Number(all.tax_percentage ?? DEFAULT_SETTINGS.tax_percentage),
      defaultShippingFee: Number(all.shipping_fee_default ?? DEFAULT_SETTINGS.shipping_fee_default)
    };
  }
  async getAllSettings() {
    const records = await this.client.systemSetting.findMany();
    const result = { ...DEFAULT_SETTINGS };
    for (const r of records) {
      result[r.key] = r.value;
    }
    if (result.contact_email === "support@qutoof.sa") result.contact_email = DEFAULT_SETTINGS.contact_email;
    if (result.contact_phone === "+966500000000") result.contact_phone = DEFAULT_SETTINGS.contact_phone;
    if (result.support_phone === "712275038" || result.support_phone === "+966500000000") {
      result.support_phone = DEFAULT_SETTINGS.support_phone;
    }
    if (result.address?.includes("\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629") || result.address?.includes("\u062C\u062F\u0629") || result.address?.includes("\u0627\u0644\u0631\u064A\u0627\u0636")) {
      result.address = DEFAULT_SETTINGS.address;
    }
    if (result.currency === "SAR") result.currency = DEFAULT_SETTINGS.currency;
    return result;
  }
  async updateSettings(updates) {
    for (const key of Object.keys(updates)) {
      const upperKey = key.toUpperCase();
      if (FORBIDDEN_KEYS.some((fk) => upperKey.includes(fk))) {
        throw new ValidationException(`forbidden_setting_key_${key}`);
      }
    }
    if (updates.tax_percentage !== void 0) {
      const tax = Number(updates.tax_percentage);
      if (isNaN(tax) || tax < 0 || tax > 100) {
        throw new ValidationException("invalid_tax_percentage");
      }
    }
    for (const [key, value] of Object.entries(updates)) {
      if (value === void 0 || value === null) continue;
      await this.client.systemSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      });
    }
    return this.getAllSettings();
  }
};
var settings_repository_default = SettingsRepository;

// ../backend/src/modules/settings/controller.ts
var SettingsController = class {
  settingsRepo = new SettingsRepository();
  async getPublicSettings(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const publicSettings = await this.settingsRepo.getPublicSettings();
      return success(publicSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getAdminSettings(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const allSettings = await this.settingsRepo.getAllSettings();
      return success(allSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateAdminSettings(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const updated = await this.settingsRepo.updateSettings(body);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/settings/routes.ts
function toControllerRequest11(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt10(handler2) {
  return (context) => handler2(context);
}
function createSettingsRoutes(controller = new SettingsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "settings-public",
    method: "GET",
    path: "/settings/public",
    version: "v1",
    handler: adapt10((ctx) => controller.getPublicSettings(toControllerRequest11(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["settings"],
      middleware: []
    }
  });
  builder.register({
    name: "settings-admin-get",
    method: "GET",
    path: "/admin/settings",
    version: "v1",
    handler: adapt10((ctx) => controller.getAdminSettings(toControllerRequest11(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["settings"],
      middleware: []
    }
  });
  builder.register({
    name: "settings-admin-update",
    method: "PUT",
    path: "/admin/settings",
    version: "v1",
    handler: adapt10((ctx) => controller.updateAdminSettings(toControllerRequest11(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["settings"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/notifications/controller.ts
init_errors();
var NotificationsController = class {
  notificationRepo = new NotificationRepository();
  async listUserNotifications(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const result = await this.notificationRepo.findUserNotifications(user.id);
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAsRead(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const notificationId = request4.params?.id;
      if (!notificationId) {
        return this.errorResponse("bad_request", "notification_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.notificationRepo.markAsRead(notificationId, user.id);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAllAsRead(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const count = await this.notificationRepo.markAllAsRead(user.id);
      return success({ count }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/notifications/routes.ts
function toControllerRequest12(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt11(handler2) {
  return (context) => handler2(context);
}
function createNotificationRoutes(controller = new NotificationsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "notification-list",
    method: "GET",
    path: "/notifications",
    version: "v1",
    handler: adapt11((ctx) => controller.listUserNotifications(toControllerRequest12(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["notifications"],
      middleware: []
    }
  });
  builder.register({
    name: "notification-mark-read",
    method: "POST",
    path: "/notifications/:id/read",
    version: "v1",
    handler: adapt11((ctx) => controller.markAsRead(toControllerRequest12(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["notifications"],
      middleware: []
    }
  });
  builder.register({
    name: "notification-mark-all-read",
    method: "POST",
    path: "/notifications/read-all",
    version: "v1",
    handler: adapt11((ctx) => controller.markAllAsRead(toControllerRequest12(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["notifications"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/support/controller.ts
init_errors();

// ../backend/src/repositories/support-repository.ts
var TICKETS_STORE = /* @__PURE__ */ new Map();
var SupportRepository = class extends base_repository_default {
  settingsRepo = new settings_repository_default();
  notificationRepo = new notification_repository_default();
  constructor() {
    super("user");
  }
  async getSupportContacts() {
    const pubSettings = await this.settingsRepo.getPublicSettings();
    return {
      supportPhone: pubSettings.supportPhone,
      contactEmail: pubSettings.contactEmail,
      address: pubSettings.address
    };
  }
  async createTicket(data) {
    if (!data.subject || !data.description) {
      throw new ValidationException("subject_and_description_required");
    }
    const ticketId = `TICK-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const ticketNumber = `#${Math.floor(1e5 + Math.random() * 9e5)}`;
    const ticket = {
      id: ticketId,
      ticketNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject,
      description: data.description,
      priority: data.priority ?? "MEDIUM",
      status: "OPEN",
      assignedStaffId: null,
      replies: [],
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    TICKETS_STORE.set(ticketId, ticket);
    try {
      await this.client.activityLog.create({
        data: {
          userId: data.customerId,
          action: "SUPPORT_TICKET_CREATED",
          meta: JSON.stringify({ ticketId, subject: data.subject })
        }
      });
    } catch {
    }
    return ticket;
  }
  async findCustomerTickets(customerId) {
    const results = [];
    for (const ticket of TICKETS_STORE.values()) {
      if (ticket.customerId === customerId) {
        results.push(ticket);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async findAllTickets() {
    return Array.from(TICKETS_STORE.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  async findTicketById(ticketId, customerIdCheck) {
    const ticket = TICKETS_STORE.get(ticketId);
    if (!ticket) return null;
    if (customerIdCheck && ticket.customerId !== customerIdCheck) {
      return null;
    }
    return ticket;
  }
  async replyToTicket(data) {
    const ticket = TICKETS_STORE.get(data.ticketId);
    if (!ticket) throw new NotFoundException("ticket_not_found");
    const replyId = `REPLY-${Date.now()}`;
    const reply = {
      id: replyId,
      ticketId: ticket.id,
      senderId: data.senderId,
      senderName: data.senderName,
      senderRole: data.senderRole,
      message: data.message,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    ticket.replies.push(reply);
    ticket.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (data.senderRole === "CUSTOMER") {
      ticket.status = "IN_PROGRESS";
    } else {
      ticket.status = "WAITING_FOR_CUSTOMER";
      await this.notificationRepo.createNotification({
        userId: ticket.customerId,
        title: `\u0631\u062F \u062C\u062F\u064A\u062F \u0639\u0644\u0649 \u062A\u0630\u0643\u0631\u0629 \u0627\u0644\u062F\u0639\u0645 ${ticket.ticketNumber}`,
        body: `\u062A\u0645 \u0625\u0636\u0627\u0641\u0629 \u0631\u062F \u062C\u062F\u064A\u062F \u0645\u0646 \u0641\u0631\u064A\u0642 \u0627\u0644\u062F\u0639\u0645 \u0627\u0644\u0641\u0646\u064A: "${data.message.slice(0, 50)}..."`,
        channel: "SUPPORT",
        payload: { ticketId: ticket.id }
      });
    }
    TICKETS_STORE.set(ticket.id, ticket);
    return ticket;
  }
  async updateTicketStatus(ticketId, status) {
    const ticket = TICKETS_STORE.get(ticketId);
    if (!ticket) throw new NotFoundException("ticket_not_found");
    ticket.status = status;
    ticket.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (status === "RESOLVED" || status === "CLOSED") {
      ticket.resolvedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    TICKETS_STORE.set(ticket.id, ticket);
    return ticket;
  }
};
var support_repository_default = SupportRepository;

// ../backend/src/modules/support/controller.ts
var SupportController = class {
  supportRepo = new SupportRepository();
  cartRepo = new cart_repository_default();
  async getSupportContacts(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const contacts = await this.supportRepo.getSupportContacts();
      return success(contacts, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async createTicket(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { subject, description, priority } = body;
      if (!subject || !description) {
        return this.errorResponse("bad_request", "subject_and_description_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const ticket = await this.supportRepo.createTicket({
        customerId: user.id,
        customerName: user.displayName || user.name || user.email,
        customerEmail: user.email,
        subject: String(subject),
        description: String(description),
        priority: priority ? String(priority) : "MEDIUM"
      });
      return created(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listTickets(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      let tickets;
      if (isStaffOrAdmin) {
        tickets = await this.supportRepo.findAllTickets();
      } else {
        tickets = await this.supportRepo.findCustomerTickets(user.id);
      }
      return success({ tickets }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getTicketById(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      if (!ticketId) {
        return this.errorResponse("bad_request", "ticket_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      const ticket = await this.supportRepo.findTicketById(
        ticketId,
        isStaffOrAdmin ? void 0 : user.id
      );
      if (!ticket) {
        return this.errorResponse("not_found", "ticket_not_found", HTTP_STATUS.NOT_FOUND, ctx);
      }
      return success(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async replyTicket(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      const message = request4.body?.message;
      if (!ticketId || !message) {
        return this.errorResponse("bad_request", "ticket_id_and_message_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      const ticketCheck = await this.supportRepo.findTicketById(ticketId, isStaffOrAdmin ? void 0 : user.id);
      if (!ticketCheck) {
        return this.errorResponse("not_found", "ticket_not_found", HTTP_STATUS.NOT_FOUND, ctx);
      }
      const updated = await this.supportRepo.replyToTicket({
        ticketId,
        senderId: user.id,
        senderName: user.displayName || user.name || user.email,
        senderRole: user.role ?? "CUSTOMER",
        message: String(message)
      });
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateTicketStatus(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      const status = request4.body?.status;
      if (!ticketId || !status) {
        return this.errorResponse("bad_request", "ticket_id_and_status_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.supportRepo.updateTicketStatus(ticketId, status);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof NotFoundException) {
      return this.errorResponse("not_found", error.message || "not_found", HTTP_STATUS.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/support/routes.ts
function toControllerRequest13(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt12(handler2) {
  return (context) => handler2(context);
}
function createSupportRoutes(controller = new SupportController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "support-contacts",
    method: "GET",
    path: "/support/contacts",
    version: "v1",
    handler: adapt12((ctx) => controller.getSupportContacts(toControllerRequest13(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  builder.register({
    name: "support-ticket-create",
    method: "POST",
    path: "/support/tickets",
    version: "v1",
    handler: adapt12((ctx) => controller.createTicket(toControllerRequest13(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  builder.register({
    name: "support-ticket-list",
    method: "GET",
    path: "/support/tickets",
    version: "v1",
    handler: adapt12((ctx) => controller.listTickets(toControllerRequest13(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  builder.register({
    name: "support-ticket-get",
    method: "GET",
    path: "/support/tickets/:id",
    version: "v1",
    handler: adapt12((ctx) => controller.getTicketById(toControllerRequest13(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  builder.register({
    name: "support-ticket-reply",
    method: "POST",
    path: "/support/tickets/:id/reply",
    version: "v1",
    handler: adapt12((ctx) => controller.replyTicket(toControllerRequest13(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  builder.register({
    name: "support-ticket-status",
    method: "PATCH",
    path: "/support/tickets/:id/status",
    version: "v1",
    handler: adapt12((ctx) => controller.updateTicketStatus(toControllerRequest13(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["support"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/reports/controller.ts
init_errors();

// ../backend/src/repositories/reports-repository.ts
var ReportsRepository = class extends base_repository_default {
  supportRepo = new support_repository_default();
  constructor() {
    super("order");
  }
  async getDashboardKpis() {
    const [
      ordersAgg,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      inventories,
      supportTickets
    ] = await Promise.all([
      this.client.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "CANCELED" } }
      }),
      this.client.order.count(),
      this.client.order.count({ where: { status: "DELIVERED" } }),
      this.client.order.count({ where: { status: "PENDING" } }),
      this.client.customer.count(),
      this.client.product.count({ where: { isPublished: true } }),
      this.client.inventory.findMany(),
      this.supportRepo.findAllTickets()
    ]);
    const totalRevenue = ordersAgg._sum?.total ?? 0;
    const lowStockProducts = inventories.filter((i) => i.available <= i.safetyStock).length;
    const openSupportTickets = supportTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      openSupportTickets
    };
  }
  async getSalesReport(startDate, endDate, status) {
    const where = {};
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }
    const [agg, count, orders] = await Promise.all([
      this.client.order.aggregate({
        _sum: { total: true },
        _avg: { total: true },
        where
      }),
      this.client.order.count({ where }),
      this.client.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { customer: true }
      })
    ]);
    return {
      totalOrders: count,
      totalRevenue: agg._sum?.total ?? 0,
      averageOrderValue: Math.round((agg._avg?.total ?? 0) * 100) / 100,
      recentOrders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.code,
        customerName: o.customer?.fullName || o.customer?.email || "\u0639\u0645\u064A\u0644",
        status: o.status,
        total: o.total,
        createdAt: o.createdAt
      }))
    };
  }
  async getProductAnalytics() {
    const [totalProducts, lowStockItems, topItems] = await Promise.all([
      this.client.product.count(),
      this.client.inventory.findMany({
        where: { available: { lte: 5 } },
        include: { product: true },
        take: 20
      }),
      this.client.orderItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true, total: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: 10
      })
    ]);
    const productIds = topItems.map((i) => i.productId);
    const products = await this.client.product.findMany({
      where: { id: { in: productIds } }
    });
    const bestSellers = topItems.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      return {
        id: item.productId,
        name: prod?.name || "\u0645\u0646\u062A\u062C",
        sku: prod?.sku || "-",
        totalQuantitySold: item._sum?.quantity ?? 0,
        totalRevenue: item._sum?.total ?? 0
      };
    });
    return {
      totalProducts,
      lowStockCount: lowStockItems.length,
      lowStockList: lowStockItems.map((i) => ({
        id: i.id,
        productName: i.product.name,
        available: i.available,
        safetyStock: i.safetyStock
      })),
      bestSellers
    };
  }
  async getInventoryAnalytics() {
    const inventories = await this.client.inventory.findMany({
      include: { product: true }
    });
    let totalUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    for (const inv of inventories) {
      totalUnits += inv.quantity;
      if (inv.available <= 0) outOfStockCount++;
      else if (inv.available <= inv.safetyStock) lowStockCount++;
    }
    return {
      totalItems: inventories.length,
      totalUnits,
      lowStockCount,
      outOfStockCount,
      items: inventories.map((i) => ({
        id: i.id,
        productName: i.product.name,
        sku: i.product.sku,
        quantity: i.quantity,
        reserved: i.reserved,
        available: i.available
      }))
    };
  }
  async getCustomerAnalytics() {
    const [totalCustomers, customers] = await Promise.all([
      this.client.customer.count(),
      this.client.customer.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        include: { orders: true }
      })
    ]);
    return {
      totalCustomers,
      recentCustomers: customers.map((c) => ({
        id: c.id,
        name: c.fullName || c.email,
        email: c.email,
        ordersCount: c.orders.length,
        createdAt: c.createdAt
      }))
    };
  }
  async getPaymentAnalytics() {
    const payments = await this.client.payment.findMany();
    let completedTotal = 0;
    let pendingTotal = 0;
    let failedTotal = 0;
    for (const p of payments) {
      if (p.status === "COMPLETED") completedTotal += p.amount;
      else if (p.status === "PENDING") pendingTotal += p.amount;
      else failedTotal += p.amount;
    }
    return {
      totalTransactions: payments.length,
      completedTotal,
      pendingTotal,
      failedTotal
    };
  }
};

// ../backend/src/modules/reports/controller.ts
var ReportsController = class {
  reportsRepo = new ReportsRepository();
  async getDashboardKpis(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const kpis = await this.reportsRepo.getDashboardKpis();
      return success(kpis, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getSalesReport(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const { startDate, endDate, status } = request4.query || {};
      const report = await this.reportsRepo.getSalesReport(
        startDate ? String(startDate) : void 0,
        endDate ? String(endDate) : void 0,
        status ? String(status) : void 0
      );
      return success(report, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getProductAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getProductAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getInventoryAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getInventoryAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getCustomerAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getCustomerAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getPaymentAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getPaymentAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/reports/routes.ts
function toControllerRequest14(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt13(handler2) {
  return (context) => handler2(context);
}
function createReportsRoutes(controller = new ReportsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "reports-dashboard",
    method: "GET",
    path: "/reports/dashboard",
    version: "v1",
    handler: adapt13((ctx) => controller.getDashboardKpis(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  builder.register({
    name: "reports-sales",
    method: "GET",
    path: "/reports/sales",
    version: "v1",
    handler: adapt13((ctx) => controller.getSalesReport(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  builder.register({
    name: "reports-products",
    method: "GET",
    path: "/reports/products",
    version: "v1",
    handler: adapt13((ctx) => controller.getProductAnalytics(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  builder.register({
    name: "reports-inventory",
    method: "GET",
    path: "/reports/inventory",
    version: "v1",
    handler: adapt13((ctx) => controller.getInventoryAnalytics(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  builder.register({
    name: "reports-customers",
    method: "GET",
    path: "/reports/customers",
    version: "v1",
    handler: adapt13((ctx) => controller.getCustomerAnalytics(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  builder.register({
    name: "reports-payments",
    method: "GET",
    path: "/reports/payments",
    version: "v1",
    handler: adapt13((ctx) => controller.getPaymentAnalytics(toControllerRequest14(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["reports"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/audit/controller.ts
init_errors();
var AuditController = class {
  auditRepo = new AuditRepository();
  async listAuditLogs(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const { resource, action, actorId, page, limit } = request4.query || {};
      const result = await this.auditRepo.findAuditLogs({
        resource: resource ? String(resource) : void 0,
        action: action ? String(action) : void 0,
        actorId: actorId ? String(actorId) : void 0,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  mapError(error, ctx) {
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ctx
    );
  }
  errorResponse(code, message, statusCode, ctx) {
    return {
      statusCode,
      body: {
        success: false,
        error: { code, message },
        meta: {
          timestamp: ctx.timestamp,
          requestId: ctx.requestId,
          version: ctx.version,
          locale: ctx.locale
        }
      }
    };
  }
};

// ../backend/src/modules/audit/routes.ts
function toControllerRequest15(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: {
      metadata: {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        version: ctx.version ?? "v1"
      }
    }
  };
}
function adapt14(handler2) {
  return (context) => handler2(context);
}
function createAuditRoutes(controller = new AuditController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "audit-logs-list",
    method: "GET",
    path: "/audit/logs",
    version: "v1",
    handler: adapt14((ctx) => controller.listAuditLogs(toControllerRequest15(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["audit"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/education/controller.ts
init_prisma_service();
import { randomUUID } from "node:crypto";

// ../backend/src/modules/education/medical-guidance-ai-service.ts
var MAX_INPUT_LENGTH = 2e4;
function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function urls(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string" && /^https?:\/\//i.test(item.trim())).map((item) => item.trim()).slice(0, 10) : [];
}
function fallback(body) {
  const findings = [];
  if (!body) findings.push({ severity: "critical", message: "\u0646\u0635 \u0627\u0644\u0625\u0631\u0634\u0627\u062F \u0645\u0641\u0642\u0648\u062F.", suggestedAction: "\u0623\u0643\u0645\u0644 \u0627\u0644\u0646\u0635 \u0642\u0628\u0644 \u0627\u0644\u0645\u0631\u0627\u062C\u0639\u0629." });
  if (!/https?:\/\//i.test(body)) findings.push({ severity: "high", message: "\u0644\u0627 \u064A\u0638\u0647\u0631 \u0645\u0635\u062F\u0631 \u062F\u0627\u062E\u0644 \u0646\u0635 \u0627\u0644\u0637\u0644\u0628.", suggestedAction: "\u0623\u0636\u0641 \u0645\u0635\u062F\u0631\u0627\u064B \u0645\u0648\u062B\u0648\u0642\u0627\u064B \u0645\u0646 \u062D\u0642\u0644 \u0627\u0644\u0645\u0635\u0627\u062F\u0631." });
  if (/يعالج|يشفي|جرعة|أوقف الدواء|تشخيص/iu.test(body)) findings.push({ severity: "critical", message: "\u062A\u0648\u062C\u062F \u0635\u064A\u0627\u063A\u0629 \u0635\u062D\u064A\u0629 \u062D\u0633\u0627\u0633\u0629 \u062A\u062D\u062A\u0627\u062C \u0645\u0631\u0627\u062C\u0639\u0629 \u0645\u062E\u062A\u0635.", suggestedAction: "\u0623\u0639\u062F \u0627\u0644\u0635\u064A\u0627\u063A\u0629 \u0643\u0645\u0639\u0644\u0648\u0645\u0629 \u063A\u0630\u0627\u0626\u064A\u0629 \u0639\u0627\u0645\u0629." });
  return { provider: "deterministic-fallback", status: findings.length ? "needs_review" : "pass", readOnly: true, mustNotPublish: true, findings };
}
async function reviewMedicalGuidanceWithAI(request4) {
  const input = request4.body && typeof request4.body === "object" ? request4.body : {};
  const title = text(input.title, 180);
  const body = text(input.body, MAX_INPUT_LENGTH);
  const sourceUrls = urls(input.sourceUrls);
  if (!title || !body) return validationError("education_ai_review_fields_required", { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" });
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;
  const apiBase = (process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_API_BASE || "").replace(/\/$/, "");
  const model = process.env.EDUCATION_REVIEW_MODEL || "gpt-5-mini";
  if (!apiKey || !apiBase) return success({ ...fallback(body), provider: "deterministic-fallback", reason: "AI provider is not configured" }, { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" });
  const systemPrompt = "\u0623\u0646\u062A \u0645\u0631\u0627\u062C\u0639 \u0645\u062D\u062A\u0648\u0649 \u063A\u0630\u0627\u0626\u064A \u0645\u0633\u0624\u0648\u0644. \u0644\u0627 \u062A\u0634\u062E\u0635 \u0648\u0644\u0627 \u062A\u0639\u0627\u0644\u062C \u0648\u0644\u0627 \u062A\u0642\u062A\u0631\u062D \u062C\u0631\u0639\u0627\u062A. \u062D\u0644\u0644 \u0627\u0644\u0646\u0635 \u0641\u0642\u0637\u060C \u0623\u062E\u0631\u062C JSON \u0645\u0637\u0627\u0628\u0642\u0627\u064B \u0644\u0644\u0645\u062E\u0637\u0637\u060C \u0648\u0627\u0639\u062A\u0628\u0631 \u0643\u0644 \u0646\u062A\u064A\u062C\u0629 \u0627\u0642\u062A\u0631\u0627\u062D\u0627\u064B \u064A\u062D\u062A\u0627\u062C \u0645\u0631\u0627\u062C\u0639\u0629 \u0628\u0634\u0631\u064A\u0629. \u0644\u0627 \u062A\u062E\u062A\u0631\u0639 \u0645\u0635\u062F\u0631\u0627\u064B.";
  const userPayload = JSON.stringify({ title, body, sourceUrls, productName: text(input.productName, 160), produceKey: text(input.produceKey, 120), familyName: text(input.familyName, 120) });
  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_completion_tokens: 1200,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `\u0631\u0627\u062C\u0639 \u0647\u0630\u0627 \u0627\u0644\u0625\u062F\u062E\u0627\u0644 \u0648\u0623\u0639\u062F JSON \u0641\u0642\u0637:
${userPayload}` }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "medical_guidance_review",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                status: { type: "string", enum: ["pass", "needs_review", "blocked"] },
                summary: { type: "string" },
                findings: { type: "array", items: { type: "object", additionalProperties: false, properties: { severity: { type: "string" }, message: { type: "string" }, suggestedAction: { type: "string" } }, required: ["severity", "message", "suggestedAction"] } }
              },
              required: ["status", "summary", "findings"]
            }
          }
        }
      }),
      signal: AbortSignal.timeout(12e3)
    });
    if (!response.ok) throw new Error(`AI review failed with status ${response.status}`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("AI review returned empty content");
    const result = JSON.parse(content);
    return success({ ...result, provider: model, readOnly: true, mustNotPublish: true }, { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" });
  } catch {
    return success({ ...fallback(body), provider: "deterministic-fallback", reason: "AI review unavailable; no content was changed" }, { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" });
  }
}

// ../backend/src/modules/education/controller.ts
var EducationController = class {
  prisma = PrismaService.getClient();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  async listArticles(request4) {
    const ctx = this.context(request4);
    try {
      const page = Math.max(1, Number(this.value(request4.query?.page) ?? 1) || 1);
      const limit = Math.min(50, Math.max(1, Number(this.value(request4.query?.limit) ?? 12) || 12));
      const [data, total] = await Promise.all([
        this.prisma.educationalArticle.findMany({
          where: { status: "PUBLISHED", deletedAt: null },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
          skip: (page - 1) * limit,
          take: limit,
          select: { id: true, slug: true, title: true, summary: true, articleType: true, coverImageUrl: true, coverImageSourceUrl: true, coverImageLicense: true, sourceUrls: true, publishedAt: true, family: { select: { familyKey: true, name: true } } }
        }),
        this.prisma.educationalArticle.count({ where: { status: "PUBLISHED", deletedAt: null } })
      ]);
      return paginated(data, page, limit, total, ctx);
    } catch {
      return internalError("education_articles_unavailable", ctx);
    }
  }
  async getArticle(request4) {
    const ctx = this.context(request4);
    const slug = request4.params?.slug;
    if (!slug) return validationError("article_slug_required", ctx);
    try {
      const article = await this.prisma.educationalArticle.findFirst({
        where: { slug, status: "PUBLISHED", deletedAt: null },
        include: { family: true, productLinks: { include: { product: { select: { id: true, name: true, slug: true, produceKey: true } } } } }
      });
      return article ? success(article, ctx) : notFound("education_article_not_found", ctx);
    } catch {
      return internalError("education_article_unavailable", ctx);
    }
  }
  async reviewMedicalGuidance(request4) {
    return reviewMedicalGuidanceWithAI(request4);
  }
  async listAdminFamilies(request4) {
    const ctx = this.context(request4);
    try {
      const rows = await this.prisma.productFamily.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true, articles: true } } }
      });
      return success(rows, ctx);
    } catch {
      return internalError("education_families_unavailable", ctx);
    }
  }
  async createAdminFamily(request4) {
    const ctx = this.context(request4);
    const body = request4.body ?? {};
    const familyKey = this.text(body.familyKey, 80).toLowerCase();
    const name = this.text(body.name, 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(familyKey)) return validationError("family_key_invalid", ctx);
    if (!name) return validationError("family_name_required", ctx);
    try {
      const row = await this.prisma.productFamily.create({
        data: { id: randomUUID(), familyKey, name, description: this.optionalText(body.description, 1e3) }
      });
      return created(row, ctx);
    } catch {
      return internalError("education_family_create_failed", ctx);
    }
  }
  async updateAdminFamily(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    const body = request4.body ?? {};
    if (!id) return validationError("family_id_required", ctx);
    const familyKey = this.text(body.familyKey, 80).toLowerCase();
    const name = this.text(body.name, 120);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(familyKey)) return validationError("family_key_invalid", ctx);
    if (!name) return validationError("family_name_required", ctx);
    try {
      const row = await this.prisma.productFamily.update({
        where: { id },
        data: { familyKey, name, description: this.optionalText(body.description, 1e3) }
      });
      return success(row, ctx);
    } catch {
      return internalError("education_family_update_failed", ctx);
    }
  }
  async deleteAdminFamily(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("family_id_required", ctx);
    try {
      await this.prisma.productFamily.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError("education_family_delete_failed", ctx);
    }
  }
  async listAdminArticles(request4) {
    const ctx = this.context(request4);
    const search = this.optionalText(this.value(request4.query?.search), 120);
    const status = this.optionalText(this.value(request4.query?.status), 30);
    try {
      const rows = await this.prisma.educationalArticle.findMany({
        where: {
          deletedAt: null,
          ...status ? { status } : {},
          ...search ? { OR: [{ title: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }] } : {}
        },
        orderBy: { updatedAt: "desc" },
        take: 100,
        include: { family: { select: { id: true, familyKey: true, name: true } }, productLinks: { select: { productId: true, product: { select: { id: true, name: true, produceKey: true } } } } }
      });
      return success(rows, ctx);
    } catch {
      return internalError("admin_education_articles_unavailable", ctx);
    }
  }
  async createAdminArticle(request4) {
    const ctx = this.context(request4);
    const body = request4.body ?? {};
    const input = this.articleInput(body);
    if (!input.slug || !input.title || !input.body) return validationError("education_article_fields_required", ctx);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const article = await tx.educationalArticle.create({ data: { id: randomUUID(), ...input.data } });
        if (input.productIds.length) await tx.articleProduct.createMany({ data: input.productIds.map((productId) => ({ id: randomUUID(), articleId: article.id, productId })) });
        return tx.educationalArticle.findUnique({ where: { id: article.id }, include: { family: true, productLinks: { include: { product: true } } } });
      });
      return created(row, ctx);
    } catch {
      return internalError("education_article_create_failed", ctx);
    }
  }
  async updateAdminArticle(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    const body = request4.body ?? {};
    const input = this.articleInput(body);
    if (!id) return validationError("education_article_id_required", ctx);
    if (!input.slug || !input.title || !input.body) return validationError("education_article_fields_required", ctx);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const article = await tx.educationalArticle.update({ where: { id }, data: input.data });
        await tx.articleProduct.deleteMany({ where: { articleId: id } });
        if (input.productIds.length) await tx.articleProduct.createMany({ data: input.productIds.map((productId) => ({ id: randomUUID(), articleId: id, productId })) });
        return tx.educationalArticle.findUnique({ where: { id: article.id }, include: { family: true, productLinks: { include: { product: true } } } });
      });
      return success(row, ctx);
    } catch {
      return internalError("education_article_update_failed", ctx);
    }
  }
  async deleteAdminArticle(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("education_article_id_required", ctx);
    try {
      await this.prisma.educationalArticle.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date(), status: "ARCHIVED" } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError("education_article_delete_failed", ctx);
    }
  }
  async createConsultation(request4) {
    const ctx = this.context(request4);
    const body = request4.body ?? {};
    const contactName = typeof body.contactName === "string" ? body.contactName.trim() : "";
    const goal = typeof body.goal === "string" ? body.goal.trim() : "";
    const consent = body.consent === true;
    if (!contactName || contactName.length > 120) return validationError("consultation_name_invalid", ctx);
    if (!goal || goal.length > 1e3) return validationError("consultation_goal_invalid", ctx);
    if (!consent) return validationError("consultation_consent_required", ctx);
    try {
      const record = await this.prisma.consultationRequest.create({
        data: {
          id: randomUUID(),
          contactName,
          contactPhone: typeof body.contactPhone === "string" ? body.contactPhone.trim().slice(0, 40) : void 0,
          contactEmail: typeof body.contactEmail === "string" ? body.contactEmail.trim().slice(0, 180) : void 0,
          goal,
          dietaryRestrictions: typeof body.dietaryRestrictions === "string" ? body.dietaryRestrictions.trim().slice(0, 1e3) : void 0,
          preferredContactTime: typeof body.preferredContactTime === "string" ? body.preferredContactTime.trim().slice(0, 100) : void 0,
          consent: true,
          status: "NEW"
        },
        select: { id: true, status: true, createdAt: true }
      });
      return created(record, ctx);
    } catch {
      return internalError("consultation_create_failed", ctx);
    }
  }
  async listConsultations(request4) {
    const ctx = this.context(request4);
    try {
      const rows = await this.prisma.consultationRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
      return success(rows, ctx);
    } catch {
      return internalError("consultations_unavailable", ctx);
    }
  }
  articleInput(body) {
    const status = ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(this.text(body.status, 20)) ? this.text(body.status, 20) : "DRAFT";
    const productIds = Array.isArray(body.productIds) ? body.productIds.filter((value) => typeof value === "string" && value.length > 0).slice(0, 50) : [];
    const sourceUrls = Array.isArray(body.sourceUrls) ? body.sourceUrls.filter((value) => typeof value === "string" && /^https?:\/\//i.test(value.trim())).map((value) => value.trim()).slice(0, 20) : [];
    return {
      slug: this.text(body.slug, 160).toLowerCase(),
      title: this.text(body.title, 180),
      body: this.text(body.body, 2e4),
      productIds,
      data: {
        slug: this.text(body.slug, 160).toLowerCase(),
        title: this.text(body.title, 180),
        summary: this.optionalText(body.summary, 500),
        body: this.text(body.body, 2e4),
        articleType: this.optionalText(body.articleType, 40) ?? "BENEFITS",
        status,
        coverImageUrl: this.optionalUrl(body.coverImageUrl),
        coverImageSourceUrl: this.optionalUrl(body.coverImageSourceUrl),
        coverImageLicense: this.optionalText(body.coverImageLicense, 120),
        sourceUrls,
        familyId: this.optionalText(body.familyId, 80),
        publishedAt: status === "PUBLISHED" ? /* @__PURE__ */ new Date() : null
      }
    };
  }
  text(value, max) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  optionalText(value, max) {
    const text2 = this.text(value, max);
    return text2 || void 0;
  }
  optionalUrl(value) {
    const text2 = this.optionalText(value, 1e3);
    return text2 && /^https?:\/\//i.test(text2) ? text2 : void 0;
  }
  value(value) {
    return Array.isArray(value) ? value[0] : value;
  }
};
var controller_default10 = EducationController;

// ../backend/src/modules/education/routes.ts
function toControllerRequest16(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function adapt15(handler2) {
  return (context) => handler2(context);
}
function publicOptions() {
  return { mode: "public", publicRoute: true, privateRoute: false, authenticationRequired: false, authorizationRequired: false, requiredPermissions: [], tags: ["education"], middleware: [] };
}
function privateOptions(permission) {
  return { mode: "private", publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: true, requiredPermissions: [permission], tags: ["education"], middleware: [] };
}
function createEducationRoutes(controller = new controller_default10()) {
  const builder = new RouterBuilder();
  const register = (definition) => builder.register({ ...definition, version: "v1", handler: adapt15(definition.handler) });
  register({ name: "education-articles-list", method: "GET", path: "/education/articles", handler: (ctx) => controller.listArticles(toControllerRequest16(ctx)), options: publicOptions() });
  register({ name: "education-article-get", method: "GET", path: "/education/articles/:slug", handler: (ctx) => controller.getArticle(toControllerRequest16(ctx)), options: publicOptions() });
  register({ name: "education-consultation-create", method: "POST", path: "/education/consultations", handler: (ctx) => controller.createConsultation(toControllerRequest16(ctx)), options: publicOptions() });
  register({ name: "education-ai-review", method: "POST", path: "/admin/education/review", handler: (ctx) => controller.reviewMedicalGuidance(toControllerRequest16(ctx)), options: privateOptions("products:read") });
  register({ name: "education-families-list", method: "GET", path: "/admin/education/families", handler: (ctx) => controller.listAdminFamilies(toControllerRequest16(ctx)), options: privateOptions("products:read") });
  register({ name: "education-family-create", method: "POST", path: "/admin/education/families", handler: (ctx) => controller.createAdminFamily(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-family-update", method: "PUT", path: "/admin/education/families/:id", handler: (ctx) => controller.updateAdminFamily(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-family-delete", method: "DELETE", path: "/admin/education/families/:id", handler: (ctx) => controller.deleteAdminFamily(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-articles-admin-list", method: "GET", path: "/admin/education/articles", handler: (ctx) => controller.listAdminArticles(toControllerRequest16(ctx)), options: privateOptions("products:read") });
  register({ name: "education-article-create", method: "POST", path: "/admin/education/articles", handler: (ctx) => controller.createAdminArticle(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-article-update", method: "PUT", path: "/admin/education/articles/:id", handler: (ctx) => controller.updateAdminArticle(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-article-delete", method: "DELETE", path: "/admin/education/articles/:id", handler: (ctx) => controller.deleteAdminArticle(toControllerRequest16(ctx)), options: privateOptions("products:update") });
  register({ name: "education-consultations-list", method: "GET", path: "/admin/education/consultations", handler: (ctx) => controller.listConsultations(toControllerRequest16(ctx)), options: privateOptions("customers:read") });
  return builder.build();
}

// ../backend/src/modules/categories/controller.ts
import { randomUUID as randomUUID2 } from "node:crypto";
init_prisma_service();
var CategoriesController = class {
  prisma = PrismaService.getClient();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  text(value, max = 120) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  async list(request4) {
    const ctx = this.context(request4);
    const search = this.text(request4.query?.search, 120);
    try {
      const rows = await this.prisma.category.findMany({
        where: { deletedAt: null, ...search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { slug: { contains: search, mode: "insensitive" } }] } : {} },
        orderBy: { name: "asc" },
        include: { _count: { select: { products: true, children: true } } }
      });
      return success(rows, ctx);
    } catch {
      return internalError("categories_unavailable", ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    const body = request4.body ?? {};
    const name = this.text(body.name);
    const slug = this.text(body.slug, 120).toLowerCase();
    const parentId = this.text(body.parentId, 50) || null;
    if (!name) return validationError("category_name_required", ctx);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return validationError("category_slug_invalid", ctx);
    try {
      const row = await this.prisma.category.create({ data: { id: randomUUID2(), name, slug, parentId } });
      return created(row, ctx);
    } catch {
      return internalError("category_create_failed", ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    const body = request4.body ?? {};
    const name = this.text(body.name);
    const slug = this.text(body.slug, 120).toLowerCase();
    if (!id) return validationError("category_id_required", ctx);
    if (!name) return validationError("category_name_required", ctx);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return validationError("category_slug_invalid", ctx);
    try {
      const row = await this.prisma.category.update({ where: { id }, data: { name, slug, parentId: this.text(body.parentId, 50) || null } });
      return success(row, ctx);
    } catch {
      return internalError("category_update_failed", ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("category_id_required", ctx);
    try {
      const used = await this.prisma.product.count({ where: { categoryId: id, deletedAt: null } });
      if (used > 0) return validationError("category_has_products", ctx);
      await this.prisma.category.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError("category_delete_failed", ctx);
    }
  }
};
var controller_default11 = CategoriesController;

// ../backend/src/modules/categories/routes.ts
function toRequest(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, user: ctx.user, context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function adapt16(handler2) {
  return (ctx) => handler2(ctx);
}
function createCategoriesRoutes(controller = new controller_default11()) {
  const builder = new RouterBuilder();
  const options = { mode: "private", publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: false, tags: ["categories"], middleware: [] };
  builder.register({ name: "categories-list", method: "GET", path: "/categories", version: "v1", handler: adapt16((ctx) => controller.list(toRequest(ctx))), options });
  builder.register({ name: "categories-create", method: "POST", path: "/categories", version: "v1", handler: adapt16((ctx) => controller.create(toRequest(ctx))), options });
  builder.register({ name: "categories-update", method: "PUT", path: "/categories/:id", version: "v1", handler: adapt16((ctx) => controller.update(toRequest(ctx))), options });
  builder.register({ name: "categories-delete", method: "DELETE", path: "/categories/:id", version: "v1", handler: adapt16((ctx) => controller.remove(toRequest(ctx))), options });
  return builder.build();
}

// ../backend/src/modules/units/controller.ts
import { randomUUID as randomUUID3 } from "node:crypto";
init_prisma_service();
var UNIT_TYPES = /* @__PURE__ */ new Set(["PIECE", "WEIGHT", "VOLUME", "LENGTH", "AREA"]);
var UnitsController = class {
  prisma = PrismaService.getClient();
  context(request4) {
    return {
      timestamp: request4.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: request4.context?.metadata?.version ?? "v1",
      locale: request4.context?.metadata?.locale
    };
  }
  text(value, max = 80) {
    return typeof value === "string" ? value.trim().slice(0, max) : "";
  }
  type(value) {
    const valueText = this.text(value, 20).toUpperCase();
    return UNIT_TYPES.has(valueText) ? valueText : "";
  }
  async list(request4) {
    const ctx = this.context(request4);
    const search = this.text(request4.query?.search);
    try {
      const rows = await this.prisma.unit.findMany({
        where: { deletedAt: null, ...search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { symbol: { contains: search, mode: "insensitive" } }] } : {} },
        orderBy: [{ type: "asc" }, { name: "asc" }],
        include: { _count: { select: { products: true } } }
      });
      return success(rows, ctx);
    } catch {
      return internalError("units_unavailable", ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    const body = request4.body ?? {};
    const name = this.text(body.name);
    const symbol = this.text(body.symbol, 20) || null;
    const type = this.type(body.type);
    if (!name) return validationError("unit_name_required", ctx);
    if (!type) return validationError("unit_type_invalid", ctx);
    try {
      const row = await this.prisma.unit.create({ data: { id: randomUUID3(), name, symbol, type } });
      return created(row, ctx);
    } catch {
      return internalError("unit_create_failed", ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    const body = request4.body ?? {};
    const name = this.text(body.name);
    const symbol = this.text(body.symbol, 20) || null;
    const type = this.type(body.type);
    if (!id) return validationError("unit_id_required", ctx);
    if (!name) return validationError("unit_name_required", ctx);
    if (!type) return validationError("unit_type_invalid", ctx);
    try {
      const row = await this.prisma.unit.update({ where: { id }, data: { name, symbol, type } });
      return success(row, ctx);
    } catch {
      return internalError("unit_update_failed", ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError("unit_id_required", ctx);
    try {
      const used = await this.prisma.product.count({ where: { unitId: id } });
      if (used > 0) return validationError("unit_has_products", ctx);
      await this.prisma.unit.update({ where: { id }, data: { deletedAt: /* @__PURE__ */ new Date() } });
      return success({ id, deleted: true }, ctx);
    } catch {
      return internalError("unit_delete_failed", ctx);
    }
  }
};
var controller_default12 = UnitsController;

// ../backend/src/modules/units/routes.ts
function toRequest2(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, user: ctx.user, context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function adapt17(handler2) {
  return (ctx) => handler2(ctx);
}
function createUnitsRoutes(controller = new controller_default12()) {
  const builder = new RouterBuilder();
  const options = { mode: "private", publicRoute: false, privateRoute: true, authenticationRequired: true, authorizationRequired: false, tags: ["units"], middleware: [] };
  builder.register({ name: "units-list", method: "GET", path: "/units", version: "v1", handler: adapt17((ctx) => controller.list(toRequest2(ctx))), options });
  builder.register({ name: "units-create", method: "POST", path: "/units", version: "v1", handler: adapt17((ctx) => controller.create(toRequest2(ctx))), options });
  builder.register({ name: "units-update", method: "PUT", path: "/units/:id", version: "v1", handler: adapt17((ctx) => controller.update(toRequest2(ctx))), options });
  builder.register({ name: "units-delete", method: "DELETE", path: "/units/:id", version: "v1", handler: adapt17((ctx) => controller.remove(toRequest2(ctx))), options });
  return builder.build();
}

// ../backend/src/modules/invoices/routes.ts
function toRequest3(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, user: ctx.user, context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function adapt18(handler2) {
  return (ctx) => handler2(ctx);
}
function createInvoiceRoutes(controller = new controller_default()) {
  const builder = new RouterBuilder();
  builder.register({ name: "invoice-public-get", method: "GET", path: "/invoices/:id/public", version: "v1", handler: adapt18((ctx) => controller.getPublic(toRequest3(ctx))), options: { mode: "public", publicRoute: true, privateRoute: false, authenticationRequired: false, authorizationRequired: false, tags: ["invoices"], middleware: [] } });
  return builder.build();
}

// ../backend/src/modules/assistant/service.ts
var MAX_MESSAGE_LENGTH = 1200;
var MAX_HISTORY_ITEMS = 8;
var MAX_CONTEXT_PRODUCTS = 80;
var STATIC_FALLBACK_PRODUCTS = [
  { name: "\u062A\u0641\u0627\u062D \u0623\u062D\u0645\u0631 \u0637\u0627\u0632\u062C" },
  { name: "\u0628\u0631\u062A\u0642\u0627\u0644 \u0623\u0628\u0648 \u0635\u0631\u0629" },
  { name: "\u0644\u064A\u0645\u0648\u0646 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u064A\u0648\u0633\u0641\u064A \u0628\u0644\u062F\u064A" },
  { name: "\u0645\u0627\u0646\u062C\u0648 \u064A\u0645\u0646\u064A \u0633\u0648\u062F\u0627\u0646\u064A" },
  { name: "\u0631\u0645\u0627\u0646 \u0635\u0639\u062F\u064A \u0641\u0627\u062E\u0631" },
  { name: "\u0639\u0646\u0628 \u0631\u0648\u0636\u064A \u064A\u0645\u0646\u064A" },
  { name: "\u0628\u0637\u064A\u062E \u0623\u062D\u0645\u0631 \u0628\u0644\u062F\u064A" },
  { name: "\u0634\u0645\u0627\u0645 \u064A\u0645\u0646\u064A \u062D\u0644\u0648" },
  { name: "\u062E\u0648\u062E \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u0645\u0648\u0632 \u0639\u0636\u0648\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u0641\u0631\u0627\u0648\u0644\u0629 \u0637\u0627\u0632\u062C\u0629" },
  { name: "\u0641\u0644\u0641\u0644 \u0631\u0648\u0645\u064A \u0645\u0644\u0648\u0646" },
  { name: "\u062C\u0632\u0631 \u0639\u0636\u0648\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u0637\u0645\u0627\u0637\u0645 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C\u0629" },
  { name: "\u0628\u0637\u0627\u0637\u0633 \u064A\u0645\u0646\u064A \u0645\u0623\u0631\u0628\u064A" },
  { name: "\u0628\u0635\u0644 \u0623\u062D\u0645\u0631 \u0628\u0644\u062F\u064A" },
  { name: "\u062E\u064A\u0627\u0631 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u0628\u0627\u0630\u0646\u062C\u0627\u0646 \u0623\u0633\u0648\u062F \u0628\u0644\u062F\u064A" },
  { name: "\u0643\u0648\u0633\u0627 \u062E\u0636\u0631\u0627\u0621 \u0637\u0627\u0632\u062C\u0629" },
  { name: "\u062E\u0633 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u0645\u0644\u0641\u0648\u0641 \u0623\u062E\u0636\u0631 \u0637\u0627\u0632\u062C" },
  { name: "\u0642\u0631\u0646\u0628\u064A\u0637 / \u0632\u0647\u0631\u0629 \u0628\u0644\u062F\u064A" },
  { name: "\u0628\u0631\u0648\u0643\u0644\u064A \u0623\u062E\u0636\u0631 \u0637\u0627\u0632\u062C" },
  { name: "\u0646\u0639\u0646\u0627\u0639 \u0628\u0644\u062F\u064A \u0637\u0627\u0632\u062C" },
  { name: "\u062D\u0628\u0642 / \u0631\u064A\u062D\u0627\u0646 \u0637\u0627\u0632\u062C" },
  { name: "\u062D\u0644\u064A\u0628 \u0637\u0627\u0632\u062C" }
];
function cleanText(value, max = 500) {
  return String(value ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);
}
function isSensitiveMedicalQuestion(message) {
  return /(تشخيص|مرض|دواء|جرع|علاج|حامل|حمل|سكري|ضغط|حساسي|سرطان|نزيف|ألم شديد|طبيب|medical|diagnos|medication)/i.test(message);
}
function normalizeSearch(value) {
  return value.toLowerCase().replace(/[إأآ]/g, "\u0627").replace(/ة/g, "\u0647").replace(/ى/g, "\u064A").replace(/[ًٌٍَُِّْـ]/g, "").trim();
}
function isPlaceholderProduct(product) {
  return /\b(test|phase|concurrency|demo|sample)\b/i.test(`${product.name} ${product.slug ?? ""}`);
}
function formatProduct(product) {
  const price = product.price != null ? ` \u2014 ${product.price} \u0631.\u064A` : " \u2014 \u0627\u0644\u0633\u0639\u0631 \u063A\u064A\u0631 \u0645\u0633\u062C\u0644 \u062D\u0627\u0644\u064A\u0627\u064B";
  const unit = product.unit ? ` / ${product.unit}` : "";
  const availability = product.available === false ? " \u2014 \u063A\u064A\u0631 \u0645\u062A\u0648\u0641\u0631 \u062D\u0627\u0644\u064A\u0627\u064B" : " \u2014 \u0645\u062A\u0648\u0641\u0631";
  return `${product.name}${unit}${price}${availability}`;
}
function fallbackReply(message, products) {
  if (isSensitiveMedicalQuestion(message)) {
    return "\u0623\u0633\u062A\u0637\u064A\u0639 \u062A\u0642\u062F\u064A\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0627\u0645\u0629 \u0639\u0646 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0641\u0642\u0637\u060C \u0648\u0644\u0627 \u0623\u0633\u062A\u0637\u064A\u0639 \u062A\u0634\u062E\u064A\u0635 \u0627\u0644\u062D\u0627\u0644\u0627\u062A \u0623\u0648 \u0627\u0642\u062A\u0631\u0627\u062D \u0639\u0644\u0627\u062C \u0623\u0648 \u062C\u0631\u0639\u0627\u062A. \u064A\u0631\u062C\u0649 \u0627\u0633\u062A\u0634\u0627\u0631\u0629 \u0637\u0628\u064A\u0628 \u0623\u0648 \u0623\u062E\u0635\u0627\u0626\u064A \u062A\u063A\u0630\u064A\u0629 \u0645\u0631\u062E\u0651\u0635\u060C \u0648\u0627\u0637\u0644\u0628 \u0627\u0644\u0645\u0633\u0627\u0639\u062F\u0629 \u0627\u0644\u0639\u0627\u062C\u0644\u0629 \u0639\u0646\u062F \u0648\u062C\u0648\u062F \u0623\u0639\u0631\u0627\u0636 \u0634\u062F\u064A\u062F\u0629.";
  }
  const normalized = normalizeSearch(message);
  const wantsProducts = /(المنتجات|الاصناف|قائمه|قائمة|الفواكه|الخضروات|الخضار|المتاح|ماذا يوجد|ايش عندكم|ما لديكم)/i.test(normalized);
  const wantsOrder = /(اطلب|طلب|شراء|اشتر|كيف.*طلب|واتساب|السله|السلة|التوصيل|التسليم)/i.test(normalized);
  const wantsPrice = /(سعر|كم|بكم|ريال|price)/i.test(normalized);
  const wantsAvailability = /(متوفر|توفر|مخزون|availability|stock)/i.test(normalized);
  if (wantsOrder) {
    return "\u0644\u0637\u0644\u0628 \u0645\u0646\u062A\u062C\u0627\u062A \u0642\u0637\u0648\u0641: 1) \u0627\u062E\u062A\u0631 \u0627\u0644\u0645\u0646\u062A\u062C \u0648\u0627\u0636\u063A\u0637 \xAB\u0623\u0636\u0641\xBB \u0644\u0625\u0636\u0627\u0641\u062A\u0647 \u0625\u0644\u0649 \u0627\u0644\u0633\u0644\u0629. 2) \u0627\u0641\u062A\u062D \u0627\u0644\u0633\u0644\u0629 \u0648\u0631\u0627\u062C\u0639 \u0627\u0644\u0643\u0645\u064A\u0629 \u0648\u0627\u0644\u0633\u0639\u0631. 3) \u0627\u0646\u062A\u0642\u0644 \u0644\u0625\u062A\u0645\u0627\u0645 \u0627\u0644\u0637\u0644\u0628 \u0648\u0623\u062F\u062E\u0644 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0648\u0635\u064A\u0644. \u0648\u064A\u0645\u0643\u0646\u0643 \u0627\u0633\u062A\u062E\u062F\u0627\u0645 \xAB\u0637\u0644\u0628 \u0633\u0631\u064A\u0639 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628\xBB \u0648\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0645\u0646\u0627\u0633\u0628: 712275038 \u0623\u0648 777803161. \u0644\u0627 \u062A\u0631\u0633\u0644 \u0643\u0644\u0645\u0627\u062A \u0627\u0644\u0645\u0631\u0648\u0631 \u0623\u0648 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0628\u0637\u0627\u0642\u0629 \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u062D\u0627\u062F\u062B\u0629.";
  }
  if (wantsProducts) {
    const realProducts = products.filter((product) => !isPlaceholderProduct(product));
    const listSource = realProducts.length > 0 ? realProducts : STATIC_FALLBACK_PRODUCTS;
    const list = listSource.slice(0, 30).map((product, index) => `${index + 1}. ${formatProduct(product)}`).join("\u061B ");
    const sourceNote = realProducts.length > 0 ? "\u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0648\u0627\u0644\u062A\u0648\u0641\u0631 \u0645\u0623\u062E\u0648\u0630\u0627\u0646 \u0645\u0646 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629." : "\u0647\u0630\u0647 \u0623\u0633\u0645\u0627\u0621 \u0625\u0631\u0634\u0627\u062F\u064A\u0629 \u0627\u062D\u062A\u064A\u0627\u0637\u064A\u0629\u061B \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0627\u062E\u062A\u0628\u0627\u0631 \u063A\u064A\u0631 \u0645\u0639\u0631\u0648\u0636\u0629 \u0644\u0644\u0645\u0633\u062A\u062E\u062F\u0645. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u062A\u0648\u0641\u0631 \u062F\u0627\u062E\u0644 \u0627\u0644\u0645\u062A\u062C\u0631 \u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628.";
    return `\u0647\u0630\u0647 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0648\u062C\u0648\u062F\u0629 \u0641\u064A \u0642\u0637\u0648\u0641: ${list}. ${sourceNote}`.slice(0, 1700);
  }
  const tokens = normalized.split(/[^a-z0-9ء-ي]+/i).filter((token) => token.length >= 2 && !/(ما|من|في|عن|هل|هذا|هذه|اريد|أريد|لو|لي|عندي|عندكم|قطوف)/i.test(token));
  const matches = products.map((product) => {
    const haystack = normalizeSearch(`${product.name} ${product.slug ?? ""} ${product.description ?? ""}`);
    const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
    return { product, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 3).map((item) => item.product);
  if (matches.length > 0) {
    const prefix = wantsPrice ? "\u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u062D\u0627\u0644\u064A \u0641\u064A \u0642\u0637\u0648\u0641:" : wantsAvailability ? "\u062D\u0627\u0644\u0629 \u0627\u0644\u062A\u0648\u0641\u0631 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0641\u064A \u0642\u0637\u0648\u0641:" : "\u0648\u062C\u062F\u062A \u0644\u0643 \u0641\u064A \u0642\u0637\u0648\u0641:";
    return `${prefix} ${matches.map(formatProduct).join("\u061B ")}. \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0623\u062E\u0648\u0630\u0629 \u0645\u0646 \u0643\u062A\u0627\u0644\u0648\u062C \u0627\u0644\u0645\u062A\u062C\u0631 \u0627\u0644\u062D\u0627\u0644\u064A.`;
  }
  if (wantsPrice) return "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C \u0643\u0645\u0627 \u064A\u0638\u0647\u0631 \u0641\u064A \u0627\u0644\u0645\u062A\u062C\u0631\u060C \u0645\u062B\u0644 \xAB\u062A\u0641\u0627\u062D \u0623\u062D\u0645\u0631\xBB \u0623\u0648 \xAB\u0628\u0631\u062A\u0642\u0627\u0644 \u0623\u0628\u0648 \u0635\u0631\u0629\xBB\u060C \u0648\u0633\u0623\u0639\u0631\u0636 \u0627\u0644\u0633\u0639\u0631 \u0627\u0644\u0645\u0633\u062C\u0644 \u0641\u0642\u0637 \u062F\u0648\u0646 \u062A\u062E\u0645\u064A\u0646.";
  if (wantsAvailability) return "\u0627\u0643\u062A\u0628 \u0627\u0633\u0645 \u0627\u0644\u0645\u0646\u062A\u062C\u060C \u0648\u0633\u0623\u0639\u0631\u0636 \u0644\u0643 \u062D\u0627\u0644\u062A\u0647 \u0627\u0644\u0645\u0633\u062C\u0644\u0629 \u0641\u064A \u0627\u0644\u0643\u062A\u0627\u0644\u0648\u062C \u0627\u0644\u062D\u0627\u0644\u064A.";
  return "\u0645\u0631\u062D\u0628\u0627\u064B \u0628\u0643 \u0641\u064A \u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629. \u0623\u0633\u062A\u0637\u064A\u0639 \u0639\u0631\u0636 \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0648\u0627\u0644\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0633\u0639\u0631 \u0648\u0627\u0644\u062A\u0648\u0641\u0631\u060C \u0648\u0634\u0631\u062D \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0637\u0644\u0628 \u0645\u0646 \u0627\u0644\u0633\u0644\u0629 \u0623\u0648 \u0639\u0628\u0631 \u0648\u0627\u062A\u0633\u0627\u0628. \u062C\u0631\u0651\u0628: \xAB\u0627\u0639\u0631\u0636 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\xBB \u0623\u0648 \xAB\u0643\u0645 \u0633\u0639\u0631 \u0627\u0644\u062A\u0641\u0627\u062D \u0627\u0644\u0623\u062D\u0645\u0631\u061F\xBB.";
}
async function loadProducts() {
  try {
    const productService = ServiceFactory.createProductService();
    const result = await productService.paginate({ page: 1, limit: MAX_CONTEXT_PRODUCTS, filters: { isPublished: true } });
    return (result.data ?? []).map((item) => ({
      name: cleanText(item.name, 120),
      slug: cleanText(item.slug, 120),
      description: cleanText(item.description, 300),
      price: Number.isFinite(Number(item.sellingPrice ?? item.price)) ? Number(item.sellingPrice ?? item.price) : null,
      available: item.stock == null ? true : Number(item.stock) > 0,
      unit: cleanText(item.unit?.name ?? item.unit?.symbol ?? "", 40) || null
    })).filter((item) => item.name);
  } catch {
    return [];
  }
}
async function callModel(message, history, products) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.BUILT_IN_FORGE_API_KEY || process.env.OPENAI_API_KEY;
  const normalizedApiKey = apiKey?.trim();
  const baseUrl = (process.env.GEMINI_API_BASE || process.env.BUILT_IN_FORGE_API_URL || process.env.OPENAI_API_BASE || "").replace(/\/$/, "");
  if (!normalizedApiKey || !baseUrl) return null;
  const model = process.env.ASSISTANT_MODEL || process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const provider = baseUrl.includes("generativelanguage.googleapis.com") || Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_API_BASE) ? "google_gemini" : "configured_ai";
  const productContext = products.map((product) => ({
    name: product.name,
    price: product.price,
    available: product.available,
    unit: product.unit,
    description: product.description
  }));
  const system = `\u0623\u0646\u062A \u0645\u0633\u0627\u0639\u062F \u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629. \u0623\u062C\u0628 \u0628\u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0648\u0627\u0636\u062D\u0629 \u0648\u0628\u0627\u062E\u062A\u0635\u0627\u0631 \u0645\u0647\u0646\u064A. \u0627\u0633\u062A\u062E\u062F\u0645 \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u0645\u0631\u0641\u0642\u0629 \u0641\u0642\u0637 \u0639\u0646\u062F \u0627\u0644\u062D\u062F\u064A\u062B \u0639\u0646 \u0627\u0644\u0627\u0633\u0645 \u0623\u0648 \u0627\u0644\u0633\u0639\u0631 \u0623\u0648 \u0627\u0644\u062A\u0648\u0641\u0631\u060C \u0648\u0644\u0627 \u062A\u062E\u062A\u0631\u0639 \u0623\u064A \u0628\u064A\u0627\u0646\u0627\u062A \u062A\u062C\u0627\u0631\u064A\u0629. \u0644\u0627 \u062A\u0646\u0641\u0630 \u0637\u0644\u0628\u0627\u062A \u0634\u0631\u0627\u0621 \u0648\u0644\u0627 \u062A\u0639\u062F\u0651\u0644 \u0627\u0644\u0645\u062E\u0632\u0648\u0646 \u0648\u0644\u0627 \u062A\u0637\u0644\u0628 \u0643\u0644\u0645\u0627\u062A \u0645\u0631\u0648\u0631 \u0623\u0648 \u0628\u064A\u0627\u0646\u0627\u062A \u062F\u0641\u0639. \u0639\u0646\u062F \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0637\u0628\u064A\u0629 \u0623\u0648 \u0627\u0644\u062A\u0634\u062E\u064A\u0635 \u0623\u0648 \u0627\u0644\u0639\u0644\u0627\u062C\u060C \u0642\u062F\u0651\u0645 \u062A\u0646\u0628\u064A\u0647\u0627\u064B \u0628\u0623\u0646\u0643 \u0644\u0627 \u062A\u0633\u062A\u0628\u062F\u0644 \u0627\u0644\u0637\u0628\u064A\u0628 \u0648\u0623\u062D\u0650\u0644 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0625\u0644\u0649 \u0645\u062E\u062A\u0635\u060C \u0648\u064A\u0645\u0643\u0646\u0643 \u0630\u0643\u0631 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0627\u0645\u0629 \u063A\u064A\u0631 \u0639\u0644\u0627\u062C\u064A\u0629 \u0641\u0642\u0637. \u0625\u0630\u0627 \u0644\u0645 \u062A\u062C\u062F \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0629 \u0641\u064A \u0627\u0644\u0633\u064A\u0627\u0642 \u0641\u0642\u0644 \u0630\u0644\u0643 \u0635\u0631\u0627\u062D\u0629. \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0628\u0635\u064A\u063A\u0629 JSON: ${JSON.stringify(productContext)}`;
  const safeHistory = (history ?? []).slice(-MAX_HISTORY_ITEMS).map((item) => ({ role: item.role, content: cleanText(item.content, 500) }));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8e3);
  try {
    if (process.env.GEMINI_API_KEY) {
      const nativeBase = (process.env.GEMINI_NATIVE_API_BASE || "https://generativelanguage.googleapis.com").replace(/\/$/, "");
      const nativeMessages = [...safeHistory, { role: "user", content: message }];
      const response2 = await fetch(`${nativeBase}/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": normalizedApiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: nativeMessages.map((item) => ({ role: item.role === "assistant" ? "model" : "user", parts: [{ text: item.content }] })),
          generationConfig: { temperature: 0.2, maxOutputTokens: 350 }
        }),
        signal: controller.signal
      });
      if (!response2.ok) {
        console.error("[assistant] Gemini request failed", { status: response2.status, model });
        return null;
      }
      const payload2 = await response2.json();
      const content2 = payload2?.candidates?.[0]?.content?.parts?.map((part) => part?.text).filter(Boolean).join(" ");
      return typeof content2 === "string" && content2.trim() ? { content: cleanText(content2, 1600), model, provider: "google_gemini" } : null;
    }
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${normalizedApiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        max_tokens: 350,
        messages: [{ role: "system", content: system }, ...safeHistory, { role: "user", content: message }]
      }),
      signal: controller.signal
    });
    if (!response.ok) {
      console.error("[assistant] model request failed", { status: response.status, provider, model });
      return null;
    }
    const payload = await response.json();
    const content = payload?.choices?.[0]?.message?.content;
    return typeof content === "string" && content.trim() ? { content: cleanText(content, 1600), model, provider } : null;
  } catch (error) {
    console.error("[assistant] model request exception", { name: error?.name || "unknown", provider, model });
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
async function chat(input) {
  const message = cleanText(input.message, MAX_MESSAGE_LENGTH);
  if (!message) throw new Error("assistant_message_required");
  const products = await loadProducts();
  const assistantMode = String(process.env.ASSISTANT_MODE || "offline").toLowerCase();
  const modelReply = assistantMode === "offline" ? null : await callModel(message, input.history, products);
  const fallbackProducts = products.length > 0 ? products : STATIC_FALLBACK_PRODUCTS;
  return {
    reply: modelReply?.content ?? fallbackReply(message, fallbackProducts),
    source: modelReply ? "ai_with_live_catalog" : "safe_fallback",
    provider: modelReply?.provider ?? "safe_fallback",
    model: modelReply?.model ?? null,
    verification: modelReply ? "live_model_response" : "deterministic_fallback",
    catalogCount: products.length,
    disclaimer: "\u0627\u0644\u0645\u0633\u0627\u0639\u062F \u064A\u0642\u062F\u0645 \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0639\u0627\u0645\u0629 \u0639\u0646 \u0627\u0644\u0645\u062A\u062C\u0631 \u0648\u0627\u0644\u0645\u0646\u062A\u062C\u0627\u062A\u060C \u0648\u0644\u0627 \u064A\u0642\u062F\u0645 \u062A\u0634\u062E\u064A\u0635\u0627\u064B \u0623\u0648 \u0639\u0644\u0627\u062C\u0627\u064B \u0637\u0628\u064A\u0627\u064B."
  };
}

// ../backend/src/modules/assistant/controller.ts
var AssistantController = class {
  async chat(request4) {
    const ctx = {
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request4.context?.metadata?.requestId,
      version: "v1",
      locale: request4.context?.metadata?.locale ?? "ar-YE"
    };
    const body = request4.body ?? {};
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 1200) return validationError("assistant_message_invalid", ctx);
    const history = Array.isArray(body.history) ? body.history.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string").slice(-8).map((item) => ({ role: item.role, content: item.content.slice(0, 500) })) : [];
    try {
      return success(await chat({ message, history }), ctx);
    } catch (error) {
      return validationError(error instanceof Error ? error.message : "assistant_request_failed", ctx);
    }
  }
};

// ../backend/src/modules/assistant/routes.ts
function toControllerRequest17(ctx) {
  return {
    body: ctx.body ?? void 0,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    user: ctx.user,
    context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } }
  };
}
function adapt19(handler2) {
  return (context) => handler2(context);
}
function createAssistantRoutes(controller = new AssistantController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "assistant-chat",
    method: "POST",
    path: "/assistant/chat",
    version: "v1",
    handler: adapt19((ctx) => controller.chat(toControllerRequest17(ctx))),
    options: {
      mode: "public",
      publicRoute: true,
      privateRoute: false,
      authenticationRequired: false,
      authorizationRequired: false,
      tags: ["assistant"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/system/server.ts
init_errors();
async function readBody(request4) {
  const reqAny = request4;
  if (reqAny.body !== void 0 && reqAny.body !== null) {
    if (typeof reqAny.body === "object") return reqAny.body;
    if (typeof reqAny.body === "string") {
      try {
        return JSON.parse(reqAny.body);
      } catch {
        return reqAny.body;
      }
    }
  }
  const chunks = [];
  try {
    for await (const chunk of request4) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  } catch {
  }
  if (chunks.length === 0) {
    return void 0;
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return void 0;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return void 0;
  }
}
function createSystemRequestHandler() {
  const registry = new RouteRegistry();
  const resolver = new RouteResolver();
  const protection = new RouteProtectionFactory();
  const authService = AuthController.createAuthService();
  const routes = [...createSystemRoutes(), ...createAuthRoutes(), ...createUserRoutes(), ...createRoleRoutes(), ...createPermissionRoutes(), ...createProductRoutes(), ...createProductMediaRoutes(), ...createCustomerRoutes(), ...createCartRoutes(), ...createOrderRoutes(), ...createInventoryRoutes(), ...createDeliveryRoutes(), ...createSupplierAdminRoutes(), ...createPaymentRoutes(), ...createSettingsRoutes(), ...createNotificationRoutes(), ...createSupportRoutes(), ...createReportsRoutes(), ...createAuditRoutes(), ...createEducationRoutes(), ...createCategoriesRoutes(), ...createUnitsRoutes(), ...createInvoiceRoutes(), ...createAssistantRoutes()];
  for (const route of routes) {
    registry.register(route);
  }
  return async (request4, response) => {
    try {
      const origin = request4.headers.origin || "*";
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("X-Frame-Options", "DENY");
      response.setHeader("X-XSS-Protection", "1; mode=block");
      response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      if (request4.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
      }
      const url = new URL(request4.url ?? "/", `http://${request4.headers.host ?? "localhost"}`);
      let targetPath = url.searchParams.get("path") || url.pathname;
      if (targetPath.startsWith("/api/")) {
        targetPath = targetPath.substring(4);
      }
      const resolved = resolver.resolve(registry, {
        method: request4.method ?? "GET",
        path: targetPath,
        version: "v1"
      });
      if (!resolved) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, error: { code: "not_found", message: "route_not_found" } }));
        return;
      }
      const route = resolved;
      const body = await readBody(request4);
      const headers = request4.headers;
      const query = {};
      for (const [key, value] of url.searchParams.entries()) {
        if (key !== "path") {
          query[key] = value;
        }
      }
      const params = route.runtimeParams ?? {};
      let currentUser = void 0;
      if (route.metadata.mode !== "public") {
        const authorization = headers.authorization;
        const authorizationHeader = Array.isArray(authorization) ? authorization[0] : authorization;
        const tokenMatch = authorizationHeader?.match(/^Bearer\s+(.+)$/i);
        if (!tokenMatch) {
          const result = unauthorized("authentication_required", {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            version: "v1"
          });
          response.writeHead(result.statusCode, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result.body));
          return;
        }
        const tokenPayload = await validateAccessToken(tokenMatch[1]);
        const user = await authService.getCurrentUser(String(tokenPayload.sub));
        if (!user) {
          const result = unauthorized("authentication_required", {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            version: "v1"
          });
          response.writeHead(result.statusCode, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result.body));
          return;
        }
        currentUser = user;
        const protectionResult = protection.protectRoute({
          route: {
            name: route.name,
            path: route.path,
            metadata: route.metadata
          },
          user
        });
        if (!protectionResult.authorized) {
          const result = forbidden("authorization_denied", {
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            version: "v1"
          });
          response.writeHead(result.statusCode, { "Content-Type": "application/json" });
          response.end(JSON.stringify(result.body));
          return;
        }
      }
      const payload = await Promise.resolve(route.handler({
        name: route.name,
        method: route.method,
        path: route.path,
        version: route.version,
        metadata: route.metadata,
        body,
        headers,
        query,
        params,
        user: currentUser
      }));
      const apiResponse = payload;
      response.writeHead(apiResponse.statusCode, { "Content-Type": "application/json" });
      response.end(JSON.stringify(apiResponse.body));
    } catch (error) {
      try {
        if (error instanceof UnauthorizedError || error instanceof InvalidTokenError || error?.code === "invalid_token" || error?.message && /invalid|token|signature|expired/i.test(error.message)) {
          response.writeHead(401, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ success: false, error: { code: "unauthorized", message: error instanceof Error ? error.message : "unauthorized" } }));
          return;
        }
      } catch (e) {
      }
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ success: false, error: { code: "internal_error", message: error instanceof Error ? error.message : "internal_error" } }));
    }
  };
}

// api-src/index.ts
var handler;
function getHandler() {
  if (!handler) {
    handler = createSystemRequestHandler();
  }
  return handler;
}
async function apiHandler(req, res) {
  try {
    const fn = getHandler();
    return await fn(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        success: false,
        error: {
          code: "internal_error",
          message: error?.message || "Server error"
        }
      }));
    }
  }
}
export {
  apiHandler as default
};
