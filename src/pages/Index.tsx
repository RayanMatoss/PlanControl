import { useState, useEffect, useCallback } from 'react';
import { isSameDay } from 'date-fns';
import { TopBar } from '@/components/mural/TopBar';
import { YearView } from '@/components/mural/YearView';
import { CalendarMural } from '@/components/mural/CalendarMural';
import { DayDrawer } from '@/components/mural/DayDrawer';
import { CreatePostItModal } from '@/components/mural/CreatePostItModal';
import { CommandPalette } from '@/components/CommandPalette';
import { PostIt, isPostItDone } from '@/types/mural';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ViewMode = 'year' | 'month';

const CURRENT_USER_ID = 'current-user';

type PostItRow = Database['public']['Tables']['post_its']['Row'];

function rowToPostIt(row: PostItRow): PostIt {
  return {
    id: row.id,
    title: row.title,
    body: row.body ?? undefined,
    color: row.color,
    status: row.status,
    type: row.type,
    secretaria: row.secretaria ?? undefined,
    assigned_to: row.assigned_to ?? undefined,
    created_by: row.created_by,
    tags: row.tags ?? [],
    start_date: row.start_date,
    end_date: row.end_date ?? undefined,
    created_at: row.created_at,
    updated_at: row.updated_at,
    completed_at: row.completed_at ?? undefined,
    completed_by: row.completed_by ?? undefined,
  };
}

const Index = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [currentYear, setCurrentYear] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [postIts, setPostIts] = useState<PostIt[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date>(new Date());
  const [showDone, setShowDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('plancontrol_show_done') !== 'false';
    } catch {
      return true;
    }
  });
  const [loadingPostIts, setLoadingPostIts] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchPostIts() {
      const { data, error } = await supabase
        .from('post_its')
        .select('*')
        .order('start_date', { ascending: true });
      if (cancelled) return;
      if (error) {
        console.error('Erro ao carregar post-its:', error);
        setPostIts([]);
        setLoadingPostIts(false);
        return;
      }
      setPostIts((data ?? []).map(rowToPostIt));
      setLoadingPostIts(false);
    }
    fetchPostIts();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === 'n' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        setCreateDate(selectedDay || new Date());
        setIsCreateOpen(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !isInput) {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDay]);

  const handleDayClick = useCallback((date: Date) => {
    setSelectedDay(date);
  }, []);

  const handleMonthFromYearClick = useCallback((monthStart: Date) => {
    setCurrentMonth(monthStart);
    setCurrentYear(monthStart);
    setViewMode('month');
  }, []);

  const handleCreatePostIt = useCallback(
    async (newPostIt: PostIt) => {
      const { data, error } = await supabase
        .from('post_its')
        .insert({
          title: newPostIt.title,
          body: newPostIt.body ?? null,
          color: newPostIt.color,
          status: newPostIt.status,
          type: newPostIt.type,
          secretaria: newPostIt.secretaria ?? null,
          assigned_to: newPostIt.assigned_to ?? null,
          created_by: newPostIt.created_by,
          tags: newPostIt.tags ?? [],
          start_date: newPostIt.start_date,
          end_date: newPostIt.end_date ?? null,
        })
        .select('*')
        .single();
      if (error) {
        toast({
          title: 'Erro ao salvar',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      setPostIts((prev) => [...prev, rowToPostIt(data as PostItRow)]);
      setIsCreateOpen(false);
    },
    [toast]
  );

  const handleSelectPostIt = useCallback((postIt: PostIt) => {
    const date = new Date(postIt.start_date + 'T12:00:00');
    setSelectedDay(date);
    setCurrentMonth(date);
  }, []);

  const handleToggleDone = useCallback(
    async (postIt: PostIt) => {
      const done = isPostItDone(postIt);
      const previousList = postIts;
      const prevStatus = postIt.status;
      const newStatus = done ? ('doing' as const) : ('done' as const);
      const completedAt = done ? null : new Date().toISOString();
      // completed_by no DB é uuid; sem auth usamos null (na UI mantemos CURRENT_USER_ID)
      const completedByForDb = done ? null : null;

      setPostIts((prev) =>
        prev.map((p) =>
          p.id !== postIt.id
            ? p
            : done
              ? {
                  ...p,
                  status: (p.status === 'done' ? 'doing' : p.status) as PostIt['status'],
                  completed_at: undefined,
                  completed_by: undefined,
                }
              : {
                  ...p,
                  status: 'done' as const,
                  completed_at: new Date().toISOString(),
                  completed_by: CURRENT_USER_ID,
                }
        )
      );

      const { error } = await supabase
        .from('post_its')
        .update({
          status: newStatus,
          completed_at: completedAt,
          completed_by: completedByForDb,
        })
        .eq('id', postIt.id);

      if (error) {
        setPostIts(previousList);
        toast({
          title: 'Erro ao atualizar',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      const undoReaberto = async () => {
        const { error: err } = await supabase
          .from('post_its')
          .update({
            status: 'done',
            completed_at: postIt.completed_at ?? new Date().toISOString(),
            completed_by: null,
          })
          .eq('id', postIt.id);
        if (!err) setPostIts(previousList);
      };
      const undoConcluido = async () => {
        const { error: err } = await supabase
          .from('post_its')
          .update({
            status: prevStatus,
            completed_at: null,
            completed_by: null,
          })
          .eq('id', postIt.id);
        if (!err) {
          setPostIts((prev) =>
            prev.map((p) =>
              p.id !== postIt.id
                ? p
                : { ...p, status: prevStatus, completed_at: undefined, completed_by: undefined }
            )
          );
        }
      };

      if (done) {
        toast({
          title: 'Reaberto ↩️',
          description: 'Post-it marcado como pendente.',
          action: (
            <ToastAction altText="Desfazer" onClick={() => undoReaberto()}>
              Desfazer
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: 'Concluído ✅',
          description: 'Post-it marcado como concluído.',
          action: (
            <ToastAction altText="Desfazer" onClick={() => undoConcluido()}>
              Desfazer
            </ToastAction>
          ),
        });
      }
    },
    [postIts, toast]
  );

  useEffect(() => {
    try {
      localStorage.setItem('plancontrol_show_done', showDone ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [showDone]);

  const dayPostIts = selectedDay
    ? postIts
        .filter((p) => isSameDay(new Date(p.start_date + 'T12:00:00'), selectedDay))
        .sort((a, b) => (isPostItDone(a) === isPostItDone(b) ? 0 : isPostItDone(a) ? 1 : -1))
    : [];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopBar
        viewMode={viewMode}
        currentMonth={currentMonth}
        currentYear={currentYear}
        onViewModeChange={setViewMode}
        onMonthChange={(date) => {
          setCurrentMonth(date);
          setCurrentYear(date);
        }}
        onYearChange={setCurrentYear}
        onCreateClick={() => {
          setCreateDate(selectedDay || new Date());
          setIsCreateOpen(true);
        }}
        onSearchClick={() => setIsCommandOpen(true)}
        showDone={showDone}
        onShowDoneChange={setShowDone}
      />

      <div className="flex-1 flex flex-col mural-area overflow-hidden min-h-0">
        {viewMode === 'year' ? (
          <YearView
            currentYear={currentYear}
            postIts={postIts}
            onMonthClick={handleMonthFromYearClick}
          />
        ) : (
          <CalendarMural
            currentMonth={currentMonth}
            postIts={postIts}
            onDayClick={handleDayClick}
            selectedDay={selectedDay}
            showDone={showDone}
            onToggleDone={handleToggleDone}
          />
        )}
      </div>

      <DayDrawer
        selectedDay={selectedDay}
        postIts={dayPostIts}
        onClose={() => setSelectedDay(null)}
        onCreateClick={() => {
          if (selectedDay) setCreateDate(selectedDay);
          setIsCreateOpen(true);
        }}
        onToggleDone={handleToggleDone}
      />

      <CreatePostItModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreatePostIt}
        defaultDate={createDate}
      />

      <CommandPalette
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        postIts={postIts}
        onSelectPostIt={handleSelectPostIt}
        onCreateClick={() => {
          setIsCommandOpen(false);
          setIsCreateOpen(true);
        }}
      />
    </div>
  );
};

export default Index;
