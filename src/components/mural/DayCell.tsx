import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { DayData, PostIt } from '@/types/mural';
import { PostItMiniCard } from './PostItMiniCard';
import { useMotionVariants } from '@/lib/theme/useMotionVariants';
import { cn } from '@/lib/utils';

interface DayCellProps {
  dayData: DayData;
  onClick: () => void;
  isSelected: boolean;
  onPostItClick?: (postItId: string) => void;
  onToggleDone?: (postIt: PostIt) => void;
}

const MAX_VISIBLE = 3;

export function DayCell({ dayData, onClick, isSelected, onPostItClick, onToggleDone }: DayCellProps) {
  const variants = useMotionVariants();
  const { date, isCurrentMonth, isToday, postIts } = dayData;
  const overflow = postIts.length - MAX_VISIBLE;

  return (
    <motion.div
      className={cn(
        'day-cell flex flex-col',
        isToday && 'is-today',
        isSelected && 'is-selected',
        !isCurrentMonth && 'is-other-month'
      )}
      data-count={postIts.length >= 5 ? 'many' : undefined}
      onClick={onClick}
      whileTap={variants.cardPress}
      layout
    >
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
            isToday && 'bg-primary text-primary-foreground'
          )}
        >
          {format(date, 'd')}
        </span>
        {postIts.length > 0 && (
          <span className="text-[10px] text-muted-foreground font-medium">
            {postIts.length}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-h-0">
        {postIts.slice(0, MAX_VISIBLE).map((postIt) => (
          <PostItMiniCard
            key={postIt.id}
            postIt={postIt}
            onClick={() => onPostItClick?.(postIt.id)}
            onToggleDone={onToggleDone}
            showDoneButton
          />
        ))}
        {overflow > 0 && (
          <span className="text-[10px] text-muted-foreground text-center font-medium py-0.5">
            +{overflow} mais
          </span>
        )}
      </div>
    </motion.div>
  );
}
