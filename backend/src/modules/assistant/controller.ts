import type { ApiResponse } from '../../api';
import { success, validationError } from '../../api';
import type { ControllerRequest } from '../../controllers';
import { chat } from './service';

type ChatBody = {
  message?: unknown;
  history?: unknown;
};

export class AssistantController {
  async chat(request: ControllerRequest<ChatBody>): Promise<ApiResponse<unknown>> {
    const ctx = {
      timestamp: new Date().toISOString(),
      requestId: request.context?.metadata?.requestId,
      version: 'v1' as const,
      locale: request.context?.metadata?.locale ?? 'ar-YE',
    };
    const body = request.body ?? {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message || message.length > 1200) return validationError('assistant_message_invalid', ctx);

    const history = Array.isArray(body.history)
      ? body.history
          .filter((item: any) => item && (item.role === 'user' || item.role === 'assistant') && typeof item.content === 'string')
          .slice(-8)
          .map((item: any) => ({ role: item.role, content: item.content.slice(0, 500) }))
      : [];

    try {
      return success(await chat({ message, history }), ctx);
    } catch (error) {
      return validationError(error instanceof Error ? error.message : 'assistant_request_failed', ctx);
    }
  }
}

export default AssistantController;
