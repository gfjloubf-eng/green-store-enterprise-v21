var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
          const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres";
          const adapter = new PrismaPg({ connectionString });
          const createClient = () => new PrismaClient({ log: ["error"], adapter });
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
        const signature = sign(encoded);
        return `${encoded}.${signature}`;
      }
      createRefreshToken(subject, jti, extra = {}, expiresInSec = REFRESH_TOKEN_EXP_SECONDS) {
        const header = { alg: "HS256", typ: "JWT" };
        const iat = Math.floor(Date.now() / 1e3);
        const exp = iat + expiresInSec;
        const id = jti ?? randomBytes(16).toString("hex");
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

// ../node_modules/hash-wasm/dist/index.umd.js
var require_index_umd = __commonJS({
  "../node_modules/hash-wasm/dist/index.umd.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = typeof globalThis !== "undefined" ? globalThis : global2 || self, factory(global2.hashwasm = {}));
    })(exports, (function(exports2) {
      "use strict";
      var name$l = "adler32";
      var data$l = "AGFzbQEAAAABDANgAAF/YAAAYAF/AAMHBgABAgEAAgUEAQECAgYOAn8BQYCJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwAAw1IYXNoX0dldFN0YXRlAAQOSGFzaF9DYWxjdWxhdGUABQpTVEFURV9TSVpFAwEK6wkGBQBBgAkLCgBBAEEBNgKECAvjCAEHf0EAKAKECCIBQf//A3EhAiABQRB2IQMCQAJAIABBAUcNACACQQAtAIAJaiIBQY+AfGogASABQfD/A0sbIgEgA2oiBEEQdCIFQYCAPGogBSAEQfD/A0sbIAFyIQEMAQsCQAJAAkACQAJAIABBEEkNAEGACSEGIABBsCtJDQFBgAkhBgNAQQAhBQNAIAYgBWoiASgCACIEQf8BcSACaiICIANqIAIgBEEIdkH/AXFqIgJqIAIgBEEQdkH/AXFqIgJqIAIgBEEYdmoiAmogAiABQQRqKAIAIgRB/wFxaiICaiACIARBCHZB/wFxaiICaiACIARBEHZB/wFxaiICaiACIARBGHZqIgJqIAIgAUEIaigCACIEQf8BcWoiAmogAiAEQQh2Qf8BcWoiAmogAiAEQRB2Qf8BcWoiAmogAiAEQRh2aiIEaiAEIAFBDGooAgAiAUH/AXFqIgRqIAQgAUEIdkH/AXFqIgRqIAQgAUEQdkH/AXFqIgRqIAQgAUEYdmoiAmohAyAFQRBqIgVBsCtHDQALIANB8f8DcCEDIAJB8f8DcCECIAZBsCtqIQYgAEHQVGoiAEGvK0sNAAsgAEUNBCAAQQ9LDQEMAgsCQCAARQ0AAkACQCAAQQNxIgUNAEGACSEBIAAhBAwBCyAAQXxxIQRBACEBA0AgAiABQYAJai0AAGoiAiADaiEDIAUgAUEBaiIBRw0ACyAFQYAJaiEBCyAAQQRJDQADQCACIAEtAABqIgUgAS0AAWoiBiABLQACaiIAIAFBA2otAABqIgIgACAGIAUgA2pqamohAyABQQRqIQEgBEF8aiIEDQALCyACQY+AfGogAiACQfD/A0sbIANB8f8DcEEQdHIhAQwECwNAIAYoAgAiAUH/AXEgAmoiBCADaiAEIAFBCHZB/wFxaiIEaiAEIAFBEHZB/wFxaiIEaiAEIAFBGHZqIgRqIAQgBkEEaigCACIBQf8BcWoiBGogBCABQQh2Qf8BcWoiBGogBCABQRB2Qf8BcWoiBGogBCABQRh2aiIEaiAEIAZBCGooAgAiAUH/AXFqIgRqIAQgAUEIdkH/AXFqIgRqIAQgAUEQdkH/AXFqIgRqIAQgAUEYdmoiBGogBCAGQQxqKAIAIgFB/wFxaiIEaiAEIAFBCHZB/wFxaiIEaiAEIAFBEHZB/wFxaiIEaiAEIAFBGHZqIgJqIQMgBkEQaiEGIABBcGoiAEEPSw0ACyAARQ0BCyAAQX9qIQcCQCAAQQNxIgVFDQAgAEF8cSEAIAUhBCAGIQEDQCACIAEtAABqIgIgA2ohAyABQQFqIQEgBEF/aiIEDQALIAYgBWohBgsgB0EDSQ0AA0AgAiAGLQAAaiIBIAYtAAFqIgQgBi0AAmoiBSAGQQNqLQAAaiICIAUgBCABIANqampqIQMgBkEEaiEGIABBfGoiAA0ACwsgA0Hx/wNwIQMgAkHx/wNwIQILIAIgA0EQdHIhAQtBACABNgKECAsxAQF/QQBBACgChAgiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AoAJCwUAQYQICzsAQQBBATYChAggABACQQBBACgChAgiAEEYdCAAQYD+A3FBCHRyIABBCHZBgP4DcSAAQRh2cnI2AoAJCwsVAgBBgAgLBAQAAAAAQYQICwQBAAAA";
      var hash$l = "02ddbd17";
      var wasmJson$l = {
        name: name$l,
        data: data$l,
        hash: hash$l
      };
      function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
          });
        }
        return new (P || (P = Promise))(function(resolve, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      }
      typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
      };
      class Mutex {
        constructor() {
          this.mutex = Promise.resolve();
        }
        lock() {
          let begin = () => {
          };
          this.mutex = this.mutex.then(() => new Promise(begin));
          return new Promise((res) => {
            begin = res;
          });
        }
        dispatch(fn) {
          return __awaiter(this, void 0, void 0, function* () {
            const unlock = yield this.lock();
            try {
              return yield Promise.resolve(fn());
            } finally {
              unlock();
            }
          });
        }
      }
      var _a;
      function getGlobal() {
        if (typeof globalThis !== "undefined")
          return globalThis;
        if (typeof self !== "undefined")
          return self;
        if (typeof window !== "undefined")
          return window;
        return global;
      }
      const globalObject = getGlobal();
      const nodeBuffer = (_a = globalObject.Buffer) !== null && _a !== void 0 ? _a : null;
      const textEncoder = globalObject.TextEncoder ? new globalObject.TextEncoder() : null;
      function intArrayToString(arr, len) {
        return String.fromCharCode(...arr.subarray(0, len));
      }
      function hexCharCodesToInt(a, b) {
        return (a & 15) + (a >> 6 | a >> 3 & 8) << 4 | (b & 15) + (b >> 6 | b >> 3 & 8);
      }
      function writeHexToUInt8(buf, str) {
        const size = str.length >> 1;
        for (let i = 0; i < size; i++) {
          const index = i << 1;
          buf[i] = hexCharCodesToInt(str.charCodeAt(index), str.charCodeAt(index + 1));
        }
      }
      function hexStringEqualsUInt8(str, buf) {
        if (str.length !== buf.length * 2) {
          return false;
        }
        for (let i = 0; i < buf.length; i++) {
          const strIndex = i << 1;
          if (buf[i] !== hexCharCodesToInt(str.charCodeAt(strIndex), str.charCodeAt(strIndex + 1))) {
            return false;
          }
        }
        return true;
      }
      const alpha = "a".charCodeAt(0) - 10;
      const digit = "0".charCodeAt(0);
      function getDigestHex(tmpBuffer, input, hashLength) {
        let p = 0;
        for (let i = 0; i < hashLength; i++) {
          let nibble = input[i] >>> 4;
          tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
          nibble = input[i] & 15;
          tmpBuffer[p++] = nibble > 9 ? nibble + alpha : nibble + digit;
        }
        return String.fromCharCode.apply(null, tmpBuffer);
      }
      const getUInt8Buffer = nodeBuffer !== null ? (data2) => {
        if (typeof data2 === "string") {
          const buf = nodeBuffer.from(data2, "utf8");
          return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
        }
        if (nodeBuffer.isBuffer(data2)) {
          return new Uint8Array(data2.buffer, data2.byteOffset, data2.length);
        }
        if (ArrayBuffer.isView(data2)) {
          return new Uint8Array(data2.buffer, data2.byteOffset, data2.byteLength);
        }
        throw new Error("Invalid data type!");
      } : (data2) => {
        if (typeof data2 === "string") {
          return textEncoder.encode(data2);
        }
        if (ArrayBuffer.isView(data2)) {
          return new Uint8Array(data2.buffer, data2.byteOffset, data2.byteLength);
        }
        throw new Error("Invalid data type!");
      };
      const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      const base64Lookup = new Uint8Array(256);
      for (let i = 0; i < base64Chars.length; i++) {
        base64Lookup[base64Chars.charCodeAt(i)] = i;
      }
      function encodeBase64(data2, pad = true) {
        const len = data2.length;
        const extraBytes = len % 3;
        const parts = [];
        const len2 = len - extraBytes;
        for (let i = 0; i < len2; i += 3) {
          const tmp = (data2[i] << 16 & 16711680) + (data2[i + 1] << 8 & 65280) + (data2[i + 2] & 255);
          const triplet = base64Chars.charAt(tmp >> 18 & 63) + base64Chars.charAt(tmp >> 12 & 63) + base64Chars.charAt(tmp >> 6 & 63) + base64Chars.charAt(tmp & 63);
          parts.push(triplet);
        }
        if (extraBytes === 1) {
          const tmp = data2[len - 1];
          const a = base64Chars.charAt(tmp >> 2);
          const b = base64Chars.charAt(tmp << 4 & 63);
          parts.push(`${a}${b}`);
          if (pad) {
            parts.push("==");
          }
        } else if (extraBytes === 2) {
          const tmp = (data2[len - 2] << 8) + data2[len - 1];
          const a = base64Chars.charAt(tmp >> 10);
          const b = base64Chars.charAt(tmp >> 4 & 63);
          const c = base64Chars.charAt(tmp << 2 & 63);
          parts.push(`${a}${b}${c}`);
          if (pad) {
            parts.push("=");
          }
        }
        return parts.join("");
      }
      function getDecodeBase64Length(data2) {
        let bufferLength = Math.floor(data2.length * 0.75);
        const len = data2.length;
        if (data2[len - 1] === "=") {
          bufferLength -= 1;
          if (data2[len - 2] === "=") {
            bufferLength -= 1;
          }
        }
        return bufferLength;
      }
      function decodeBase64(data2) {
        const bufferLength = getDecodeBase64Length(data2);
        const len = data2.length;
        const bytes = new Uint8Array(bufferLength);
        let p = 0;
        for (let i = 0; i < len; i += 4) {
          const encoded1 = base64Lookup[data2.charCodeAt(i)];
          const encoded2 = base64Lookup[data2.charCodeAt(i + 1)];
          const encoded3 = base64Lookup[data2.charCodeAt(i + 2)];
          const encoded4 = base64Lookup[data2.charCodeAt(i + 3)];
          bytes[p] = encoded1 << 2 | encoded2 >> 4;
          p += 1;
          bytes[p] = (encoded2 & 15) << 4 | encoded3 >> 2;
          p += 1;
          bytes[p] = (encoded3 & 3) << 6 | encoded4 & 63;
          p += 1;
        }
        return bytes;
      }
      const MAX_HEAP = 16 * 1024;
      const WASM_FUNC_HASH_LENGTH = 4;
      const wasmMutex = new Mutex();
      const wasmModuleCache = /* @__PURE__ */ new Map();
      function WASMInterface(binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
          let wasmInstance = null;
          let memoryView = null;
          let initialized = false;
          if (typeof WebAssembly === "undefined") {
            throw new Error("WebAssembly is not supported in this environment!");
          }
          const writeMemory = (data2, offset = 0) => {
            memoryView.set(data2, offset);
          };
          const getMemory = () => memoryView;
          const getExports = () => wasmInstance.exports;
          const setMemorySize = (totalSize) => {
            wasmInstance.exports.Hash_SetMemorySize(totalSize);
            const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
            const memoryBuffer = wasmInstance.exports.memory.buffer;
            memoryView = new Uint8Array(memoryBuffer, arrayOffset, totalSize);
          };
          const getStateSize = () => {
            const view = new DataView(wasmInstance.exports.memory.buffer);
            const stateSize = view.getUint32(wasmInstance.exports.STATE_SIZE, true);
            return stateSize;
          };
          const loadWASMPromise = wasmMutex.dispatch(() => __awaiter(this, void 0, void 0, function* () {
            if (!wasmModuleCache.has(binary.name)) {
              const asm = decodeBase64(binary.data);
              const promise = WebAssembly.compile(asm);
              wasmModuleCache.set(binary.name, promise);
            }
            const module2 = yield wasmModuleCache.get(binary.name);
            wasmInstance = yield WebAssembly.instantiate(module2, {
              // env: {
              //   emscripten_memcpy_big: (dest, src, num) => {
              //     const memoryBuffer = wasmInstance.exports.memory.buffer;
              //     const memView = new Uint8Array(memoryBuffer, 0);
              //     memView.set(memView.subarray(src, src + num), dest);
              //   },
              //   print_memory: (offset, len) => {
              //     const memoryBuffer = wasmInstance.exports.memory.buffer;
              //     const memView = new Uint8Array(memoryBuffer, 0);
              //     console.log('print_int32', memView.subarray(offset, offset + len));
              //   },
              // },
            });
          }));
          const setupInterface = () => __awaiter(this, void 0, void 0, function* () {
            if (!wasmInstance) {
              yield loadWASMPromise;
            }
            const arrayOffset = wasmInstance.exports.Hash_GetBuffer();
            const memoryBuffer = wasmInstance.exports.memory.buffer;
            memoryView = new Uint8Array(memoryBuffer, arrayOffset, MAX_HEAP);
          });
          const init = (bits = null) => {
            initialized = true;
            wasmInstance.exports.Hash_Init(bits);
          };
          const updateUInt8Array = (data2) => {
            let read = 0;
            while (read < data2.length) {
              const chunk = data2.subarray(read, read + MAX_HEAP);
              read += chunk.length;
              memoryView.set(chunk);
              wasmInstance.exports.Hash_Update(chunk.length);
            }
          };
          const update = (data2) => {
            if (!initialized) {
              throw new Error("update() called before init()");
            }
            const Uint8Buffer = getUInt8Buffer(data2);
            updateUInt8Array(Uint8Buffer);
          };
          const digestChars = new Uint8Array(hashLength * 2);
          const digest = (outputType, padding = null) => {
            if (!initialized) {
              throw new Error("digest() called before init()");
            }
            initialized = false;
            wasmInstance.exports.Hash_Final(padding);
            if (outputType === "binary") {
              return memoryView.slice(0, hashLength);
            }
            return getDigestHex(digestChars, memoryView, hashLength);
          };
          const save = () => {
            if (!initialized) {
              throw new Error("save() can only be called after init() and before digest()");
            }
            const stateOffset = wasmInstance.exports.Hash_GetState();
            const stateLength = getStateSize();
            const memoryBuffer = wasmInstance.exports.memory.buffer;
            const internalState = new Uint8Array(memoryBuffer, stateOffset, stateLength);
            const prefixedState = new Uint8Array(WASM_FUNC_HASH_LENGTH + stateLength);
            writeHexToUInt8(prefixedState, binary.hash);
            prefixedState.set(internalState, WASM_FUNC_HASH_LENGTH);
            return prefixedState;
          };
          const load = (state) => {
            if (!(state instanceof Uint8Array)) {
              throw new Error("load() expects an Uint8Array generated by save()");
            }
            const stateOffset = wasmInstance.exports.Hash_GetState();
            const stateLength = getStateSize();
            const overallLength = WASM_FUNC_HASH_LENGTH + stateLength;
            const memoryBuffer = wasmInstance.exports.memory.buffer;
            if (state.length !== overallLength) {
              throw new Error(`Bad state length (expected ${overallLength} bytes, got ${state.length})`);
            }
            if (!hexStringEqualsUInt8(binary.hash, state.subarray(0, WASM_FUNC_HASH_LENGTH))) {
              throw new Error("This state was written by an incompatible hash implementation");
            }
            const internalState = state.subarray(WASM_FUNC_HASH_LENGTH);
            new Uint8Array(memoryBuffer, stateOffset, stateLength).set(internalState);
            initialized = true;
          };
          const isDataShort = (data2) => {
            if (typeof data2 === "string") {
              return data2.length < MAX_HEAP / 4;
            }
            return data2.byteLength < MAX_HEAP;
          };
          let canSimplify = isDataShort;
          switch (binary.name) {
            case "argon2":
            case "scrypt":
              canSimplify = () => true;
              break;
            case "blake2b":
            case "blake2s":
              canSimplify = (data2, initParam) => initParam <= 512 && isDataShort(data2);
              break;
            case "blake3":
              canSimplify = (data2, initParam) => initParam === 0 && isDataShort(data2);
              break;
            case "xxhash64":
            // cannot simplify
            case "xxhash3":
            case "xxhash128":
            case "crc64":
              canSimplify = () => false;
              break;
          }
          const calculate = (data2, initParam = null, digestParam = null) => {
            if (!canSimplify(data2, initParam)) {
              init(initParam);
              update(data2);
              return digest("hex", digestParam);
            }
            const buffer = getUInt8Buffer(data2);
            memoryView.set(buffer);
            wasmInstance.exports.Hash_Calculate(buffer.length, initParam, digestParam);
            return getDigestHex(digestChars, memoryView, hashLength);
          };
          yield setupInterface();
          return {
            getMemory,
            writeMemory,
            getExports,
            setMemorySize,
            init,
            update,
            digest,
            save,
            load,
            calculate,
            hashLength
          };
        });
      }
      function lockedCreate(mutex2, binary, hashLength) {
        return __awaiter(this, void 0, void 0, function* () {
          const unlock = yield mutex2.lock();
          const wasm = yield WASMInterface(binary, hashLength);
          unlock();
          return wasm;
        });
      }
      const mutex$l = new Mutex();
      let wasmCache$l = null;
      function adler32(data2) {
        if (wasmCache$l === null) {
          return lockedCreate(mutex$l, wasmJson$l, 4).then((wasm) => {
            wasmCache$l = wasm;
            return wasmCache$l.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$l.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createAdler32() {
        return WASMInterface(wasmJson$l, 4).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 4,
            digestSize: 4
          };
          return obj;
        });
      }
      var name$k = "argon2";
      var data$k = "AGFzbQEAAAABKQVgAX8Bf2AAAX9gEH9/f39/f39/f39/f39/f38AYAR/f39/AGACf38AAwYFAAECAwQFBgEBAoCAAgYIAX8BQZCoBAsHQQQGbWVtb3J5AgASSGFzaF9TZXRNZW1vcnlTaXplAAAOSGFzaF9HZXRCdWZmZXIAAQ5IYXNoX0NhbGN1bGF0ZQAECvEyBVgBAn9BACEBAkAgAEEAKAKICCICRg0AAkAgACACayIAQRB2IABBgIB8cSAASWoiAEAAQX9HDQBB/wHADwtBACEBQQBBACkDiAggAEEQdK18NwOICAsgAcALcAECfwJAQQAoAoAIIgANAEEAPwBBEHQiADYCgAhBACgCiAgiAUGAgCBGDQACQEGAgCAgAWsiAEEQdiAAQYCAfHEgAElqIgBAAEF/Rw0AQQAPC0EAQQApA4gIIABBEHStfDcDiAhBACgCgAghAAsgAAvcDgECfiAAIAQpAwAiECAAKQMAIhF8IBFCAYZC/v///x+DIBBC/////w+DfnwiEDcDACAMIBAgDCkDAIVCIIkiEDcDACAIIBAgCCkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgBCAQIAQpAwCFQiiJIhA3AwAgACAQIAApAwAiEXwgEEL/////D4MgEUIBhkL+////H4N+fCIQNwMAIAwgECAMKQMAhUIwiSIQNwMAIAggECAIKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACAEIBAgBCkDAIVCAYk3AwAgASAFKQMAIhAgASkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDSAQIA0pAwCFQiCJIhA3AwAgCSAQIAkpAwAiEXwgEUIBhkL+////H4MgEEL/////D4N+fCIQNwMAIAUgECAFKQMAhUIoiSIQNwMAIAEgECABKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACANIBAgDSkDAIVCMIkiEDcDACAJIBAgCSkDACIRfCAQQv////8PgyARQgGGQv7///8fg358IhA3AwAgBSAQIAUpAwCFQgGJNwMAIAIgBikDACIQIAIpAwAiEXwgEUIBhkL+////H4MgEEL/////D4N+fCIQNwMAIA4gECAOKQMAhUIgiSIQNwMAIAogECAKKQMAIhF8IBFCAYZC/v///x+DIBBC/////w+DfnwiEDcDACAGIBAgBikDAIVCKIkiEDcDACACIBAgAikDACIRfCAQQv////8PgyARQgGGQv7///8fg358IhA3AwAgDiAQIA4pAwCFQjCJIhA3AwAgCiAQIAopAwAiEXwgEEL/////D4MgEUIBhkL+////H4N+fCIQNwMAIAYgECAGKQMAhUIBiTcDACADIAcpAwAiECADKQMAIhF8IBFCAYZC/v///x+DIBBC/////w+DfnwiEDcDACAPIBAgDykDAIVCIIkiEDcDACALIBAgCykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgByAQIAcpAwCFQiiJIhA3AwAgAyAQIAMpAwAiEXwgEEL/////D4MgEUIBhkL+////H4N+fCIQNwMAIA8gECAPKQMAhUIwiSIQNwMAIAsgECALKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgACAFKQMAIhAgACkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDyAQIA8pAwCFQiCJIhA3AwAgCiAQIAopAwAiEXwgEUIBhkL+////H4MgEEL/////D4N+fCIQNwMAIAUgECAFKQMAhUIoiSIQNwMAIAAgECAAKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACAPIBAgDykDAIVCMIkiEDcDACAKIBAgCikDACIRfCAQQv////8PgyARQgGGQv7///8fg358IhA3AwAgBSAQIAUpAwCFQgGJNwMAIAEgBikDACIQIAEpAwAiEXwgEUIBhkL+////H4MgEEL/////D4N+fCIQNwMAIAwgECAMKQMAhUIgiSIQNwMAIAsgECALKQMAIhF8IBFCAYZC/v///x+DIBBC/////w+DfnwiEDcDACAGIBAgBikDAIVCKIkiEDcDACABIBAgASkDACIRfCAQQv////8PgyARQgGGQv7///8fg358IhA3AwAgDCAQIAwpAwCFQjCJIhA3AwAgCyAQIAspAwAiEXwgEEL/////D4MgEUIBhkL+////H4N+fCIQNwMAIAYgECAGKQMAhUIBiTcDACACIAcpAwAiECACKQMAIhF8IBFCAYZC/v///x+DIBBC/////w+DfnwiEDcDACANIBAgDSkDAIVCIIkiEDcDACAIIBAgCCkDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgByAQIAcpAwCFQiiJIhA3AwAgAiAQIAIpAwAiEXwgEEL/////D4MgEUIBhkL+////H4N+fCIQNwMAIA0gECANKQMAhUIwiSIQNwMAIAggECAIKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACAHIBAgBykDAIVCAYk3AwAgAyAEKQMAIhAgAykDACIRfCARQgGGQv7///8fgyAQQv////8Pg358IhA3AwAgDiAQIA4pAwCFQiCJIhA3AwAgCSAQIAkpAwAiEXwgEUIBhkL+////H4MgEEL/////D4N+fCIQNwMAIAQgECAEKQMAhUIoiSIQNwMAIAMgECADKQMAIhF8IBBC/////w+DIBFCAYZC/v///x+DfnwiEDcDACAOIBAgDikDAIVCMIkiEDcDACAJIBAgCSkDACIRfCAQQv////8PgyARQgGGQv7///8fg358IhA3AwAgBCAQIAQpAwCFQgGJNwMAC98aAQN/QQAhBEEAIAIpAwAgASkDAIU3A5AIQQAgAikDCCABKQMIhTcDmAhBACACKQMQIAEpAxCFNwOgCEEAIAIpAxggASkDGIU3A6gIQQAgAikDICABKQMghTcDsAhBACACKQMoIAEpAyiFNwO4CEEAIAIpAzAgASkDMIU3A8AIQQAgAikDOCABKQM4hTcDyAhBACACKQNAIAEpA0CFNwPQCEEAIAIpA0ggASkDSIU3A9gIQQAgAikDUCABKQNQhTcD4AhBACACKQNYIAEpA1iFNwPoCEEAIAIpA2AgASkDYIU3A/AIQQAgAikDaCABKQNohTcD+AhBACACKQNwIAEpA3CFNwOACUEAIAIpA3ggASkDeIU3A4gJQQAgAikDgAEgASkDgAGFNwOQCUEAIAIpA4gBIAEpA4gBhTcDmAlBACACKQOQASABKQOQAYU3A6AJQQAgAikDmAEgASkDmAGFNwOoCUEAIAIpA6ABIAEpA6ABhTcDsAlBACACKQOoASABKQOoAYU3A7gJQQAgAikDsAEgASkDsAGFNwPACUEAIAIpA7gBIAEpA7gBhTcDyAlBACACKQPAASABKQPAAYU3A9AJQQAgAikDyAEgASkD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";
      var hash$k = "e4cdc523";
      var wasmJson$k = {
        name: name$k,
        data: data$k,
        hash: hash$k
      };
      var name$j = "blake2b";
      var data$j = "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";
      var hash$j = "c6f286e6";
      var wasmJson$j = {
        name: name$j,
        data: data$j,
        hash: hash$j
      };
      const mutex$k = new Mutex();
      let wasmCache$k = null;
      function validateBits$4(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 512 || bits % 8 !== 0) {
          return new Error("Invalid variant! Valid values: 8, 16, ..., 512");
        }
        return null;
      }
      function getInitParam$1(outputBits, keyBits) {
        return outputBits | keyBits << 16;
      }
      function blake2b(data2, bits = 512, key = null) {
        if (validateBits$4(bits)) {
          return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length > 64) {
            return Promise.reject(new Error("Max key length is 64 bytes"));
          }
          initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$k === null || wasmCache$k.hashLength !== hashLength) {
          return lockedCreate(mutex$k, wasmJson$j, hashLength).then((wasm) => {
            wasmCache$k = wasm;
            if (initParam > 512) {
              wasmCache$k.writeMemory(keyBuffer);
            }
            return wasmCache$k.calculate(data2, initParam);
          });
        }
        try {
          if (initParam > 512) {
            wasmCache$k.writeMemory(keyBuffer);
          }
          const hash2 = wasmCache$k.calculate(data2, initParam);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createBLAKE2b(bits = 512, key = null) {
        if (validateBits$4(bits)) {
          return Promise.reject(validateBits$4(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length > 64) {
            return Promise.reject(new Error("Max key length is 64 bytes"));
          }
          initParam = getInitParam$1(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$j, outputSize).then((wasm) => {
          if (initParam > 512) {
            wasm.writeMemory(keyBuffer);
          }
          wasm.init(initParam);
          const obj = {
            init: initParam > 512 ? () => {
              wasm.writeMemory(keyBuffer);
              wasm.init(initParam);
              return obj;
            } : () => {
              wasm.init(initParam);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 128,
            digestSize: outputSize
          };
          return obj;
        });
      }
      function encodeResult(salt, options, res) {
        const parameters = [
          `m=${options.memorySize}`,
          `t=${options.iterations}`,
          `p=${options.parallelism}`
        ].join(",");
        return `$argon2${options.hashType}$v=19$${parameters}$${encodeBase64(salt, false)}$${encodeBase64(res, false)}`;
      }
      const uint32View = new DataView(new ArrayBuffer(4));
      function int32LE(x) {
        uint32View.setInt32(0, x, true);
        return new Uint8Array(uint32View.buffer);
      }
      function hashFunc(blake512, buf, len) {
        return __awaiter(this, void 0, void 0, function* () {
          if (len <= 64) {
            const blake = yield createBLAKE2b(len * 8);
            blake.update(int32LE(len));
            blake.update(buf);
            return blake.digest("binary");
          }
          const r = Math.ceil(len / 32) - 2;
          const ret = new Uint8Array(len);
          blake512.init();
          blake512.update(int32LE(len));
          blake512.update(buf);
          let vp = blake512.digest("binary");
          ret.set(vp.subarray(0, 32), 0);
          for (let i = 1; i < r; i++) {
            blake512.init();
            blake512.update(vp);
            vp = blake512.digest("binary");
            ret.set(vp.subarray(0, 32), i * 32);
          }
          const partialBytesNeeded = len - 32 * r;
          let blakeSmall;
          if (partialBytesNeeded === 64) {
            blakeSmall = blake512;
            blakeSmall.init();
          } else {
            blakeSmall = yield createBLAKE2b(partialBytesNeeded * 8);
          }
          blakeSmall.update(vp);
          vp = blakeSmall.digest("binary");
          ret.set(vp.subarray(0, partialBytesNeeded), r * 32);
          return ret;
        });
      }
      function getHashType(type) {
        switch (type) {
          case "d":
            return 0;
          case "i":
            return 1;
          default:
            return 2;
        }
      }
      function argon2Internal(options) {
        return __awaiter(this, void 0, void 0, function* () {
          var _a2;
          const { parallelism, iterations, hashLength } = options;
          const password = getUInt8Buffer(options.password);
          const salt = getUInt8Buffer(options.salt);
          const version = 19;
          const hashType = getHashType(options.hashType);
          const { memorySize } = options;
          const secret = getUInt8Buffer((_a2 = options.secret) !== null && _a2 !== void 0 ? _a2 : "");
          const [argon2Interface, blake512] = yield Promise.all([
            WASMInterface(wasmJson$k, 1024),
            createBLAKE2b(512)
          ]);
          argon2Interface.setMemorySize(memorySize * 1024 + 1024);
          const initVector = new Uint8Array(24);
          const initVectorView = new DataView(initVector.buffer);
          initVectorView.setInt32(0, parallelism, true);
          initVectorView.setInt32(4, hashLength, true);
          initVectorView.setInt32(8, memorySize, true);
          initVectorView.setInt32(12, iterations, true);
          initVectorView.setInt32(16, version, true);
          initVectorView.setInt32(20, hashType, true);
          argon2Interface.writeMemory(initVector, memorySize * 1024);
          blake512.init();
          blake512.update(initVector);
          blake512.update(int32LE(password.length));
          blake512.update(password);
          blake512.update(int32LE(salt.length));
          blake512.update(salt);
          blake512.update(int32LE(secret.length));
          blake512.update(secret);
          blake512.update(int32LE(0));
          const segments = Math.floor(memorySize / (parallelism * 4));
          const lanes = segments * 4;
          const param = new Uint8Array(72);
          const H0 = blake512.digest("binary");
          param.set(H0);
          for (let lane = 0; lane < parallelism; lane++) {
            param.set(int32LE(0), 64);
            param.set(int32LE(lane), 68);
            let position = lane * lanes;
            let chunk = yield hashFunc(blake512, param, 1024);
            argon2Interface.writeMemory(chunk, position * 1024);
            position += 1;
            param.set(int32LE(1), 64);
            chunk = yield hashFunc(blake512, param, 1024);
            argon2Interface.writeMemory(chunk, position * 1024);
          }
          const C = new Uint8Array(1024);
          writeHexToUInt8(C, argon2Interface.calculate(new Uint8Array([]), memorySize));
          const res = yield hashFunc(blake512, C, hashLength);
          if (options.outputType === "hex") {
            const digestChars = new Uint8Array(hashLength * 2);
            return getDigestHex(digestChars, res, hashLength);
          }
          if (options.outputType === "encoded") {
            return encodeResult(salt, options, res);
          }
          return res;
        });
      }
      const validateOptions$3 = (options) => {
        var _a2;
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (!options.password) {
          throw new Error("Password must be specified");
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
          throw new Error("Password must be specified");
        }
        if (!options.salt) {
          throw new Error("Salt must be specified");
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length < 8) {
          throw new Error("Salt should be at least 8 bytes long");
        }
        options.secret = getUInt8Buffer((_a2 = options.secret) !== null && _a2 !== void 0 ? _a2 : "");
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
          throw new Error("Iterations should be a positive number");
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
          throw new Error("Parallelism should be a positive number");
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 4) {
          throw new Error("Hash length should be at least 4 bytes.");
        }
        if (!Number.isInteger(options.memorySize)) {
          throw new Error("Memory size should be specified.");
        }
        if (options.memorySize < 8 * options.parallelism) {
          throw new Error("Memory size should be at least 8 * parallelism.");
        }
        if (options.outputType === void 0) {
          options.outputType = "hex";
        }
        if (!["hex", "binary", "encoded"].includes(options.outputType)) {
          throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
      };
      function argon2i(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions$3(options);
          return argon2Internal(Object.assign(Object.assign({}, options), { hashType: "i" }));
        });
      }
      function argon2id2(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions$3(options);
          return argon2Internal(Object.assign(Object.assign({}, options), { hashType: "id" }));
        });
      }
      function argon2d(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions$3(options);
          return argon2Internal(Object.assign(Object.assign({}, options), { hashType: "d" }));
        });
      }
      const getHashParameters = (password, encoded, secret) => {
        const regex = /^\$argon2(id|i|d)\$v=([0-9]+)\$((?:[mtp]=[0-9]+,){2}[mtp]=[0-9]+)\$([A-Za-z0-9+/]+)\$([A-Za-z0-9+/]+)$/;
        const match = encoded.match(regex);
        if (!match) {
          throw new Error("Invalid hash");
        }
        const [, hashType, version, parameters, salt, hash2] = match;
        if (version !== "19") {
          throw new Error(`Unsupported version: ${version}`);
        }
        const parsedParameters = {};
        const paramMap = { m: "memorySize", p: "parallelism", t: "iterations" };
        for (const x of parameters.split(",")) {
          const [n, v] = x.split("=");
          parsedParameters[paramMap[n]] = Number(v);
        }
        return Object.assign(Object.assign({}, parsedParameters), {
          password,
          secret,
          hashType,
          salt: decodeBase64(salt),
          hashLength: getDecodeBase64Length(hash2),
          outputType: "encoded"
        });
      };
      const validateVerifyOptions$1 = (options) => {
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (options.hash === void 0 || typeof options.hash !== "string") {
          throw new Error("Hash should be specified");
        }
      };
      function argon2Verify2(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateVerifyOptions$1(options);
          const params = getHashParameters(options.password, options.hash, options.secret);
          validateOptions$3(params);
          const hashStart = options.hash.lastIndexOf("$") + 1;
          const result = yield argon2Internal(params);
          return result.substring(hashStart) === options.hash.substring(hashStart);
        });
      }
      var name$i = "blake2s";
      var data$i = "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";
      var hash$i = "5c0ff166";
      var wasmJson$i = {
        name: name$i,
        data: data$i,
        hash: hash$i
      };
      const mutex$j = new Mutex();
      let wasmCache$j = null;
      function validateBits$3(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits > 256 || bits % 8 !== 0) {
          return new Error("Invalid variant! Valid values: 8, 16, ..., 256");
        }
        return null;
      }
      function getInitParam(outputBits, keyBits) {
        return outputBits | keyBits << 16;
      }
      function blake2s(data2, bits = 256, key = null) {
        if (validateBits$3(bits)) {
          return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length > 32) {
            return Promise.reject(new Error("Max key length is 32 bytes"));
          }
          initParam = getInitParam(bits, keyBuffer.length);
        }
        const hashLength = bits / 8;
        if (wasmCache$j === null || wasmCache$j.hashLength !== hashLength) {
          return lockedCreate(mutex$j, wasmJson$i, hashLength).then((wasm) => {
            wasmCache$j = wasm;
            if (initParam > 512) {
              wasmCache$j.writeMemory(keyBuffer);
            }
            return wasmCache$j.calculate(data2, initParam);
          });
        }
        try {
          if (initParam > 512) {
            wasmCache$j.writeMemory(keyBuffer);
          }
          const hash2 = wasmCache$j.calculate(data2, initParam);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createBLAKE2s(bits = 256, key = null) {
        if (validateBits$3(bits)) {
          return Promise.reject(validateBits$3(bits));
        }
        let keyBuffer = null;
        let initParam = bits;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length > 32) {
            return Promise.reject(new Error("Max key length is 32 bytes"));
          }
          initParam = getInitParam(bits, keyBuffer.length);
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$i, outputSize).then((wasm) => {
          if (initParam > 512) {
            wasm.writeMemory(keyBuffer);
          }
          wasm.init(initParam);
          const obj = {
            init: initParam > 512 ? () => {
              wasm.writeMemory(keyBuffer);
              wasm.init(initParam);
              return obj;
            } : () => {
              wasm.init(initParam);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: outputSize
          };
          return obj;
        });
      }
      var name$h = "blake3";
      var data$h = "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IQEgAkFAaiICQcAASw0ACwsCQEHAACAHQf8BcSIGayIFIAIgBSACSRsiCUUNACAJQQNxIQtBACEFAkAgCUEESQ0AIAAgBmohByAJQfwAcSEIQQAhBQNAIAcgBWoiAkEoaiABIAVqIgotAAA6AAAgAkEpaiAKQQFqLQAAOgAAIAJBKmogCkECai0AADoAACACQStqIApBA2otAAA6AAAgCCAFQQRqIgVHDQALCwJAIAtFDQAgASAFaiEBIAUgBmogAGpBKGohBQNAIAUgAS0AADoAACABQQFqIQEgBUEBaiEFIAtBf2oiCw0ACwsgAC0AaCEHCyAAIAcgCWo6AGggA0HAAGokAAveAwQFfwN+BX8GfiMAQdABayIBJAACQCAAe6ciAkEALQCQigEiA08NAEEALQCKigFBBHIhBCABQShqIQVBACkDmIkBIQBBACkDkIkBIQZBACkDiIkBIQdBACkDgIkBIQggAyEJA0AgASAANwMYIAEgBjcDECABIAc3AwggASAINwMAIAEgA0EFdCIDQdGJAWoiCikDADcDKCABIANB2YkBaiILKQMANwMwIAEgA0HhiQFqIgwpAwA3AzggASADQemJAWoiDSkDADcDQCABIANB8YkBaikDADcDSCABIANB+YkBaikDADcDUCABIANBgYoBaikDADcDWCADQYmKAWopAwAhDiABQcAAOgBoIAEgDjcDYCABQgA3AyAgASAEOgBpIAEgADcDiAEgASAGNwOAASABIAc3A3ggASAINwNwIAFBkAFqIAFB8ABqIAVBwABCACAEQf8BcRACIAEpA7ABIQ4gASkDkAEhDyABKQO4ASEQIAEpA5gBIREgASkDwAEhEiABKQOgASETIA0gASkDyAEgASkDqAGFNwMAIAwgEiAThTcDACALIBAgEYU3AwAgCiAOIA+FNwMAIAlBf2oiCUH/AXEiAyACSw0AC0EAIAk6AJCKAQsgAUHQAWokAAvHCQIKfwV+IwBB4AJrIgUkAAJAAkAgAUGACEsNACAFIAA2AvwBIAVB/AFqIAFBgAhGIgZBECACQQEgA0EBQQIgBBABIAZBCnQiByABTw0BIAVB4ABqIgZCADcDACAFQdgAaiIIQgA3AwAgBUHQAGoiCUIANwMAIAVByABqIgpCADcDACAFQcAAaiILQgA3AwAgBUE4aiIMQgA3AwAgBUEwaiINQgA3AwAgBSADOgBqIAVCADcDKCAFQQA7AWggBUEAKQOAiQE3AwAgBUEAKQOIiQE3AwggBUEAKQOQiQE3AxAgBUEAKQOYiQE3AxggBSABQYAIRiIOrSACfDcDICAFIAAgB2pBACABIA4bEAQgBUGIAWpBMGogDSkDADcDACAFQYgBakE4aiAMKQMANwMAIAUgBSkDACIPNwOIASAFIAUpAwgiEDcDkAEgBSAFKQMQIhE3A5gBIAUgBSkDGCISNwOgASAFIAUpAyg3A7ABIAUtAGohACAFLQBpIQcgBSkDICECIAUtAGghASAFQYgBakHAAGogCykDADcDACAFQYgBakHIAGogCikDADcDACAFQYgBakHQAGogCSkDADcDACAFQYgBakHYAGogCCkDADcDACAFQYgBakHgAGogBikDADcDACAFIAE6APABIAUgAjcDqAEgBSAAIAdFckECciIAOgDxASAFIBI3A5gCIAUgETcDkAIgBSAQNwOIAiAFIA83A4ACIAVBoAJqIAVBgAJqIAVBsAFqIAEgAiAAQf8BcRACIAUpA8ACIQIgBSkDoAIhDyAFKQPIAiEQIAUpA6gCIREgBSkD0AIhEiAFKQOwAiETIAQgDkEFdGoiASAFKQPYAiAFKQO4AoU3AxggASASIBOFNwMQIAEgECARhTcDCCABIAIgD4U3AwBBAkEBIA4bIQYMAQsgAEIBIAFBf2pBCnZBAXKteUI/hYYiD6dBCnQiDiACIAMgBRAGIQcgACAOaiABIA5rIA9C////AYMgAnwgAyAFQcAAQSAgDkGACEsbahAGIQECQCAHQQFHDQAgBCAFKQMANwMAIAQgBSkDCDcDCCAEIAUpAxA3AxAgBCAFKQMYNwMYIAQgBSkDIDcDICAEIAUpAyg3AyggBCAFKQMwNwMwIAQgBSkDODcDOEECIQYMAQtBACEGQQAhAAJAIAEgB2oiCUECSQ0AIAlBfmoiCkEBdkEBaiIGQQNxIQ5BACEHAkAgCkEGSQ0AIAZB/P///wdxIQhBACEHIAVBiAFqIQEgBSEAA0AgASAANgIAIAFBDGogAEHAAWo2AgAgAUEIaiAAQYABajYCACABQQRqIABBwABqNgIAIABBgAJqIQAgAUEQaiEBIAggB0EEaiIHRw0ACwsgCkF+cSEIAkAgDkUNACAFIAdBBnRqIQEgBUGIAWogB0ECdGohAANAIAAgATYCACABQcAAaiEBIABBBGohACAOQX9qIg4NAAsLIAhBAmohAAsgBUGIAWogBkEBQgBBACADQQRyQQBBACAEEAEgACAJTw0AIAQgBkEFdGoiASAFIAZBBnRqIgApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggBkEBaiEGCyAFQeACaiQAIAYLrRAIAn8EfgF/AX4EfwR+BH8EfiMAQfABayIBJAACQCAARQ0AAkBBAC0AkIoBIgINACABQTBqQQApA9CJATcDACABQThqQQApA9iJATcDACABQQApA6CJASIDNwMAIAFBACkDqIkBIgQ3AwggAUEAKQOwiQEiBTcDECABQQApA7iJASIGNwMYIAFBACkDyIkBNwMoQQAtAIqKASECQQAtAImKASEHQQApA8CJASEIQQAtAIiKASEJIAFBwABqQQApA+CJATcDACABQcgAakEAKQPoiQE3AwAgAUHQAGpBACkD8IkBNwMAIAFB2ABqQQApA/iJATcDACABQeAAakEAKQOAigE3AwAgASAJOgBoIAEgCDcDICABIAIgB0VyIgJBAnI6AGkgAUEoaiEKQgAhCEGACSELIAJBCnJB/wFxIQwDQCABQbABaiABIAogCUH/AXEgCCAMEAIgASABKQPQASINIAEpA7ABhTcDcCABIAEpA9gBIg4gASkDuAGFNwN4IAEgASkD4AEiDyABKQPAAYU3A4ABIAEgASkD6AEiECAGhTcDqAEgASAPIAWFNwOgASABIA4gBIU3A5gBIAEgDSADhTcDkAEgASAQIAEpA8gBhTcDiAEgAEHAACAAQcAASRsiEUF/aiESAkACQCARQQdxIhMNACABQfAAaiECIAshByARIRQMAQsgEUH4AHEhFCABQfAAaiECIAshBwNAIAcgAi0AADoAACAHQQFqIQcgAkEBaiECIBNBf2oiEw0ACwsCQCASQQdJDQADQCAHIAIpAAA3AAAgB0EIaiEHIAJBCGohAiAUQXhqIhQNAAsLIAhCAXwhCCALIBFqIQsgACARayIADQAMAgsLAkACQAJAQQAtAImKASIHQQZ0QQBBAC0AiIoBIhFrRg0AIAEgEToAaCABQQApA4CKATcDYCABQQApA/iJATcDWCABQQApA/CJATcDUCABQQApA+iJATcDSCABQQApA+CJATcDQCABQQApA9iJATcDOCABQQApA9CJATcDMCABQQApA8iJATcDKCABQQApA8CJASIINwMgIAFBACkDuIkBIgM3AxggAUEAKQOwiQEiBDcDECABQQApA6iJASIFNwMIIAFBACkDoIkBIgY3AwAgAUEALQCKigEiEyAHRXJBAnIiCzoAaSATQQRyIRNBACkDmIkBIQ1BACkDkIkBIQ5BACkDiIkBIQ9BACkDgIkBIRAMAQtBwAAhESABQcAAOgBoQgAhCCABQgA3AyAgAUEAKQOYiQEiDTcDGCABQQApA5CJASIONwMQIAFBACkDiIkBIg83AwggAUEAKQOAiQEiEDcDACABQQAtAIqKAUEEciITOgBpIAEgAkF+aiICQQV0IgdByYoBaikDADcDYCABIAdBwYoBaikDADcDWCABIAdBuYoBaikDADcDUCABIAdBsYoBaikDADcDSCABIAdBqYoBaikDADcDQCABIAdBoYoBaikDADcDOCABIAdBmYoBaikDADcDMCABIAdBkYoBaikDADcDKCATIQsgECEGIA8hBSAOIQQgDSEDIAJFDQELIAJBf2oiB0EFdCIUQZGKAWopAwAhFSAUQZmKAWopAwAhFiAUQaGKAWopAwAhFyAUQamKAWopAwAhGCABIAM3A4gBIAEgBDcDgAEgASAFNwN4IAEgBjcDcCABQbABaiABQfAAaiABQShqIhQgESAIIAtB/wFxEAIgASATOgBpIAFBwAA6AGggASAYNwNAIAEgFzcDOCABIBY3AzAgASAVNwMoIAFCADcDICABIA03AxggASAONwMQIAEgDzcDCCABIBA3AwAgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggB0UNACACQQV0QemJAWohAiATQf8BcSERA0AgAkFoaikDACEIIAJBcGopAwAhAyACQXhqKQMAIQQgAikDACEFIAEgDTcDiAEgASAONwOAASABIA83A3ggASAQNwNwIAFBsAFqIAFB8ABqIBRBwABCACAREAIgASATOgBpIAFBwAA6AGggASAFNwNAIAEgBDcDOCABIAM3AzAgASAINwMoIAFCADcDICABIA03AxggASAONwMQIAEgDzcDCCABIBA3AwAgASABKQPoASABKQPIAYU3A2AgASABKQPgASABKQPAAYU3A1ggASABKQPYASABKQO4AYU3A1AgASABKQPQASABKQOwAYU3A0ggAkFgaiECIAdBf2oiBw0ACwsgAUEoaiEJQgAhCEGACSELIBNBCHJB/wFxIQoDQCABQbABaiABIAlBwAAgCCAKEAIgASABKQPQASIDIAEpA7ABhTcDcCABIAEpA9gBIgQgASkDuAGFNwN4IAEgASkD4AEiBSABKQPAAYU3A4ABIAEgDSABKQPoASIGhTcDqAEgASAOIAWFNwOgASABIA8gBIU3A5gBIAEgECADhTcDkAEgASAGIAEpA8gBhTcDiAEgAEHAACAAQcAASRsiEUF/aiESAkACQCARQQdxIhMNACABQfAAaiECIAshByARIRQMAQsgEUH4AHEhFCABQfAAaiECIAshBwNAIAcgAi0AADoAACAHQQFqIQcgAkEBaiECIBNBf2oiEw0ACwsCQCASQQdJDQADQCAHIAIpAAA3AAAgB0EIaiEHIAJBCGohAiAUQXhqIhQNAAsLIAhCAXwhCCALIBFqIQsgACARayIADQALCyABQfABaiQAC6MCAQR+AkACQCAAQSBGDQBCq7OP/JGjs/DbACEBQv+kuYjFkdqCm38hAkLy5rvjo6f9p6V/IQNC58yn0NbQ67O7fyEEQQAhAAwBC0EAKQOYCSEBQQApA5AJIQJBACkDiAkhA0EAKQOACSEEQRAhAAtBACAAOgCKigFBAEIANwOAigFBAEIANwP4iQFBAEIANwPwiQFBAEIANwPoiQFBAEIANwPgiQFBAEIANwPYiQFBAEIANwPQiQFBAEIANwPIiQFBAEIANwPAiQFBACABNwO4iQFBACACNwOwiQFBACADNwOoiQFBACAENwOgiQFBACABNwOYiQFBACACNwOQiQFBACADNwOIiQFBACAENwOAiQFBAEEAOgCQigFBAEEAOwGIigELBgAgABADCwYAIAAQBwsGAEGAiQELqwIBBH4CQAJAIAFBIEYNAEKrs4/8kaOz8NsAIQNC/6S5iMWR2oKbfyEEQvLmu+Ojp/2npX8hBULnzKfQ1tDrs7t/IQZBACEBDAELQQApA5gJIQNBACkDkAkhBEEAKQOICSEFQQApA4AJIQZBECEBC0EAIAE6AIqKAUEAQgA3A4CKAUEAQgA3A/iJAUEAQgA3A/CJAUEAQgA3A+iJAUEAQgA3A+CJAUEAQgA3A9iJAUEAQgA3A9CJAUEAQgA3A8iJAUEAQgA3A8CJAUEAIAM3A7iJAUEAIAQ3A7CJAUEAIAU3A6iJAUEAIAY3A6CJAUEAIAM3A5iJAUEAIAQ3A5CJAUEAIAU3A4iJAUEAIAY3A4CJAUEAQQA6AJCKAUEAQQA7AYiKASAAEAMgAhAHCwsLAQBBgAgLBHgHAAA=";
      var hash$h = "215d875f";
      var wasmJson$h = {
        name: name$h,
        data: data$h,
        hash: hash$h
      };
      const mutex$i = new Mutex();
      let wasmCache$i = null;
      function validateBits$2(bits) {
        if (!Number.isInteger(bits) || bits < 8 || bits % 8 !== 0) {
          return new Error("Invalid variant! Valid values: 8, 16, ...");
        }
        return null;
      }
      function blake3(data2, bits = 256, key = null) {
        if (validateBits$2(bits)) {
          return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length !== 32) {
            return Promise.reject(new Error("Key length must be exactly 32 bytes"));
          }
          initParam = 32;
        }
        const hashLength = bits / 8;
        const digestParam = hashLength;
        if (wasmCache$i === null || wasmCache$i.hashLength !== hashLength) {
          return lockedCreate(mutex$i, wasmJson$h, hashLength).then((wasm) => {
            wasmCache$i = wasm;
            if (initParam === 32) {
              wasmCache$i.writeMemory(keyBuffer);
            }
            return wasmCache$i.calculate(data2, initParam, digestParam);
          });
        }
        try {
          if (initParam === 32) {
            wasmCache$i.writeMemory(keyBuffer);
          }
          const hash2 = wasmCache$i.calculate(data2, initParam, digestParam);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createBLAKE3(bits = 256, key = null) {
        if (validateBits$2(bits)) {
          return Promise.reject(validateBits$2(bits));
        }
        let keyBuffer = null;
        let initParam = 0;
        if (key !== null) {
          keyBuffer = getUInt8Buffer(key);
          if (keyBuffer.length !== 32) {
            return Promise.reject(new Error("Key length must be exactly 32 bytes"));
          }
          initParam = 32;
        }
        const outputSize = bits / 8;
        const digestParam = outputSize;
        return WASMInterface(wasmJson$h, outputSize).then((wasm) => {
          if (initParam === 32) {
            wasm.writeMemory(keyBuffer);
          }
          wasm.init(initParam);
          const obj = {
            init: initParam === 32 ? () => {
              wasm.writeMemory(keyBuffer);
              wasm.init(initParam);
              return obj;
            } : () => {
              wasm.init(initParam);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType, digestParam),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: outputSize
          };
          return obj;
        });
      }
      var name$g = "crc32";
      var data$g = "AGFzbQEAAAABEQRgAAF/YAF/AGAAAGACf38AAwgHAAEBAQIAAwUEAQECAgYOAn8BQZDJBQt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAgtIYXNoX1VwZGF0ZQADCkhhc2hfRmluYWwABA1IYXNoX0dldFN0YXRlAAUOSGFzaF9DYWxjdWxhdGUABgpTVEFURV9TSVpFAwEKkggHBQBBgAkLwwMBA39BgIkBIQFBACECA0AgAUEAQQBBAEEAQQBBAEEAQQAgAkEBcWsgAHEgAkEBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnMiA0EBcWsgAHEgA0EBdnM2AgAgAUEEaiEBIAJBAWoiAkGAAkcNAAtBACEAA0AgAEGEkQFqIABBhIkBaigCACICQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEmQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYShAWogAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhKkBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzIgI2AgAgAEGEsQFqIAJB/wFxQQJ0QYCJAWooAgAgAkEIdnMiAjYCACAAQYS5AWogAkH/AXFBAnRBgIkBaigCACACQQh2cyICNgIAIABBhMEBaiACQf8BcUECdEGAiQFqKAIAIAJBCHZzNgIAIABBBGoiAEH8B0cNAAsLJwACQEEAKAKAyQEgAEYNACAAEAFBACAANgKAyQELQQBBADYChMkBC4gDAQN/QQAoAoTJAUF/cyEBQYAJIQICQCAAQQhJDQBBgAkhAgNAIAJBBGooAgAiA0EOdkH8B3FBgJEBaigCACADQRZ2QfwHcUGAiQFqKAIAcyADQQZ2QfwHcUGAmQFqKAIAcyADQf8BcUECdEGAoQFqKAIAcyACKAIAIAFzIgFBFnZB/AdxQYCpAWooAgBzIAFBDnZB/AdxQYCxAWooAgBzIAFBBnZB/AdxQYC5AWooAgBzIAFB/wFxQQJ0QYDBAWooAgBzIQEgAkEIaiECIABBeGoiAEEHSw0ACwsCQCAARQ0AAkACQCAAQQFxDQAgACEDDAELIAFB/wFxIAItAABzQQJ0QYCJAWooAgAgAUEIdnMhASACQQFqIQIgAEF/aiEDCyAAQQFGDQADQCABQf8BcSACLQAAc0ECdEGAiQFqKAIAIAFBCHZzIgFB/wFxIAJBAWotAABzQQJ0QYCJAWooAgAgAUEIdnMhASACQQJqIQIgA0F+aiIDDQALC0EAIAFBf3M2AoTJAQsyAQF/QQBBACgChMkBIgBBGHQgAEGA/gNxQQh0ciAAQQh2QYD+A3EgAEEYdnJyNgKACQsGAEGEyQELWQACQEEAKAKAyQEgAUYNACABEAFBACABNgKAyQELQQBBADYChMkBIAAQA0EAQQAoAoTJASIBQRh0IAFBgP4DcUEIdHIgAUEIdkGA/gNxIAFBGHZycjYCgAkLCwsBAEGACAsEBAAAAA==";
      var hash$g = "d2eba587";
      var wasmJson$g = {
        name: name$g,
        data: data$g,
        hash: hash$g
      };
      const mutex$h = new Mutex();
      let wasmCache$h = null;
      function validatePoly(poly) {
        if (!Number.isInteger(poly) || poly < 0 || poly > 4294967295) {
          return new Error("Polynomial must be a valid 32-bit long unsigned integer");
        }
        return null;
      }
      function crc32(data2, polynomial = 3988292384) {
        if (validatePoly(polynomial)) {
          return Promise.reject(validatePoly(polynomial));
        }
        if (wasmCache$h === null) {
          return lockedCreate(mutex$h, wasmJson$g, 4).then((wasm) => {
            wasmCache$h = wasm;
            return wasmCache$h.calculate(data2, polynomial);
          });
        }
        try {
          const hash2 = wasmCache$h.calculate(data2, polynomial);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createCRC32(polynomial = 3988292384) {
        if (validatePoly(polynomial)) {
          return Promise.reject(validatePoly(polynomial));
        }
        return WASMInterface(wasmJson$g, 4).then((wasm) => {
          wasm.init(polynomial);
          const obj = {
            init: () => {
              wasm.init(polynomial);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 4,
            digestSize: 4
          };
          return obj;
        });
      }
      var name$f = "crc64";
      var data$f = "AGFzbQEAAAABDANgAAF/YAAAYAF/AAMHBgABAgEAAQUEAQECAgYOAn8BQZCJBgt/AEGACAsHcAgGbWVtb3J5AgAOSGFzaF9HZXRCdWZmZXIAAAlIYXNoX0luaXQAAQtIYXNoX1VwZGF0ZQACCkhhc2hfRmluYWwAAw1IYXNoX0dldFN0YXRlAAQOSGFzaF9DYWxjdWxhdGUABQpTVEFURV9TSVpFAwEKgwgGBQBBgAkL9QMDAX4BfwJ+AkBBACkDgIkCQQApA4AJIgBRDQBBgIkBIQFCACECA0AgAUIAQgBCAEIAQgBCAEIAQgAgAkIBg30gAIMgAkIBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIUiA0IBg30gAIMgA0IBiIU3AwAgAUEIaiEBIAJCAXwiAkKAAlINAAtBACEBA0AgAUGImQFqIAFBiIkBaikDACICp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiKkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiLkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiMkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiNkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiOkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhSICNwMAIAFBiPkBaiACp0H/AXFBA3RBgIkBaikDACACQgiIhTcDACABQQhqIgFB+A9HDQALQQAgADcDgIkCC0EAQgA3A4iJAguUAwIBfgJ/QQApA4iJAkJ/hSEBQYAJIQICQCAAQQhJDQBBgAkhAgNAIAIpAwAgAYUiAUIwiKdB/wFxQQN0QYCZAWopAwAgAUI4iKdBA3RBgIkBaikDAIUgAUIoiKdB/wFxQQN0QYCpAWopAwCFIAFCIIinQf8BcUEDdEGAuQFqKQMAhSABpyIDQRV2QfgPcUGAyQFqKQMAhSADQQ12QfgPcUGA2QFqKQMAhSADQQV2QfgPcUGA6QFqKQMAhSADQf8BcUEDdEGA+QFqKQMAhSEBIAJBCGohAiAAQXhqIgBBB0sNAAsLAkAgAEUNAAJAAkAgAEEBcQ0AIAAhAwwBCyABQv8BgyACMQAAhadBA3RBgIkBaikDACABQgiIhSEBIAJBAWohAiAAQX9qIQMLIABBAUYNAANAIAFC/wGDIAIxAACFp0EDdEGAiQFqKQMAIAFCCIiFIgFC/wGDIAJBAWoxAACFp0EDdEGAiQFqKQMAIAFCCIiFIQEgAkECaiECIANBfmoiAw0ACwtBACABQn+FNwOIiQILZAEBfkEAQQApA4iJAiIAQjiGIABCgP4Dg0IohoQgAEKAgPwHg0IYhiAAQoCAgPgPg0IIhoSEIABCCIhCgICA+A+DIABCGIhCgID8B4OEIABCKIhCgP4DgyAAQjiIhISENwOACQsGAEGIiQILAgALCwsBAEGACAsECAAAAA==";
      var hash$f = "c5ac6c16";
      var wasmJson$f = {
        name: name$f,
        data: data$f,
        hash: hash$f
      };
      const mutex$g = new Mutex();
      let wasmCache$g = null;
      const polyBuffer = new Uint8Array(8);
      function parsePoly(poly) {
        const errText = "Polynomial must be provided as a 16 char long hex string";
        if (typeof poly !== "string" || poly.length !== 16) {
          return { hi: 0, lo: 0, err: new Error(errText) };
        }
        const hi = Number(`0x${poly.slice(0, 8)}`);
        const lo = Number(`0x${poly.slice(8)}`);
        if (Number.isNaN(hi) || Number.isNaN(lo)) {
          return { hi, lo, err: new Error(errText) };
        }
        return { hi, lo, err: null };
      }
      function writePoly(arr, lo, hi) {
        const buffer = new DataView(arr);
        buffer.setUint32(0, lo, true);
        buffer.setUint32(4, hi, true);
      }
      function crc64(data2, polynomial = "c96c5795d7870f42") {
        const { hi, lo, err } = parsePoly(polynomial);
        if (err !== null) {
          return Promise.reject(err);
        }
        if (wasmCache$g === null) {
          return lockedCreate(mutex$g, wasmJson$f, 8).then((wasm) => {
            wasmCache$g = wasm;
            writePoly(polyBuffer.buffer, lo, hi);
            wasmCache$g.writeMemory(polyBuffer);
            return wasmCache$g.calculate(data2);
          });
        }
        try {
          writePoly(polyBuffer.buffer, lo, hi);
          wasmCache$g.writeMemory(polyBuffer);
          const hash2 = wasmCache$g.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err2) {
          return Promise.reject(err2);
        }
      }
      function createCRC64(polynomial = "c96c5795d7870f42") {
        const { hi, lo, err } = parsePoly(polynomial);
        if (err !== null) {
          return Promise.reject(err);
        }
        return WASMInterface(wasmJson$f, 8).then((wasm) => {
          const instanceBuffer = new Uint8Array(8);
          writePoly(instanceBuffer.buffer, lo, hi);
          wasm.writeMemory(instanceBuffer);
          wasm.init();
          const obj = {
            init: () => {
              wasm.writeMemory(instanceBuffer);
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 8,
            digestSize: 8
          };
          return obj;
        });
      }
      var name$e = "md4";
      var data$e = "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";
      var hash$e = "bd8ce7c7";
      var wasmJson$e = {
        name: name$e,
        data: data$e,
        hash: hash$e
      };
      const mutex$f = new Mutex();
      let wasmCache$f = null;
      function md4(data2) {
        if (wasmCache$f === null) {
          return lockedCreate(mutex$f, wasmJson$e, 16).then((wasm) => {
            wasmCache$f = wasm;
            return wasmCache$f.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$f.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createMD4() {
        return WASMInterface(wasmJson$e, 16).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 16
          };
          return obj;
        });
      }
      var name$d = "md5";
      var data$d = "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";
      var hash$d = "e6508e4b";
      var wasmJson$d = {
        name: name$d,
        data: data$d,
        hash: hash$d
      };
      const mutex$e = new Mutex();
      let wasmCache$e = null;
      function md5(data2) {
        if (wasmCache$e === null) {
          return lockedCreate(mutex$e, wasmJson$d, 16).then((wasm) => {
            wasmCache$e = wasm;
            return wasmCache$e.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$e.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createMD5() {
        return WASMInterface(wasmJson$d, 16).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 16
          };
          return obj;
        });
      }
      var name$c = "sha1";
      var data$c = "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";
      var hash$c = "6b530c24";
      var wasmJson$c = {
        name: name$c,
        data: data$c,
        hash: hash$c
      };
      const mutex$d = new Mutex();
      let wasmCache$d = null;
      function sha1(data2) {
        if (wasmCache$d === null) {
          return lockedCreate(mutex$d, wasmJson$c, 20).then((wasm) => {
            wasmCache$d = wasm;
            return wasmCache$d.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$d.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA1() {
        return WASMInterface(wasmJson$c, 20).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 20
          };
          return obj;
        });
      }
      var name$b = "sha3";
      var data$b = "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";
      var hash$b = "fb24e536";
      var wasmJson$b = {
        name: name$b,
        data: data$b,
        hash: hash$b
      };
      const mutex$c = new Mutex();
      let wasmCache$c = null;
      function validateBits$1(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
          return new Error("Invalid variant! Valid values: 224, 256, 384, 512");
        }
        return null;
      }
      function sha3(data2, bits = 512) {
        if (validateBits$1(bits)) {
          return Promise.reject(validateBits$1(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$c === null || wasmCache$c.hashLength !== hashLength) {
          return lockedCreate(mutex$c, wasmJson$b, hashLength).then((wasm) => {
            wasmCache$c = wasm;
            return wasmCache$c.calculate(data2, bits, 6);
          });
        }
        try {
          const hash2 = wasmCache$c.calculate(data2, bits, 6);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA3(bits = 512) {
        if (validateBits$1(bits)) {
          return Promise.reject(validateBits$1(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$b, outputSize).then((wasm) => {
          wasm.init(bits);
          const obj = {
            init: () => {
              wasm.init(bits);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType, 6),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 200 - 2 * outputSize,
            digestSize: outputSize
          };
          return obj;
        });
      }
      const mutex$b = new Mutex();
      let wasmCache$b = null;
      function validateBits(bits) {
        if (![224, 256, 384, 512].includes(bits)) {
          return new Error("Invalid variant! Valid values: 224, 256, 384, 512");
        }
        return null;
      }
      function keccak(data2, bits = 512) {
        if (validateBits(bits)) {
          return Promise.reject(validateBits(bits));
        }
        const hashLength = bits / 8;
        if (wasmCache$b === null || wasmCache$b.hashLength !== hashLength) {
          return lockedCreate(mutex$b, wasmJson$b, hashLength).then((wasm) => {
            wasmCache$b = wasm;
            return wasmCache$b.calculate(data2, bits, 1);
          });
        }
        try {
          const hash2 = wasmCache$b.calculate(data2, bits, 1);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createKeccak(bits = 512) {
        if (validateBits(bits)) {
          return Promise.reject(validateBits(bits));
        }
        const outputSize = bits / 8;
        return WASMInterface(wasmJson$b, outputSize).then((wasm) => {
          wasm.init(bits);
          const obj = {
            init: () => {
              wasm.init(bits);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType, 1),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 200 - 2 * outputSize,
            digestSize: outputSize
          };
          return obj;
        });
      }
      var name$a = "sha256";
      var data$a = "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c2pBx6KerX1qIhkgASADcyACcSABIANxcyABQR53IAFBE3dzIAFBCndzaiAaaiICaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakHRxqk2aiIaIAIgAXMgA3EgAiABcXMgAkEedyACQRN3cyACQQp3c2ogGGoiA2oiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pB59KkoQFqIhggAyACcyABcSADIAJxcyADQR53IANBE3dzIANBCndzaiAUaiIBaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGFldy9AmoiFCABIANzIAJxIAEgA3FzIAFBHncgAUETd3MgAUEKd3NqIBdqIgJqIhMgI2ogJiASaiAiIBFqICUgCWogEyASIBFzcSARc2ogE0EadyATQRV3cyATQQd3c2pBuMLs8AJqIhcgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAZaiIDaiIJIBMgEnNxIBJzaiAJQRp3IAlBFXdzIAlBB3dzakH827HpBGoiGSADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBpqIgFqIhEgCSATc3EgE3NqIBFBGncgEUEVd3MgEUEHd3NqQZOa4JkFaiIaIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGGoiAmoiEiARIAlzcSAJc2ogEkEadyASQRV3cyASQQd3c2pB1OapqAZqIhggAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAUaiIDaiITaiAoIBJqICQgEWogJyAJaiATIBIgEXNxIBFzaiATQRp3IBNBFXdzIBNBB3dzakG7laizB2oiFCADIAJzIAFxIAMgAnFzIANBHncgA0ETd3MgA0EKd3NqIBdqIgFqIgkgEyASc3EgEnNqIAlBGncgCUEVd3MgCUEHd3NqQa6Si454aiIXIAEgA3MgAnEgASADcXMgAUEedyABQRN3cyABQQp3c2ogGWoiAmoiESAJIBNzcSATc2ogEUEadyARQRV3cyARQQd3c2pBhdnIk3lqIhkgAiABcyADcSACIAFxcyACQR53IAJBE3dzIAJBCndzaiAaaiIDaiISIBEgCXNxIAlzaiASQRp3IBJBFXdzIBJBB3dzakGh0f+VemoiGiADIAJz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";
      var hash$a = "8c18dd94";
      var wasmJson$a = {
        name: name$a,
        data: data$a,
        hash: hash$a
      };
      const mutex$a = new Mutex();
      let wasmCache$a = null;
      function sha224(data2) {
        if (wasmCache$a === null) {
          return lockedCreate(mutex$a, wasmJson$a, 28).then((wasm) => {
            wasmCache$a = wasm;
            return wasmCache$a.calculate(data2, 224);
          });
        }
        try {
          const hash2 = wasmCache$a.calculate(data2, 224);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA224() {
        return WASMInterface(wasmJson$a, 28).then((wasm) => {
          wasm.init(224);
          const obj = {
            init: () => {
              wasm.init(224);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 28
          };
          return obj;
        });
      }
      const mutex$9 = new Mutex();
      let wasmCache$9 = null;
      function sha256(data2) {
        if (wasmCache$9 === null) {
          return lockedCreate(mutex$9, wasmJson$a, 32).then((wasm) => {
            wasmCache$9 = wasm;
            return wasmCache$9.calculate(data2, 256);
          });
        }
        try {
          const hash2 = wasmCache$9.calculate(data2, 256);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA256() {
        return WASMInterface(wasmJson$a, 32).then((wasm) => {
          wasm.init(256);
          const obj = {
            init: () => {
              wasm.init(256);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 32
          };
          return obj;
        });
      }
      var name$9 = "sha512";
      var data$9 = "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";
      var hash$9 = "f2e40eb1";
      var wasmJson$9 = {
        name: name$9,
        data: data$9,
        hash: hash$9
      };
      const mutex$8 = new Mutex();
      let wasmCache$8 = null;
      function sha384(data2) {
        if (wasmCache$8 === null) {
          return lockedCreate(mutex$8, wasmJson$9, 48).then((wasm) => {
            wasmCache$8 = wasm;
            return wasmCache$8.calculate(data2, 384);
          });
        }
        try {
          const hash2 = wasmCache$8.calculate(data2, 384);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA384() {
        return WASMInterface(wasmJson$9, 48).then((wasm) => {
          wasm.init(384);
          const obj = {
            init: () => {
              wasm.init(384);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 128,
            digestSize: 48
          };
          return obj;
        });
      }
      const mutex$7 = new Mutex();
      let wasmCache$7 = null;
      function sha512(data2) {
        if (wasmCache$7 === null) {
          return lockedCreate(mutex$7, wasmJson$9, 64).then((wasm) => {
            wasmCache$7 = wasm;
            return wasmCache$7.calculate(data2, 512);
          });
        }
        try {
          const hash2 = wasmCache$7.calculate(data2, 512);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSHA512() {
        return WASMInterface(wasmJson$9, 64).then((wasm) => {
          wasm.init(512);
          const obj = {
            init: () => {
              wasm.init(512);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 128,
            digestSize: 64
          };
          return obj;
        });
      }
      var name$8 = "xxhash32";
      var data$8 = "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";
      var hash$8 = "4bb12485";
      var wasmJson$8 = {
        name: name$8,
        data: data$8,
        hash: hash$8
      };
      const mutex$6 = new Mutex();
      let wasmCache$6 = null;
      function validateSeed$3(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
          return new Error("Seed must be a valid 32-bit long unsigned integer.");
        }
        return null;
      }
      function xxhash32(data2, seed = 0) {
        if (validateSeed$3(seed)) {
          return Promise.reject(validateSeed$3(seed));
        }
        if (wasmCache$6 === null) {
          return lockedCreate(mutex$6, wasmJson$8, 4).then((wasm) => {
            wasmCache$6 = wasm;
            return wasmCache$6.calculate(data2, seed);
          });
        }
        try {
          const hash2 = wasmCache$6.calculate(data2, seed);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createXXHash32(seed = 0) {
        if (validateSeed$3(seed)) {
          return Promise.reject(validateSeed$3(seed));
        }
        return WASMInterface(wasmJson$8, 4).then((wasm) => {
          wasm.init(seed);
          const obj = {
            init: () => {
              wasm.init(seed);
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 16,
            digestSize: 4
          };
          return obj;
        });
      }
      var name$7 = "xxhash64";
      var data$7 = "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";
      var hash$7 = "177fbfa3";
      var wasmJson$7 = {
        name: name$7,
        data: data$7,
        hash: hash$7
      };
      const mutex$5 = new Mutex();
      let wasmCache$5 = null;
      const seedBuffer$2 = new Uint8Array(8);
      function validateSeed$2(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
          return new Error("Seed must be given as two valid 32-bit long unsigned integers (lo + high).");
        }
        return null;
      }
      function writeSeed$2(arr, low, high) {
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
      }
      function xxhash64(data2, seedLow = 0, seedHigh = 0) {
        if (validateSeed$2(seedLow)) {
          return Promise.reject(validateSeed$2(seedLow));
        }
        if (validateSeed$2(seedHigh)) {
          return Promise.reject(validateSeed$2(seedHigh));
        }
        if (wasmCache$5 === null) {
          return lockedCreate(mutex$5, wasmJson$7, 8).then((wasm) => {
            wasmCache$5 = wasm;
            writeSeed$2(seedBuffer$2.buffer, seedLow, seedHigh);
            wasmCache$5.writeMemory(seedBuffer$2);
            return wasmCache$5.calculate(data2);
          });
        }
        try {
          writeSeed$2(seedBuffer$2.buffer, seedLow, seedHigh);
          wasmCache$5.writeMemory(seedBuffer$2);
          const hash2 = wasmCache$5.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createXXHash64(seedLow = 0, seedHigh = 0) {
        if (validateSeed$2(seedLow)) {
          return Promise.reject(validateSeed$2(seedLow));
        }
        if (validateSeed$2(seedHigh)) {
          return Promise.reject(validateSeed$2(seedHigh));
        }
        return WASMInterface(wasmJson$7, 8).then((wasm) => {
          const instanceBuffer = new Uint8Array(8);
          writeSeed$2(instanceBuffer.buffer, seedLow, seedHigh);
          wasm.writeMemory(instanceBuffer);
          wasm.init();
          const obj = {
            init: () => {
              wasm.writeMemory(instanceBuffer);
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 32,
            digestSize: 8
          };
          return obj;
        });
      }
      var name$6 = "xxhash3";
      var data$6 = "AGFzbQEAAAABNAhgAAF/YAR/f39/AGAHf39/f39/fwBgBH9+fn4BfmAEf39/fgF+YAN/f34BfmAAAGABfwADDg0AAQIDBAUFBQYHBgAGBQQBAQICBg4CfwFBwI4FC38AQcAJCwdwCAZtZW1vcnkCAA5IYXNoX0dldEJ1ZmZlcgAACUhhc2hfSW5pdAAIC0hhc2hfVXBkYXRlAAkKSGFzaF9GaW5hbAAKDUhhc2hfR2V0U3RhdGUACw5IYXNoX0NhbGN1bGF0ZQAMClNUQVRFX1NJWkUDAQr6QQ0FAEGACgvkAwMPfgF/AX4CQCADRQ0AIAApAzAhBCAAKQM4IQUgACkDICEGIAApAyghByAAKQMQIQggACkDGCEJIAApAwAhCiAAKQMIIQsDQCAFIAFBMGopAwAiDHwgAkE4aikDACABQThqKQMAIg2FIgVCIIggBUL/////D4N+fCEFIAcgAUEgaikDACIOfCACQShqKQMAIAFBKGopAwAiD4UiB0IgiCAHQv////8Pg358IQcgCSABQRBqKQMAIhB8IAJBGGopAwAgAUEYaikDACIRhSIJQiCIIAlC/////w+DfnwhCSALIAEpAwAiEnwgAkEIaiITKQMAIAFBCGopAwAiFIUiC0IgiCALQv////8Pg358IQsgAkEwaikDACAMhSIMQiCIIAxC/////w+DfiAEfCANfCEEIAJBIGopAwAgDoUiDEIgiCAMQv////8Pg34gBnwgD3whBiACQRBqKQMAIBCFIgxCIIggDEL/////D4N+IAh8IBF8IQggAikDACAShSIMQiCIIAxC/////w+DfiAKfCAUfCEKIAFBwABqIQEgEyECIANBf2oiAw0ACyAAIAk3AxggACAKNwMAIAAgCzcDCCAAIAc3AyggACAINwMQIAAgBTcDOCAAIAY3AyAgACAENwMwCwveAgIBfwF+AkAgBCACIAEoAgAiB2siAkkNACAAIAMgBSAHQQN0aiACEAEgACAFIAZqIgcpAwAgACkDACIIQi+IhSAIhUKx893xCX43AwAgACAHKQMIIAApAwgiCEIviIUgCIVCsfPd8Ql+NwMIIAAgBykDECAAKQMQIghCL4iFIAiFQrHz3fEJfjcDECAAIAcpAxggACkDGCIIQi+IhSAIhUKx893xCX43AxggACAHKQMgIAApAyAiCEIviIUgCIVCsfPd8Ql+NwMgIAAgBykDKCAAKQMoIghCL4iFIAiFQrHz3fEJfjcDKCAAIAcpAzAgACkDMCIIQi+IhSAIhUKx893xCX43AzAgACAHKQM4IAApAzgiCEIviIUgCIVCsfPd8Ql+NwM4IAAgAyACQQZ0aiAFIAQgAmsiBxABIAEgBzYCAA8LIAAgAyAFIAdBA3RqIAQQASABIAcgBGo2AgALhQEBAX8gAiABhSADpyIEQRh0IARBgP4DcUEIdHIgBEEIdkGA/gNxIARBGHZycq1CIIYgA4V9QQA1AoCMAUIghiAAQfyLAWo1AgCEhSIDQjGJIANCGImFIAOFQqW+4/TRjIfZn39+IgNCI4ggAK18IAOFQqW+4/TRjIfZn39+IgNCHIggA4ULZwAgAiABc60gA3wiA0IhiEEALQCAjAFBEHQgAEEIdHIgAEEBdkGAjAFqLQAAQRh0ciAAQf+LAWotAAByrYUgA4VCz9bTvtLHq9lCfiIDQh2IIAOFQvnz3fGZ9pmrFn4iA0IgiCADhQuJAwEEfgJAIABBCUkNAEEAKQOAjAEgASkDICABKQMYhSACfIUiA0I4hiADQoD+A4NCKIaEIANCgID8B4NCGIYgA0KAgID4D4NCCIaEhCADQgiIQoCAgPgPgyADQhiIQoCA/AeDhCADQiiIQoD+A4MgA0I4iISEhCAArXwgAEH4iwFqKQMAIAEpAzAgASkDKIUgAn2FIgJ8IAJC/////w+DIgQgA0IgiCIFfiIGQv////8PgyACQiCIIgIgA0L/////D4MiA358IAQgA34iA0IgiHwiBEIghiADQv////8Pg4QgBkIgiCACIAV+fCAEQiCIfIV8IgNCJYggA4VC+fPd8ZnymasWfiIDQiCIIAOFDwsCQCAAQQRJDQAgACABQQhqKQMAIAFBEGopAwAgAhADDwsCQCAARQ0AIAAgASgCACABQQRqKAIAIAIQBA8LIAEpAzggASkDQIUgAoUiA0IhiCADhULP1tO+0ser2UJ+IgNCHYggA4VC+fPd8Zn2masWfiIDQiCIIAOFC94IAQZ+IACtQoeVr6+Ytt6bnn9+IQMCQCAAQSFJDQACQCAAQcEASQ0AAkAgAEHhAEkNACABKQNoIAJ9QQApA7iMAYUiBEL/////D4MiBSABKQNgIAJ8QQApA7CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDeCACfSAAQciLAWopAwCFIgNC/////w+DIgQgASkDcCACfCAAQcCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQNIIAJ9QQApA6iMAYUiBEL/////D4MiBSABKQNAIAJ8QQApA6CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDWCACfSAAQdiLAWopAwCFIgNC/////w+DIgQgASkDUCACfCAAQdCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQMoIAJ9QQApA5iMAYUiBEL/////D4MiBSABKQMgIAJ8QQApA5CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDOCACfSAAQeiLAWopAwCFIgNC/////w+DIgQgASkDMCACfCAAQeCLAWopAwCFIgVCIIgiBn4iB0L/////D4MgA0IgiCIDIAVC/////w+DIgV+fCAEIAV+IgRCIIh8IgVCIIYgBEL/////D4OEIAdCIIggAyAGfnwgBUIgiHyFfCEDCyABKQMIIAJ9QQApA4iMAYUiBEL/////D4MiBSABKQMAIAJ8QQApA4CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgA3wgASkDGCACfSAAQfiLAWopAwCFIgNC/////w+DIgQgASkDECACfCAAQfCLAWopAwCFIgJCIIgiBX4iBkL/////D4MgA0IgiCIDIAJC/////w+DIgJ+fCAEIAJ+IgJCIIh8IgRCIIYgAkL/////D4OEIAZCIIggAyAFfnwgBEIgiHyFfCICQiWIIAKFQvnz3fGZ8pmrFn4iAkIgiCAChQv8CgQBfwV+An8BfkEAIQMgASkDeCACfUEAKQP4jAGFIgRC/////w+DIgUgASkDcCACfEEAKQPwjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpA2ggAn1BACkD6IwBhSIEQv////8PgyIFIAEpA2AgAnxBACkD4IwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSABKQNYIAJ9QQApA9iMAYUiBEL/////D4MiBSABKQNQIAJ8QQApA9CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgASkDSCACfUEAKQPIjAGFIgRC/////w+DIgUgASkDQCACfEEAKQPAjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpAzggAn1BACkDuIwBhSIEQv////8PgyIFIAEpAzAgAnxBACkDsIwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSABKQMoIAJ9QQApA6iMAYUiBEL/////D4MiBSABKQMgIAJ8QQApA6CMAYUiBkIgiCIHfiIIQv////8PgyAEQiCIIgQgBkL/////D4MiBn58IAUgBn4iBUIgiHwiBkIghiAFQv////8Pg4QgCEIgiCAEIAd+fCAGQiCIfIUgASkDGCACfUEAKQOYjAGFIgRC/////w+DIgUgASkDECACfEEAKQOQjAGFIgZCIIgiB34iCEL/////D4MgBEIgiCIEIAZC/////w+DIgZ+fCAFIAZ+IgVCIIh8IgZCIIYgBUL/////D4OEIAhCIIggBCAHfnwgBkIgiHyFIAEpAwggAn1BACkDiIwBhSIEQv////8PgyIFIAEpAwAgAnxBACkDgIwBhSIGQiCIIgd+IghC/////w+DIARCIIgiBCAGQv////8PgyIGfnwgBSAGfiIFQiCIfCIGQiCGIAVC/////w+DhCAIQiCIIAQgB358IAZCIIh8hSAArUKHla+vmLbem55/fnx8fHx8fHx8IgRCJYggBIVC+fPd8ZnymasWfiIEQiCIIASFIQQCQCAAQZABSA0AIABBBHZBeGohCQNAIAEgA2oiCkELaikDACACfSADQYiNAWopAwCFIgVC/////w+DIgYgCkEDaikDACACfCADQYCNAWopAwCFIgdCIIgiCH4iC0L/////D4MgBUIgiCIFIAdC/////w+DIgd+fCAGIAd+IgZCIIh8IgdCIIYgBkL/////D4OEIAtCIIggBSAIfnwgB0IgiHyFIAR8IQQgA0EQaiEDIAlBf2oiCQ0ACwsgASkDfyACfSAAQfiLAWopAwCFIgVC/////w+DIgYgASkDdyACfCAAQfCLAWopAwCFIgJCIIgiB34iCEL/////D4MgBUIgiCIFIAJC/////w+DIgJ+fCAGIAJ+IgJCIIh8IgZCIIYgAkL/////D4OEIAhCIIggBSAHfnwgBkIgiHyFIAR8IgJCJYggAoVC+fPd8ZnymasWfiICQiCIIAKFC98FAgF+AX8CQAJAQQApA4AKIgBQRQ0AQYAIIQFCACEADAELAkBBACkDoI4BIABSDQBBACEBDAELQQAhAUEAQq+v79e895Kg/gAgAH03A/iLAUEAIABCxZbr+djShYIofDcD8IsBQQBCj/Hjja2P9JhOIAB9NwPoiwFBACAAQqus+MXV79HQfHw3A+CLAUEAQtOt1LKShbW0nn8gAH03A9iLAUEAIABCl5r0jvWWvO3JAHw3A9CLAUEAQsWDgv2v/8SxayAAfTcDyIsBQQAgAELqi7OdyOb09UN8NwPAiwFBAELIv/rLnJveueQAIAB9NwO4iwFBACAAQoqjgd/Ume2sMXw3A7CLAUEAQvm57738+MKnHSAA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QQApA4CKATcDACACQQApA4iKATcDCCACQQApA5CKATcDECACQQApA5iKATcDGCACQQApA6CKATcDICACQQApA6iKATcDKCACQQApA7CKASIFNwMwIAJBACkDuIoBIgY3AzgCQAJAQQAoAoCOASIHQcAASQ0AIAJBACgCiI4BNgJAIAIgAkHAAGpBACgCmI4BQYCMASAHQX9qQQZ2IANBACgCnI4BIgAQAiADIABqIgBBeWopAwAhCCAAKQMJIQkgACkDGSEKIAApAykhCyAHQcCLAWopAwAhBSAAKQMBIQwgB0HIiwFqKQMAIQYgB0HQiwFqKQMAIQ0gACkDESEOIAdB2IsBaikDACEPIAdB4IsBaikDACEQIAApAyEhESAHQeiLAWopAwAhEiACKQMAIRMgAikDECEUIAIpAyAhFSACKQMwIRYgAikDCCEXIAIpAxghGCACKQMoIRkgAiACKQM4IAdB8IsBaikDACIafCAAKQMxIAdB+IsBaikDACIbhSIcQiCIIBxC/////w+Dfnw3AzggGSAQfCARIBKFIhFCIIggEUL/////D4N+fCERIBggDXwgDiAPhSIOQiCIIA5C/////w+DfnwhDiAXIAV8IAwgBoUiDEIgiCAMQv////8Pg358IQwgGyAWIAsgGoUiC0IgiCALQv////8Pg358fCELIBIgFSAKIBCFIhBCIIggEEL/////D4N+fHwhECAPIBQgCSANhSINQiCIIA1C/////w+Dfnx8IRIgBiATIAggBYUiBUIgiCAFQv////8Pg358fCEIDAELIAdBwI0BaiEdQcAAIAdrIR4gAkHAAGohAAJAAkACQCAHQThNDQAgHiEfDAELAkACQEE4IAdrQQN2QQFqQQdxIh8NACACQcAAaiEAIB4hHwwBCyACQcAAaiEAIB9BA3QiICEfA0AgACAdKQMANwMAIABBCGohACAdQQhqIR0gH0F4aiIfDQALQcAAIAcgIGprIR8LAkAgBw0AA0AgACAdKQMANwMAIABBCGogHUEIaikDADcDACAAQRBqIB1BEGopAwA3AwAgAEEYaiAdQRhqKQMANwMAIABBIGogHUEgaikDADcDACAAQShqIB1BKGopAwA3AwAgAEEwaiAdQTBqKQMANwMAIABBOGogHUE4aikDADcDACAAQcAAaiEAIB1BwABqIR0gH0FAaiIfQQdLDQALCyAfRQ0BCyAfQX9qISECQCAfQQdxIiBFDQAgH0F4cSEfA0AgACAdLQAAOgAAIABBAWohACAdQQFqIR0gIEF/aiIgDQALCyAhQQdJDQADQCAAIB0pAAA3AAAgAEEIaiEAIB1BCGohHSAfQXhqIh8NAAsLIAJBwABqIB5qIR1BgIwBIQACQAJAAkAgB0EISQ0AAkAgB0E4akEDdkEBakEHcSIfDQAMAgsgH0EDdCEgQYCMASEAA0AgHSAAKQMANwMAIB1BCGohHSAAQQhqIQAgH0F/aiIfDQALIAcgIGshBwsgB0UNAQJAAkAgB0EHcSIgDQAgByEfDAELIAdBeHEhHwNAIB0gAC0AADoAACAdQQFqIR0gAEEBaiEAICBBf2oiIA0ACwsgB0EISQ0BCwNAIB0gACkAADcAACAdQQhqIR0gAEEIaiEAIB9BeGoiHw0ACwsgA0EAKAKcjgFqIgBBeWopAwAhCiAAKQMJIRMgACkDGSEUIAApAykhCyAAKQMBIQwgACkDESEOIAApAyEhESACKQMAIRUgAikDECEWIAIpAyAhFyACKQMIIRggAikDQCENIAIpA0ghDyACKQMYIRkgAikDUCESIAIpA1ghCCACKQMoIRogAikDYCEQIAIpA2ghCSACIAYgAikDcCIbfCAAKQMxIAIpA3giBoUiHEIgiCAcQv////8Pg358NwM4IBogEHwgESAJhSIRQiCIIBFC/////w+DfnwhESAZIBJ8IA4gCIUiDkIgiCAOQv////8Pg358IQ4gGCANfCAMIA+FIgxCIIggDEL/////D4N+fCEMIAYgCyAbhSILQiCIIAtC/////w+DfiAFfHwhCyAJIBcgFCAQhSIFQiCIIAVC/////w+Dfnx8IRAgCCAWIBMgEoUiBUIgiCAFQv////8Pg358fCESIA8gFSAKIA2FIgVCIIggBUL/////D4N+fHwhCAsgAykDQyACKQM4hSIFQv////8PgyIGIAMpAzsgC4UiC0IgiCINfiIPQv////8PgyAFQiCIIgUgC0L/////D4MiC358IAYgC34iBkIgiHwiC0IghiAGQv////8Pg4QgD0IgiCAFIA1+fCALQiCIfIUgAykDMyARhSIFQv////8PgyIGIAMpAysgEIUiC0IgiCINfiIPQv////8PgyAFQiCIIgUgC0L/////D4MiC358IAYgC34iBkIgiHwiC0IghiAGQv////8Pg4QgD0IgiCAFIA1+fCALQiCIfIUgAykDIyAOhSIFQv////8PgyIGIAMpAxsgEoUiC0IgiCINfiIPQv////8PgyAFQiCIIgUgC0L/////D4MiC358IAYgC34iBkIgiHwiC0IghiAGQv////8Pg4QgD0IgiCAFIA1+fCALQiCIfIUgAykDEyAMhSIFQv////8PgyIGIAMpAwsgCIUiC0IgiCINfiIPQv////8PgyAFQiCIIgUgC0L/////D4MiC358IAYgC34iBkIgiHwiC0IghiAGQv////8Pg4QgD0IgiCAFIA1+fCALQiCIfIUgBEKHla+vmLbem55/fnx8fHwiBEIliCAEhUL5893xmfKZqxZ+IgRCIIggBIUhBAwBCyAEpyEAAkBBACkDoI4BIgRQDQACQCAAQRBLDQAgAEGACCAEEAUhBAwCCwJAIABBgAFLDQAgAEGACCAEEAYhBAwCCyAAQYAIIAQQByEEDAELAkAgAEEQSw0AIAAgA0IAEAUhBAwBCwJAIABBgAFLDQAgACADQgAQBiEEDAELIAAgA0IAEAchBAtBACAEQjiGIARCgP4Dg0IohoQgBEKAgPwHg0IYhiAEQoCAgPgPg0IIhoSEIARCCIhCgICA+A+DIARCGIhCgID8B4OEIARCKIhCgP4DgyAEQjiIhISENwOACiABJAALBgBBgIoBCwIACwvMAQEAQYAIC8QBuP5sOSOkS758AYEs9yGtHN7UbemDkJfbckCkpLezZx/LeeZOzMDleIJa0H3M/3IhuAhGdPdDJI7gNZDmgTomTDwoUruRwwDLiNBlixtTLqNxZEiXog35TjgZ70ap3qzYqPp2P+OcND/53LvHxwtPHYpR4EvNtFkxyJ9+ydl4c2TqxayDNNPrw8WBoP/6E2PrFw3dUbfw2knTFlUmKdRonisWvlh9R6H8j/i40XrQMc5FyzqPlRYEKK/X+8q7S0B+QAIAAA==";
      var hash$6 = "5a2fbdbb";
      var wasmJson$6 = {
        name: name$6,
        data: data$6,
        hash: hash$6
      };
      const mutex$4 = new Mutex();
      let wasmCache$4 = null;
      const seedBuffer$1 = new Uint8Array(8);
      function validateSeed$1(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
          return new Error("Seed must be given as two valid 32-bit long unsigned integers (lo + high).");
        }
        return null;
      }
      function writeSeed$1(arr, low, high) {
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
      }
      function xxhash3(data2, seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
          return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
          return Promise.reject(validateSeed$1(seedHigh));
        }
        if (wasmCache$4 === null) {
          return lockedCreate(mutex$4, wasmJson$6, 8).then((wasm) => {
            wasmCache$4 = wasm;
            writeSeed$1(seedBuffer$1.buffer, seedLow, seedHigh);
            wasmCache$4.writeMemory(seedBuffer$1);
            return wasmCache$4.calculate(data2);
          });
        }
        try {
          writeSeed$1(seedBuffer$1.buffer, seedLow, seedHigh);
          wasmCache$4.writeMemory(seedBuffer$1);
          const hash2 = wasmCache$4.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createXXHash3(seedLow = 0, seedHigh = 0) {
        if (validateSeed$1(seedLow)) {
          return Promise.reject(validateSeed$1(seedLow));
        }
        if (validateSeed$1(seedHigh)) {
          return Promise.reject(validateSeed$1(seedHigh));
        }
        return WASMInterface(wasmJson$6, 8).then((wasm) => {
          const instanceBuffer = new Uint8Array(8);
          writeSeed$1(instanceBuffer.buffer, seedLow, seedHigh);
          wasm.writeMemory(instanceBuffer);
          wasm.init();
          const obj = {
            init: () => {
              wasm.writeMemory(instanceBuffer);
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 512,
            digestSize: 8
          };
          return obj;
        });
      }
      var name$5 = "xxhash128";
      var data$5 = "AGFzbQEAAAABKwdgAAF/YAR/f39/AGAHf39/f39/fwBgA39/fgF+YAR/f39+AGAAAGABfwADDQwAAQIDBAQEBQYFAAUFBAEBAgIGDgJ/AUHAjgULfwBBwAkLB3AIBm1lbW9yeQIADkhhc2hfR2V0QnVmZmVyAAAJSGFzaF9Jbml0AAcLSGFzaF9VcGRhdGUACApIYXNoX0ZpbmFsAAkNSGFzaF9HZXRTdGF0ZQAKDkhhc2hfQ2FsY3VsYXRlAAsKU1RBVEVfU0laRQMBCqBNDAUAQYAKC+QDAw9+AX8BfgJAIANFDQAgACkDMCEEIAApAzghBSAAKQMgIQYgACkDKCEHIAApAxAhCCAAKQMYIQkgACkDACEKIAApAwghCwNAIAUgAUEwaikDACIMfCACQThqKQMAIAFBOGopAwAiDYUiBUIgiCAFQv////8Pg358IQUgByABQSBqKQMAIg58IAJBKGopAwAgAUEoaikDACIPhSIHQiCIIAdC/////w+DfnwhByAJIAFBEGopAwAiEHwgAkEYaikDACABQRhqKQMAIhGFIglCIIggCUL/////D4N+fCEJIAsgASkDACISfCACQQhqIhMpAwAgAUEIaikDACIUhSILQiCIIAtC/////w+DfnwhCyACQTBqKQMAIAyFIgxCIIggDEL/////D4N+IAR8IA18IQQgAkEgaikDACAOhSIMQiCIIAxC/////w+DfiAGfCAPfCEGIAJBEGopAwAgEIUiDEIgiCAMQv////8Pg34gCHwgEXwhCCACKQMAIBKFIgxCIIggDEL/////D4N+IAp8IBR8IQogAUHAAGohASATIQIgA0F/aiIDDQALIAAgCTcDGCAAIAo3AwAgACALNwMIIAAgBzcDKCAAIAg3AxAgACAFNwM4IAAgBjcDICAAIAQ3AzALC94CAgF/AX4CQCAEIAIgASgCACIHayICSQ0AIAAgAyAFIAdBA3RqIAIQASAAIAUgBmoiBykDACAAKQMAIghCL4iFIAiFQrHz3fEJfjcDACAAIAcpAwggACkDCCIIQi+IhSAIhUKx893xCX43AwggACAHKQMQIAApAxAiCEIviIUgCIVCsfPd8Ql+NwMQIAAgBykDGCAAKQMYIghCL4iFIAiFQrHz3fEJfjcDGCAAIAcpAyAgACkDICIIQi+IhSAIhUKx893xCX43AyAgACAHKQMoIAApAygiCEIviIUgCIVCsfPd8Ql+NwMoIAAgBykDMCAAKQMwIghCL4iFIAiFQrHz3fEJfjcDMCAAIAcpAzggACkDOCIIQi+IhSAIhUKx893xCX43AzggACADIAJBBnRqIAUgBCACayIHEAEgASAHNgIADwsgACADIAUgB0EDdGogBBABIAEgByAEajYCAAvtAwEFfiABKQM4IAApAziFIgNC/////w+DIgQgASkDMCAAKQMwhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMoIAApAyiFIgNC/////w+DIgQgASkDICAAKQMghSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMYIAApAxiFIgNC/////w+DIgQgASkDECAAKQMQhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSABKQMIIAApAwiFIgNC/////w+DIgQgASkDACAAKQMAhSIFQiCIIgZ+IgdC/////w+DIANCIIgiAyAFQv////8PgyIFfnwgBCAFfiIEQiCIfCIFQiCGIARC/////w+DhCAHQiCIIAMgBn58IAVCIIh8hSACfHx8fCICQiWIIAKFQvnz3fGZ8pmrFn4iAkIgiCAChQu6CAIFfgN/AkAgAUEJSQ0AIAAgAUH4iwFqKQMAIgQgAikDOCACKQMwhSADfIUiBUL/////D4NC95Svrwh+IAVCgICAgHCDfEEAKQOAjAEgAikDKCACKQMghSADfYUgBIUiA0IgiCIEQrHz3fEJfnwgBEKHla+vCH4iBEIgiHwgBEL/////D4MgA0L/////D4MiA0Kx893xCX58IANCh5Wvrwh+IgRCIIh8IgVCIIh8IgNCOIYgA0KA/gODQiiGhCADQoCA/AeDQhiGIANCgICA+A+DQgiGhIQgA0IIiEKAgID4D4MgA0IYiEKAgPwHg4QgA0IoiEKA/gODIANCOIiEhIQgBEL/////D4MgAUF/aq1CNoaEIAVCIIZ8hSIEQiCIIgVCz9bTvgJ+IgZC/////w+DIARC/////w+DIgRCvdzKlQx+fCAEQs/W074CfiIEQiCIfCIHQiCGIghCJYggCCAEQv////8Pg4SFQvnz3fGZ8pmrFn4iBEIgiCAEhTcDACAAIAVCvdzKlQx+IANCz9bTvtLHq9lCfnwgBkIgiHwgB0IgiHwiA0IliCADhUL5893xmfKZqxZ+IgNCIIggA4U3AwgPCwJAIAFBBEkNACAAIAIpAxggAikDEIUgA6ciAkEYdCACQYD+A3FBCHRyIAJBCHZBgP4DcSACQRh2cnKtQiCGIAOFfCABQfyLAWo1AgBCIIZBADUCgIwBhIUiA0IgiCIEIAFBAnRBh5Wvr3hqrSIFfiIGQiCIIARCsfPd8Ql+fCAGQv////8PgyADQv////8PgyIDQrHz3fEJfnwgAyAFfiIDQiCIfCIEQiCIfCAEQiCGIANC/////w+DhCIEQgGGfCIDQiWIIAOFQvnz3fGZ8pmrFn4iBUIgiCAFhTcDCCAAIANCA4ggBIUiA0IjiCADhUKlvuP00YyH2Z9/fiIDQhyIIAOFNwMADwsCQCABRQ0AIAAgAigCBCACKAIAc60gA3wiBEIhiEEALQCAjAFBEHQgAUEIdHIiCSABQQF2QYCMAWotAABBGHRyIgogAUH/iwFqLQAAIgFyIguthSAEhULP1tO+0ser2UJ+IgRCHYggBIVC+fPd8Zn2masWfiIEQiCIIASFNwMAIAAgAigCDCACKAIIc60gA30iA0IhiCABQRh0IAtBgP4DcUEIdHIgCUEIdkGA/gNxIApBGHZyckENd62FIAOFQs/W077Sx6vZQn4iA0IdiCADhUL5893xmfaZqxZ+IgNCIIggA4U3AwgPCyAAIAIpA1AgAikDWIUgA4UiBEIhiCAEhULP1tO+0ser2UJ+IgRCHYggBIVC+fPd8Zn2masWfiIEQiCIIASFNwMIIAAgAikDQCACKQNIhSADhSIDQiGIIAOFQs/W077Sx6vZQn4iA0IdiCADhUL5893xmfaZqxZ+IgNCIIggA4U3AwALwwoBCn4gAa0iBEKHla+vmLbem55/fiEFAkACQCABQSFPDQBCACEGDAELQgAhBwJAIAFBwQBJDQBCACEHAkAgAUHhAEkNACACQfgAaikDACADfSABQciLAWopAwAiCIUiB0L/////D4MiCSACKQNwIAN8IAFBwIsBaikDACIKhSILQiCIIgx+Ig1CIIggB0IgiCIHIAx+fCANQv////8PgyAHIAtC/////w+DIgt+fCAJIAt+IgdCIIh8IglCIIh8QQApA7iMASILQQApA7CMASIMfIUgCUIghiAHQv////8Pg4SFIQcgAkHoAGopAwAgA30gC4UiCUL/////D4MiCyACKQNgIAN8IAyFIgxCIIgiDX4iBkL/////D4MgCUIgiCIJIAxC/////w+DIgx+fCALIAx+IgtCIIh8IgxCIIYgC0L/////D4OEIAZCIIggCSANfnwgDEIgiHyFIAV8IAggCnyFIQULIAJB2ABqKQMAIAN9IAFB2IsBaikDACIIhSIJQv////8PgyIKIAIpA1AgA3wgAUHQiwFqKQMAIguFIgxCIIgiDX4iBkL/////D4MgCUIgiCIJIAxC/////w+DIgx+fCAKIAx+IgpCIIh8IgxCIIYgCkL/////D4OEIAZCIIggCSANfnwgDEIgiHyFIAd8QQApA6iMASIJQQApA6CMASIKfIUhByACQcgAaikDACADfSAJhSIJQv////8PgyIMIAIpA0AgA3wgCoUiCkIgiCINfiIGQv////8PgyAJQiCIIgkgCkL/////D4MiCn58IAwgCn4iCkIgiHwiDEIghiAKQv////8Pg4QgBkIgiCAJIA1+fCAMQiCIfIUgBXwgCCALfIUhBQsgAkE4aikDACADfSABQeiLAWopAwAiCIUiCUL/////D4MiCiACKQMwIAN8IAFB4IsBaikDACILhSIMQiCIIg1+IgZC/////w+DIAlCIIgiCSAMQv////8PgyIMfnwgCiAMfiIKQiCIfCIMQiCGIApC/////w+DhCAGQiCIIAkgDX58IAxCIIh8hSAHfEEAKQOYjAEiB0EAKQOQjAEiCXyFIQYgAkEoaikDACADfSAHhSIHQv////8PgyIKIAIpAyAgA3wgCYUiCUIgiCIMfiINQv////8PgyAHQiCIIgcgCUL/////D4MiCX58IAogCX4iCUIgiHwiCkIghiAJQv////8Pg4QgDUIgiCAHIAx+fCAKQiCIfIUgBXwgCCALfIUhBQsgACACQRhqKQMAIAN9IAFB+IsBaikDACIHhSIIQv////8PgyIJIAIpAxAgA3wgAUHwiwFqKQMAIgqFIgtCIIgiDH4iDUL/////D4MgCEIgiCIIIAtC/////w+DIgt+fCAJIAt+IglCIIh8IgtCIIYgCUL/////D4OEIA1CIIggCCAMfnwgC0IgiHyFIAZ8QQApA4iMASIIQQApA4CMASIJfIUiCyACQQhqKQMAIAN9IAiFIghC/////w+DIgwgAikDACADfCAJhSIJQiCIIg1+IgZC/////w+DIAhCIIgiCCAJQv////8PgyIJfnwgDCAJfiIJQiCIfCIMQiCGIAlC/////w+DhCAGQiCIIAggDX58IAxCIIh8hSAFfCAHIAp8hSIFfCIHQiWIIAeFQvnz3fGZ8pmrFn4iB0IgiCAHhTcDACAAQgAgBUKHla+vmLbem55/fiAEIAN9Qs/W077Sx6vZQn58IAtC49zKlfzO8vWFf358IgNCJYggA4VC+fPd8ZnymasWfiIDQiCIIAOFfTcDCAuhDwMBfxR+An9BACEEIAJB+ABqKQMAIAN9QQApA/iMASIFhSIGQv////8PgyIHIAIpA3AgA3xBACkD8IwBIgiFIglCIIgiCn4iC0L/////D4MgBkIgiCIGIAlC/////w+DIgl+fCAHIAl+IgdCIIh8IglCIIYgB0L/////D4OEIAtCIIggBiAKfnwgCUIgiHyFIAJB2ABqKQMAIAN9QQApA9iMASIHhSIGQv////8PgyIJIAIpA1AgA3xBACkD0IwBIgqFIgtCIIgiDH4iDUL/////D4MgBkIgiCIGIAtC/////w+DIgt+fCAJIAt+IglCIIh8IgtCIIYgCUL/////D4OEIA1CIIggBiAMfnwgC0IgiHyFIAJBOGopAwAgA31BACkDuIwBIgmFIgZC/////w+DIgsgAikDMCADfEEAKQOwjAEiDIUiDUIgiCIOfiIPQv////8PgyAGQiCIIgYgDUL/////D4MiDX58IAsgDX4iC0IgiHwiDUIghiALQv////8Pg4QgD0IgiCAGIA5+fCANQiCIfIUgAkEYaikDACADfUEAKQOYjAEiC4UiBkL/////D4MiDSACKQMQIAN8QQApA5CMASIOhSIPQiCIIhB+IhFC/////w+DIAZCIIgiBiAPQv////8PgyIPfnwgDSAPfiINQiCIfCIPQiCGIA1C/////w+DhCARQiCIIAYgEH58IA9CIIh8hUEAKQOIjAEiDUEAKQOAjAEiD3yFfEEAKQOojAEiEEEAKQOgjAEiEXyFfEEAKQPIjAEiEkEAKQPAjAEiE3yFfEEAKQPojAEiFEEAKQPgjAEiFXyFIgZCJYggBoVC+fPd8ZnymasWfiIGQiCIIAaFIQYgAkHoAGopAwAgA30gFIUiFEL/////D4MiFiACKQNgIAN8IBWFIhVCIIgiF34iGEL/////D4MgFEIgiCIUIBVC/////w+DIhV+fCAWIBV+IhVCIIh8IhZCIIYgFUL/////D4OEIBhCIIggFCAXfnwgFkIgiHyFIAJByABqKQMAIAN9IBKFIhJC/////w+DIhQgAikDQCADfCAThSITQiCIIhV+IhZC/////w+DIBJCIIgiEiATQv////8PgyITfnwgFCATfiITQiCIfCIUQiCGIBNC/////w+DhCAWQiCIIBIgFX58IBRCIIh8hSACQShqKQMAIAN9IBCFIhBC/////w+DIhIgAikDICADfCARhSIRQiCIIhN+IhRC/////w+DIBBCIIgiECARQv////8PgyIRfnwgEiARfiIRQiCIfCISQiCGIBFC/////w+DhCAUQiCIIBAgE358IBJCIIh8hSACQQhqKQMAIAN9IA2FIg1C/////w+DIhAgAikDACADfCAPhSIPQiCIIhF+IhJC/////w+DIA1CIIgiDSAPQv////8PgyIPfnwgECAPfiIPQiCIfCIQQiCGIA9C/////w+DhCASQiCIIA0gEX58IBBCIIh8hSABrSIPQoeVr6+Ytt6bnn9+fCALIA58hXwgCSAMfIV8IAcgCnyFfCAFIAh8hSIFQiWIIAWFQvnz3fGZ8pmrFn4iBUIgiCAFhSEFAkAgAUGgAUgNACABQQV2QXxqIRkDQCACIARqIhpBG2opAwAgA30gBEGYjQFqKQMAIgeFIghC/////w+DIgkgGkETaikDACADfCAEQZCNAWopAwAiCoUiC0IgiCIMfiINQv////8PgyAIQiCIIgggC0L/////D4MiC358IAkgC34iCUIgiHwiC0IghiAJQv////8Pg4QgDUIgiCAIIAx+fCALQiCIfIUgBnwgBEGIjQFqKQMAIgggBEGAjQFqKQMAIgl8hSEGIBpBC2opAwAgA30gCIUiCEL/////D4MiCyAaQQNqKQMAIAN8IAmFIglCIIgiDH4iDUL/////D4MgCEIgiCIIIAlC/////w+DIgl+fCALIAl+IglCIIh8IgtCIIYgCUL/////D4OEIA1CIIggCCAMfnwgC0IgiHyFIAV8IAcgCnyFIQUgBEEgaiEEIBlBf2oiGQ0ACwsgACACQf8AaikDACADfCABQeiLAWopAwAiB4UiCEL/////D4MiCSACKQN3IAN9IAFB4IsBaikDACIKhSILQiCIIgx+Ig1C/////w+DIAhCIIgiCCALQv////8PgyILfnwgCSALfiIJQiCIfCILQiCGIAlC/////w+DhCANQiCIIAggDH58IAtCIIh8hSAGfCABQfiLAWopAwAiBiABQfCLAWopAwAiCHyFIgkgAkHvAGopAwAgA3wgBoUiBkL/////D4MiCyACKQNnIAN9IAiFIghCIIgiDH4iDUL/////D4MgBkIgiCIGIAhC/////w+DIgh+fCALIAh+IghCIIh8IgtCIIYgCEL/////D4OEIA1CIIggBiAMfnwgC0IgiHyFIAV8IAcgCnyFIgZ8IgVCJYggBYVC+fPd8ZnymasWfiIFQiCIIAWFNwMAIABCACAGQoeVr6+Ytt6bnn9+IA8gA31Cz9bTvtLHq9lCfnwgCULj3MqV/M7y9YV/fnwiA0IliCADhUL5893xmfKZqxZ+IgNCIIggA4V9NwMIC98FAgF+AX8CQAJAQQApA4AKIgBQRQ0AQYAIIQFCACEADAELAkBBACkDoI4BIABSDQBBACEBDAELQQAhAUEAQq+v79e895Kg/gAgAH03A/iLAUEAIABCxZbr+djShYIofDcD8IsBQQBCj/Hjja2P9JhOIAB9NwPoiwFBACAAQqus+MXV79HQfHw3A+CLAUEAQtOt1LKShbW0nn8gAH03A9iLAUEAIABCl5r0jvWWvO3JAHw3A9CLAUEAQsWDgv2v/8SxayAAfTcDyIsBQQAgAELqi7OdyOb09UN8NwPAiwFBAELIv/rLnJveueQAIAB9NwO4iwFBACAAQoqjgd/Ume2sMXw3A7CLAUEAQvm57738+MKnHSAAfTcDqIsBQQAgAEKo9dv7s5ynmj98NwOgiwFBAEK4sry3lNW31lggAH03A5iLAUEAIABC8cihuqm0w/zOAHw3A5CLAUEAQoihl9u445SXo38gAH03A4iL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AkHAAGogDGohC0GAjAEhAAJAAkACQCAHQQhJDQACQCAHQThqQQN2QQFqQQdxIg0NAAwCCyANQQN0IQ5BgIwBIQADQCALIAApAwA3AwAgC0EIaiELIABBCGohACANQX9qIg0NAAsgByAOayEHCyAHRQ0BAkACQCAHQQdxIg4NACAHIQ0MAQsgB0F4cSENA0AgCyAALQAAOgAAIAtBAWohCyAAQQFqIQAgDkF/aiIODQALCyAHQQhJDQELA0AgCyAAKQAANwAAIAtBCGohCyAAQQhqIQAgDUF4aiINDQALCyACIAIpAwggAikDQCIIfCADQQAoApyOAWoiACkDASACKQNIIgmFIgpCIIggCkL/////D4N+fDcDCCACIAIpAxggAikDUCIKfCAAKQMRIAIpA1giEIUiEUIgiCARQv////8Pg358NwMYIAIgECAKIAApAwmFIgpCIIggCkL/////D4N+IAIpAxB8fDcDECACIAkgCCAAQXlqKQMAhSIIQiCIIAhC/////w+DfiACKQMAfHw3AwAgACkDGSEIIAIpAyAhCSACIAIpAyggAikDYCIKfCAAKQMhIAIpA2giEIUiEUIgiCARQv////8Pg358NwMoIAIgECAJIAggCoUiCEIgiCAIQv////8Pg358fDcDICACIAYgAikDcCIIfCAAKQMxIAIpA3giBoUiCUIgiCAJQv////8Pg358NwM4IAIgBiAIIAApAymFIghCIIggCEL/////D4N+IAV8fDcDMAsgAiACIANBC2ogBEKHla+vmLbem55/fhADNwNAIAIgAiADQQAoApyOAWpBdWogBELP1tO+0ser2UJ+Qn+FEAM3A0gMAQsgBKchAAJAQQApA6COASIEUA0AAkAgAEEQSw0AIAJBwABqIABBgAggBBAEDAILAkAgAEGAAUsNACACQcAAaiAAQYAIIAQQBQwCCyACQcAAaiAAQYAIIAQQBgwBCwJAIABBEEsNACACQcAAaiAAIANCABAEDAELAkAgAEGAAUsNACACQcAAaiAAIANCABAFDAELIAJBwABqIAAgA0IAEAYLQQAgAikDcDcDuApBACACKQNgNwOoCkEAIAIpA1A3A5gKQQAgAkH4AGopAwA3A8AKQQAgAkHoAGopAwA3A7AKQQAgAkHYAGopAwA3A6AKQQAgAikDSCIEQjiGIARCgP4Dg0IohoQgBEKAgPwHg0IYhiAEQoCAgPgPg0IIhoSEIARCCIhCgICA+A+DIARCGIhCgID8B4OEIARCKIhCgP4DgyAEQjiIhISEIgQ3A4AKQQAgBDcDkApBACACKQNAIgRCOIYgBEKA/gODQiiGhCAEQoCA/AeDQhiGIARCgICA+A+DQgiGhIQgBEIIiEKAgID4D4MgBEIYiEKAgPwHg4QgBEIoiEKA/gODIARCOIiEhIQ3A4gKIAEkAAsGAEGAigELAgALC8wBAQBBgAgLxAG4/mw5I6RLvnwBgSz3Ia0c3tRt6YOQl9tyQKSkt7NnH8t55k7MwOV4glrQfcz/ciG4CEZ090MkjuA1kOaBOiZMPChSu5HDAMuI0GWLG1Muo3FkSJeiDflOOBnvRqnerNio+nY/45w0P/ncu8fHC08dilHgS820WTHIn37J2XhzZOrFrIM00+vDxYGg//oTY+sXDd1Rt/DaSdMWVSYp1GieKxa+WH1HofyP+LjRetAxzkXLOo+VFgQor9f7yrtLQH5AAgAA";
      var hash$5 = "b9ab74e2";
      var wasmJson$5 = {
        name: name$5,
        data: data$5,
        hash: hash$5
      };
      const mutex$3 = new Mutex();
      let wasmCache$3 = null;
      const seedBuffer = new Uint8Array(8);
      function validateSeed(seed) {
        if (!Number.isInteger(seed) || seed < 0 || seed > 4294967295) {
          return new Error("Seed must be given as two valid 32-bit long unsigned integers (lo + high).");
        }
        return null;
      }
      function writeSeed(arr, low, high) {
        const buffer = new DataView(arr);
        buffer.setUint32(0, low, true);
        buffer.setUint32(4, high, true);
      }
      function xxhash128(data2, seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
          return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
          return Promise.reject(validateSeed(seedHigh));
        }
        if (wasmCache$3 === null) {
          return lockedCreate(mutex$3, wasmJson$5, 16).then((wasm) => {
            wasmCache$3 = wasm;
            writeSeed(seedBuffer.buffer, seedLow, seedHigh);
            wasmCache$3.writeMemory(seedBuffer);
            return wasmCache$3.calculate(data2);
          });
        }
        try {
          writeSeed(seedBuffer.buffer, seedLow, seedHigh);
          wasmCache$3.writeMemory(seedBuffer);
          const hash2 = wasmCache$3.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createXXHash128(seedLow = 0, seedHigh = 0) {
        if (validateSeed(seedLow)) {
          return Promise.reject(validateSeed(seedLow));
        }
        if (validateSeed(seedHigh)) {
          return Promise.reject(validateSeed(seedHigh));
        }
        return WASMInterface(wasmJson$5, 16).then((wasm) => {
          const instanceBuffer = new Uint8Array(8);
          writeSeed(instanceBuffer.buffer, seedLow, seedHigh);
          wasm.writeMemory(instanceBuffer);
          wasm.init();
          const obj = {
            init: () => {
              wasm.writeMemory(instanceBuffer);
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 512,
            digestSize: 16
          };
          return obj;
        });
      }
      var name$4 = "ripemd160";
      var data$4 = "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";
      var hash$4 = "6abbce74";
      var wasmJson$4 = {
        name: name$4,
        data: data$4,
        hash: hash$4
      };
      const mutex$2 = new Mutex();
      let wasmCache$2 = null;
      function ripemd160(data2) {
        if (wasmCache$2 === null) {
          return lockedCreate(mutex$2, wasmJson$4, 20).then((wasm) => {
            wasmCache$2 = wasm;
            return wasmCache$2.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$2.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createRIPEMD160() {
        return WASMInterface(wasmJson$4, 20).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 20
          };
          return obj;
        });
      }
      function calculateKeyBuffer(hasher, key) {
        const { blockSize } = hasher;
        const buf = getUInt8Buffer(key);
        if (buf.length > blockSize) {
          hasher.update(buf);
          const uintArr = hasher.digest("binary");
          hasher.init();
          return uintArr;
        }
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
      }
      function calculateHmac(hasher, key) {
        hasher.init();
        const { blockSize } = hasher;
        const keyBuf = calculateKeyBuffer(hasher, key);
        const keyBuffer = new Uint8Array(blockSize);
        keyBuffer.set(keyBuf);
        const opad = new Uint8Array(blockSize);
        for (let i = 0; i < blockSize; i++) {
          const v = keyBuffer[i];
          opad[i] = v ^ 92;
          keyBuffer[i] = v ^ 54;
        }
        hasher.update(keyBuffer);
        const obj = {
          init: () => {
            hasher.init();
            hasher.update(keyBuffer);
            return obj;
          },
          update: (data2) => {
            hasher.update(data2);
            return obj;
          },
          digest: ((outputType) => {
            const uintArr = hasher.digest("binary");
            hasher.init();
            hasher.update(opad);
            hasher.update(uintArr);
            return hasher.digest(outputType);
          }),
          save: () => {
            throw new Error("save() not supported");
          },
          load: () => {
            throw new Error("load() not supported");
          },
          blockSize: hasher.blockSize,
          digestSize: hasher.digestSize
        };
        return obj;
      }
      function createHMAC(hash2, key) {
        if (!hash2 || !hash2.then) {
          throw new Error('Invalid hash function is provided! Usage: createHMAC(createMD5(), "key").');
        }
        return hash2.then((hasher) => calculateHmac(hasher, key));
      }
      function calculatePBKDF2(digest, salt, iterations, hashLength, outputType) {
        return __awaiter(this, void 0, void 0, function* () {
          const DK = new Uint8Array(hashLength);
          const block1 = new Uint8Array(salt.length + 4);
          const block1View = new DataView(block1.buffer);
          const saltBuffer = getUInt8Buffer(salt);
          const saltUIntBuffer = new Uint8Array(saltBuffer.buffer, saltBuffer.byteOffset, saltBuffer.length);
          block1.set(saltUIntBuffer);
          let destPos = 0;
          const hLen = digest.digestSize;
          const l = Math.ceil(hashLength / hLen);
          let T = null;
          let U = null;
          for (let i = 1; i <= l; i++) {
            block1View.setUint32(salt.length, i);
            digest.init();
            digest.update(block1);
            T = digest.digest("binary");
            U = T.slice();
            for (let j = 1; j < iterations; j++) {
              digest.init();
              digest.update(U);
              U = digest.digest("binary");
              for (let k = 0; k < hLen; k++) {
                T[k] ^= U[k];
              }
            }
            DK.set(T.subarray(0, hashLength - destPos), destPos);
            destPos += hLen;
          }
          if (outputType === "binary") {
            return DK;
          }
          const digestChars = new Uint8Array(hashLength * 2);
          return getDigestHex(digestChars, DK, hashLength);
        });
      }
      const validateOptions$2 = (options) => {
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (!options.hashFunction || !options.hashFunction.then) {
          throw new Error('Invalid hash function is provided! Usage: pbkdf2("password", "salt", 1000, 32, createSHA1()).');
        }
        if (!Number.isInteger(options.iterations) || options.iterations < 1) {
          throw new Error("Iterations should be a positive number");
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
          throw new Error("Hash length should be a positive number");
        }
        if (options.outputType === void 0) {
          options.outputType = "hex";
        }
        if (!["hex", "binary"].includes(options.outputType)) {
          throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
      };
      function pbkdf2(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions$2(options);
          const hmac = yield createHMAC(options.hashFunction, options.password);
          return calculatePBKDF2(hmac, options.salt, options.iterations, options.hashLength, options.outputType);
        });
      }
      var name$3 = "scrypt";
      var data$3 = "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cyICajYCOCAAIAAoAjwgAiAKakESdyAGc2o2AjwLvxIDFX8Bfg5/AkAgAkUNACAAQQd0IgNBQGoiBEEAKAKACCIFIAMgAmwiBmogAyABbGoiByADaiIIaiEJIAAgAkEHdCIKIAFBB3RqIgtsIQwgACALQYABamwhDSAAQQV0IgtBASALQQFLGyILQWBxIQ4gC0EBcSEPIAdBeGohECAHQXBqIREgB0FoaiESIAdBYGohEyAHQVhqIRQgB0FQaiEVIAdBSGohFiAHQUBqIRcgAa1Cf3whGCAEIAdqIRkgByAAQQh0IhpqIRsgACAKQYABamwhHCALQQRJIR1BACEeQQAhHwNAQQAoAoAIIiAgAyAfbGohIQJAIABFDQBBACEiAkAgHQ0AICAgHmohI0EAIQtBACEiA0AgByALaiIEICMgC2oiJCgCADYCACAEQQRqICRBBGooAgA2AgAgBEEIaiAkQQhqKAIANgIAIARBDGogJEEMaigCADYCACALQRBqIQsgDiAiQQRqIiJHDQALCyAPRQ0AIAcgIkECdCILaiAhIAtqKAIANgIACwJAIAFFDQBBACElIBwhIyAGISYDQCAFISQgACEiAkACQCAADQAgGyAXKQMANwMAIBsgFikDADcDCCAbIBUpAwA3AxAgGyAUKQMANwMYIBsgEykDADcDICAbIBIpAwA3AyggGyARKQMANwMwIBsgECkDADcDOAwBCwNAICQgJmoiCyAkIAxqIgQpAwA3AwAgC0EIaiAEQQhqKQMANwMAIAtBEGogBEEQaikDADcDACALQRhqIARBGGopAwA3AwAgC0EgaiAEQSBqKQMANwMAIAtBKGogBEEoaikDADcDACALQTBqIARBMGopAwA3AwAgC0E4aiAEQThqKQMANwMAIAtBwABqIARBwABqKQMANwMAIAtByABqIARByABqKQMANwMAIAtB0ABqIARB0ABqKQMANwMAIAtB2ABqIARB2ABqKQMANwMAIAtB4ABqIARB4ABqKQMANwMAIAtB6ABqIARB6ABqKQMANwMAIAtB8ABqIARB8ABqKQMANwMAIAtB+ABqIARB+ABqKQMANwMAICRBgAFqISQgIkF/aiIiDQALIAcgCCAbIAAQAiAFISQgACEiA0AgJCAjaiILICQgDWoiBCkDADcDACALQQhqIARBCGopAwA3AwAgC0EQaiAEQRBqKQMANwMAIAtBGGogBEEYaikDADcDACALQSBqIARBIGopAwA3AwAgC0EoaiAEQShqKQMANwMAIAtBMGogBEEwaikDADcDACALQThqIARBOGopAwA3AwAgC0HAAGogBEHAAGopAwA3AwAgC0HIAGogBEHIAGopAwA3AwAgC0HQAGogBEHQAGopAwA3AwAgC0HYAGogBEHYAGopAwA3AwAgC0HgAGogBEHgAGopAwA3AwAgC0HoAGogBEHoAGopAwA3AwAgC0HwAGogBEHwAGopAwA3AwAgC0H4AGogBEH4AGopAwA3AwAgJEGAAWohJCAiQX9qIiINAAsLIAggByAbIAAQAiAjIBpqISMgJiAaaiEmICVBAmoiJSABSQ0AC0EAISUDQAJAAkAgAA0AIBsgFykDADcDACAbIBYpAwA3AwggGyAVKQMANwMQIBsgFCkDADcDGCAbIBMpAwA3AyAgGyASKQMANwMoIBsgESkDADcDMCAbIBApAwA3AzgMAQsgACAKIBkpAgAgGIOnQQd0amwhJiAFISQgACEiA0AgJCAMaiILIAspAwAgJCAmaiIEKQMAhTcDACALQQhqIiMgIykDACAEQQhqKQMAhTcDACALQRBqIiMgIykDACAEQRBqKQMAhTcDACALQRhqIiMgIykDACAEQRhqKQMAhTcDACALQSBqIiMgIykDACAEQSBqKQMAhTcDACALQShqIiMgIykDACAEQShqKQMAhTcDACALQTBqIiMgIykDACAEQTBqKQMAhTcDACALQThqIiMgIykDACAEQThqKQMAhTcDACALQcAAaiIjICMpAwAgBEHAAGopAwCFNwMAIAtByABqIiMgIykDACAEQcgAaikDAIU3AwAgC0HQAGoiIyAjKQMAIARB0ABqKQMAhTcDACALQdgAaiIjICMpAwAgBEHYAGopAwCFNwMAIAtB4ABqIiMgIykDACAEQeAAaikDAIU3AwAgC0HoAGoiIyAjKQMAIARB6ABqKQMAhTcDACALQfAAaiIjICMpAwAgBEHwAGopAwCFNwMAIAtB+ABqIgsgCykDACAEQfgAaikDAIU3AwAgJEGAAWohJCAiQX9qIiINAAsgByAIIBsgABACIAAgCiAJKQIAIBiDp0EHdGpsISYgBSEkIAAhIgNAICQgDWoiCyALKQMAICQgJmoiBCkDAIU3AwAgC0EIaiIjICMpAwAgBEEIaikDAIU3AwAgC0EQaiIjICMpAwAgBEEQaikDAIU3AwAgC0EYaiIjICMpAwAgBEEYaikDAIU3AwAgC0EgaiIjICMpAwAgBEEgaikDAIU3AwAgC0EoaiIjICMpAwAgBEEoaikDAIU3AwAgC0EwaiIjICMpAwAgBEEwaikDAIU3AwAgC0E4aiIjICMpAwAgBEE4aikDAIU3AwAgC0HAAGoiIyAjKQMAIARBwABqKQMAhTcDACALQcgAaiIjICMpAwAgBEHIAGopAwCFNwMAIAtB0ABqIiMgIykDACAEQdAAaikDAIU3AwAgC0HYAGoiIyAjKQMAIARB2ABqKQMAhTcDACALQeAAaiIjICMpAwAgBEHgAGopAwCFNwMAIAtB6ABqIiMgIykDACAEQegAaikDAIU3AwAgC0HwAGoiIyAjKQMAIARB8ABqKQMAhTcDACALQfgAaiILIAspAwAgBEH4AGopAwCFNwMAICRBgAFqISQgIkF/aiIiDQALCyAIIAcgGyAAEAIgJUECaiIlIAFJDQALCwJAIABFDQBBACEiAkAgHQ0AICAgHmohI0EAIQtBACEiA0AgIyALaiIEIAcgC2oiJCgCADYCACAEQQRqICRBBGooAgA2AgAgBEEIaiAkQQhqKAIANgIAIARBDGogJEEMaigCADYCACALQRBqIQsgDiAiQQRqIiJHDQALCyAPRQ0AICEgIkECdCILaiAHIAtqKAIANgIACyAeIANqIR4gH0EBaiIfIAJHDQALCws=";
      var hash$3 = "b32721f8";
      var wasmJson$3 = {
        name: name$3,
        data: data$3,
        hash: hash$3
      };
      function scryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
          const { costFactor, blockSize, parallelism, hashLength } = options;
          const SHA256Hasher = createSHA256();
          const blockData = yield pbkdf2({
            password: options.password,
            salt: options.salt,
            iterations: 1,
            hashLength: 128 * blockSize * parallelism,
            hashFunction: SHA256Hasher,
            outputType: "binary"
          });
          const scryptInterface = yield WASMInterface(wasmJson$3, 0);
          const VSize = 128 * blockSize * costFactor;
          const XYSize = 256 * blockSize;
          scryptInterface.setMemorySize(blockData.length + VSize + XYSize);
          scryptInterface.writeMemory(blockData, 0);
          scryptInterface.getExports().scrypt(blockSize, costFactor, parallelism);
          const expensiveSalt = scryptInterface.getMemory().subarray(0, 128 * blockSize * parallelism);
          const outputData = yield pbkdf2({
            password: options.password,
            salt: expensiveSalt,
            iterations: 1,
            hashLength,
            hashFunction: SHA256Hasher,
            outputType: "binary"
          });
          if (options.outputType === "hex") {
            const digestChars = new Uint8Array(hashLength * 2);
            return getDigestHex(digestChars, outputData, hashLength);
          }
          return outputData;
        });
      }
      const isPowerOfTwo = (v) => v && !(v & v - 1);
      const validateOptions$1 = (options) => {
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (!Number.isInteger(options.blockSize) || options.blockSize < 1) {
          throw new Error("Block size should be a positive number");
        }
        if (!Number.isInteger(options.costFactor) || options.costFactor < 2 || !isPowerOfTwo(options.costFactor)) {
          throw new Error("Cost factor should be a power of 2, greater than 1");
        }
        if (!Number.isInteger(options.parallelism) || options.parallelism < 1) {
          throw new Error("Parallelism should be a positive number");
        }
        if (!Number.isInteger(options.hashLength) || options.hashLength < 1) {
          throw new Error("Hash length should be a positive number.");
        }
        if (options.outputType === void 0) {
          options.outputType = "hex";
        }
        if (!["hex", "binary"].includes(options.outputType)) {
          throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary']`);
        }
      };
      function scrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions$1(options);
          return scryptInternal(options);
        });
      }
      var name$2 = "bcrypt";
      var data$2 = "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";
      var hash$2 = "8bd8822d";
      var wasmJson$2 = {
        name: name$2,
        data: data$2,
        hash: hash$2
      };
      function bcryptInternal(options) {
        return __awaiter(this, void 0, void 0, function* () {
          const { costFactor, password, salt } = options;
          const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
          bcryptInterface.writeMemory(getUInt8Buffer(salt), 0);
          const passwordBuffer = getUInt8Buffer(password);
          bcryptInterface.writeMemory(passwordBuffer, 16);
          const shouldEncode = options.outputType === "encoded" ? 1 : 0;
          bcryptInterface.getExports().bcrypt(passwordBuffer.length, costFactor, shouldEncode);
          const memory = bcryptInterface.getMemory();
          if (options.outputType === "encoded") {
            return intArrayToString(memory, 60);
          }
          if (options.outputType === "hex") {
            const digestChars = new Uint8Array(24 * 2);
            return getDigestHex(digestChars, memory, 24);
          }
          return memory.slice(0, 24);
        });
      }
      const validateOptions = (options) => {
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (!Number.isInteger(options.costFactor) || options.costFactor < 4 || options.costFactor > 31) {
          throw new Error("Cost factor should be a number between 4 and 31");
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
          throw new Error("Password should be at least 1 byte long");
        }
        if (options.password.length > 72) {
          throw new Error("Password should be at most 72 bytes long");
        }
        options.salt = getUInt8Buffer(options.salt);
        if (options.salt.length !== 16) {
          throw new Error("Salt should be 16 bytes long");
        }
        if (options.outputType === void 0) {
          options.outputType = "encoded";
        }
        if (!["hex", "binary", "encoded"].includes(options.outputType)) {
          throw new Error(`Insupported output type ${options.outputType}. Valid values: ['hex', 'binary', 'encoded']`);
        }
      };
      function bcrypt(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateOptions(options);
          return bcryptInternal(options);
        });
      }
      const validateHashCharacters = (hash2) => {
        if (!/^\$2[axyb]\$[0-3][0-9]\$[./A-Za-z0-9]{53}$/.test(hash2)) {
          return false;
        }
        if (hash2[4] === "0" && Number(hash2[5]) < 4) {
          return false;
        }
        if (hash2[4] === "3" && Number(hash2[5]) > 1) {
          return false;
        }
        return true;
      };
      const validateVerifyOptions = (options) => {
        if (!options || typeof options !== "object") {
          throw new Error("Invalid options parameter. It requires an object.");
        }
        if (options.hash === void 0 || typeof options.hash !== "string") {
          throw new Error("Hash should be specified");
        }
        if (options.hash.length !== 60) {
          throw new Error("Hash should be 60 bytes long");
        }
        if (!validateHashCharacters(options.hash)) {
          throw new Error("Invalid hash");
        }
        options.password = getUInt8Buffer(options.password);
        if (options.password.length < 1) {
          throw new Error("Password should be at least 1 byte long");
        }
        if (options.password.length > 72) {
          throw new Error("Password should be at most 72 bytes long");
        }
      };
      function bcryptVerify(options) {
        return __awaiter(this, void 0, void 0, function* () {
          validateVerifyOptions(options);
          const { hash: hash2, password } = options;
          const bcryptInterface = yield WASMInterface(wasmJson$2, 0);
          bcryptInterface.writeMemory(getUInt8Buffer(hash2), 0);
          const passwordBuffer = getUInt8Buffer(password);
          bcryptInterface.writeMemory(passwordBuffer, 60);
          return !!bcryptInterface.getExports().bcrypt_verify(passwordBuffer.length);
        });
      }
      var name$1 = "whirlpool";
      var data$1 = "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";
      var hash$1 = "8d8f6035";
      var wasmJson$1 = {
        name: name$1,
        data: data$1,
        hash: hash$1
      };
      const mutex$1 = new Mutex();
      let wasmCache$1 = null;
      function whirlpool(data2) {
        if (wasmCache$1 === null) {
          return lockedCreate(mutex$1, wasmJson$1, 64).then((wasm) => {
            wasmCache$1 = wasm;
            return wasmCache$1.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache$1.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createWhirlpool() {
        return WASMInterface(wasmJson$1, 64).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 64
          };
          return obj;
        });
      }
      var name = "sm3";
      var data = "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";
      var hash = "b6fb4b8e";
      var wasmJson = {
        name,
        data,
        hash
      };
      const mutex = new Mutex();
      let wasmCache = null;
      function sm3(data2) {
        if (wasmCache === null) {
          return lockedCreate(mutex, wasmJson, 32).then((wasm) => {
            wasmCache = wasm;
            return wasmCache.calculate(data2);
          });
        }
        try {
          const hash2 = wasmCache.calculate(data2);
          return Promise.resolve(hash2);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      function createSM3() {
        return WASMInterface(wasmJson, 32).then((wasm) => {
          wasm.init();
          const obj = {
            init: () => {
              wasm.init();
              return obj;
            },
            update: (data2) => {
              wasm.update(data2);
              return obj;
            },
            // biome-ignore lint/suspicious/noExplicitAny: Conflict with IHasher type
            digest: (outputType) => wasm.digest(outputType),
            save: () => wasm.save(),
            load: (data2) => {
              wasm.load(data2);
              return obj;
            },
            blockSize: 64,
            digestSize: 32
          };
          return obj;
        });
      }
      exports2.adler32 = adler32;
      exports2.argon2Verify = argon2Verify2;
      exports2.argon2d = argon2d;
      exports2.argon2i = argon2i;
      exports2.argon2id = argon2id2;
      exports2.bcrypt = bcrypt;
      exports2.bcryptVerify = bcryptVerify;
      exports2.blake2b = blake2b;
      exports2.blake2s = blake2s;
      exports2.blake3 = blake3;
      exports2.crc32 = crc32;
      exports2.crc64 = crc64;
      exports2.createAdler32 = createAdler32;
      exports2.createBLAKE2b = createBLAKE2b;
      exports2.createBLAKE2s = createBLAKE2s;
      exports2.createBLAKE3 = createBLAKE3;
      exports2.createCRC32 = createCRC32;
      exports2.createCRC64 = createCRC64;
      exports2.createHMAC = createHMAC;
      exports2.createKeccak = createKeccak;
      exports2.createMD4 = createMD4;
      exports2.createMD5 = createMD5;
      exports2.createRIPEMD160 = createRIPEMD160;
      exports2.createSHA1 = createSHA1;
      exports2.createSHA224 = createSHA224;
      exports2.createSHA256 = createSHA256;
      exports2.createSHA3 = createSHA3;
      exports2.createSHA384 = createSHA384;
      exports2.createSHA512 = createSHA512;
      exports2.createSM3 = createSM3;
      exports2.createWhirlpool = createWhirlpool;
      exports2.createXXHash128 = createXXHash128;
      exports2.createXXHash3 = createXXHash3;
      exports2.createXXHash32 = createXXHash32;
      exports2.createXXHash64 = createXXHash64;
      exports2.keccak = keccak;
      exports2.md4 = md4;
      exports2.md5 = md5;
      exports2.pbkdf2 = pbkdf2;
      exports2.ripemd160 = ripemd160;
      exports2.scrypt = scrypt;
      exports2.sha1 = sha1;
      exports2.sha224 = sha224;
      exports2.sha256 = sha256;
      exports2.sha3 = sha3;
      exports2.sha384 = sha384;
      exports2.sha512 = sha512;
      exports2.sm3 = sm3;
      exports2.whirlpool = whirlpool;
      exports2.xxhash128 = xxhash128;
      exports2.xxhash3 = xxhash3;
      exports2.xxhash32 = xxhash32;
      exports2.xxhash64 = xxhash64;
    }));
  }
});

// ../backend/src/services/auth-hash-service.ts
var import_hash_wasm, HashService, auth_hash_service_default;
var init_auth_hash_service = __esm({
  "../backend/src/services/auth-hash-service.ts"() {
    "use strict";
    import_hash_wasm = __toESM(require_index_umd());
    HashService = class {
      async hash(password) {
        return (0, import_hash_wasm.argon2id)({
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
          return await (0, import_hash_wasm.argon2Verify)({ password, hash: stored });
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
var HTTP_STATUS2 = {
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
function success2(data, context) {
  return {
    statusCode: HTTP_STATUS2.OK,
    body: {
      success: true,
      data,
      meta: createMeta(context)
    }
  };
}
function created2(data, context) {
  return {
    statusCode: HTTP_STATUS2.CREATED,
    body: {
      success: true,
      data,
      meta: createMeta(context)
    }
  };
}
function noContent2(context) {
  return {
    statusCode: HTTP_STATUS2.NO_CONTENT,
    body: {
      success: true,
      data: null,
      meta: createMeta(context)
    }
  };
}
function unauthorized2(message, context) {
  return errorResponse("unauthorized", message, HTTP_STATUS2.UNAUTHORIZED, context);
}
function forbidden(message, context) {
  return errorResponse("forbidden", message, HTTP_STATUS2.FORBIDDEN, context);
}
function notFound2(message, context) {
  return errorResponse("not_found", message, HTTP_STATUS2.NOT_FOUND, context);
}
function conflict(message, context) {
  return errorResponse("conflict", message, HTTP_STATUS2.CONFLICT, context);
}
function validationError2(message, context) {
  return errorResponse("validation_error", message, HTTP_STATUS2.UNPROCESSABLE_ENTITY, context);
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
function paginated2(data, page, limit, total, context) {
  return {
    statusCode: HTTP_STATUS2.OK,
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
  async record(userId, email, ip, ua, success3, reason) {
    return this.client.loginHistory.create({ data: { userId, email, ipAddress: ip, userAgent: ua, success: success3, reason } });
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
  async recordLoginAttempt(userId, email, ip, ua, success3 = false, reason) {
    await this.loginRepo.record(userId, email, ip, ua, success3, reason);
  }
  async lockAccount(userId, reason = "too_many_failed_logins") {
    const meta = JSON.stringify({ type: "account_lock", reason, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
    await this.client.securityLog.create({ data: { userId, event: "account_locked", severity: "WARN", meta } });
  }
  async isAccountLocked(userId) {
    const rec = await this.client.securityLog.findFirst({ where: { userId, event: "account_locked" }, orderBy: { createdAt: "desc" } });
    if (!rec) return false;
    const ttl = Number(process.env.ACCOUNT_LOCK_TTL_MINUTES ?? 30);
    const created3 = rec.createdAt;
    if (!created3) return true;
    const unlockedAt = new Date(created3.getTime() + ttl * 60 * 1e3);
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
      return this.errorResponse("bad_request", "identifier_and_password_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.signIn(body.identifier, body.password, body.deviceId, this.requestMeta(request4));
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async refresh(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.refresh(body.refreshToken, this.requestMeta(request4));
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async signOut(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request4));
      return success2(null, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Logout endpoint — invalidates refresh token and session and returns HTTP 204 No Content
  async logout(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.refreshToken !== "string" || !body.refreshToken) {
      return this.errorResponse("bad_request", "refresh_token_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      await this.authService.signOut(body.refreshToken, this.requestMeta(request4));
      return noContent2(ctx);
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
      return this.errorResponse("unauthorized", "access_token_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    try {
      const result = await this.authService.validateAccessToken(token);
      return success2({ valid: result.valid }, ctx);
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
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS2.UNAUTHORIZED, ctx);
      const result = await this.authService.getCurrentUser(userId);
      if (!result) return this.errorResponse("not_found", "user_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Public Customer Registration
  async signUp(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.email !== "string" || typeof body.password !== "string") {
      return this.errorResponse("bad_request", "email_and_password_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const result = await this.authService.signUp({
        name: String(body.name ?? body.displayName ?? body.email),
        email: String(body.email),
        password: String(body.password),
        confirmPassword: body.confirmPassword ? String(body.confirmPassword) : void 0,
        phone: body.phone ? String(body.phone) : void 0
      });
      return success2(result, ctx);
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
      return this.errorResponse("bad_request", "current_and_new_password_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS2.UNAUTHORIZED, ctx);
      await this.authService.changePassword(userId, String(body.currentPassword), String(body.newPassword), body.confirmPassword ? String(body.confirmPassword) : void 0);
      return success2({ message: "password_changed_successfully" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Forgot Password — Request reset link
  async forgotPassword(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.email !== "string" || !body.email) {
      return this.errorResponse("bad_request", "email_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const { default: resetService } = await Promise.resolve().then(() => (init_auth_reset_service(), auth_reset_service_exports));
      await resetService.generateResetTokenByEmail(String(body.email));
      return success2({ message: "If the email exists, a password reset token has been generated." }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Reset Password — Submit reset token & new password
  async resetPassword(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.token !== "string" || typeof body.newPassword !== "string") {
      return this.errorResponse("bad_request", "token_and_new_password_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const { default: resetService } = await Promise.resolve().then(() => (init_auth_reset_service(), auth_reset_service_exports));
      await resetService.resetPassword(String(body.token), String(body.newPassword));
      return success2({ message: "password_reset_successfully" }, ctx);
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
      return this.errorResponse("bad_request", "body_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const payload = await guardRequireAuth(authorization);
      const userId = payload?.sub;
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS2.UNAUTHORIZED, ctx);
      const result = await this.authService.updateProfile(userId, {
        name: body.name ? String(body.name) : void 0,
        displayName: body.displayName ? String(body.displayName) : void 0,
        phone: body.phone ? String(body.phone) : void 0
      });
      return success2(result, ctx);
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
      if (!userId) return this.errorResponse("unauthorized", "missing_sub", HTTP_STATUS2.UNAUTHORIZED, ctx);
      const { default: emailVerificationService } = await Promise.resolve().then(() => (init_auth_email_verification_service(), auth_email_verification_service_exports));
      await emailVerificationService.generateVerificationToken(userId);
      return success2({ message: "verification_token_sent" }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  // Email Verification: Verify token
  async verifyEmail(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!this.isObject(body) || typeof body.token !== "string" || !body.token) {
      return this.errorResponse("bad_request", "token_required", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    try {
      const { default: emailVerificationService } = await Promise.resolve().then(() => (init_auth_email_verification_service(), auth_email_verification_service_exports));
      const ok = await emailVerificationService.activateAccount(String(body.token));
      if (!ok) return this.errorResponse("bad_request", "invalid_or_expired_token", HTTP_STATUS2.BAD_REQUEST, ctx);
      return success2({ message: "email_verified_successfully" }, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    if (error instanceof InvalidTokenError) {
      return this.errorResponse("unauthorized", error.message || "invalid_token", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    if (error instanceof AccountLockedError) {
      return this.errorResponse("account_locked", error.message || "account_locked", 423, ctx);
    }
    if (error instanceof RateLimitError) {
      return this.errorResponse("rate_limited", error.message || "rate_limited", 429, ctx);
    }
    return this.errorResponse("internal_error", error instanceof Error ? error.message : "internal_error", HTTP_STATUS2.INTERNAL_SERVER_ERROR, ctx);
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
    return success2(this.service.getHealth(), this.createApiContext());
  }
  getReady() {
    return success2(this.service.getReady(), this.createApiContext());
  }
  getLive() {
    return success2(this.service.getLive(), this.createApiContext());
  }
  getVersion() {
    return success2(this.service.getVersion(), this.createApiContext());
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
    const orderResult = createdOrder;
    if (cacheKey) {
      idempotencyStore.set(cacheKey, { order: orderResult, createdAt: Date.now() });
    }
    try {
      await new notification_repository_default().createForManagementUsers({
        title: "\u0637\u0644\u0628 \u062C\u062F\u064A\u062F \u0648\u0635\u0644",
        body: `\u0627\u0644\u0637\u0644\u0628 ${orderResult.code} \u0628\u0642\u064A\u0645\u0629 ${Number(orderResult.total).toLocaleString("ar-YE")} \u0631.\u064A.`,
        channel: "admin",
        payload: {
          type: "order_created",
          orderId: orderResult.id,
          orderCode: orderResult.code,
          total: orderResult.total
        }
      });
    } catch {
    }
    return orderResult;
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
      return paginated2(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.userService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "user_not_found" }, meta: ctx } };
      return success2(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.email !== "string" || !body.email) {
      return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "email_required" }, meta: ctx } };
    }
    try {
      const createdUser = await this.userService.create(body);
      return created2(this.mapToDto(createdUser), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    try {
      const updated = await this.userService.update(id, body);
      return success2(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.userService.delete(id);
      return noContent2(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.userService.restore(id);
      return success2(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async listRoles(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    if (!userId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_required" }, meta: ctx } };
    try {
      const result = await this.userService.listRoles(userId);
      const roles = (result.roles ?? []).map((assignment) => assignment.role ?? assignment);
      return success2({ userId: result.userId, roles }, ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async assignRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.body?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      return created2(await this.userService.assignRole(userId, roleId), ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async removeRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.params?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      await this.userService.removeRole(userId, roleId);
      return noContent2(ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  async checkRole(request4) {
    const ctx = this.createApiContext(request4);
    const userId = request4.params?.userId;
    const roleId = request4.params?.roleId;
    if (!userId || !roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "user_id_and_role_id_required" }, meta: ctx } };
    try {
      return success2({ assigned: await this.userService.checkRole(userId, roleId) }, ctx);
    } catch (err) {
      return this.relationshipError(err, ctx);
    }
  }
  relationshipError(err, ctx) {
    if (err instanceof ConflictException) return { statusCode: HTTP_STATUS2.CONFLICT, body: { success: false, error: { code: "conflict", message: err.message }, meta: ctx } };
    if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
    return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
  }
};
var controller_default = UsersController;

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
function createUserRoutes(controller = new controller_default()) {
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
      return paginated2(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.roleService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "role_not_found" }, meta: ctx } };
      return success2(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name) {
      return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "name_required" }, meta: ctx } };
    }
    try {
      const payload = {
        name: body.name
      };
      if (body.description !== void 0) payload.description = body.description;
      const createdRole = await this.roleService.create(payload);
      return created2(this.mapToDto(createdRole), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    try {
      const payload = {};
      if (body.description !== void 0) payload.description = body.description;
      const updated = await this.roleService.update(id, payload);
      return success2(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.roleService.delete(id);
      return noContent2(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.roleService.restore(id);
      return success2(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
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
    if (!roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    try {
      const result = await this.roleService.listPermissions(roleId);
      const dto = {
        role: this.mapToDto(result.role),
        permissions: (result.permissions ?? []).map((e) => this.mapPermissionEntity(e))
      };
      return success2(dto, ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async assignPermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const body = request4.body;
    if (!roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!body || typeof body !== "object" || typeof body.permissionId !== "string" || !body.permissionId) {
      return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    }
    try {
      const result = await this.roleService.assignPermission(roleId, body.permissionId);
      return created2(this.mapPermissionEntity(result), ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      if (err instanceof ConflictException) return { statusCode: HTTP_STATUS2.CONFLICT, body: { success: false, error: { code: "conflict", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async removePermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const permissionId = request4.params?.permissionId;
    if (!roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    try {
      await this.roleService.removePermission(roleId, permissionId);
      return noContent2(ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async checkPermission(request4) {
    const ctx = this.createApiContext(request4);
    const roleId = request4.params?.roleId;
    const permissionId = request4.params?.permissionId;
    if (!roleId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "role_id_required" }, meta: ctx } };
    if (!permissionId) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "permission_id_required" }, meta: ctx } };
    try {
      const exists = await this.roleService.checkPermission(roleId, permissionId);
      return success2({ assigned: exists }, ctx);
    } catch (err) {
      if (err instanceof NotFoundException) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: err.message }, meta: ctx } };
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
};
var controller_default2 = RolesController;

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
function createRoleRoutes(controller = new controller_default2()) {
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
      return paginated2(data, resultAny.page ?? page, resultAny.limit ?? limit, resultAny.total ?? 0, ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async get(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const result = await this.permissionService.findById(id);
      if (!result) return { statusCode: HTTP_STATUS2.NOT_FOUND, body: { success: false, error: { code: "not_found", message: "permission_not_found" }, meta: ctx } };
      return success2(this.mapToDto(result), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async create(request4) {
    const ctx = this.createApiContext(request4);
    const body = request4.body;
    if (!body || typeof body !== "object" || typeof body.resource !== "string" || !body.resource) {
      return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "resource_required" }, meta: ctx } };
    }
    if (typeof body.action !== "string" || !PERMISSION_ACTIONS.includes(body.action)) {
      return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: "action_invalid" }, meta: ctx } };
    }
    try {
      const payload = {
        resource: body.resource,
        action: body.action
      };
      if (body.description !== void 0) payload.description = body.description;
      const createdPermission = await this.permissionService.create(payload);
      return created2(this.mapToDto(createdPermission), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async update(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    const body = request4.body;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    if (!body || typeof body !== "object") return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "data_required" }, meta: ctx } };
    if (body.action !== void 0 && (typeof body.action !== "string" || !PERMISSION_ACTIONS.includes(body.action))) {
      return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: "action_invalid" }, meta: ctx } };
    }
    try {
      const payload = {};
      if (body.resource !== void 0) payload.resource = body.resource;
      if (body.action !== void 0) payload.action = body.action;
      if (body.description !== void 0) payload.description = body.description;
      const updated = await this.permissionService.update(id, payload);
      return success2(this.mapToDto(updated), ctx);
    } catch (err) {
      if (err instanceof ValidationException) {
        return { statusCode: HTTP_STATUS2.UNPROCESSABLE_ENTITY, body: { success: false, error: { code: "validation_error", message: err.message }, meta: ctx } };
      }
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async remove(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      await this.permissionService.delete(id);
      return noContent2(ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
  async restore(request4) {
    const ctx = this.createApiContext(request4);
    const id = request4.params?.id;
    if (!id) return { statusCode: HTTP_STATUS2.BAD_REQUEST, body: { success: false, error: { code: "bad_request", message: "id_required" }, meta: ctx } };
    try {
      const restored = await this.permissionService.restore(id);
      return success2(this.mapToDto(restored), ctx);
    } catch (err) {
      return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: err?.message ?? "internal_error" }, meta: ctx } };
    }
  }
};
var controller_default3 = PermissionsController;

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
function createPermissionRoutes(controller = new controller_default3()) {
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
      return paginated2(data, result.page ?? page, result.limit ?? limit, result.total ?? 0, ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async get(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError2("id_required", ctx);
    try {
      const product = await this.productService.findById(id);
      return product ? success2(this.mapToDto(product), ctx) : notFound2("product_not_found", ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      const product = await this.productService.create(request4.body);
      return created2(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async update(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError2("id_required", ctx);
    try {
      const product = await this.productService.update(id, request4.body);
      return success2(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async remove(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError2("id_required", ctx);
    try {
      await this.productService.delete(id);
      return noContent2(ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  async restore(request4) {
    const ctx = this.context(request4);
    const id = request4.params?.id;
    if (!id) return validationError2("id_required", ctx);
    try {
      const product = await this.productService.restore(id);
      return success2(this.mapToDto(product), ctx);
    } catch (err) {
      return this.error(err, ctx);
    }
  }
  error(err, ctx) {
    if (err instanceof ValidationException) return validationError2(err.message, ctx);
    if (err instanceof NotFoundException) return notFound2(err.message, ctx);
    if (err instanceof ConflictException) return conflict(err.message, ctx);
    return {
      statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
var controller_default4 = ProductsController;

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
function createProductRoutes(controller = new controller_default4()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt5(definition.handler) });
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
  register({ name: "products-list", method: "GET", path: "/products", version: "v1", handler: (ctx) => controller.list(toControllerRequest5(ctx)), options: privateOptions("products:read") });
  register({ name: "products-get", method: "GET", path: "/products/:id", version: "v1", handler: (ctx) => controller.get(toControllerRequest5(ctx)), options: privateOptions("products:read") });
  register({ name: "products-create", method: "POST", path: "/products", version: "v1", handler: (ctx) => controller.create(toControllerRequest5(ctx)), options: privateOptions("products:create") });
  register({ name: "products-update", method: "PUT", path: "/products/:id", version: "v1", handler: (ctx) => controller.update(toControllerRequest5(ctx)), options: privateOptions("products:update") });
  register({ name: "products-delete", method: "DELETE", path: "/products/:id", version: "v1", handler: (ctx) => controller.remove(toControllerRequest5(ctx)), options: privateOptions("products:delete") });
  register({ name: "products-restore", method: "PATCH", path: "/products/:id/restore", version: "v1", handler: (ctx) => controller.restore(toControllerRequest5(ctx)), options: privateOptions("products:update") });
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
      return paginated2(result.data.map((entry) => this.mapCustomer(entry)), result.page, result.limit, result.total, ctx);
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
      return entity ? success2(this.mapCustomer(entity), ctx) : notFound2("customer_not_found", ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async create(request4) {
    const ctx = this.context(request4);
    try {
      const entity = await this.service.create(request4.body);
      return created2(this.mapCustomer(entity), ctx);
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
      return success2(this.mapCustomer(entity), ctx);
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
      return noContent2(ctx);
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
      return success2(addresses.map((entry) => this.mapAddress(entry)), ctx);
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
      return created2(this.mapAddress(address), ctx);
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
      return success2(this.mapAddress(address), ctx);
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
      return noContent2(ctx);
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
    if (error instanceof ValidationException) return validationError2(error.message, ctx);
    if (error instanceof NotFoundException) return notFound2(error.message, ctx);
    if (error instanceof ConflictException) return conflict(error.message, ctx);
    return { statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR, body: { success: false, error: { code: "internal_error", message: "internal_error" }, meta: ctx } };
  }
};
var controller_default5 = CustomersController;

// ../backend/src/modules/customers/routes.ts
function request(ctx) {
  return { body: ctx.body, headers: ctx.headers, query: ctx.query, params: ctx.params, context: { user: ctx.user, metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function createCustomerRoutes(controller = new controller_default5()) {
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
      return success2(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async addItem(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const cart = await this.service.addItem(user.id, request4.body, user.email);
      return success2(cart, ctx);
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
      return success2(cart, ctx);
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
      return success2(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  async clearCart(request4) {
    const ctx = this.context(request4);
    try {
      const user = this.getUserInfo(request4);
      const cart = await this.service.clearCart(user.id, user.email);
      return success2(cart, ctx);
    } catch (error) {
      return this.error(error, ctx);
    }
  }
  error(error, ctx) {
    if (error instanceof ValidationException2) return validationError2(error.message, ctx);
    if (error instanceof NotFoundException || error?.code === "not_found") return notFound2(error instanceof Error ? error.message : "not_found", ctx);
    if (error instanceof ForbiddenError || error?.code === "forbidden") return forbidden(error instanceof Error ? error.message : "forbidden", ctx);
    return {
      statusCode: HTTP_STATUS2.INTERNAL_SERVER_ERROR,
      body: { success: false, error: { code: "internal_error", message: error instanceof Error ? error.message : "internal_error" }, meta: ctx }
    };
  }
};
var controller_default6 = CartController;

// ../backend/src/modules/cart/routes.ts
function toControllerRequest6(ctx) {
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
function createCartRoutes(controller = new controller_default6()) {
  const builder = new RouterBuilder();
  const register = (definition) => {
    builder.register({ ...definition, handler: adapt6(definition.handler) });
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
  register({ name: "cart-get", method: "GET", path: "/cart", version: "v1", handler: (ctx) => controller.getCart(toControllerRequest6(ctx)), options: privateOptions("carts:read") });
  register({ name: "cart-items-add", method: "POST", path: "/cart/items", version: "v1", handler: (ctx) => controller.addItem(toControllerRequest6(ctx)), options: privateOptions("carts:create") });
  register({ name: "cart-items-update", method: "PUT", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.updateItem(toControllerRequest6(ctx)), options: privateOptions("carts:update") });
  register({ name: "cart-items-remove", method: "DELETE", path: "/cart/items/:id", version: "v1", handler: (ctx) => controller.removeItem(toControllerRequest6(ctx)), options: privateOptions("carts:delete") });
  register({ name: "cart-clear", method: "DELETE", path: "/cart", version: "v1", handler: (ctx) => controller.clearCart(toControllerRequest6(ctx)), options: privateOptions("carts:delete") });
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
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
      return created2(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listOrders(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdFilter = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return success2({ items: [], total: 0, page: 1, limit: 10, totalPages: 0 }, ctx);
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
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getOrderById(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.id;
      if (!orderId) {
        return this.errorResponse("bad_request", "order_id_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const order = await this.orderRepo.findOrderById(orderId, customerIdCheck);
      if (!order) {
        return this.errorResponse("not_found", "order_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
      }
      return success2(order, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateStatus(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.id;
      const status = request4.body?.status;
      if (!orderId || !status) {
        return this.errorResponse("bad_request", "order_id_and_status_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER" && !this.hasManagementPermissions(user);
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const updatedOrder = await this.orderRepo.updateOrderStatus(orderId, status, customerIdCheck);
      return success2(updatedOrder, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
function createOrderRoutes(controller = new OrderController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "orders-create",
    method: "POST",
    path: "/orders",
    version: "v1",
    handler: adapt7((ctx) => controller.createOrder(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.listOrders(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.getOrderById(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.updateStatus(toControllerRequest7(ctx))),
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
    handler: adapt7((ctx) => controller.cancelOrder(toControllerRequest7(ctx))),
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const result = await this.inventoryRepo.findInventoryList({
        status: query.status ? String(query.status) : void 0,
        search: query.search ? String(query.search) : void 0,
        page: query.page ? Number(query.page) : 1,
        limit: query.limit ? Number(query.limit) : 10
      });
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async adjustStock(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { productId, type, quantity, reason } = body;
      if (!productId || !type || quantity === void 0) {
        return this.errorResponse("bad_request", "product_id_type_and_quantity_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const validTypes = ["IN", "OUT", "ADJUSTMENT"];
      if (!validTypes.includes(type)) {
        return this.errorResponse("bad_request", "invalid_movement_type", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const updated = await this.inventoryRepo.adjustStock(
        productId,
        type,
        Number(quantity),
        reason ? String(reason) : void 0,
        user.id
      );
      return success2(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listMovements(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const query = request4.query || {};
      const inventoryId = query.inventoryId ? String(query.inventoryId) : void 0;
      const movements = await this.inventoryRepo.findMovements(inventoryId);
      return success2({ movements }, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
function createInventoryRoutes(controller = new InventoryController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "inventory-list",
    method: "GET",
    path: "/inventory",
    version: "v1",
    handler: adapt8((ctx) => controller.listInventory(toControllerRequest8(ctx))),
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
    handler: adapt8((ctx) => controller.adjustStock(toControllerRequest8(ctx))),
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
    handler: adapt8((ctx) => controller.listMovements(toControllerRequest8(ctx))),
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
  integer(value, fallback, max) {
    if (value === void 0) return fallback;
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
var controller_default7 = DeliveryController;

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
function createDeliveryRoutes(controller = new controller_default7()) {
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
  integer(value, fallback, max) {
    if (value === void 0) return fallback;
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
var controller_default8 = SupplierAdminController;

// ../backend/src/modules/suppliers-admin/routes.ts
function request3(ctx) {
  return { body: ctx.body, headers: ctx.headers, params: ctx.params, query: ctx.query, context: { user: ctx.user, metadata: { timestamp: (/* @__PURE__ */ new Date()).toISOString(), version: "v1" } } };
}
function createSupplierAdminRoutes(controller = new controller_default8()) {
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { orderId, paymentMethod, idempotencyKey } = body;
      if (!orderId || !paymentMethod) {
        return this.errorResponse("bad_request", "order_id_and_payment_method_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER";
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "order_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const transaction = await this.paymentRepo.createPaymentTransaction({
        orderId: String(orderId),
        paymentMethod: String(paymentMethod),
        idempotencyKey: idempotencyKey ? String(idempotencyKey) : void 0,
        customerIdCheck
      });
      return created2(transaction, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getPaymentForOrder(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const orderId = request4.params?.orderId;
      if (!orderId) {
        return this.errorResponse("bad_request", "order_id_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isCustomerOnly = user.role === "CUSTOMER";
      let customerIdCheck = void 0;
      if (isCustomerOnly) {
        const customer = await this.cartRepo.findCustomerByUserIdOrEmail(user.id, user.email);
        if (!customer) {
          return this.errorResponse("not_found", "payment_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
        }
        customerIdCheck = customer.id;
      }
      const payment = await this.paymentRepo.findPaymentByOrderId(orderId, customerIdCheck);
      if (!payment) {
        return this.errorResponse("not_found", "payment_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
      }
      return success2(payment, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async verifyPayment(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { paymentId, status, providerReference } = body;
      if (!paymentId) {
        return this.errorResponse("bad_request", "payment_id_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const verified = await this.paymentRepo.verifyPaymentTransaction(
        String(paymentId),
        status ? String(status) : "COMPLETED",
        providerReference ? String(providerReference) : void 0
      );
      return success2(verified, ctx);
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
      return this.errorResponse("not_found", error.message || "not_found", HTTP_STATUS2.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
function createPaymentRoutes(controller = new PaymentController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "payment-create",
    method: "POST",
    path: "/payments/create",
    version: "v1",
    handler: adapt9((ctx) => controller.createPayment(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.getPaymentForOrder(toControllerRequest9(ctx))),
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
    handler: adapt9((ctx) => controller.verifyPayment(toControllerRequest9(ctx))),
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
      return success2(publicSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getAdminSettings(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const allSettings = await this.settingsRepo.getAllSettings();
      return success2(allSettings, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateAdminSettings(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const updated = await this.settingsRepo.updateSettings(body);
      return success2(updated, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
function createSettingsRoutes(controller = new SettingsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "settings-public",
    method: "GET",
    path: "/settings/public",
    version: "v1",
    handler: adapt10((ctx) => controller.getPublicSettings(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.getAdminSettings(toControllerRequest10(ctx))),
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
    handler: adapt10((ctx) => controller.updateAdminSettings(toControllerRequest10(ctx))),
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const result = await this.notificationRepo.findUserNotifications(user.id);
      return success2(result, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAsRead(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const notificationId = request4.params?.id;
      if (!notificationId) {
        return this.errorResponse("bad_request", "notification_id_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const updated = await this.notificationRepo.markAsRead(notificationId, user.id);
      return success2(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async markAllAsRead(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const count = await this.notificationRepo.markAllAsRead(user.id);
      return success2({ count }, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
function createNotificationRoutes(controller = new NotificationsController()) {
  const builder = new RouterBuilder();
  builder.register({
    name: "notification-list",
    method: "GET",
    path: "/notifications",
    version: "v1",
    handler: adapt11((ctx) => controller.listUserNotifications(toControllerRequest11(ctx))),
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
    handler: adapt11((ctx) => controller.markAsRead(toControllerRequest11(ctx))),
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
    handler: adapt11((ctx) => controller.markAllAsRead(toControllerRequest11(ctx))),
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
      return success2(contacts, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async createTicket(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const body = request4.body || {};
      const { subject, description, priority } = body;
      if (!subject || !description) {
        return this.errorResponse("bad_request", "subject_and_description_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const ticket = await this.supportRepo.createTicket({
        customerId: user.id,
        customerName: user.displayName || user.name || user.email,
        customerEmail: user.email,
        subject: String(subject),
        description: String(description),
        priority: priority ? String(priority) : "MEDIUM"
      });
      return created2(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async listTickets(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      let tickets;
      if (isStaffOrAdmin) {
        tickets = await this.supportRepo.findAllTickets();
      } else {
        tickets = await this.supportRepo.findCustomerTickets(user.id);
      }
      return success2({ tickets }, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getTicketById(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      if (!ticketId) {
        return this.errorResponse("bad_request", "ticket_id_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      const ticket = await this.supportRepo.findTicketById(
        ticketId,
        isStaffOrAdmin ? void 0 : user.id
      );
      if (!ticket) {
        return this.errorResponse("not_found", "ticket_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
      }
      return success2(ticket, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async replyTicket(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      const message = request4.body?.message;
      if (!ticketId || !message) {
        return this.errorResponse("bad_request", "ticket_id_and_message_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const isStaffOrAdmin = user.role === "ADMIN" || user.role === "MANAGER" || user.role === "EMPLOYEE";
      const ticketCheck = await this.supportRepo.findTicketById(ticketId, isStaffOrAdmin ? void 0 : user.id);
      if (!ticketCheck) {
        return this.errorResponse("not_found", "ticket_not_found", HTTP_STATUS2.NOT_FOUND, ctx);
      }
      const updated = await this.supportRepo.replyToTicket({
        ticketId,
        senderId: user.id,
        senderName: user.displayName || user.name || user.email,
        senderRole: user.role ?? "CUSTOMER",
        message: String(message)
      });
      return success2(updated, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async updateTicketStatus(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const ticketId = request4.params?.id;
      const status = request4.body?.status;
      if (!ticketId || !status) {
        return this.errorResponse("bad_request", "ticket_id_and_status_required", HTTP_STATUS2.BAD_REQUEST, ctx);
      }
      const updated = await this.supportRepo.updateTicketStatus(ticketId, status);
      return success2(updated, ctx);
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
      return this.errorResponse("not_found", error.message || "not_found", HTTP_STATUS2.NOT_FOUND, ctx);
    }
    if (error instanceof ValidationException) {
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
    handler: adapt12((ctx) => controller.getSupportContacts(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.createTicket(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.listTickets(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.getTicketById(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.replyTicket(toControllerRequest12(ctx))),
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
    handler: adapt12((ctx) => controller.updateTicketStatus(toControllerRequest12(ctx))),
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const kpis = await this.reportsRepo.getDashboardKpis();
      return success2(kpis, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getSalesReport(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const { startDate, endDate, status } = request4.query || {};
      const report = await this.reportsRepo.getSalesReport(
        startDate ? String(startDate) : void 0,
        endDate ? String(endDate) : void 0,
        status ? String(status) : void 0
      );
      return success2(report, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getProductAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getProductAnalytics();
      return success2(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getInventoryAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getInventoryAnalytics();
      return success2(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getCustomerAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getCustomerAnalytics();
      return success2(analytics, ctx);
    } catch (error) {
      return this.mapError(error, ctx);
    }
  }
  async getPaymentAnalytics(request4) {
    const ctx = this.createApiContext(request4);
    try {
      const user = request4.user;
      if (!user || !user.id) {
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const analytics = await this.reportsRepo.getPaymentAnalytics();
      return success2(analytics, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
    handler: adapt13((ctx) => controller.getDashboardKpis(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.getSalesReport(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.getProductAnalytics(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.getInventoryAnalytics(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.getCustomerAnalytics(toControllerRequest13(ctx))),
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
    handler: adapt13((ctx) => controller.getPaymentAnalytics(toControllerRequest13(ctx))),
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
        return this.errorResponse("unauthorized", "authentication_required", HTTP_STATUS2.UNAUTHORIZED, ctx);
      }
      const { resource, action, actorId, page, limit } = request4.query || {};
      const result = await this.auditRepo.findAuditLogs({
        resource: resource ? String(resource) : void 0,
        action: action ? String(action) : void 0,
        actorId: actorId ? String(actorId) : void 0,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      });
      return success2(result, ctx);
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
      return this.errorResponse("bad_request", error.message || "bad_request", HTTP_STATUS2.BAD_REQUEST, ctx);
    }
    if (error instanceof UnauthorizedError) {
      return this.errorResponse("unauthorized", error.message || "unauthorized", HTTP_STATUS2.UNAUTHORIZED, ctx);
    }
    return this.errorResponse(
      "internal_error",
      error instanceof Error ? error.message : "internal_error",
      HTTP_STATUS2.INTERNAL_SERVER_ERROR,
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
    handler: adapt14((ctx) => controller.listAuditLogs(toControllerRequest14(ctx))),
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
  const routes = [...createSystemRoutes(), ...createAuthRoutes(), ...createUserRoutes(), ...createRoleRoutes(), ...createPermissionRoutes(), ...createProductRoutes(), ...createCustomerRoutes(), ...createCartRoutes(), ...createOrderRoutes(), ...createInventoryRoutes(), ...createDeliveryRoutes(), ...createSupplierAdminRoutes(), ...createPaymentRoutes(), ...createSettingsRoutes(), ...createNotificationRoutes(), ...createSupportRoutes(), ...createReportsRoutes(), ...createAuditRoutes()];
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
          const result = unauthorized2("authentication_required", {
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
          const result = unauthorized2("authentication_required", {
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
/*! Bundled license information:

hash-wasm/dist/index.umd.js:
  (*!
   * hash-wasm (https://www.npmjs.com/package/hash-wasm)
   * (c) Dani Biro
   * @license MIT
   *)
*/
