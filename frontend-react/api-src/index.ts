import type { IncomingMessage, ServerResponse } from 'node:http';
import { createSystemRequestHandler } from '../../backend/src/system/server';

let handler: any;

function getHandler() {
  if (!handler) {
    handler = createSystemRequestHandler();
  }
  return handler;
}

export default async function apiHandler(req: IncomingMessage, res: ServerResponse) {
  try {
    const fn = getHandler();
    return await fn(req, res);
  } catch (error: any) {
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: {
          code: 'internal_error',
          message: error?.message || 'Server error',
        },
      }));
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = apiHandler;
  module.exports.default = apiHandler;
}
