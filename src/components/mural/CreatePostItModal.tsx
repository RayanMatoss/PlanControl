import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { StickyNote, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  PostIt, PostItColor, PostItStatus, PostItType,
  POST_IT_COLORS, postItColorClass, TEMPLATES,
} from '@/types/mural';
import { cn } from '@/lib/utils';

interface CreatePostItModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postIt: PostIt) => void;
  defaultDate: Date;
}

export function CreatePostItModal({ isOpen, onClose, onSubmit, defaultDate }: CreatePostItModalProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState<PostItColor>('yellow');
  const [type, setType] = useState<PostItType>('note');
  const [status, setStatus] = useState<PostItStatus>('idea');
  const [secretaria, setSecretaria] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const resetForm = () => {
    setTitle('');
    setBody('');
    setColor('yellow');
    setType('note');
    setStatus('idea');
    setSecretaria('');
    setTagsInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPostIt: PostIt = {
      id: crypto.randomUUID(),
      title: title.trim(),
      body: body.trim() || undefined,
      color,
      status,
      type,
      secretaria: secretaria.trim() || undefined,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      start_date: format(defaultDate, 'yyyy-MM-dd'),
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSubmit(newPostIt);
    resetForm();
  };

  const applyTemplate = (tpl: (typeof TEMPLATES)[0]) => {
    setTitle(tpl.title);
    setColor(tpl.color);
    setType(tpl.type);
    setStatus(tpl.status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px]">
        <DialogHeader className="shrink-0 space-y-1 border-b border-border/60 bg-muted/30 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <StickyNote className="h-4 w-4 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">Novo Post-it</DialogTitle>
              <p className="text-xs text-muted-foreground">
                {format(defaultDate, "EEEE, dd 'de' MMMM yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 pb-6">
          <div className="space-y-5 pb-1">
          <div>
            <Label className="mb-1.5 block text-xs font-medium text-muted-foreground">Modelos rápidos</Label>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.title}
                  type="button"
                  onClick={() => applyTemplate(tpl)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                    'border-border/80 bg-background hover:border-primary/40 hover:bg-accent/50',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30'
                  )}
                >
                  <span className={cn('mr-1.5 inline-block h-2 w-2 rounded-full', postItColorClass[tpl.color])} />
                  {tpl.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="postit-title" className="text-sm font-medium">Título</Label>
              <Input
                id="postit-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: ETP em elaboração..."
                className="h-10"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Cor</Label>
              <div className="flex gap-2.5">
                {POST_IT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Cor ${c}`}
                    className={cn(
                      'h-9 w-9 rounded-full border-2 transition-all',
                      postItColorClass[c],
                      color === c
                        ? 'border-foreground/40 scale-110 shadow-md'
                        : 'border-transparent hover:scale-105 hover:shadow-sm'
                    )}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={type} onValueChange={(v) => setType(v as PostItType)}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="note">Nota</SelectItem>
                    <SelectItem value="process">Processo</SelectItem>
                    <SelectItem value="event">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as PostItStatus)}>
                  <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Ideia</SelectItem>
                    <SelectItem value="doing">Em andamento</SelectItem>
                    <SelectItem value="done">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postit-secretaria" className="text-sm font-medium">Secretaria</Label>
              <Input
                id="postit-secretaria"
                value={secretaria}
                onChange={(e) => setSecretaria(e.target.value)}
                placeholder="Ex: Administração"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postit-tags" className="text-sm font-medium">Tags</Label>
              <Input
                id="postit-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: urgente, ETP (separadas por vírgula)"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postit-desc" className="text-sm font-medium">Descrição</Label>
              <Textarea
                id="postit-desc"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Detalhes ou observações..."
                className="min-h-[88px] resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => { onClose(); resetForm(); }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={!title.trim()}
              >
                <Plus className="h-4 w-4" />
                Criar Post-it
              </Button>
            </div>
          </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
