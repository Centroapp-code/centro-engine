import type {
  CreatePhoneNumberParams,
  EndCallParams,
  IncomingCall,
  PhoneNumber,
  TransferCallParams,
} from "./types";

/**
 * Everything a phone network provider (Twilio, and later others) must
 * implement to plug into Centro. TwilioPhoneProvider is registered (see
 * services/phone/registry.ts) and implements receiveCall, the only
 * operation the incoming-call/call-status webhooks currently need.
 * createPhoneNumber, transferCall, and endCall are stubbed — each throws
 * until a future chunk actually needs them.
 */
export interface PhoneProvider {
  /** Identifies the provider, e.g. "TWILIO". Matches the Prisma PhoneProvider enum. */
  readonly name: string;

  /** Provisions a new phone number for a company to route to Centro. */
  createPhoneNumber(params: CreatePhoneNumberParams): Promise<PhoneNumber>;

  /** Normalizes a provider webhook payload into an IncomingCall. */
  receiveCall(payload: unknown): Promise<IncomingCall>;

  /** Transfers an in-progress call to a human team member. */
  transferCall(params: TransferCallParams): Promise<void>;

  /** Ends an in-progress call. */
  endCall(params: EndCallParams): Promise<void>;
}
