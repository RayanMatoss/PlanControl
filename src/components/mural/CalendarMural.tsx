import { useMemo } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameMonth, isToday, isSameDay,
} from 'date-fns';
import { PostIt, DayData } from '@/types/mural';
import { DayCell } from './DayCell';

interface CalendarMuralProps {
  currentMonth: Date;
  postIts: PostIt[];
  onDayClick: (date: Date) => void;
  selectedDay: Date | null;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function CalendarMural({ currentMonth, postIts, onDayClick, selectedDay }: CalendarMuralProps) {
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const dayDataList: DayData[] = useMemo(() => {
    return days.map((date) => ({
      date,
      isCurrentMonth: isSameMonth(date, currentMonth),
      isToday: isToday(date),
      postIts: postIts.filter((p) =>
        isSameDay(new Date(p.start_date + 'T12:00:00'), date)
      ),
    }));
  }, [days, currentMonth, postIts]);

  const rows = Math.ceil(days.length / 7);

  return (
    <div className="flex-1 flex flex-col p-3 md:p-4 overflow-hidden">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[11px] font-semibold text-muted-foreground py-1.5 uppercase tracking-wider select-none"
          >
            {day}
          </div>
        ))}
      </div>
      <div
        className="grid grid-cols-7 gap-1 flex-1"
        style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
      >
        {dayDataList.map((dayData, i) => (
          <DayCell
            key={i}
            dayData={dayData}
            onClick={() => onDayClick(dayData.date)}
            isSelected={selectedDay ? isSameDay(dayData.date, selectedDay) : false}
          />
        ))}
      </div>
    </div>
  );
}
