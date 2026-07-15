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
 * provider (Twilio, etc.) can be registered later without changing any
 * calling code. No provider is implemented yet.
 */
export * from "./types";
export * from "./provider";
export * from "./registry";
export * from "./call-store";
