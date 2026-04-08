import { authedRequest } from '../../../api/apiClient';

export type SendHelpPayload = {
  name: string;
  email: string;
  message: string;
};

export type SendHelpResponse = {
  message: string;
  ticketId: string;
};

export function sendHelpRequest(token: string, payload: SendHelpPayload) {
  return authedRequest<SendHelpResponse>(token, '/send-help', 'POST', payload);
}
