import type { PhoneProvider } from "./provider";

const providers = new Map<string, PhoneProvider>();

/** Registers a provider implementation. Called once at app startup. */
export function registerPhoneProvider(provider: PhoneProvider) {
  providers.set(provider.name, provider);
}

/** Looks up a registered provider by name (e.g. "TWILIO"). */
export function getPhoneProvider(name: string): PhoneProvider {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`No phone provider registered for "${name}"`);
  }
  return provider;
}
