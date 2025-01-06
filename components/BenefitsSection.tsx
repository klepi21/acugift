import {
  Brain,
  HeartPulse,
  Zap,
  Bed,
  Dumbbell,
  Frown,
  Cigarette,
  ThermometerSun,
} from 'lucide-react';

const benefits = [
  {
    icon: Brain,
    title: 'Πονοκέφαλοι & Ημικρανίες',
  },
  {
    icon: Zap,
    title: 'Στρες',
  },
  {
    icon: Dumbbell,
    title: 'Μυϊκοί Τραυματισμοί',
  },
  {
    icon: HeartPulse,
    title: 'Κυκλοφορικό',
  },
  {
    icon: Bed,
    title: 'Αϋπνία',
  },
  {
    icon: Frown,
    title: 'Κατάθλιψη & Άγχος',
  },
  {
    icon: ThermometerSun,
    title: 'Εμμηνόπαυση',
  },
  {
    icon: Cigarette,
    title: 'Διακοπή Καπνίσματος',
  },
];

export function BenefitsSection() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold text-center text-[#8B4513] mb-8">
        Ο Βελονισμός Βοηθάει σε
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <div 
            key={index}
            className="flex flex-col items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm hover:bg-white/70 transition-colors"
          >
            <benefit.icon className="h-8 w-8 text-[#8B4513] mb-3" />
            <span className="text-sm font-medium text-[#8B4513] text-center">
              {benefit.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 