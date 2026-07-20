"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AgentConfig } from "@/lib/db/queries/settings";
import { updateAgentConfig, type AgentConfigActionState } from "@/lib/actions/settings";

const INITIAL_STATE: AgentConfigActionState = { status: "idle" };

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save changes"}
    </Button>
  );
}

export function AgentConfigForm({ initial }: { initial: AgentConfig }) {
  const [questions, setQuestions] = useState(initial.screeningQuestions);
  const [state, formAction] = useActionState(updateAgentConfig, INITIAL_STATE);

  function updateQuestion(index: number, value: string) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, ""]);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent identity</CardTitle>
          <CardDescription>
            How your AI receptionist introduces itself on every call.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-name">Agent name</Label>
            <Input id="agent-name" name="name" defaultValue={initial.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-greeting">Greeting</Label>
            <Textarea
              id="agent-greeting"
              name="greeting"
              rows={3}
              defaultValue={initial.greeting}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-personality">Personality / tone</Label>
            <Textarea
              id="agent-personality"
              name="personality"
              rows={2}
              defaultValue={initial.personality}
              placeholder="e.g. Warm and professional, but brief — gets to the point quickly."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Screening instructions</CardTitle>
          <CardDescription>
            How your AI receptionist should evaluate and prioritize vendor calls.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-instructions">Instructions</Label>
            <Textarea
              id="agent-instructions"
              name="instructions"
              rows={4}
              defaultValue={initial.instructions}
              placeholder="Describe your company, products/services, and what the agent should or shouldn't engage with."
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-transfer-rules">Transfer rules</Label>
            <Textarea
              id="agent-transfer-rules"
              name="transferRules"
              rows={3}
              defaultValue={initial.transferRules}
              placeholder="e.g. Transfer live if the caller claims urgent time-limited pricing or represents a known strategic vendor."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Screening questions</CardTitle>
          <CardDescription>
            Questions the agent asks to understand and score every vendor call.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {questions.map((question, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                name="screeningQuestions"
                value={question}
                onChange={(e) => updateQuestion(index, e.target.value)}
                placeholder={`Question ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => removeQuestion(index)}
                aria-label="Remove question"
              >
                <X />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={addQuestion}
          >
            <Plus />
            Add question
          </Button>
        </CardContent>
        <CardFooter className="justify-between">
          <p
            className={
              state.status === "error"
                ? "text-sm text-destructive"
                : "text-sm text-muted-foreground"
            }
          >
            {state.message ?? ""}
          </p>
          <SaveButton />
        </CardFooter>
      </Card>
    </form>
  );
}
