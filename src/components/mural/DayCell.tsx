import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { DayData } from '@/types/mural';
import { PostItMiniCard } from './PostItMiniCard';
import { cn } from '@/lib/utils';

interface DayCellProps {
  dayData: DayData;
  onClick: () => void;
  isSelected: boolean;
  onPostItClick?: (postItId: string) => void;
}

const MAX_VISIBLE = 3;

export function DayCell({ dayData, onClick, isSelected, onPostItClick }: DayCellProps) {
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
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
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
