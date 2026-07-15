/**
 * Phone integration architecture.
 *
 * Centro does not replace a company's phone system. The flow is:
 *
 *   Company phone menu ("Press 6 for Sales")
 *     -> forwarded to a Centro phone number
 *     -> Centro AI answers
 *
 * PhoneProvider abstracts the network operations that make this possible
 * (creating numbers, receiving/transferring/ending calls) so a concrete
 * provider (Twilio, etc.) can be registered without changing any calling
 * code. See providers/twilio-provider.ts for the Twilio implementation.
 */
export * from "./types";
export * from "./provider";
export * from "./registry";
export * from "./call-store";
export * from "./lookup";
