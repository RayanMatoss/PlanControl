import { Palette, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { THEME_IDS, type ThemeId, type MotionLevel } from '@/lib/theme/registry';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const MOTION_LABELS: Record<MotionLevel, string> = {
  off: 'Sem animação',
  low: 'Pouco',
  high: 'Alto',
};

export function ThemeSwitcher({ open, onOpenChange }: ThemeSwitcherProps) {
  const { themeId, setTheme, motionLevel, setMotionLevel, registry } = useTheme();

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Tema (Ctrl+Shift+T)">
          <Palette className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="theme-switcher-panel w-[340px] p-2 border border-[hsl(var(--border))]"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 mb-1">
          <p className="theme-switcher-title text-xs font-semibold uppercase tracking-wider">
            Tema do Mural
          </p>
        </div>
        <div className="grid gap-1.5">
          {THEME_IDS.map((id, i) => {
            const pack = registry[id];
            const isActive = themeId === id;
            return (
              <motion.button
                key={id}
                type="button"
                onClick={() => setTheme(id)}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-2.5 text-left transition-colors theme-switcher-card',
                  'hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive && 'ring-2 ring-primary border-primary/50 bg-primary/10'
                )}
              >
                <div
                  className="theme-preview h-12 w-[4.5rem] shrink-0 overflow-hidden border bg-background"
                  style={{
                    backgroundColor: pack.previewColors.bg,
                    borderColor: pack.previewColors.cardBorder ?? 'hsl(var(--border))',
                  }}
                  data-theme={id}
                >
                  <div
                    className="mt-1.5 ml-1.5 h-6 w-10 border border-border/60"
                    style={{ backgroundColor: pack.previewColors.card }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold leading-tight theme-switcher-name">
                    {pack.name}
                  </p>
                  <p className="theme-switcher-desc text-[11px] leading-snug line-clamp-2 mt-0.5">
                    {pack.description}
                  </p>
                </div>
                {isActive && (
                  <span className="text-primary text-xs font-semibold shrink-0">Ativo</span>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-[hsl(var(--border))]">
          <div className="px-2 py-1.5 mb-1.5 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 theme-switcher-desc" />
            <p className="theme-switcher-title text-xs font-semibold uppercase tracking-wider">
              Animações
            </p>
          </div>
          <div className="flex gap-1">
            {(['off', 'low', 'high'] as MotionLevel[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setMotionLevel(level)}
                className={cn(
                  'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors theme-switcher-motion-btn',
                  'hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  motionLevel === level
                    ? 'border-primary bg-primary/15 text-primary font-semibold'
                    : 'border-[hsl(var(--border))] theme-switcher-desc'
                )}
              >
                {MOTION_LABELS[level]}
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
