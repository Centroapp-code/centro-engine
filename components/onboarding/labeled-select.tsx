"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LabeledSelect({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  options,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value || null}
        onValueChange={(next) => onValueChange((next as string | null) ?? "")}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
