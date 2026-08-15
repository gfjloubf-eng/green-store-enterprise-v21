import type { IncomingMessage, ServerResponse } from 'node:http';
import { createSystemRequestHandler } from '../../backend/src/system/server';

const handler = createSystemRequestHandler();

export default async function apiHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
