import type { PhoneProvider } from "../provider";
import type {
  CreatePhoneNumberParams,
  EndCallParams,
  IncomingCall,
  PhoneNumber,
  TransferCallParams,
} from "../types";

/**
 * Twilio implementation of PhoneProvider. Only receiveCall is implemented —
 * it's the only operation the incoming-call and call-status webhooks need.
 * The rest throw until a chunk actually needs them.
 */
export class TwilioPhoneProvider implements PhoneProvider {
  readonly name = "TWILIO";

  async createPhoneNumber(_params: CreatePhoneNumberParams): Promise<PhoneNumber> {
    throw new Error("TwilioPhoneProvider.createPhoneNumber is not implemented yet.");
  }

  async receiveCall(payload: unknown): Promise<IncomingCall> {
    const params = payload as Record<string, string>;
    return {
      providerCallId: params.CallSid,
      from: params.From,
      to: params.To,
      receivedAt: new Date(),
    };
  }

  async transferCall(_params: TransferCallParams): Promise<void> {
    throw new Error("TwilioPhoneProvider.transferCall is not implemented yet.");
  }

  async endCall(_params: EndCallParams): Promise<void> {
    throw new Error("TwilioPhoneProvider.endCall is not implemented yet.");
  }
}
