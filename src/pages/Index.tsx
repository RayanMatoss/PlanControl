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

type ViewMode = 'year' | 'month';

const CURRENT_USER_ID = 'current-user';

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

  const handleCreatePostIt = useCallback((newPostIt: PostIt) => {
    setPostIts((prev) => [...prev, newPostIt]);
    setIsCreateOpen(false);
  }, []);

  const handleSelectPostIt = useCallback((postIt: PostIt) => {
    const date = new Date(postIt.start_date + 'T12:00:00');
    setSelectedDay(date);
    setCurrentMonth(date);
  }, []);

  const handleToggleDone = useCallback(
    (postIt: PostIt) => {
      const done = isPostItDone(postIt);
      const previousList = postIts;
      const prevStatus = postIt.status;

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

      if (done) {
        toast({
          title: 'Reaberto ↩️',
          description: 'Post-it marcado como pendente.',
          action: (
            <ToastAction altText="Desfazer" onClick={() => setPostIts(previousList)}>
              Desfazer
            </ToastAction>
          ),
        });
      } else {
        toast({
          title: 'Concluído ✅',
          description: 'Post-it marcado como concluído.',
          action: (
            <ToastAction
              altText="Desfazer"
              onClick={() => {
                setPostIts((prev) =>
                  prev.map((p) =>
                    p.id !== postIt.id
                      ? p
                      : {
                          ...p,
                          status: prevStatus,
                          completed_at: undefined,
                          completed_by: undefined,
                        }
                  )
                );
              }}
            >
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
