import type { IncomingMessage, ServerResponse } from 'node:http';
import { createSystemRequestHandler } from '../../backend/src/system/server';

const handler = createSystemRequestHandler();

export default async function apiHandler(req: IncomingMessage, res: ServerResponse) {
  try {
    return await handler(req, res);
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
