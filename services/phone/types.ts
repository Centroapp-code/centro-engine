/** An E.164 phone number provisioned for a company and routed to Centro. */
export type PhoneNumber = {
  phoneNumber: string;
  /** The provider's own identifier for this number (e.g. a Twilio SID). */
  providerId: string;
};

export type CreatePhoneNumberParams = {
  companyId: string;
  /** Preferred area code, if the provider supports searching by one. */
  areaCode?: string;
};

/**
 * A normalized inbound call, after a provider-specific webhook payload has
 * been parsed. `to` is the Centro number the company's phone menu forwarded
 * the call to — Centro never replaces the company's own phone system or
 * number.
 */
export type IncomingCall = {
  providerCallId: string;
  from: string;
  to: string;
  receivedAt: Date;
};

export type TransferCallParams = {
  providerCallId: string;
  /** E.164 number of the human sales rep to transfer the call to. */
  transferTo: string;
};

export type EndCallParams = {
  providerCallId: string;
};

/** Recorded the moment a call starts, before its outcome is known. */
export type NewCallParams = {
  companyId: string;
  providerCallId: string;
  callerPhone: string;
};

/** Recorded once the provider reports the call as complete. */
export type CompleteCallParams = {
  providerCallId: string;
  duration: number;
};
