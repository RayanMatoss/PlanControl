import { cn } from '@/lib/utils';

interface PlanControlLogoProps {
  className?: string;
  showText?: boolean;
}

/** Logo PlanControl: ícone de calendário azul com check verde + texto Plan (azul) Control (cinza) */
export function PlanControlLogo({ className, showText = true }: PlanControlLogoProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Ícone: calendário azul com check verde */}
      <div className="relative flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden bg-[#2563eb] flex items-center justify-center">
        {/* Anéis do calendário (topo) */}
        <div className="absolute top-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#1d4ed8]" />
          <span className="w-1.5 h-1.5 rounded-sm bg-[#1d4ed8]" />
        </div>
        {/* Quadradinhos dos dias (esquerda) */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
          <span className="w-1.5 h-1.5 rounded-[2px] bg-[#3b82f6]/80" />
          <span className="w-1.5 h-1.5 rounded-[2px] bg-[#3b82f6]/80" />
        </div>
        {/* Check verde */}
        <svg
          className="absolute bottom-0.5 right-0.5 w-4 h-4 text-emerald-500 drop-shadow-sm"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      {showText && (
        <h1 className="text-lg font-bold tracking-tight hidden sm:block">
          <span className="text-[#2563eb]">Plan</span>
          <span className="text-slate-600 dark:text-slate-400">Control</span>
        </h1>
      )}
    </div>
  );
}
