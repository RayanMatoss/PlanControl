export type PostItType = 'note' | 'process' | 'event';
export type PostItStatus = 'idea' | 'doing' | 'done';
export type PostItColor = 'yellow' | 'pink' | 'blue' | 'green' | 'orange';

export interface PostIt {
  id: string;
  title: string;
  body?: string;
  color: PostItColor;
  status: PostItStatus;
  type: PostItType;
  secretaria?: string;
  assigned_to?: string;
  created_by: string;
  tags: string[];
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  /** Preenchido quando status = 'done' */
  completed_at?: string | null;
  /** ID do usuário que marcou como concluído */
  completed_by?: string | null;
}

/** Post-it está concluído (status done e/ou completed_at preenchido) */
export function isPostItDone(p: PostIt): boolean {
  return p.status === 'done' || !!p.completed_at;
}

export interface DayData {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  postIts: PostIt[];
}

export const POST_IT_COLORS: PostItColor[] = ['yellow', 'pink', 'blue', 'green', 'orange'];

export const postItColorClass: Record<PostItColor, string> = {
  yellow: 'bg-postit-yellow',
  pink: 'bg-postit-pink',
  blue: 'bg-postit-blue',
  green: 'bg-postit-green',
  orange: 'bg-postit-orange',
};

export const statusConfig: Record<PostItStatus, { label: string; dotClass: string }> = {
  idea: { label: 'Ideia', dotClass: 'bg-status-idea' },
  doing: { label: 'Em andamento', dotClass: 'bg-status-doing' },
  done: { label: 'Concluído', dotClass: 'bg-status-done' },
};

export const typeConfig: Record<PostItType, { label: string; icon: string }> = {
  note: { label: 'Nota', icon: 'sticky-note' },
  process: { label: 'Processo', icon: 'file-text' },
  event: { label: 'Evento', icon: 'calendar' },
};

export const TEMPLATES = [
  { title: 'Solicitar demandas', color: 'yellow' as PostItColor, type: 'process' as PostItType, status: 'idea' as PostItStatus },
  { title: 'ETP em elaboração', color: 'blue' as PostItColor, type: 'process' as PostItType, status: 'doing' as PostItStatus },
  { title: 'TR revisar', color: 'orange' as PostItColor, type: 'process' as PostItType, status: 'doing' as PostItStatus },
  { title: 'Publicar no PNCP', color: 'green' as PostItColor, type: 'event' as PostItType, status: 'idea' as PostItStatus },
];
