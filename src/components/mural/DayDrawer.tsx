import { useState, useEffect, useMemo } from 'react';
import { format, isBefore, startOfToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, ArrowLeft, StickyNote, FileText, Calendar, AlertTriangle, Clock, Lightbulb, Loader2, CheckCircle2, ChevronDown, ChevronRight, Circle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PostIt, postItColorClass, statusConfig, typeConfig, isPostItDone } from '@/types/mural';
import { useTheme } from '@/hooks/useTheme';
import { useMotionVariants } from '@/lib/theme/useMotionVariants';
import { cn } from '@/lib/utils';

const KANBAN_SECTIONS: { status: PostIt['status']; label: string; icon: typeof Lightbulb }[] = [
  { status: 'idea', label: 'Ideia', icon: Lightbulb },
  { status: 'doing', label: 'Em andamento', icon: Loader2 },
  { status: 'done', label: 'Concluído', icon: CheckCircle2 },
];

interface DayDrawerProps {
  selectedDay: Date | null;
  postIts: PostIt[];
  onClose: () => void;
  onCreateClick: () => void;
  onToggleDone?: (postIt: PostIt) => void;
}

const typeIcons = { note: StickyNote, process: FileText, event: Calendar };

export function DayDrawer({ selectedDay, postIts, onClose, onCreateClick, onToggleDone }: DayDrawerProps) {
  const [selectedPostIt, setSelectedPostIt] = useState<PostIt | null>(null);
  const [concluidosOpen, setConcluidosOpen] = useState(false);
  const { themeId } = useTheme();
  const variants = useMotionVariants();
  const isKanban = themeId === 'kanban';

  const pendentes = useMemo(() => postIts.filter((p) => !isPostItDone(p)), [postIts]);
  const concluidos = useMemo(() => postIts.filter(isPostItDone), [postIts]);

  const postItsByStatus = useMemo(() => {
    if (!isKanban) return null;
    return {
      idea: postIts.filter((p) => p.status === 'idea'),
      doing: postIts.filter((p) => p.status === 'doing'),
      done: concluidos,
    };
  }, [postIts, isKanban, concluidos]);

  useEffect(() => {
    setSelectedPostIt(null);
  }, [selectedDay]);

  return (
    <Dialog open={!!selectedDay} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-md flex-col gap-0 p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 border-b border-border/50 px-5 py-4">
          <DialogTitle className="text-base font-semibold capitalize text-left">
            {selectedDay && format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <AnimatePresence mode="wait">
            {selectedPostIt ? (
              <motion.div
                key="detail"
                initial={variants.drawerIn.initial}
                animate={variants.drawerIn.animate}
                exit={variants.drawerIn.exit}
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
            ) : isKanban && postItsByStatus ? (
              <motion.div
                key="list-kanban"
                initial={variants.drawerIn.initial}
                animate={variants.drawerIn.animate}
                exit={variants.drawerIn.exit}
                className="space-y-4"
              >
                {KANBAN_SECTIONS.map(({ status, label, icon: Icon }) => {
                  const items = postItsByStatus[status];
                  return (
                    <div key={status}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        {items.length > 0 && (
                          <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                            {items.length}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {items.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground/70 py-1">Nenhum</p>
                        ) : (
                          items.map((postIt, i) => (
                            <PostItListItem
                              key={postIt.id}
                              postIt={postIt}
                              index={i}
                              onClick={() => setSelectedPostIt(postIt)}
                              onToggleDone={onToggleDone}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={variants.drawerIn.initial}
                animate={variants.drawerIn.animate}
                exit={variants.drawerIn.exit}
                className="space-y-4"
              >
                {/* Pendentes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pendentes
                    </span>
                    {pendentes.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                        {pendentes.length}
                      </Badge>
                    )}
                  </div>
                  {pendentes.length === 0 && concluidos.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm">
                      <StickyNote className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      Nenhum post-it neste dia.
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {pendentes.map((postIt, i) => (
                      <PostItListItem
                        key={postIt.id}
                        postIt={postIt}
                        index={i}
                        onClick={() => setSelectedPostIt(postIt)}
                        onToggleDone={onToggleDone}
                      />
                    ))}
                  </div>
                </div>

                {/* Concluídos (colapsável) */}
                {concluidos.length > 0 && (
                  <Collapsible open={concluidosOpen} onOpenChange={setConcluidosOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between px-2 py-1.5 h-auto text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      >
                        <span className="flex items-center gap-2">
                          {concluidosOpen ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5" />
                          )}
                          Concluídos
                        </span>
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
                          {concluidos.length}
                        </Badge>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="space-y-1.5 pt-1.5">
                        {concluidos.map((postIt, i) => (
                          <PostItListItem
                            key={postIt.id}
                            postIt={postIt}
                            index={i}
                            onClick={() => setSelectedPostIt(postIt)}
                            onToggleDone={onToggleDone}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="shrink-0 border-t border-border/50 px-5 py-3">
          <Button onClick={onCreateClick} size="sm" className="w-full gap-1.5">
            <Plus className="h-4 w-4" /> Novo Post-it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PostItListItem({
  postIt,
  index,
  onClick,
  onToggleDone,
}: {
  postIt: PostIt;
  index: number;
  onClick: () => void;
  onToggleDone?: (postIt: PostIt) => void;
}) {
  const { themeId } = useTheme();
  const variants = useMotionVariants();
  const Icon = typeIcons[postIt.type];
  const done = isPostItDone(postIt);
  const isOverdue = !done && isBefore(parseISO(postIt.start_date), startOfToday());
  const sc = statusConfig[postIt.status];

  const handleCheckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleDone?.(postIt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'postit-card p-3 cursor-pointer border border-border/60',
        themeId === 'whiteboard' && 'postit-style-fold',
        postItColorClass[postIt.color],
        isOverdue && 'ring-1 ring-destructive/30',
        done && 'opacity-65'
      )}
      style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}
      data-status={postIt.status}
      onClick={onClick}
      whileHover={variants.cardHover}
      whileTap={variants.cardPress}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Icon className="h-4 w-4 shrink-0 opacity-50" />
          <span className={cn('font-semibold text-sm truncate', done && 'line-through')}>
            {postIt.title}
          </span>
          {done && (
            <Badge variant="secondary" className="text-[10px] shrink-0">
              Concluído
            </Badge>
          )}
          {isOverdue && <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />}
        </div>
        {onToggleDone && (
          <button
            type="button"
            onClick={handleCheckClick}
            className="shrink-0 rounded p-1 text-foreground/60 hover:text-foreground hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={done ? 'Reabrir' : 'Concluir'}
          >
            {done ? (
              <CheckCircle className="h-4 w-4 text-status-done" />
            ) : (
              <Circle className="h-4 w-4" />
            )}
          </button>
        )}
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
  const { themeId } = useTheme();
  const Icon = typeIcons[postIt.type];
  const sc = statusConfig[postIt.status];
  const tc = typeConfig[postIt.type];
  const done = isPostItDone(postIt);
  const isOverdue = !done && isBefore(parseISO(postIt.start_date), startOfToday());

  return (
    <div
      className={cn(
        'postit-card p-5 border border-border/60',
        themeId === 'whiteboard' && 'postit-style-fold',
        postItColorClass[postIt.color],
        done && 'opacity-65'
      )}
      style={{ borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)' }}
      data-status={postIt.status}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-5 w-5 opacity-60" />
        <h3 className={cn('font-bold text-lg leading-tight', done && 'line-through')}>{postIt.title}</h3>
        {done && (
          <Badge variant="secondary" className="text-[11px]">Concluído</Badge>
        )}
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
