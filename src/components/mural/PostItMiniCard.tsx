import { useMemo } from 'react';
import { StickyNote, FileText, Calendar, AlertTriangle, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PostIt, postItColorClass, isPostItDone } from '@/types/mural';
import { useTheme } from '@/hooks/useTheme';
import { useMotionVariants } from '@/lib/theme/useMotionVariants';
import { cn } from '@/lib/utils';
import { isBefore, startOfToday, parseISO } from 'date-fns';

interface PostItMiniCardProps {
  postIt: PostIt;
  onClick?: () => void;
  onToggleDone?: (postIt: PostIt) => void;
  showDoneButton?: boolean;
}

const typeIcons = {
  note: StickyNote,
  process: FileText,
  event: Calendar,
};

export function PostItMiniCard({ postIt, onClick, onToggleDone, showDoneButton = true }: PostItMiniCardProps) {
  const { themeId } = useTheme();
  const variants = useMotionVariants();
  const Icon = typeIcons[postIt.type];
  const done = isPostItDone(postIt);
  const rotation = useMemo(() => {
    const hash = postIt.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ((hash % 5) - 2.5) * 0.6;
  }, [postIt.id]);

  const isOverdue = !done && isBefore(parseISO(postIt.start_date), startOfToday());

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleDone?.(postIt);
  };

  return (
    <motion.div
      className={cn(
        'postit-card px-2 py-1.5 text-xs cursor-pointer border border-border/60 flex items-center gap-1.5',
        themeId === 'whiteboard' && 'postit-style-fold',
        postItColorClass[postIt.color],
        isOverdue && 'ring-1 ring-destructive/40',
        done && 'opacity-65'
      )}
      style={{
        rotate: `${rotation}deg`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
      }}
      data-status={postIt.status}
      whileHover={variants.cardHover}
      whileTap={variants.cardPress}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      layout
    >
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <Icon className="h-3 w-3 shrink-0 opacity-50" />
        <span className={cn('truncate font-medium text-foreground/90', done && 'line-through')}>
          {postIt.title}
        </span>
        {isOverdue && <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" />}
      </div>
      {showDoneButton && onToggleDone && (
        <button
          type="button"
          onClick={handleCheckClick}
          className="shrink-0 rounded p-0.5 text-foreground/60 hover:text-foreground hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={done ? 'Reabrir' : 'Concluir'}
        >
          {done ? (
            <CheckCircle className="h-3.5 w-3.5 text-status-done" />
          ) : (
            <Circle className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </motion.div>
  );
}
