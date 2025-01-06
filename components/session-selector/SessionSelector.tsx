"use client";

import { Slider } from "@/components/ui/slider";
import { PriceInfo } from './PriceInfo';

interface SessionSelectorProps {
  sessions: number;
  onChange: (value: number) => void;
}

export function SessionSelector({ sessions, onChange }: SessionSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Αριθμός Συνεδριών:</span>
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
      <PriceInfo sessions={sessions} />
    </div>
  );
}