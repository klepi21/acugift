"use client";

import { Slider } from "@/components/ui/slider";
import { calculatePrice } from "@/lib/pricing";

interface SessionSelectorProps {
  sessions: number;
  onChange: (value: number) => void;
}

export function SessionSelector({ sessions, onChange }: SessionSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Number of Sessions:</span>
        <span className="text-2xl font-bold">{sessions}</span>
      </div>
      <Slider
        value={[sessions]}
        onValueChange={(value) => onChange(value[0])}
        min={1}
        max={10}
        step={1}
        className="w-full"
      />
      <div className="text-sm text-muted-foreground">
        {sessions === 1 && "Single session: $50 each"}
        {sessions === 2 && "Two sessions: $40 each"}
        {sessions >= 3 && sessions <= 5 && "3-5 sessions: $35 each"}
        {sessions >= 6 && sessions <= 8 && "6-8 sessions: $32 each"}
        {sessions >= 9 && "9-10 sessions: $30 each"}
      </div>
    </div>
  );
}