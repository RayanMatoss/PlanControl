import { useState } from 'react';
import { format } from 'date-fns';
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

  const applyTemplate = (tpl: typeof TEMPLATES[0]) => {
    setTitle(tpl.title);
    setColor(tpl.color);
    setType(tpl.type);
    setStatus(tpl.status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { onClose(); resetForm(); } }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-base">
            Novo Post-it · {format(defaultDate, 'dd/MM/yyyy')}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-1.5 mb-1">
          {TEMPLATES.map((tpl) => (
            <Button
              key={tpl.title}
              type="button"
              variant="outline"
              size="sm"
              className="text-[11px] h-7"
              onClick={() => applyTemplate(tpl)}
            >
              {tpl.title}
            </Button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-xs">Título</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: ETP em elaboração..."
              autoFocus
            />
          </div>

          <div>
            <Label className="text-xs mb-1.5 block">Cor</Label>
            <div className="flex gap-2">
              {POST_IT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={cn(
                    'w-8 h-8 rounded-full transition-all',
                    postItColorClass[c],
                    color === c ? 'ring-2 ring-ring ring-offset-2 scale-110' : 'hover:scale-105'
                  )}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType(v as PostItType)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Nota</SelectItem>
                  <SelectItem value="process">Processo</SelectItem>
                  <SelectItem value="event">Evento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PostItStatus)}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Ideia</SelectItem>
                  <SelectItem value="doing">Em andamento</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Secretaria</Label>
            <Input
              value={secretaria}
              onChange={(e) => setSecretaria(e.target.value)}
              placeholder="Ex: Administração"
            />
          </div>

          <div>
            <Label className="text-xs">Tags (separadas por vírgula)</Label>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: urgente, ETP"
            />
          </div>

          <div>
            <Label className="text-xs">Descrição</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Detalhes..."
              className="min-h-[80px] resize-none"
            />
          </div>

          <Button type="submit" className="w-full" disabled={!title.trim()}>
            Criar Post-it
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
