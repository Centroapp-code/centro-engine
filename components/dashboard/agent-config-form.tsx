"use client";

import { useState } from "react";
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
import type { MockAgentConfig } from "@/lib/mock/dashboard";

export function AgentConfigForm({ initial }: { initial: MockAgentConfig }) {
  const [name, setName] = useState(initial.name);
  const [greeting, setGreeting] = useState(initial.greeting);
  const [companyDescription, setCompanyDescription] = useState(
    initial.companyDescription
  );
  const [productsServices, setProductsServices] = useState(
    initial.productsServices
  );
  const [questions, setQuestions] = useState(initial.qualificationQuestions);
  const [saved, setSaved] = useState(false);

  function updateQuestion(index: number, value: string) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? value : q)));
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, ""]);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Agent identity</CardTitle>
          <CardDescription>
            How your AI sales agent introduces itself on every call.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-name">Agent name</Label>
            <Input
              id="agent-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="agent-greeting">Greeting</Label>
            <Textarea
              id="agent-greeting"
              rows={3}
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Business context</CardTitle>
          <CardDescription>
            What the agent tells callers about your company and offering.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="company-description">Company description</Label>
            <Textarea
              id="company-description"
              rows={3}
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="products-services">Products / services</Label>
            <Textarea
              id="products-services"
              rows={3}
              value={productsServices}
              onChange={(e) => setProductsServices(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Qualification questions</CardTitle>
          <CardDescription>
            Questions the agent asks to understand and score every caller.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {questions.map((question, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
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
          <p className="text-sm text-muted-foreground">
            {saved ? "Changes saved." : ""}
          </p>
          <Button type="submit">Save changes</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
