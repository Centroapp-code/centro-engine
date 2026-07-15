import { AgentConfigForm } from "@/components/dashboard/agent-config-form";
import { mockAgentConfig } from "@/lib/mock/dashboard";

export default function AgentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">AI Agent</h1>
        <p className="text-sm text-muted-foreground">
          Configure how your Centro agent greets and qualifies callers.
        </p>
      </div>

      <div className="max-w-2xl">
        <AgentConfigForm initial={mockAgentConfig} />
      </div>
    </div>
  );
}
