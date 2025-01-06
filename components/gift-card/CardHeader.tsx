import { Flower } from 'lucide-react';

export function CardHeader() {
  return (
    <>
      <div className="flex justify-center">
        <Flower className="h-12 w-12 text-[#8B4513]" />
      </div>
      <h2 className="text-2xl font-bold text-[#8B4513]">Ιατρείο Βελονισμού</h2>
    </>
  );
}