import { useMemo } from 'react';
import { StickyNote, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PostIt, postItColorClass } from '@/types/mural';
import { cn } from '@/lib/utils';
import { isBefore, startOfToday, parseISO } from 'date-fns';

interface PostItMiniCardProps {
  postIt: PostIt;
  onClick?: () => void;
}

const typeIcons = {
  note: StickyNote,
  process: FileText,
  event: Calendar,
};

export function PostItMiniCard({ postIt, onClick }: PostItMiniCardProps) {
  const Icon = typeIcons[postIt.type];
  const rotation = useMemo(() => {
    const hash = postIt.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return ((hash % 5) - 2.5) * 0.6;
  }, [postIt.id]);

  const isOverdue = postIt.status !== 'done' && isBefore(parseISO(postIt.start_date), startOfToday());

  return (
    <motion.div
      className={cn(
        'postit-card px-2 py-1.5 text-xs cursor-pointer shadow-sm',
        postItColorClass[postIt.color],
        isOverdue && 'ring-1 ring-destructive/40'
      )}
      style={{ rotate: `${rotation}deg` }}
      whileHover={{ scale: 1.04, rotate: 0, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      layout
    >
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0 opacity-50" />
        <span className="truncate font-medium text-foreground/90">{postIt.title}</span>
        {isOverdue && <AlertTriangle className="h-3 w-3 shrink-0 text-destructive" />}
      </div>
    </motion.div>
  );
}
