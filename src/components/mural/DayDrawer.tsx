import { useState, useEffect } from 'react';
import { format, isBefore, startOfToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, ArrowLeft, StickyNote, FileText, Calendar, AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PostIt, postItColorClass, statusConfig, typeConfig } from '@/types/mural';
import { cn } from '@/lib/utils';

interface DayDrawerProps {
  selectedDay: Date | null;
  postIts: PostIt[];
  onClose: () => void;
  onCreateClick: () => void;
}

const typeIcons = { note: StickyNote, process: FileText, event: Calendar };

export function DayDrawer({ selectedDay, postIts, onClose, onCreateClick }: DayDrawerProps) {
  const [selectedPostIt, setSelectedPostIt] = useState<PostIt | null>(null);

  useEffect(() => {
    setSelectedPostIt(null);
  }, [selectedDay]);

  return (
    <Sheet open={!!selectedDay} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[380px] sm:w-[440px] flex flex-col p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <SheetTitle className="text-base capitalize">
            {selectedDay && format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            {selectedPostIt ? (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-3 -ml-2 gap-1 text-xs text-muted-foreground"
                  onClick={() => setSelectedPostIt(null)}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Voltar
                </Button>
                <PostItDetail postIt={selectedPostIt} />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2.5"
              >
                {postIts.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <StickyNote className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    Nenhum post-it neste dia.
                  </div>
                )}
                {postIts.map((postIt, i) => (
                  <PostItListItem
                    key={postIt.id}
                    postIt={postIt}
                    index={i}
                    onClick={() => setSelectedPostIt(postIt)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-5 py-3 border-t border-border/50">
          <Button onClick={onCreateClick} size="sm" className="w-full gap-1.5">
            <Plus className="h-4 w-4" /> Novo Post-it
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PostItListItem({ postIt, index, onClick }: { postIt: PostIt; index: number; onClick: () => void }) {
  const Icon = typeIcons[postIt.type];
  const isOverdue = postIt.status !== 'done' && isBefore(parseISO(postIt.start_date), startOfToday());
  const sc = statusConfig[postIt.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'postit-card p-3 cursor-pointer shadow-sm border border-foreground/5',
        postItColorClass[postIt.color],
        isOverdue && 'ring-1 ring-destructive/30'
      )}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Icon className="h-4 w-4 shrink-0 opacity-50" />
          <span className="font-semibold text-sm truncate">{postIt.title}</span>
        </div>
        {isOverdue && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <div className={cn('w-2 h-2 rounded-full', sc.dotClass)} />
        <span className="text-[11px] text-foreground/60">{sc.label}</span>
        {postIt.secretaria && (
          <span className="text-[11px] text-foreground/50 ml-auto truncate">{postIt.secretaria}</span>
        )}
      </div>
    </motion.div>
  );
}

function PostItDetail({ postIt }: { postIt: PostIt }) {
  const Icon = typeIcons[postIt.type];
  const sc = statusConfig[postIt.status];
  const tc = typeConfig[postIt.type];
  const isOverdue = postIt.status !== 'done' && isBefore(parseISO(postIt.start_date), startOfToday());

  return (
    <div className={cn('postit-card p-5 shadow-md', postItColorClass[postIt.color])}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 opacity-60" />
        <h3 className="font-bold text-lg leading-tight">{postIt.title}</h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="secondary" className="text-[11px] gap-1">
          <div className={cn('w-2 h-2 rounded-full', sc.dotClass)} />
          {sc.label}
        </Badge>
        <Badge variant="secondary" className="text-[11px]">{tc.label}</Badge>
        {isOverdue && (
          <Badge variant="destructive" className="text-[11px] gap-1">
            <Clock className="h-3 w-3" /> Atrasado
          </Badge>
        )}
      </div>

      {postIt.body && (
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">{postIt.body}</p>
      )}

      <div className="space-y-1.5 text-xs text-foreground/60">
        {postIt.secretaria && <div><strong>Secretaria:</strong> {postIt.secretaria}</div>}
        <div><strong>Data:</strong> {format(parseISO(postIt.start_date), "dd/MM/yyyy")}</div>
        {postIt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {postIt.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
