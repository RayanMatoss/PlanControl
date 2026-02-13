import { StickyNote, Plus, CalendarDays } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { PostIt } from '@/types/mural';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postIts: PostIt[];
  onSelectPostIt: (postIt: PostIt) => void;
  onCreateClick: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  postIts,
  onSelectPostIt,
  onCreateClick,
}: CommandPaletteProps) {
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar post-its, ações..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Ações rápidas">
          <CommandItem
            onSelect={() => {
              onOpenChange(false);
              onCreateClick();
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar novo post-it
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Post-its">
          {postIts.slice(0, 20).map((p) => (
            <CommandItem
              key={p.id}
              onSelect={() => {
                onOpenChange(false);
                onSelectPostIt(p);
              }}
            >
              <StickyNote className="mr-2 h-4 w-4 opacity-50" />
              <span className="truncate">{p.title}</span>
              {p.secretaria && (
                <span className="ml-auto text-xs text-muted-foreground truncate">
                  {p.secretaria}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
