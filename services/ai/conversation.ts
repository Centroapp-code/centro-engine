/** A single spoken turn in a call. Only the opening greeting exists so far. */
export type ConversationTurn = {
  message: string;
};

/**
 * Starts a conversation for a newly-answered call. For now this just
 * returns the agent's configured greeting — qualification, follow-up
 * questions, and scoring are a future addition here, not in the phone layer.
 */
export function startConversation(agent: { greeting: string }): ConversationTurn {
  return { message: agent.greeting };
}
