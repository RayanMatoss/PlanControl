import { useState, useEffect } from 'react';
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Search, CalendarDays, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'year' | 'month';

interface TopBarProps {
  viewMode: ViewMode;
  currentMonth: Date;
  currentYear: Date;
  onViewModeChange?: (mode: ViewMode) => void;
  onMonthChange: (date: Date) => void;
  onYearChange: (date: Date) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
  showDone?: boolean;
  onShowDoneChange?: (show: boolean) => void;
}

export function TopBar({
  viewMode,
  currentMonth,
  currentYear,
  onViewModeChange,
  onMonthChange,
  onYearChange,
  onCreateClick,
  onSearchClick,
  showDone = true,
  onShowDoneChange,
}: TopBarProps) {
  const isYearView = viewMode === 'year';
  const [themeOpen, setThemeOpen] = useState(false);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        setThemeOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  return (
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-md grid grid-cols-3 items-center px-4 md:px-6 sticky top-0 z-30">
      <div className="flex justify-start" />
      <div className="flex items-center justify-center gap-1">
        {isYearView ? (
          <>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onYearChange(subYears(currentYear, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentYear.getFullYear()}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold min-w-[80px] text-center select-none"
              >
                {currentYear.getFullYear()}
              </motion.span>
            </AnimatePresence>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onYearChange(addYears(currentYear, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs ml-1 gap-1"
              onClick={() => {
                const today = new Date();
                onYearChange(today);
                onMonthChange(today);
                onViewModeChange?.('month');
              }}
            >
              Hoje
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
              onClick={() => onViewModeChange?.('year')}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ano</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMonthChange(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <AnimatePresence mode="wait">
              <motion.span
                key={format(currentMonth, 'yyyy-MM')}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-semibold min-w-[140px] text-center capitalize select-none"
              >
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </motion.span>
            </AnimatePresence>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onMonthChange(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs ml-1" onClick={() => onMonthChange(new Date())}>
              Hoje
            </Button>
          </>
        )}
      </div>
      <div className="flex items-center justify-end gap-1.5">
        {onShowDoneChange && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs text-muted-foreground"
            onClick={() => onShowDoneChange(!showDone)}
            title={showDone ? 'Ocultar concluídos' : 'Mostrar concluídos'}
          >
            <CheckSquare className={cn('h-3.5 w-3.5', showDone && 'text-primary')} />
            <span className="hidden sm:inline">Concluídos</span>
          </Button>
        )}
        <ThemeSwitcher open={themeOpen} onOpenChange={setThemeOpen} />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSearchClick} title="Buscar (Ctrl+K)">
          <Search className="h-4 w-4" />
        </Button>
        <Button onClick={onCreateClick} size="sm" className="h-8 gap-1 text-xs">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Post-it</span>
        </Button>
      </div>
    </header>
  );
}
