var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../backend/src/api/contracts.ts
var init_contracts = __esm({
  "../backend/src/api/contracts.ts"() {
    "use strict";
  }
});

// ../backend/src/api/content-negotiation.ts
var init_content_negotiation = __esm({
  "../backend/src/api/content-negotiation.ts"() {
    "use strict";
  }
});

// ../backend/src/api/status.ts
var HTTP_STATUS;
var init_status = __esm({
  "../backend/src/api/status.ts"() {
    "use strict";
    HTTP_STATUS = {
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
  }
});

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
var init_response_builder = __esm({
  "../backend/src/api/response-builder.ts"() {
    "use strict";
    init_status();
  }
});

// ../backend/src/api/versioning.ts
var init_versioning = __esm({
  "../backend/src/api/versioning.ts"() {
    "use strict";
  }
});

// ../backend/src/api/index.ts
var init_api = __esm({
  "../backend/src/api/index.ts"() {
    "use strict";
    init_contracts();
    init_content_negotiation();
    init_response_builder();
    init_status();
    init_versioning();
  }
});

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
var init_metadata = __esm({
  "../backend/src/routes/metadata.ts"() {
    "use strict";
  }
});

// ../backend/src/routes/registry.ts
var RouteRegistry;
var init_registry = __esm({
  "../backend/src/routes/registry.ts"() {
    "use strict";
    init_metadata();
    RouteRegistry = class {
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
  }
});

// ../backend/src/routes/builder.ts
var RouterBuilder;
var init_builder = __esm({
  "../backend/src/routes/builder.ts"() {
    "use strict";
    init_metadata();
    init_registry();
    RouterBuilder = class {
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
  }
});

// ../backend/src/routes/contracts.ts
var init_contracts2 = __esm({
  "../backend/src/routes/contracts.ts"() {
    "use strict";
  }
});

// ../backend/src/routes/resolver.ts
var RouteResolver;
var init_resolver = __esm({
  "../backend/src/routes/resolver.ts"() {
    "use strict";
    RouteResolver = class {
      resolve(registry, request2) {
        return registry.findByPath(request2.method, request2.path, request2.version);
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
  }
});

// ../backend/src/routes/index.ts
var init_routes = __esm({
  "../backend/src/routes/index.ts"() {
    "use strict";
    init_builder();
    init_contracts2();
    init_metadata();
    init_registry();
    init_resolver();
  }
});

// ../backend/src/common/security/errors.ts
var errors_exports = {};
__export(errors_exports, {
  AccountLockedError: () => AccountLockedError,
  AuthError: () => AuthError,
  InvalidTokenError: () => InvalidTokenError,
  RateLimitError: () => RateLimitError,
  UnauthorizedError: () => UnauthorizedError
});
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

// ../backend/src/validation/common.ts
var init_common = __esm({
  "../backend/src/validation/common.ts"() {
    "use strict";
  }
});

// ../backend/src/validation/composite.ts
var init_composite = __esm({
  "../backend/src/validation/composite.ts"() {
    "use strict";
  }
});

// ../backend/src/validation/errors.ts
var ValidationException, InvalidRequestError;
var init_errors2 = __esm({
  "../backend/src/validation/errors.ts"() {
    "use strict";
    ValidationException = class _ValidationException extends Error {
      code;
      constructor(code, message) {
        super(message ?? code);
        this.code = code;
        Object.setPrototypeOf(this, _ValidationException.prototype);
      }
    };
    InvalidRequestError = class _InvalidRequestError extends ValidationException {
      constructor(message) {
        super("invalid_request", message ?? "invalid_request");
        Object.setPrototypeOf(this, _InvalidRequestError.prototype);
      }
    };
  }
});

// ../backend/src/validation/engine.ts
var ValidationEngine, engine_default;
var init_engine = __esm({
  "../backend/src/validation/engine.ts"() {
    "use strict";
    init_errors2();
    ValidationEngine = class {
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
    engine_default = new ValidationEngine();
  }
});

// ../backend/src/validation/types.ts
var init_types = __esm({
  "../backend/src/validation/types.ts"() {
    "use strict";
  }
});

// ../backend/src/validation/index.ts
var init_validation = __esm({
  "../backend/src/validation/index.ts"() {
    "use strict";
    init_common();
    init_composite();
    init_engine();
    init_errors2();
    init_types();
  }
});

// ../backend/src/repositories/prisma-service.ts
function loadEnvFile() {
  if (process.env.DATABASE_URL) return;
  const candidates = [
    import_node_path.default.resolve(__dirname, "../../../.env.local"),
    import_node_path.default.resolve(__dirname, "../../../.env"),
    import_node_path.default.resolve(__dirname, "../../.env.local"),
    import_node_path.default.resolve(__dirname, "../../.env")
  ];
  for (const candidate of candidates) {
    if (!import_node_fs.default.existsSync(candidate)) continue;
    const content = import_node_fs.default.readFileSync(candidate, "utf8");
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
var import_node_fs, import_node_path, import_client, import_adapter_pg, prismaClient, PrismaService, prisma_service_default;
var init_prisma_service = __esm({
  "../backend/src/repositories/prisma-service.ts"() {
    "use strict";
    import_node_fs = __toESM(require("node:fs"));
    import_node_path = __toESM(require("node:path"));
    import_client = require("@prisma/client");
    import_adapter_pg = require("@prisma/adapter-pg");
    prismaClient = (() => {
      loadEnvFile();
      if (!process.env.NODE_TLS_REJECT_UNAUTHORIZED && process.env.DATABASE_URL?.includes("sslmode=require")) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      }
      const adapter = new import_adapter_pg.PrismaPg({ connectionString: process.env.DATABASE_URL });
      const createClient = () => new import_client.PrismaClient({ log: ["error"], adapter });
      if (process.env.NODE_ENV !== "production") {
        if (!global.__prismaClient) {
          global.__prismaClient = createClient();
        }
        return global.__prismaClient;
      }
      return createClient();
    })();
    PrismaService = class _PrismaService {
      static client = prismaClient;
      static getClient() {
        return _PrismaService.client;
      }
      static async disconnect() {
        await _PrismaService.client.$disconnect();
      }
      static async transaction(work) {
        return _PrismaService.client.$transaction(work);
      }
    };
    prisma_service_default = PrismaService;
  }
});

// ../backend/src/services/auth-constants.ts
function loadEnvFile2() {
  if (process.env.JWT_SECRET) return;
  const candidates = [
    import_node_path2.default.resolve(__dirname, "../../.env.local"),
    import_node_path2.default.resolve(__dirname, "../../.env"),
    import_node_path2.default.resolve(__dirname, "../.env.local"),
    import_node_path2.default.resolve(__dirname, "../.env"),
    import_node_path2.default.resolve(process.cwd(), ".env.local"),
    import_node_path2.default.resolve(process.cwd(), ".env"),
    import_node_path2.default.resolve(process.cwd(), "backend/.env.local"),
    import_node_path2.default.resolve(process.cwd(), "backend/.env")
  ];
  for (const candidate of candidates) {
    if (!import_node_fs2.default.existsSync(candidate)) continue;
    const content = import_node_fs2.default.readFileSync(candidate, "utf8");
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
var import_node_fs2, import_node_path2, ACCESS_TOKEN_EXP_SECONDS, REFRESH_TOKEN_EXP_SECONDS, JWT_SECRET, TOKEN_ISSUER;
var init_auth_constants = __esm({
  "../backend/src/services/auth-constants.ts"() {
    "use strict";
    import_node_fs2 = __toESM(require("node:fs"));
    import_node_path2 = __toESM(require("node:path"));
    loadEnvFile2();
    ACCESS_TOKEN_EXP_SECONDS = Number(process.env.ACCESS_TOKEN_EXP_SECONDS ?? 900);
    REFRESH_TOKEN_EXP_SECONDS = Number(process.env.REFRESH_TOKEN_EXP_SECONDS ?? 60 * 60 * 24 * 30);
    JWT_SECRET = process.env.JWT_SECRET ?? "dev-jwt-secret-phase6b-verification-key-12345";
    TOKEN_ISSUER = process.env.TOKEN_ISSUER ?? "qutoof-nature";
  }
});

// ../backend/src/services/auth-token-service.ts
function base64url(input) {
  const b = typeof input === "string" ? Buffer.from(input) : input;
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
function sign(payload) {
  const hmac = (0, import_crypto.createHmac)("sha256", JWT_SECRET);
  hmac.update(payload);
  return base64url(hmac.digest());
}
var import_crypto, TokenService, auth_token_service_default;
var init_auth_token_service = __esm({
  "../backend/src/services/auth-token-service.ts"() {
    "use strict";
    import_crypto = require("crypto");
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
        const signature = sign(encoded);
        return `${encoded}.${signature}`;
      }
      createRefreshToken(subject, jti, extra = {}, expiresInSec = REFRESH_TOKEN_EXP_SECONDS) {
        const header = { alg: "HS256", typ: "JWT" };
        const iat = Math.floor(Date.now() / 1e3);
        const exp = iat + expiresInSec;
        const id = jti ?? (0, import_crypto.randomBytes)(16).toString("hex");
        const payload = { iss: this.issuer, sub: subject, iat, exp, jti: id, ...extra, typ: "refresh" };
        const encoded = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
        const signature = sign(encoded);
        return `${encoded}.${signature}`;
      }
      verify(token) {
        try {
          const parts = token.split(".");
          if (parts.length !== 3) return { valid: false, error: "malformed" };
          const [encodedHeader, encodedPayload, signature] = parts;
          const signed = `${encodedHeader}.${encodedPayload}`;
          const expected = sign(signed);
          const expectedBuffer = Buffer.from(expected, "base64url");
          const signatureBuffer = Buffer.from(signature, "base64url");
          if (signatureBuffer.length !== expectedBuffer.length || !(0, import_crypto.timingSafeEqual)(signatureBuffer, expectedBuffer)) {
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
var import_argon2, HashService, auth_hash_service_default;
var init_auth_hash_service = __esm({
  "../backend/src/services/auth-hash-service.ts"() {
    "use strict";
    import_argon2 = __toESM(require("argon2"));
    HashService = class {
      // Argon2id recommended parameters (tune per environment)
      options = {
        type: import_argon2.default.argon2id,
        memoryCost: 2 ** 16,
        // 64 MB
        timeCost: 3,
        parallelism: 1
      };
      async hash(password) {
        return import_argon2.default.hash(password, this.options);
      }
      async verify(password, stored) {
        try {
          return await import_argon2.default.verify(stored, password);
        } catch (err) {
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
var import_crypto2, RefreshTokenRepository, refresh_token_repository_default;
var init_refresh_token_repository = __esm({
  "../backend/src/repositories/refresh-token-repository.ts"() {
    "use strict";
    init_prisma_service();
    import_crypto2 = __toESM(require("crypto"));
    RefreshTokenRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = import_crypto2.default.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
      }
      async revokeByHash(token) {
        const tokenHash = import_crypto2.default.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.updateMany({ where: { tokenHash }, data: { revoked: true } });
      }
      async findByHash(token) {
        const tokenHash = import_crypto2.default.createHash("sha256").update(token).digest("hex");
        return this.client.refreshToken.findFirst({ where: { tokenHash } });
      }
      async rotate(oldToken, newToken, expiresAt) {
        const oldHash = import_crypto2.default.createHash("sha256").update(oldToken).digest("hex");
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
var import_crypto4, PasswordResetRepository, password_reset_repository_default;
var init_password_reset_repository = __esm({
  "../backend/src/repositories/password-reset-repository.ts"() {
    "use strict";
    init_prisma_service();
    import_crypto4 = __toESM(require("crypto"));
    PasswordResetRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = import_crypto4.default.createHash("sha256").update(token).digest("hex");
        return this.client.passwordReset.create({ data: { userId, tokenHash, expiresAt } });
      }
      async findValidByToken(token) {
        const tokenHash = import_crypto4.default.createHash("sha256").update(token).digest("hex");
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
var import_crypto5, EmailVerificationRepository, email_verification_repository_default;
var init_email_verification_repository = __esm({
  "../backend/src/repositories/email-verification-repository.ts"() {
    "use strict";
    init_prisma_service();
    import_crypto5 = __toESM(require("crypto"));
    EmailVerificationRepository = class {
      client = prisma_service_default.getClient();
      async create(userId, token, expiresAt) {
        const tokenHash = import_crypto5.default.createHash("sha256").update(token).digest("hex");
        return this.client.emailVerification.create({ data: { userId, tokenHash, expiresAt } });
      }
      async verify(token) {
        const tokenHash = import_crypto5.default.createHash("sha256").update(token).digest("hex");
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

// ../backend/src/authorization/errors.ts
var AuthorizationError, UnauthorizedError2, ForbiddenError, PermissionDeniedError, RoleDeniedError;
var init_errors3 = __esm({
  "../backend/src/authorization/errors.ts"() {
    "use strict";
    AuthorizationError = class _AuthorizationError extends Error {
      code;
      constructor(code, message) {
        super(message ?? code);
        this.code = code;
        Object.setPrototypeOf(this, _AuthorizationError.prototype);
      }
    };
    UnauthorizedError2 = class _UnauthorizedError extends AuthorizationError {
      constructor(message) {
        super("unauthorized", message ?? "unauthorized");
        Object.setPrototypeOf(this, _UnauthorizedError.prototype);
      }
    };
    ForbiddenError = class _ForbiddenError extends AuthorizationError {
      constructor(message) {
        super("forbidden", message ?? "forbidden");
        Object.setPrototypeOf(this, _ForbiddenError.prototype);
      }
    };
    PermissionDeniedError = class _PermissionDeniedError extends ForbiddenError {
      constructor(message) {
        super(message ?? "permission_denied");
        Object.setPrototypeOf(this, _PermissionDeniedError.prototype);
      }
    };
    RoleDeniedError = class _RoleDeniedError extends ForbiddenError {
      constructor(message) {
        super(message ?? "role_denied");
        Object.setPrototypeOf(this, _RoleDeniedError.prototype);
      }
    };
  }
});

// ../backend/src/repositories/exceptions.ts
var DatabaseException, NotFoundException, ConflictException, ValidationException2;
var init_exceptions = __esm({
  "../backend/src/repositories/exceptions.ts"() {
    "use strict";
    DatabaseException = class extends Error {
      constructor(message) {
        super(message ?? "Database error");
        this.name = "DatabaseException";
      }
    };
    NotFoundException = class extends Error {
      constructor(message) {
        super(message ?? "Resource not found");
        this.name = "NotFoundException";
      }
    };
    ConflictException = class extends Error {
      constructor(message) {
        super(message ?? "Conflict");
        this.name = "ConflictException";
      }
    };
    ValidationException2 = class extends Error {
      constructor(message) {
        super(message ?? "Validation failed");
        this.name = "ValidationException";
      }
    };
  }
});

// ../backend/src/repositories/base-repository.ts
var BaseRepository, base_repository_default;
var init_base_repository = __esm({
  "../backend/src/repositories/base-repository.ts"() {
    "use strict";
    init_prisma_service();
    BaseRepository = class {
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
    base_repository_default = BaseRepository;
  }
});

// ../backend/src/repositories/tenant-repository.ts
var TenantRepository, tenant_repository_default;
var init_tenant_repository = __esm({
  "../backend/src/repositories/tenant-repository.ts"() {
    "use strict";
    init_base_repository();
    TenantRepository = class extends base_repository_default {
      constructor() {
        super("tenant");
      }
    };
    tenant_repository_default = TenantRepository;
  }
});

// ../backend/src/repositories/user-repository.ts
var UserRepository, user_repository_default;
var init_user_repository = __esm({
  "../backend/src/repositories/user-repository.ts"() {
    "use strict";
    init_base_repository();
    UserRepository = class extends base_repository_default {
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
    user_repository_default = UserRepository;
  }
});

// ../backend/src/repositories/role-repository.ts
var RoleRepository, role_repository_default;
var init_role_repository = __esm({
  "../backend/src/repositories/role-repository.ts"() {
    "use strict";
    init_base_repository();
    RoleRepository = class extends base_repository_default {
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
    role_repository_default = RoleRepository;
  }
});

// ../backend/src/repositories/permission-repository.ts
var PermissionRepository, permission_repository_default;
var init_permission_repository = __esm({
  "../backend/src/repositories/permission-repository.ts"() {
    "use strict";
    init_base_repository();
    PermissionRepository = class extends base_repository_default {
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
    permission_repository_default = PermissionRepository;
  }
});

// ../backend/src/repositories/store-repository.ts
var StoreRepository, store_repository_default;
var init_store_repository = __esm({
  "../backend/src/repositories/store-repository.ts"() {
    "use strict";
    init_base_repository();
    StoreRepository = class extends base_repository_default {
      constructor() {
        super("store");
      }
    };
    store_repository_default = StoreRepository;
  }
});

// ../backend/src/repositories/branch-repository.ts
var BranchRepository, branch_repository_default;
var init_branch_repository = __esm({
  "../backend/src/repositories/branch-repository.ts"() {
    "use strict";
    init_base_repository();
    BranchRepository = class extends base_repository_default {
      constructor() {
        super("branch");
      }
    };
    branch_repository_default = BranchRepository;
  }
});

// ../backend/src/repositories/category-repository.ts
var CategoryRepository, category_repository_default;
var init_category_repository = __esm({
  "../backend/src/repositories/category-repository.ts"() {
    "use strict";
    init_base_repository();
    CategoryRepository = class extends base_repository_default {
      constructor() {
        super("category");
      }
    };
    category_repository_default = CategoryRepository;
  }
});

// ../backend/src/repositories/product-repository.ts
var ProductRepository, product_repository_default;
var init_product_repository = __esm({
  "../backend/src/repositories/product-repository.ts"() {
    "use strict";
    init_base_repository();
    ProductRepository = class extends base_repository_default {
      constructor() {
        super("product");
      }
      async findById(id) {
        return await this.model.findFirst({ where: { id, deletedAt: null } }) ?? null;
      }
      async findBySlug(slug, excludeId) {
        const where = excludeId ? { slug, id: { not: excludeId }, deletedAt: null } : { slug, deletedAt: null };
        return await this.model.findFirst({ where }) ?? null;
      }
      async create(data) {
        return this.model.create({ data });
      }
      async update(id, data) {
        return this.model.update({ where: { id }, data });
      }
      async findMany(filter) {
        return this.model.findMany({
          where: { AND: [{ deletedAt: null }, filter ?? {}] }
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
    product_repository_default = ProductRepository;
  }
});

// ../backend/src/repositories/inventory-repository.ts
var InventoryRepository, inventory_repository_default;
var init_inventory_repository = __esm({
  "../backend/src/repositories/inventory-repository.ts"() {
    "use strict";
    init_base_repository();
    init_validation();
    InventoryRepository = class extends base_repository_default {
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
      async findOrCreateInventory(productId, warehouseId) {
        let targetWarehouseId = warehouseId;
        if (!targetWarehouseId) {
          const defaultW = await this.findOrCreateDefaultWarehouse();
          targetWarehouseId = defaultW.id;
        }
        let inv = await this.client.inventory.findFirst({
          where: { productId, warehouseId: targetWarehouseId },
          include: {
            product: { select: { id: true, name: true, sku: true } },
            warehouse: { select: { id: true, name: true } }
          }
        });
        if (!inv) {
          inv = await this.client.inventory.create({
            data: {
              productId,
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
      async reserveStockForOrder(tx, productId, qty, orderId) {
        const inv = await tx.inventory.findFirst({
          where: { productId }
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
      async releaseStockForOrder(tx, productId, qty, orderId) {
        const inv = await tx.inventory.findFirst({
          where: { productId }
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
      async deductStockForShipment(tx, productId, qty, orderId) {
        const inv = await tx.inventory.findFirst({
          where: { productId }
        });
        if (!inv) return;
        const newReserved = Math.max(0, inv.reserved - qty);
        const newQuantity = Math.max(0, inv.quantity - qty);
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
      async deductStockForOrder(tx, productId, qty, orderId) {
        return this.deductStockForShipment(tx, productId, qty, orderId);
      }
      async adjustStock(productId, type, qty, reason, performedById) {
        if (qty < 0) {
          throw new ValidationException("quantity_cannot_be_negative");
        }
        const defaultW = await this.findOrCreateDefaultWarehouse();
        const { updated } = await this.client.$transaction(
          async (tx) => {
            let inv = await tx.inventory.findFirst({
              where: { productId, warehouseId: defaultW.id }
            });
            if (!inv) {
              inv = await tx.inventory.create({
                data: {
                  productId,
                  warehouseId: defaultW.id,
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
            } else {
              const newQty = Math.max(0, qty);
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
        const [items, total] = await Promise.all([
          this.client.stockMovement.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit
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
    inventory_repository_default = InventoryRepository;
  }
});

// ../backend/src/repositories/supplier-repository.ts
var SupplierRepository, supplier_repository_default;
var init_supplier_repository = __esm({
  "../backend/src/repositories/supplier-repository.ts"() {
    "use strict";
    init_base_repository();
    SupplierRepository = class extends base_repository_default {
      constructor() {
        super("supplier");
      }
    };
    supplier_repository_default = SupplierRepository;
  }
});

// ../backend/src/repositories/customer-repository.ts
var CustomerRepository, customer_repository_default;
var init_customer_repository = __esm({
  "../backend/src/repositories/customer-repository.ts"() {
    "use strict";
    init_base_repository();
    init_prisma_service();
    CustomerRepository = class extends base_repository_default {
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
    customer_repository_default = CustomerRepository;
  }
});

// ../backend/src/repositories/cart-repository.ts
var CartRepository, cart_repository_default;
var init_cart_repository = __esm({
  "../backend/src/repositories/cart-repository.ts"() {
    "use strict";
    init_base_repository();
    CartRepository = class extends base_repository_default {
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
    cart_repository_default = CartRepository;
  }
});

// ../backend/src/repositories/order-repository.ts
var ALLOWED_TRANSITIONS, OrderRepository, order_repository_default;
var init_order_repository = __esm({
  "../backend/src/repositories/order-repository.ts"() {
    "use strict";
    init_base_repository();
    init_exceptions();
    init_validation();
    init_inventory_repository();
    ALLOWED_TRANSITIONS = {
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
    OrderRepository = class extends base_repository_default {
      constructor() {
        super("order");
      }
      async createOrderFromCart(customerId, options) {
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
        const preparedItems = cart.items.map((item) => {
          const unitPrice = typeof item.product.price === "number" ? item.product.price : item.unitPrice || 0;
          const itemTotal = unitPrice * item.quantity;
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
        const tax = 0;
        const shipping = 0;
        const total = subtotal + tax + shipping;
        const code = `ORD-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
        const createdOrder = await this.client.$transaction(async (tx) => {
          const order = await tx.order.create({
            data: {
              code,
              customerId,
              status: "PENDING",
              subtotal,
              tax,
              shipping,
              total,
              currency: "SAR",
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
            await invRepo.reserveStockForOrder(tx, pItem.productId, pItem.quantity, order.id);
          }
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
              }
            }
          });
        });
        if (!createdOrder) {
          throw new Error("order_creation_failed");
        }
        return createdOrder;
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
              }
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
            }
          }
        });
        if (!order || order.deletedAt !== null) return null;
        if (customerId && order.customerId !== customerId) {
          return null;
        }
        return order;
      }
      async updateOrderStatus(orderId, newStatus, customerId) {
        const order = await this.client.order.findUnique({
          where: { id: orderId }
        });
        if (!order || order.deletedAt !== null) {
          throw new NotFoundException("order_not_found");
        }
        if (customerId) {
          if (order.customerId !== customerId) {
            throw new NotFoundException("order_not_found");
          }
          if (newStatus !== "CANCELED") {
            throw new ValidationException("customer_cannot_set_status");
          }
          if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
            throw new ValidationException("order_cannot_be_cancelled");
          }
        }
        const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
        if (!allowed.includes(newStatus)) {
          throw new ValidationException(`invalid_status_transition_${order.status}_to_${newStatus}`);
        }
        const orderWithItems = await this.client.order.findUnique({
          where: { id: orderId },
          include: { items: true }
        });
        const invRepo = new InventoryRepository();
        if (orderWithItems && orderWithItems.items) {
          if (newStatus === "CANCELED") {
            for (const item of orderWithItems.items) {
              await invRepo.releaseStockForOrder(this.client, item.productId, item.quantity, orderId);
            }
          } else if (newStatus === "SHIPPED" || newStatus === "DELIVERED") {
            for (const item of orderWithItems.items) {
              await invRepo.deductStockForOrder(this.client, item.productId, item.quantity, orderId);
            }
          }
        }
        const updated = await this.client.order.update({
          where: { id: orderId },
          data: { status: newStatus },
          include: {
            items: {
              include: { product: true }
            },
            customer: {
              select: { id: true, fullName: true, email: true, phone: true }
            }
          }
        });
        return updated;
      }
    };
    order_repository_default = OrderRepository;
  }
});

// ../backend/src/repositories/payment-repository.ts
var PaymentRepository, payment_repository_default;
var init_payment_repository = __esm({
  "../backend/src/repositories/payment-repository.ts"() {
    "use strict";
    init_base_repository();
    init_exceptions();
    init_validation();
    PaymentRepository = class extends base_repository_default {
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
    payment_repository_default = PaymentRepository;
  }
});

// ../backend/src/repositories/notification-repository.ts
var NotificationRepository, notification_repository_default;
var init_notification_repository = __esm({
  "../backend/src/repositories/notification-repository.ts"() {
    "use strict";
    init_base_repository();
    init_exceptions();
    NotificationRepository = class extends base_repository_default {
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
    notification_repository_default = NotificationRepository;
  }
});

// ../backend/src/repositories/audit-repository.ts
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
var SENSITIVE_KEYS, AuditRepository, audit_repository_default;
var init_audit_repository = __esm({
  "../backend/src/repositories/audit-repository.ts"() {
    "use strict";
    init_base_repository();
    SENSITIVE_KEYS = ["password", "passwordHash", "token", "jwt", "secret", "creditCard"];
    AuditRepository = class extends base_repository_default {
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
    audit_repository_default = AuditRepository;
  }
});

// ../backend/src/repositories/repository-factory.ts
var tenantRepository, userRepository, roleRepository, permissionRepository, storeRepository, branchRepository, categoryRepository, productRepository, inventoryRepository, supplierRepository, customerRepository, cartRepository, orderRepository, paymentRepository, notificationRepository, auditRepository, RepositoryFactory;
var init_repository_factory = __esm({
  "../backend/src/repositories/repository-factory.ts"() {
    "use strict";
    init_tenant_repository();
    init_user_repository();
    init_role_repository();
    init_permission_repository();
    init_store_repository();
    init_branch_repository();
    init_category_repository();
    init_product_repository();
    init_inventory_repository();
    init_supplier_repository();
    init_customer_repository();
    init_cart_repository();
    init_order_repository();
    init_payment_repository();
    init_notification_repository();
    init_audit_repository();
    tenantRepository = new tenant_repository_default();
    userRepository = new user_repository_default();
    roleRepository = new role_repository_default();
    permissionRepository = new permission_repository_default();
    storeRepository = new store_repository_default();
    branchRepository = new branch_repository_default();
    categoryRepository = new category_repository_default();
    productRepository = new product_repository_default();
    inventoryRepository = new inventory_repository_default();
    supplierRepository = new supplier_repository_default();
    customerRepository = new customer_repository_default();
    cartRepository = new cart_repository_default();
    orderRepository = new order_repository_default();
    paymentRepository = new payment_repository_default();
    notificationRepository = new notification_repository_default();
    auditRepository = new audit_repository_default();
    RepositoryFactory = {
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
  }
});

// ../backend/src/repositories/logger.ts
var NoopLogger, logger;
var init_logger = __esm({
  "../backend/src/repositories/logger.ts"() {
    "use strict";
    NoopLogger = class {
      debug() {
      }
      info() {
      }
      warn() {
      }
      error() {
      }
    };
    logger = new NoopLogger();
  }
});

// ../backend/src/repositories/prisma-error-mapper.ts
function mapPrismaError(err) {
  if (err instanceof import_client2.Prisma.PrismaClientKnownRequestError) {
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
var import_client2;
var init_prisma_error_mapper = __esm({
  "../backend/src/repositories/prisma-error-mapper.ts"() {
    "use strict";
    import_client2 = require("@prisma/client");
    init_exceptions();
  }
});

// ../backend/src/services/base-service.ts
var BaseService, base_service_default;
var init_base_service = __esm({
  "../backend/src/services/base-service.ts"() {
    "use strict";
    init_logger();
    init_prisma_service();
    init_prisma_error_mapper();
    BaseService = class {
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
    base_service_default = BaseService;
  }
});

// ../backend/src/services/tenant-service.ts
var TenantService, tenant_service_default;
var init_tenant_service = __esm({
  "../backend/src/services/tenant-service.ts"() {
    "use strict";
    init_base_service();
    TenantService = class extends base_service_default {
      constructor(tenantRepo) {
        super();
        this.tenantRepo = tenantRepo;
      }
      tenantRepo;
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
    tenant_service_default = TenantService;
  }
});

// ../backend/src/services/user-service.ts
var UserService, user_service_default;
var init_user_service = __esm({
  "../backend/src/services/user-service.ts"() {
    "use strict";
    init_base_service();
    init_exceptions();
    UserService = class extends base_service_default {
      constructor(userRepo, roleRepo) {
        super();
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
      }
      userRepo;
      roleRepo;
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
    user_service_default = UserService;
  }
});

// ../backend/src/services/role-service.ts
var RoleService, role_service_default;
var init_role_service = __esm({
  "../backend/src/services/role-service.ts"() {
    "use strict";
    init_exceptions();
    init_base_service();
    RoleService = class extends base_service_default {
      constructor(roleRepo, permissionRepo) {
        super();
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
      }
      roleRepo;
      permissionRepo;
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
    role_service_default = RoleService;
  }
});

// ../backend/src/services/permission-service.ts
var PermissionService, permission_service_default;
var init_permission_service = __esm({
  "../backend/src/services/permission-service.ts"() {
    "use strict";
    init_base_service();
    PermissionService = class extends base_service_default {
      constructor(permissionRepo) {
        super();
        this.permissionRepo = permissionRepo;
      }
      permissionRepo;
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
    permission_service_default = PermissionService;
  }
});

// ../backend/src/services/store-service.ts
var StoreService, store_service_default;
var init_store_service = __esm({
  "../backend/src/services/store-service.ts"() {
    "use strict";
    init_base_service();
    StoreService = class extends base_service_default {
      constructor(storeRepo) {
        super();
        this.storeRepo = storeRepo;
      }
      storeRepo;
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
    store_service_default = StoreService;
  }
});

// ../backend/src/services/branch-service.ts
var BranchService, branch_service_default;
var init_branch_service = __esm({
  "../backend/src/services/branch-service.ts"() {
    "use strict";
    init_base_service();
    BranchService = class extends base_service_default {
      constructor(branchRepo) {
        super();
        this.branchRepo = branchRepo;
      }
      branchRepo;
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
    branch_service_default = BranchService;
  }
});

// ../backend/src/services/category-service.ts
var CategoryService, category_service_default;
var init_category_service = __esm({
  "../backend/src/services/category-service.ts"() {
    "use strict";
    init_base_service();
    CategoryService = class extends base_service_default {
      constructor(categoryRepo) {
        super();
        this.categoryRepo = categoryRepo;
      }
      categoryRepo;
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
    category_service_default = CategoryService;
  }
});

// ../backend/src/services/product-service.ts
var ProductService, product_service_default;
var init_product_service = __esm({
  "../backend/src/services/product-service.ts"() {
    "use strict";
    init_base_service();
    init_exceptions();
    init_validation();
    ProductService = class extends base_service_default {
      constructor(productRepo) {
        super();
        this.productRepo = productRepo;
      }
      productRepo;
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
        const stringFields = ["sku", "name", "slug", "description", "brandId", "unitId", "categoryId", "subcategoryId"];
        const maxLengths = {
          sku: 100,
          name: 255,
          slug: 255,
          description: 5e3,
          brandId: 36,
          unitId: 36,
          categoryId: 36,
          subcategoryId: 36
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
        if (typeof payload.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug.trim())) {
          throw new ValidationException("slug_invalid");
        }
        for (const field of ["brandId", "unitId", "categoryId", "subcategoryId"]) {
          if (typeof payload[field] === "string" && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload[field].trim())) {
            throw new ValidationException(`${field}_invalid`);
          }
        }
        if (payload.isPublished !== void 0 && typeof payload.isPublished !== "boolean") {
          throw new ValidationException("isPublished_invalid");
        }
        if (update && !stringFields.some((field) => payload[field] !== void 0) && payload.isPublished === void 0) {
          throw new ValidationException("data_required");
        }
      }
      toPersistencePayload(payload, update = false) {
        const fields = ["sku", "name", "slug", "description", "brandId", "unitId", "categoryId", "subcategoryId", "isPublished"];
        const result = {};
        for (const field of fields) {
          if (payload[field] !== void 0) {
            result[field] = typeof payload[field] === "string" ? payload[field].trim() : payload[field];
          }
        }
        if (!update && result.isPublished === void 0) result.isPublished = false;
        return result;
      }
    };
    product_service_default = ProductService;
  }
});

// ../backend/src/services/inventory-service.ts
var InventoryService, inventory_service_default;
var init_inventory_service = __esm({
  "../backend/src/services/inventory-service.ts"() {
    "use strict";
    init_base_service();
    InventoryService = class extends base_service_default {
      constructor(inventoryRepo) {
        super();
        this.inventoryRepo = inventoryRepo;
      }
      inventoryRepo;
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
    inventory_service_default = InventoryService;
  }
});

// ../backend/src/services/supplier-service.ts
var SupplierService, supplier_service_default;
var init_supplier_service = __esm({
  "../backend/src/services/supplier-service.ts"() {
    "use strict";
    init_base_service();
    SupplierService = class extends base_service_default {
      constructor(supplierRepo) {
        super();
        this.supplierRepo = supplierRepo;
      }
      supplierRepo;
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
    supplier_service_default = SupplierService;
  }
});

// ../backend/src/services/customer-service.ts
var CustomerService, customer_service_default;
var init_customer_service = __esm({
  "../backend/src/services/customer-service.ts"() {
    "use strict";
    init_base_service();
    init_exceptions();
    init_validation();
    CustomerService = class extends base_service_default {
      constructor(customerRepo) {
        super();
        this.customerRepo = customerRepo;
      }
      customerRepo;
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
    customer_service_default = CustomerService;
  }
});

// ../backend/src/services/cart-service.ts
var CartService, cart_service_default;
var init_cart_service = __esm({
  "../backend/src/services/cart-service.ts"() {
    "use strict";
    init_base_service();
    init_exceptions();
    init_errors3();
    CartService = class extends base_service_default {
      constructor(cartRepo) {
        super();
        this.cartRepo = cartRepo;
      }
      cartRepo;
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
    cart_service_default = CartService;
  }
});

// ../backend/src/services/order-service.ts
var OrderService, order_service_default;
var init_order_service = __esm({
  "../backend/src/services/order-service.ts"() {
    "use strict";
    init_base_service();
    OrderService = class extends base_service_default {
      constructor(orderRepo) {
        super();
        this.orderRepo = orderRepo;
      }
      orderRepo;
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
    order_service_default = OrderService;
  }
});

// ../backend/src/services/payment-service.ts
var PaymentService, payment_service_default;
var init_payment_service = __esm({
  "../backend/src/services/payment-service.ts"() {
    "use strict";
    init_base_service();
    PaymentService = class extends base_service_default {
      constructor(paymentRepo) {
        super();
        this.paymentRepo = paymentRepo;
      }
      paymentRepo;
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
    payment_service_default = PaymentService;
  }
});

// ../backend/src/services/notification-service.ts
var NotificationService, notification_service_default;
var init_notification_service = __esm({
  "../backend/src/services/notification-service.ts"() {
    "use strict";
    init_base_service();
    NotificationService = class extends base_service_default {
      constructor(notificationRepo) {
        super();
        this.notificationRepo = notificationRepo;
      }
      notificationRepo;
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
    notification_service_default = NotificationService;
  }
});

// ../backend/src/services/audit-service.ts
var AuditService, audit_service_default;
var init_audit_service = __esm({
  "../backend/src/services/audit-service.ts"() {
    "use strict";
    init_base_service();
    AuditService = class extends base_service_default {
      constructor(auditRepo) {
        super();
        this.auditRepo = auditRepo;
      }
      auditRepo;
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
    audit_service_default = AuditService;
  }
});

// ../backend/src/services/service-factory.ts
var ServiceFactory;
var init_service_factory = __esm({
  "../backend/src/services/service-factory.ts"() {
    "use strict";
    init_repository_factory();
    init_tenant_service();
    init_user_service();
    init_role_service();
    init_permission_service();
    init_store_service();
    init_branch_service();
    init_category_service();
    init_product_service();
    init_inventory_service();
    init_supplier_service();
    init_customer_service();
    init_cart_service();
    init_order_service();
    init_payment_service();
    init_notification_service();
    init_audit_service();
    ServiceFactory = {
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
  }
});

// ../backend/src/modules/users/controller.ts
var UsersController, controller_default4;
var init_controller = __esm({
  "../backend/src/modules/users/controller.ts"() {
    "use strict";
    init_api();
    init_service_factory();
    init_validation();
    init_exceptions();
    UsersController = class {
      userService = ServiceFactory.createUserService();
      createApiContext(request2) {
        return {
          timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
          requestId: request2.context?.metadata?.requestId,
          version: request2.context?.metadata?.version ?? "v1",
          locale: request2.context?.metadata?.locale
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
      async list(request2) {
        const ctx = this.createApiContext(request2);
        const q = request2.query ?? {};
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
      async get(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          const result = await this.userService.findById(id);
          if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "user_not_found" }, meta: ctx } };
          return success(this.mapToDto(result), ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async create(request2) {
        const ctx = this.createApiContext(request2);
        const body = request2.body;
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
      async update(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        const body = request2.body;
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
      async remove(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          await this.userService.delete(id);
          return noContent(ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async restore(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          const restored = await this.userService.restore(id);
          return success(this.mapToDto(restored), ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async listRoles(request2) {
        const ctx = this.createApiContext(request2);
        const userId = request2.params?.userId;
        if (!userId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_required" }, meta: ctx } };
        try {
          const result = await this.userService.listRoles(userId);
          const roles = (result.roles ?? []).map((assignment) => assignment.role ?? assignment);
          return success({ userId: result.userId, roles }, ctx);
        } catch (err) {
          return this.relationshipError(err, ctx);
        }
      }
      async assignRole(request2) {
        const ctx = this.createApiContext(request2);
        const userId = request2.params?.userId;
        const roleId = request2.body?.roleId;
        if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
        try {
          return created(await this.userService.assignRole(userId, roleId), ctx);
        } catch (err) {
          return this.relationshipError(err, ctx);
        }
      }
      async removeRole(request2) {
        const ctx = this.createApiContext(request2);
        const userId = request2.params?.userId;
        const roleId = request2.params?.roleId;
        if (!userId || !roleId) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
        try {
          await this.userService.removeRole(userId, roleId);
          return noContent(ctx);
        } catch (err) {
          return this.relationshipError(err, ctx);
        }
      }
      async checkRole(request2) {
        const ctx = this.createApiContext(request2);
        const userId = request2.params?.userId;
        const roleId = request2.params?.roleId;
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
    controller_default4 = UsersController;
  }
});

// ../backend/src/modules/users/routes.ts
var routes_exports = {};
__export(routes_exports, {
  createUserRoutes: () => createUserRoutes,
  default: () => routes_default
});
function toControllerRequest12(ctx) {
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
function adapt12(handler2) {
  return (context) => handler2(context);
}
function createUserRoutes(controller = new controller_default4()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "users-list",
    method: "GET",
    path: "/users",
    version: "v1",
    handler: adapt12((ctx) => controller.list(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.get(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.create(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.update(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.remove(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.restore(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.listRoles(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.assignRole(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.checkRole(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.removeRole(toControllerRequest12(ctx))),
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
var routes_default;
var init_routes2 = __esm({
  "../backend/src/modules/users/routes.ts"() {
    "use strict";
    init_routes();
    init_controller();
    routes_default = createUserRoutes;
  }
});

// ../backend/src/modules/roles/controller.ts
var RolesController, controller_default5;
var init_controller2 = __esm({
  "../backend/src/modules/roles/controller.ts"() {
    "use strict";
    init_api();
    init_service_factory();
    init_exceptions();
    init_validation();
    RolesController = class {
      roleService = ServiceFactory.createRoleService();
      createApiContext(request2) {
        return {
          timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
          requestId: request2.context?.metadata?.requestId,
          version: request2.context?.metadata?.version ?? "v1",
          locale: request2.context?.metadata?.locale
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
      async list(request2) {
        const ctx = this.createApiContext(request2);
        const q = request2.query ?? {};
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
      async get(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          const result = await this.roleService.findById(id);
          if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "role_not_found" }, meta: ctx } };
          return success(this.mapToDto(result), ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async create(request2) {
        const ctx = this.createApiContext(request2);
        const body = request2.body;
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
      async update(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        const body = request2.body;
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
      async remove(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          await this.roleService.delete(id);
          return noContent(ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async restore(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
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
      async listPermissions(request2) {
        const ctx = this.createApiContext(request2);
        const roleId = request2.params?.roleId;
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
      async assignPermission(request2) {
        const ctx = this.createApiContext(request2);
        const roleId = request2.params?.roleId;
        const body = request2.body;
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
      async removePermission(request2) {
        const ctx = this.createApiContext(request2);
        const roleId = request2.params?.roleId;
        const permissionId = request2.params?.permissionId;
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
      async checkPermission(request2) {
        const ctx = this.createApiContext(request2);
        const roleId = request2.params?.roleId;
        const permissionId = request2.params?.permissionId;
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
    controller_default5 = RolesController;
  }
});

// ../backend/src/modules/roles/routes.ts
var routes_exports2 = {};
__export(routes_exports2, {
  createRoleRoutes: () => createRoleRoutes,
  default: () => routes_default2
});
function toControllerRequest13(ctx) {
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
function adapt13(handler2) {
  return (context) => handler2(context);
}
function createRoleRoutes(controller = new controller_default5()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "roles-list",
    method: "GET",
    path: "/roles",
    version: "v1",
    handler: adapt13((ctx) => controller.list(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.get(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.create(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.update(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.remove(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.restore(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.listPermissions(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.assignPermission(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.checkPermission(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.removePermission(toControllerRequest13(ctx))),
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
var routes_default2;
var init_routes3 = __esm({
  "../backend/src/modules/roles/routes.ts"() {
    "use strict";
    init_routes();
    init_controller2();
    routes_default2 = createRoleRoutes;
  }
});

// ../backend/src/modules/permissions/controller.ts
var PERMISSION_ACTIONS, PermissionsController, controller_default6;
var init_controller3 = __esm({
  "../backend/src/modules/permissions/controller.ts"() {
    "use strict";
    init_api();
    init_service_factory();
    init_validation();
    PERMISSION_ACTIONS = ["CREATE", "READ", "UPDATE", "DELETE", "LIST", "EXECUTE"];
    PermissionsController = class {
      permissionService = ServiceFactory.createPermissionService();
      createApiContext(request2) {
        return {
          timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
          requestId: request2.context?.metadata?.requestId,
          version: request2.context?.metadata?.version ?? "v1",
          locale: request2.context?.metadata?.locale
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
      async list(request2) {
        const ctx = this.createApiContext(request2);
        const q = request2.query ?? {};
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
      async get(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          const result = await this.permissionService.findById(id);
          if (!result) return { statusCode: HTTP_STATUS.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "permission_not_found" }, meta: ctx } };
          return success(this.mapToDto(result), ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async create(request2) {
        const ctx = this.createApiContext(request2);
        const body = request2.body;
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
      async update(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        const body = request2.body;
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
      async remove(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          await this.permissionService.delete(id);
          return noContent(ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
      async restore(request2) {
        const ctx = this.createApiContext(request2);
        const id = request2.params?.id;
        if (!id) return { statusCode: HTTP_STATUS.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
        try {
          const restored = await this.permissionService.restore(id);
          return success(this.mapToDto(restored), ctx);
        } catch (err) {
          return { statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
        }
      }
    };
    controller_default6 = PermissionsController;
  }
});

// ../backend/src/modules/permissions/routes.ts
var routes_exports3 = {};
__export(routes_exports3, {
  createPermissionRoutes: () => createPermissionRoutes,
  default: () => routes_default3
});
function toControllerRequest14(ctx) {
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
function adapt14(handler2) {
  return (context) => handler2(context);
}
function createPermissionRoutes(controller = new controller_default6()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "permissions-list",
    method: "GET",
    path: "/permissions",
    version: "v1",
    handler: adapt14((ctx) => controller.list(toControllerRequest14(ctx))),
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
    handler: adapt14((ctx) => controller.get(toControllerRequest14(ctx))),
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
    handler: adapt14((ctx) => controller.create(toControllerRequest14(ctx))),
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
    handler: adapt14((ctx) => controller.update(toControllerRequest14(ctx))),
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
    handler: adapt14((ctx) => controller.remove(toControllerRequest14(ctx))),
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
    handler: adapt14((ctx) => controller.restore(toControllerRequest14(ctx))),
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
var routes_default3;
var init_routes4 = __esm({
  "../backend/src/modules/permissions/routes.ts"() {
    "use strict";
    init_routes();
    init_controller3();
    routes_default3 = createPermissionRoutes;
  }
});

// api/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => apiHandler
});
module.exports = __toCommonJS(index_exports);

// ../backend/src/system/server.ts
var import_node_http = require("node:http");
init_api();
init_routes();
init_routes();

// ../backend/src/modules/auth/routes.ts
init_routes();

// ../backend/src/modules/auth/controller.ts
init_api();
init_errors();
init_validation();
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

// ../backend/src/services/auth-service.ts
init_rate_limiter();
init_prisma_service();
var import_crypto3 = __toESM(require("crypto"));
init_errors();
init_validation();
var AuthService = class {
  constructor(userLookup) {
    this.userLookup = userLookup;
  }
  userLookup;
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
    const tokenHash = import_crypto3.default.createHash("sha256").update(refreshToken).digest("hex");
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
    const incomingHash = import_crypto3.default.createHash("sha256").update(refreshToken).digest("hex");
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
    let primaryRole = null;
    const roles = [];
    const permissions = /* @__PURE__ */ new Set();
    let branch = null;
    let store = null;
    if (Array.isArray(user.roles) && user.roles.length > 0) {
      const r = user.roles[0];
      primaryRole = r.role?.name ?? null;
      for (const assignment of user.roles) {
        if (assignment.role?.name) {
          roles.push(String(assignment.role.name));
        }
        if (Array.isArray(assignment.role?.permissions)) {
          for (const rp of assignment.role.permissions) {
            if (rp?.permission) {
              permissions.add(`${rp.permission.resource}:${String(rp.permission.action).toLowerCase()}`);
            }
          }
        }
      }
      if (r.branch) {
        branch = { id: r.branch.id, name: r.branch.name };
        if (r.branch.storeId) {
          const s = await client.store.findUnique({ where: { id: r.branch.storeId }, select: { id: true, name: true } });
          if (s) store = { id: s.id, name: s.name };
        }
      }
    }
    return {
      id: user.id,
      fullName: user.displayName ?? null,
      email: user.email,
      phone: user.phone ?? null,
      avatar: null,
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

// ../backend/src/modules/auth/controller.ts
var AuthController = class _AuthController {
  constructor(authService = _AuthController.createAuthService()) {
    this.authService = authService;
  }
  authService;
  static createAuthService() {
    return new AuthService(async (identifier) => {
      const client = prisma_service_default.getClient();
      return client.user.findFirst({ where: { email: identifier } });
    });
  }
  async signIn(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
    if (!this.isObject(body) || typeof body.identifier !== "string" || !body.identifier || typeof body.password !== "string" || !body.password) {
      return this.errorResponse("bad_request", "identifier_and_password_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.signIn(body.identifier, body.password, body.deviceId, this.requestMeta(request2));
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async refresh(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.refresh(body.refreshToken, this.requestMeta(request2));
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async signOut(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request2));
      return success(null, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Logout endpoint — invalidates refresh token and session and returns HTTP 204 No Content
  async logout(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request2));
      return noContent(ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async validate(request2) {
    const ctx = this.createApiContext(request2);
    const authorization = this.headerValue(request2, "authorization");
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
  async me(request2) {
    const ctx = this.createApiContext(request2);
    const authorization = this.headerValue(request2, "authorization");
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
  async signUp(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
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
  async changePassword(request2) {
    const ctx = this.createApiContext(request2);
    const authorization = this.headerValue(request2, "authorization");
    const body = request2.body;
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
  async forgotPassword(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
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
  async resetPassword(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
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
  async updateProfile(request2) {
    const ctx = this.createApiContext(request2);
    const authorization = this.headerValue(request2, "authorization");
    const body = request2.body;
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
  // Email Verification: Send verification token
  async sendVerification(request2) {
    const ctx = this.createApiContext(request2);
    const authorization = this.headerValue(request2, "authorization");
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
  async verifyEmail(request2) {
    const ctx = this.createApiContext(request2);
    const body = request2.body;
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
  requestMeta(request2) {
    return {
      ip: this.headerValue(request2, "x-forwarded-for") ?? this.headerValue(request2, "x-real-ip"),
      userAgent: this.headerValue(request2, "user-agent")
    };
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
    };
  }
  headerValue(request2, name) {
    const value = request2.headers?.[name.toLowerCase()];
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
  carts: "tenant"
};
function createPermissionDefinition(module2, action, description) {
  return {
    key: `${module2}:${action}`,
    module: module2,
    action,
    scope: MODULE_SCOPES[module2],
    description
  };
}
function createPermissionMap(module2, descriptions) {
  return {
    create: createPermissionDefinition(module2, "create", descriptions.create),
    read: createPermissionDefinition(module2, "read", descriptions.read),
    update: createPermissionDefinition(module2, "update", descriptions.update),
    delete: createPermissionDefinition(module2, "delete", descriptions.delete),
    list: createPermissionDefinition(module2, "list", descriptions.list)
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
  })
};
var PERMISSION_GROUPS = Object.entries(PERMISSION_DEFINITIONS).map(
  ([module2, definitions]) => ({
    module: module2,
    scope: MODULE_SCOPES[module2],
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
function getModulePermissions(module2) {
  return Object.values(PERMISSION_DEFINITIONS[module2]).map((permission) => permission.key);
}
function getPermissionsForModules(modules) {
  return modules.flatMap((module2) => getModulePermissions(module2));
}
function getPermissionsForModuleActions(module2, actions) {
  return Object.values(PERMISSION_DEFINITIONS[module2]).filter((permission) => actions.includes(permission.action)).map((permission) => permission.key);
}
var ROLE_DEFINITIONS = [
  createRoleDefinition("SUPER_ADMIN", "Full access across every module", [...ALL_PERMISSIONS]),
  createRoleDefinition("ADMIN", "Administrative access with audit excluded", ALL_PERMISSIONS.filter((permission) => !permission.startsWith("audit:"))),
  createRoleDefinition("MANAGER", "Operational access for products, inventory, orders, and customers", getPermissionsForModules(["products", "inventory", "orders", "customers"])),
  createRoleDefinition("EMPLOYEE", "Staff operational access for reading products, customers, inventory, and updating orders", [
    ...getPermissionsForModuleActions("products", ["read", "list"]),
    ...getPermissionsForModuleActions("customers", ["read", "list"]),
    ...getPermissionsForModuleActions("orders", ["read", "list", "update"]),
    ...getPermissionsForModuleActions("inventory", ["read", "list"])
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

// ../backend/src/authorization/service.ts
init_errors3();
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
function buildAuthorizationContext(user, request2) {
  return {
    roles: user?.roles,
    permissions: user?.permissions,
    scope: user?.scope,
    requiredScope: request2?.requiredScope,
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
  authorizationService;
  requirePermission(user, request2) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.evaluate(context, {
      requiredPermissions: request2.requiredPermissions,
      requiredRoles: request2.requiredRoles,
      requiredScope: request2.requiredScope,
      requireAllPermissions: request2.requireAllPermissions
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(request2.requiredPermissions)
    };
  }
  requireAnyPermission(user, permissions, request2 = {}) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.hasAnyPermission(context, permissions, {
      requiredRoles: request2.requiredRoles,
      requiredScope: request2.requiredScope
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(permissions)
    };
  }
  requireAllPermissions(user, permissions, request2 = {}) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.hasAllPermissions(context, permissions, {
      requiredRoles: request2.requiredRoles,
      requiredScope: request2.requiredScope
    });
    return {
      ...result,
      requiredPermissions: normalizePermissions2(permissions)
    };
  }
  requireRole(user, role, request2 = {}) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.hasRole(context, role, { requiredScope: request2.requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  requireAnyRole(user, roles, request2 = {}) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.hasAnyRole(context, roles, { requiredScope: request2.requiredScope });
    return {
      ...result,
      requiredPermissions: []
    };
  }
  requireSuperAdmin(user, request2 = {}) {
    const context = buildAuthorizationContext(user, request2);
    const result = this.authorizationService.isSuperAdmin(context, { requiredScope: request2.requiredScope });
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
  permissionMiddleware;
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

// ../backend/src/system/routes.ts
init_routes();

// ../backend/src/system/controller.ts
init_api();

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
  service;
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

// ../backend/src/modules/products/routes.ts
init_routes();

// ../backend/src/modules/products/controller.ts
init_api();
init_exceptions();
init_service_factory();
init_validation();
var ProductsController = class {
  productService = ServiceFactory.createProductService();
  context(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
    };
  }
  mapToDto(entity) {
    return {
      id: entity.id,
      sku: entity.sku ?? null,
      name: entity.name,
      slug: entity.slug,
      description: entity.description ?? null,
      brandId: entity.brandId ?? null,
      unitId: entity.unitId ?? null,
      categoryId: entity.categoryId ?? null,
      subcategoryId: entity.subcategoryId ?? null,
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
  async list(request2) {
    const ctx = this.context(request2);
    const q = request2.query ?? {};
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
  async get(request2) {
    const ctx = this.context(request2);
    const id = request2.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      const product = await this.productService.findById(id);
      return product ? success(this.mapToDto(product), ctx) : notFound("product_not_found", ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async create(request2) {
    const ctx = this.context(request2);
    try {
      const product = await this.productService.create(request2.body);
      return created(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async update(request2) {
    const ctx = this.context(request2);
    const id = request2.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      const product = await this.productService.update(id, request2.body);
      return success(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async remove(request2) {
    const ctx = this.context(request2);
    const id = request2.params?.id;
    if (!id) return validationError("id_required", ctx);
    try {
      await this.productService.delete(id);
      return noContent(ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async restore(request2) {
    const ctx = this.context(request2);
    const id = request2.params?.id;
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
  parsePositiveInteger(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
    if (value === void 0) return fallback;
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > maximum) throw new ValidationException("pagination_invalid");
    return parsed;
  }
};
var controller_default = ProductsController;

// ../backend/src/modules/products/routes.ts
function toControllerRequest2(ctx) {
  return {
    body: ctx.body,
    headers: ctx.headers,
    query: ctx.query,
    params: ctx.params,
    context: { metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } }
  };
}
function adapt2(handler2) {
  return (context) => handler2(context);
}
function createProductRoutes(controller = new controller_default()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt2(definition.handler) });
  };
  const privateOptions = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["products"],
    middleware: []
  });
  register({ name: "products-list", method: "GET", path: "/products", version: "v1", handler: (ctx) => controller.list(toControllerRequest2(ctx)), options: privateOptions("products:read") });
  register({ name: "products-get", method: "GET", path: "/products/:id", version: "v1", handler: (ctx) => controller.get(toControllerRequest2(ctx)), options: privateOptions("products:read") });
  register({ name: "products-create", method: "POST", path: "/products", version: "v1", handler: (ctx) => controller.create(toControllerRequest2(ctx)), options: privateOptions("products:create") });
  register({ name: "products-update", method: "PUT", path: "/products/:id", version: "v1", handler: (ctx) => controller.update(toControllerRequest2(ctx)), options: privateOptions("products:update") });
  register({ name: "products-delete", method: "DELETE", path: "/products/:id", version: "v1", handler: (ctx) => controller.remove(toControllerRequest2(ctx)), options: privateOptions("products:delete") });
  register({ name: "products-restore", method: "PATCH", path: "/products/:id/restore", version: "v1", handler: (ctx) => controller.restore(toControllerRequest2(ctx)), options: privateOptions("products:update") });
  return builder.build();
}

// ../backend/src/modules/customers/routes.ts
init_routes();

// ../backend/src/modules/customers/controller.ts
init_api();
init_exceptions();
init_service_factory();
init_validation();
var CustomersController = class {
  service = ServiceFactory.createCustomerService();
  context(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
  async list(request2) {
    const ctx = this.context(request2);
    const query = request2.query ?? {};
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
  async checkOwnershipOrAdmin(request2, targetCustomerId) {
    const user = request2.context?.user;
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
  async get(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const entity = await this.service.findById(id);
      return entity ? success(this.mapCustomer(entity), ctx) : notFound("customer_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async create(request2) {
    const ctx = this.context(request2);
    try {
      const entity = await this.service.create(request2.body);
      return created(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async update(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const entity = await this.service.update(id, request2.body);
      return success(this.mapCustomer(entity), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async remove(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      await this.service.delete(id);
      return noContent(ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async listAddresses(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const addresses = await this.service.listAddresses(id);
      return success(addresses.map((entry) => this.mapAddress(entry)), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async createAddress(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const address = await this.service.createAddress(id, request2.body);
      return created(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async updateAddress(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      const address = await this.service.updateAddress(id, request2.params?.addressId ?? "", request2.body);
      return success(this.mapAddress(address), ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async removeAddress(request2) {
    const ctx = this.context(request2);
    try {
      const id = request2.params?.id ?? "";
      const allowed = await this.checkOwnershipOrAdmin(request2, id);
      if (!allowed) return forbidden("authorization_denied", ctx);
      await this.service.deleteAddress(id, request2.params?.addressId ?? "");
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
  integer(value, fallback, max) {
    if (value === void 0) return fallback;
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
var controller_default2 = CustomersController;

// ../backend/src/modules/customers/routes.ts
function request(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { user: ctx.user, metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function createCustomerRoutes(controller = new controller_default2()) {
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

// ../backend/src/modules/cart/routes.ts
init_routes();

// ../backend/src/modules/cart/controller.ts
init_api();
init_exceptions();
init_errors3();
init_service_factory();
var CartController = class {
  service = ServiceFactory.createCartService();
  context(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
    };
  }
  getUserInfo(request2) {
    const user = request2.context?.user;
    if (!user || typeof user !== "object" || !user.id) {
      throw new ValidationException2("authentication_required");
    }
    return {
      id: String(user.id),
      email: user.email ? String(user.email) : void 0
    };
  }
  async getCart(request2) {
    const ctx = this.context(request2);
    try {
      const user = this.getUserInfo(request2);
      const cart = await this.service.getCartForUser(user.id, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async addItem(request2) {
    const ctx = this.context(request2);
    try {
      const user = this.getUserInfo(request2);
      const cart = await this.service.addItem(user.id, request2.body, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async updateItem(request2) {
    const ctx = this.context(request2);
    try {
      const user = this.getUserInfo(request2);
      const itemId = request2.params?.id ?? "";
      const cart = await this.service.updateItemQuantity(user.id, itemId, request2.body, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async removeItem(request2) {
    const ctx = this.context(request2);
    try {
      const user = this.getUserInfo(request2);
      const itemId = request2.params?.id ?? "";
      const cart = await this.service.removeItem(user.id, itemId, user.email);
      return success(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async clearCart(request2) {
    const ctx = this.context(request2);
    try {
      const user = this.getUserInfo(request2);
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
var controller_default3 = CartController;

// ../backend/src/modules/cart/routes.ts
function toControllerRequest3(ctx) {
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
function adapt3(handler2) {
  return (context) => handler2(context);
}
function createCartRoutes(controller = new controller_default3()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt3(definition.handler) });
  };
  const privateOptions = (permission) => ({
    mode: "private",
    publicRoute: false,
    privateRoute: true,
    authenticationRequired: true,
    authorizationRequired: true,
    requiredPermissions: [permission],
    tags: ["carts"],
    middleware: []
  });
  register({ name: "cart-get", method: "GET", path: "/cart", version: "v1", handler: (ctx) => controller.getCart(toControllerRequest3(ctx)), options: privateOptions("carts:read") });
  register({ name: "cart-items-add", method: "POST", path: "/cart/items", version: "v1", handler: (ctx) => controller.addItem(toControllerRequest3(ctx)), options: privateOptions("carts:create") });
  register({ name: "cart-items-update", method: "PUT", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.updateItem(toControllerRequest3(ctx)), options: privateOptions("carts:update") });
  register({ name: "cart-items-remove", method: "DELETE", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.removeItem(toControllerRequest3(ctx)), options: privateOptions("carts:delete") });
  register({ name: "cart-clear", method: "DELETE", path: "/cart", version: "v1", handler: (ctx) => controller.clearCart(toControllerRequest3(ctx)), options: privateOptions("carts:delete") });
  return builder.build();
}

// ../backend/src/modules/orders/routes.ts
init_routes();

// ../backend/src/modules/orders/controller.ts
init_api();
init_errors();
init_validation();
init_order_repository();
init_cart_repository();
var OrderController = class {
  orderRepo = new OrderRepository();
  cartRepo = new cart_repository_default();
  async createOrder(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      let customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
      if (!customer) {
        customer = await this.cartRepo.createCustomerForUser(user.id, user.email);
      }
      const body = request2.body || {};
      const order = await this.orderRepo.createOrderFromCart(customer.id, {
        shippingAddressId: body.shippingAddressId,
        notes: body.notes
      });
      return created(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listOrders(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request2.query || {};
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
  async getOrderById(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request2.params?.id;
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
  async updateStatus(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request2.params?.id;
      const status = request2.body?.status;
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
  async cancelOrder(request2) {
    const cancelReq = {
      ...request2,
      body: { ...request2.body || {}, status: "CANCELED" }
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
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function toControllerRequest4(ctx) {
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
function adapt4(handler2) {
  return (context) => handler2(context);
}
function createOrderRoutes(controller = new OrderController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "orders-create",
    method: "POST",
    path: "/orders",
    version: "v1",
    handler: adapt4((ctx) => controller.createOrder(toControllerRequest4(ctx))),
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
    handler: adapt4((ctx) => controller.listOrders(toControllerRequest4(ctx))),
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
    handler: adapt4((ctx) => controller.getOrderById(toControllerRequest4(ctx))),
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
    handler: adapt4((ctx) => controller.updateStatus(toControllerRequest4(ctx))),
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
    handler: adapt4((ctx) => controller.cancelOrder(toControllerRequest4(ctx))),
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

// ../backend/src/modules/inventory/routes.ts
init_routes();

// ../backend/src/modules/inventory/controller.ts
init_api();
init_errors();
init_validation();
init_inventory_repository();
var InventoryController = class {
  inventoryRepo = new InventoryRepository();
  async listInventory(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request2.query || {};
      const result = await this.inventoryRepo.findInventoryList({
        status: query.status ? String(query.status) : void 0,
        search: query.search ? String(query.search) : void 0,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10
      });
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async adjustStock(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request2.body || {};
      const { productId, type, quantity, reason } = body;
      if (!productId || !type || quantity === void 0) {
        return this.errorResponse("bad_request", "product_id_type_and_quantity_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const validTypes = ["IN", "OUT", "ADJUSTMENT"];
      if (!validTypes.includes(type)) {
        return this.errorResponse("bad_request", "invalid_movement_type", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.inventoryRepo.adjustStock(
        productId,
        type,
        Number(quantity),
        reason ? String(reason) : void 0,
        user.id
      );
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listMovements(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const query = request2.query || {};
      const inventoryId = query.inventoryId ? String(query.inventoryId) : void 0;
      const movements = await this.inventoryRepo.findMovements(inventoryId);
      return success({ movements }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function toControllerRequest5(ctx) {
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
function adapt5(handler2) {
  return (context) => handler2(context);
}
function createInventoryRoutes(controller = new InventoryController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "inventory-list",
    method: "GET",
    path: "/inventory",
    version: "v1",
    handler: adapt5((ctx) => controller.listInventory(toControllerRequest5(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["inventory"],
      middleware: []
    }
  });
  builder.register({
    name: "inventory-adjust",
    method: "POST",
    path: "/inventory/adjust",
    version: "v1",
    handler: adapt5((ctx) => controller.adjustStock(toControllerRequest5(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["inventory"],
      middleware: []
    }
  });
  builder.register({
    name: "inventory-movements",
    method: "GET",
    path: "/inventory/movements",
    version: "v1",
    handler: adapt5((ctx) => controller.listMovements(toControllerRequest5(ctx))),
    options: {
      mode: "private",
      publicRoute: false,
      privateRoute: true,
      authenticationRequired: true,
      authorizationRequired: false,
      tags: ["inventory"],
      middleware: []
    }
  });
  return builder.build();
}

// ../backend/src/modules/payments/routes.ts
init_routes();

// ../backend/src/modules/payments/controller.ts
init_api();
init_errors();
init_validation();
init_exceptions();
init_payment_repository();
init_cart_repository();
var PaymentController = class {
  paymentRepo = new PaymentRepository();
  cartRepo = new cart_repository_default();
  async createPayment(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request2.body || {};
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
  async getPaymentForOrder(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const orderId = request2.params?.orderId;
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
  async verifyPayment(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request2.body || {};
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
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function toControllerRequest6(ctx) {
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
function adapt6(handler2) {
  return (context) => handler2(context);
}
function createPaymentRoutes(controller = new PaymentController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "payment-create",
    method: "POST",
    path: "/payments/create",
    version: "v1",
    handler: adapt6((ctx) => controller.createPayment(toControllerRequest6(ctx))),
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
    handler: adapt6((ctx) => controller.getPaymentForOrder(toControllerRequest6(ctx))),
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
    handler: adapt6((ctx) => controller.verifyPayment(toControllerRequest6(ctx))),
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

// ../backend/src/modules/settings/routes.ts
init_routes();

// ../backend/src/modules/settings/controller.ts
init_api();
init_errors();
init_validation();

// ../backend/src/repositories/settings-repository.ts
init_base_repository();
init_validation();
var DEFAULT_SETTINGS = {
  store_name: "\u0642\u0637\u0648\u0641 \u0627\u0644\u0637\u0628\u064A\u0639\u0629 (Qutoof Nature Store)",
  store_description: "\u0645\u062A\u062C\u0631 \u0627\u0644\u062A\u0645\u0648\u0631 \u0648\u0627\u0644\u0641\u0648\u0627\u0643\u0647 \u0648\u0627\u0644\u0645\u0648\u0627\u062F \u0627\u0644\u063A\u0630\u0627\u0626\u064A\u0629 \u0627\u0644\u0637\u0627\u0632\u062C\u0629",
  contact_email: "support@qutoof.sa",
  contact_phone: "+966500000000",
  support_phone: "+966920000000",
  address: "\u0627\u0644\u0645\u0645\u0644\u0643\u0629 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629\u060C \u062C\u062F\u0629 / \u0627\u0644\u0631\u064A\u0627\u0636",
  currency: "SAR",
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
  async getSetting(key, fallback) {
    const record = await this.client.systemSetting.findUnique({
      where: { key }
    });
    return record?.value ?? fallback ?? DEFAULT_SETTINGS[key] ?? "";
  }
  async getPublicSettings() {
    const all = await this.getAllSettings();
    return {
      storeName: all.store_name ?? DEFAULT_SETTINGS.store_name,
      storeDescription: all.store_description ?? DEFAULT_SETTINGS.store_description,
      contactEmail: all.contact_email ?? DEFAULT_SETTINGS.contact_email,
      contactPhone: all.contact_phone ?? DEFAULT_SETTINGS.contact_phone,
      supportPhone: all.support_phone ?? DEFAULT_SETTINGS.support_phone,
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
  async getPublicSettings(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const publicSettings = await this.settingsRepo.getPublicSettings();
      return success(publicSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getAdminSettings(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const allSettings = await this.settingsRepo.getAllSettings();
      return success(allSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateAdminSettings(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request2.body || {};
      const updated = await this.settingsRepo.updateSettings(body);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function toControllerRequest7(ctx) {
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
function createSettingsRoutes(controller = new SettingsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "settings-public",
    method: "GET",
    path: "/settings/public",
    version: "v1",
    handler: adapt7((ctx) => controller.getPublicSettings(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.getAdminSettings(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.updateAdminSettings(toControllerRequest7(ctx))),
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

// ../backend/src/modules/notifications/routes.ts
init_routes();

// ../backend/src/modules/notifications/controller.ts
init_api();
init_errors();
init_validation();
init_notification_repository();
var NotificationsController = class {
  notificationRepo = new NotificationRepository();
  async listUserNotifications(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const result = await this.notificationRepo.findUserNotifications(user.id);
      return success(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAsRead(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const notificationId = request2.params?.id;
      if (!notificationId) {
        return this.errorResponse("bad_request", "notification_id_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.notificationRepo.markAsRead(notificationId, user.id);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAllAsRead(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const count = await this.notificationRepo.markAllAsRead(user.id);
      return success({ count }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function adapt8(handler2) {
  return (context) => handler2(context);
}
function createNotificationRoutes(controller = new NotificationsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "notification-list",
    method: "GET",
    path: "/notifications",
    version: "v1",
    handler: adapt8((ctx) => controller.listUserNotifications(toControllerRequest8(ctx))),
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
    handler: adapt8((ctx) => controller.markAsRead(toControllerRequest8(ctx))),
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
    handler: adapt8((ctx) => controller.markAllAsRead(toControllerRequest8(ctx))),
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

// ../backend/src/modules/support/routes.ts
init_routes();

// ../backend/src/modules/support/controller.ts
init_api();
init_errors();
init_validation();
init_exceptions();

// ../backend/src/repositories/support-repository.ts
init_base_repository();
init_exceptions();
init_validation();
init_notification_repository();
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
init_cart_repository();
var SupportController = class {
  supportRepo = new SupportRepository();
  cartRepo = new cart_repository_default();
  async getSupportContacts(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const contacts = await this.supportRepo.getSupportContacts();
      return success(contacts, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async createTicket(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const body = request2.body || {};
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
  async listTickets(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
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
  async getTicketById(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request2.params?.id;
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
  async replyTicket(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request2.params?.id;
      const message = request2.body?.message;
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
  async updateTicketStatus(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const ticketId = request2.params?.id;
      const status = request2.body?.status;
      if (!ticketId || !status) {
        return this.errorResponse("bad_request", "ticket_id_and_status_required", HTTP_STATUS.BAD_REQUEST, ctx);
      }
      const updated = await this.supportRepo.updateTicketStatus(ticketId, status);
      return success(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function adapt9(handler2) {
  return (context) => handler2(context);
}
function createSupportRoutes(controller = new SupportController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "support-contacts",
    method: "GET",
    path: "/support/contacts",
    version: "v1",
    handler: adapt9((ctx) => controller.getSupportContacts(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.createTicket(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.listTickets(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.getTicketById(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.replyTicket(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.updateTicketStatus(toControllerRequest9(ctx))),
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

// ../backend/src/modules/reports/routes.ts
init_routes();

// ../backend/src/modules/reports/controller.ts
init_api();
init_errors();
init_validation();

// ../backend/src/repositories/reports-repository.ts
init_base_repository();
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
  async getDashboardKpis(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const kpis = await this.reportsRepo.getDashboardKpis();
      return success(kpis, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getSalesReport(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const { startDate, endDate, status } = request2.query || {};
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
  async getProductAnalytics(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getProductAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getInventoryAnalytics(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getInventoryAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getCustomerAnalytics(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getCustomerAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getPaymentAnalytics(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getPaymentAnalytics();
      return success(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function adapt10(handler2) {
  return (context) => handler2(context);
}
function createReportsRoutes(controller = new ReportsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "reports-dashboard",
    method: "GET",
    path: "/reports/dashboard",
    version: "v1",
    handler: adapt10((ctx) => controller.getDashboardKpis(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getSalesReport(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getProductAnalytics(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getInventoryAnalytics(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getCustomerAnalytics(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getPaymentAnalytics(toControllerRequest10(ctx))),
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

// ../backend/src/modules/audit/routes.ts
init_routes();

// ../backend/src/modules/audit/controller.ts
init_api();
init_errors();
init_validation();
init_audit_repository();
var AuditController = class {
  auditRepo = new AuditRepository();
  async listAuditLogs(request2) {
    const ctx = this.createApiContext(request2);
    try {
      const user = request2.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS.UNAUTHORIZED, ctx);
      }
      const { resource, action, actorId, page, limit } = request2.query || {};
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
  createApiContext(request2) {
    return {
      timestamp: request2.context?.metadata?.timestamp ?? (/* @__PURE__ */ new Date()).toISOString(),
      requestId: request2.context?.metadata?.requestId,
      version: request2.context?.metadata?.version ?? "v1",
      locale: request2.context?.metadata?.locale
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
function adapt11(handler2) {
  return (context) => handler2(context);
}
function createAuditRoutes(controller = new AuditController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "audit-logs-list",
    method: "GET",
    path: "/audit/logs",
    version: "v1",
    handler: adapt11((ctx) => controller.listAuditLogs(toControllerRequest11(ctx))),
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

// ../backend/src/system/server.ts
async function readBody(request2) {
  const chunks = [];
  for await (const chunk of request2) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
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
  const routes = [...createSystemRoutes(), ...createAuthRoutes(), ...(init_routes2(), __toCommonJS(routes_exports)).createUserRoutes(), ...(init_routes3(), __toCommonJS(routes_exports2)).createRoleRoutes(), ...(init_routes4(), __toCommonJS(routes_exports3)).createPermissionRoutes(), ...createProductRoutes(), ...createCustomerRoutes(), ...createCartRoutes(), ...createOrderRoutes(), ...createInventoryRoutes(), ...createPaymentRoutes(), ...createSettingsRoutes(), ...createNotificationRoutes(), ...createSupportRoutes(), ...createReportsRoutes(), ...createAuditRoutes()];
  for (const route of routes) {
    registry.register(route);
  }
  return async (request2, response) => {
    try {
      const origin = request2.headers.origin || "*";
      response.setHeader("Access-Control-Allow-Origin", origin);
      response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
      response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      response.setHeader("Access-Control-Allow-Credentials", "true");
      response.setHeader("X-Content-Type-Options", "nosniff");
      response.setHeader("X-Frame-Options", "DENY");
      response.setHeader("X-XSS-Protection", "1; mode=block");
      response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
      response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      if (request2.method === "OPTIONS") {
        response.writeHead(204);
        response.end();
        return;
      }
      const url = new URL(request2.url ?? "/", `http://${request2.headers.host ?? "localhost"}`);
      const targetPath = url.searchParams.get("path") || url.pathname;
      const resolved = resolver.resolve(registry, {
        method: request2.method ?? "GET",
        path: targetPath,
        version: "v1"
      });
      if (!resolved) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ success: false, error: { code: "not_found", message: "route_not_found" } }));
        return;
      }
      const route = resolved;
      const body = await readBody(request2);
      const headers = request2.headers;
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
        const errors = (init_errors(), __toCommonJS(errors_exports));
        const UnauthorizedError3 = errors.UnauthorizedError;
        const InvalidTokenError2 = errors.InvalidTokenError;
        if (error instanceof UnauthorizedError3 || error instanceof InvalidTokenError2 || error?.code === "invalid_token" || error?.message && /invalid|token|signature|expired/i.test(error.message)) {
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
function startSystemServer(port = Number(process.env.PORT ?? 3e3)) {
  const handler2 = createSystemRequestHandler();
  const server = (0, import_node_http.createServer)(handler2);
  server.listen(port, () => {
    console.log(`System backend listening on http://127.0.0.1:${port}`);
  });
  return server;
}
if (require.main === module) {
  startSystemServer();
}

// api/index.ts
var handler = createSystemRequestHandler();
async function apiHandler(req, res) {
  return handler(req, res);
}
