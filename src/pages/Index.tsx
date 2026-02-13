import { useState, useEffect, useCallback } from 'react';
import { isSameDay } from 'date-fns';
import { TopBar } from '@/components/mural/TopBar';
import { CalendarMural } from '@/components/mural/CalendarMural';
import { DayDrawer } from '@/components/mural/DayDrawer';
import { CreatePostItModal } from '@/components/mural/CreatePostItModal';
import { CommandPalette } from '@/components/CommandPalette';
import { mockPostIts } from '@/data/mockData';
import { PostIt } from '@/types/mural';

const Index = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [postIts, setPostIts] = useState<PostIt[]>(mockPostIts);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [createDate, setCreateDate] = useState<Date>(new Date());

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

  const handleCreatePostIt = useCallback((newPostIt: PostIt) => {
    setPostIts((prev) => [...prev, newPostIt]);
    setIsCreateOpen(false);
  }, []);

  const handleSelectPostIt = useCallback((postIt: PostIt) => {
    const date = new Date(postIt.start_date + 'T12:00:00');
    setSelectedDay(date);
    setCurrentMonth(date);
  }, []);

  const dayPostIts = selectedDay
    ? postIts.filter((p) => isSameDay(new Date(p.start_date + 'T12:00:00'), selectedDay))
    : [];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      <TopBar
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onCreateClick={() => {
          setCreateDate(selectedDay || new Date());
          setIsCreateOpen(true);
        }}
        onSearchClick={() => setIsCommandOpen(true)}
      />

      <CalendarMural
        currentMonth={currentMonth}
        postIts={postIts}
        onDayClick={handleDayClick}
        selectedDay={selectedDay}
      />

      <DayDrawer
        selectedDay={selectedDay}
        postIts={dayPostIts}
        onClose={() => setSelectedDay(null)}
        onCreateClick={() => {
          if (selectedDay) setCreateDate(selectedDay);
          setIsCreateOpen(true);
        }}
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
