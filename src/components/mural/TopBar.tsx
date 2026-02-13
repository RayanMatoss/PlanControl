import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus, Search, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onCreateClick: () => void;
  onSearchClick: () => void;
}

export function TopBar({ currentMonth, onMonthChange, onCreateClick, onSearchClick }: TopBarProps) {
  return (
    <header className="h-16 border-b border-border/60 bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <LayoutGrid className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-bold tracking-tight hidden sm:block">Mural</h1>
      </div>

      <div className="flex items-center gap-1">
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
      </div>

      <div className="flex items-center gap-1.5">
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
