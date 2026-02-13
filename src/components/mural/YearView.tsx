import { useMemo } from 'react';
import { format, startOfMonth, setMonth, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { StickyNote } from 'lucide-react';
import { PostIt } from '@/types/mural';
import { useMotionVariants } from '@/lib/theme/useMotionVariants';
import { cn } from '@/lib/utils';

const MONTH_NAMES = [...Array(12)].map((_, i) =>
  format(setMonth(new Date(2000, 0, 1), i), 'MMMM', { locale: ptBR })
);

interface YearViewProps {
  currentYear: Date;
  postIts: PostIt[];
  onMonthClick: (monthStart: Date) => void;
}

export function YearView({ currentYear, postIts, onMonthClick }: YearViewProps) {
  const variants = useMotionVariants();
  const year = currentYear.getFullYear();
  const months = useMemo(() => {
    return [...Array(12)].map((_, i) => startOfMonth(new Date(year, i, 1)));
  }, [year]);

  const countByMonth = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 0; i < 12; i++) counts[i] = 0;
    postIts.forEach((p) => {
      const d = new Date(p.start_date + 'T12:00:00');
      if (d.getFullYear() === year) counts[d.getMonth()]++;
    });
    return counts;
  }, [postIts, year]);

  return (
    <div className="flex-1 flex flex-col p-4 md:p-8 overflow-auto">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto w-full"
        style={{ gap: 'var(--card-gap)' }}
      >
        {months.map((monthDate, i) => {
          const monthIndex = monthDate.getMonth();
          const count = countByMonth[monthIndex] ?? 0;
          const isCurrent = isThisMonth(monthDate);
          const hasPostIts = count > 0;

          return (
            <motion.button
              key={i}
              type="button"
              onClick={() => onMonthClick(monthDate)}
              className={cn(
                'group relative flex flex-col items-center justify-center min-h-[100px] md:min-h-[112px]',
                'border transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                isCurrent
                  ? 'bg-primary/10 border-primary/40 hover:bg-primary/15'
                  : 'bg-card/80 border-border/80 hover:border-primary/30 hover:bg-accent/40 backdrop-blur-sm'
              )}
              style={{
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
              }}
              whileHover={{ ...variants.cardHover, boxShadow: 'var(--shadow-lg)' }}
              whileTap={variants.cardPress}
              initial={variants.pageFade.initial}
              animate={variants.pageFade.animate}
              transition={{ delay: i * 0.025 }}
            >
              {/* Número do mês (1-12) discreto */}
              <span
                className={cn(
                  'absolute top-2.5 right-2.5 text-[10px] font-bold tabular-nums rounded-md px-1.5 py-0.5',
                  isCurrent ? 'text-primary/70 bg-primary/15' : 'text-muted-foreground/60 bg-muted/50'
                )}
              >
                {String(monthIndex + 1).padStart(2, '0')}
              </span>

              <span
                className={cn(
                  'text-base font-semibold capitalize tracking-tight text-foreground mt-1 px-2 text-center transition-transform duration-200 group-hover:scale-105',
                  isCurrent && 'text-primary'
                )}
              >
                {MONTH_NAMES[monthIndex]}
              </span>

              {hasPostIts && (
                <span
                  className={cn(
                    'mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-transform duration-200 group-hover:scale-110',
                    isCurrent
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary/90'
                  )}
                >
                  <StickyNote className="h-3 w-3" />
                  {count}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
