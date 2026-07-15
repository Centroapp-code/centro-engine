import type {
  CreatePhoneNumberParams,
  EndCallParams,
  IncomingCall,
  PhoneNumber,
  TransferCallParams,
} from "./types";

/**
 * Everything a phone network provider (Twilio, and later others) must
 * implement to plug into Centro. No provider implements this yet — see
 * services/phone/registry.ts for how one will be registered once built.
 */
export interface PhoneProvider {
  /** Identifies the provider, e.g. "TWILIO". Matches the Prisma PhoneProvider enum. */
  readonly name: string;

  /** Provisions a new phone number for a company to route to Centro. */
  createPhoneNumber(params: CreatePhoneNumberParams): Promise<PhoneNumber>;

  /** Normalizes a provider webhook payload into an IncomingCall. */
  receiveCall(payload: unknown): Promise<IncomingCall>;

  /** Transfers an in-progress call to a human sales rep. */
  transferCall(params: TransferCallParams): Promise<void>;

  /** Ends an in-progress call. */
  endCall(params: EndCallParams): Promise<void>;
}
