import { Settings } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Configuracoes = () => {
  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <header className="border-b border-border/60 bg-card/80 backdrop-blur-md px-4 py-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Settings className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Configurações</h1>
            <p className="text-xs text-muted-foreground">Ajustes básicos do PlanControl</p>
          </div>
        </div>
        <ThemeSwitcher />
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Geral</CardTitle>
              <CardDescription>Preferências gerais da aplicação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="week-start">Primeiro dia da semana</Label>
                  <p className="text-xs text-muted-foreground">Domingo ou Segunda-feira no calendário</p>
                </div>
                <Switch id="week-start" disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="notifications">Notificações</Label>
                  <p className="text-xs text-muted-foreground">Lembretes de post-its e prazos</p>
                </div>
                <Switch id="notifications" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aparência</CardTitle>
              <CardDescription>Tema e exibição</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-view">Visual compacto</Label>
                  <p className="text-xs text-muted-foreground">Menos espaçamento no calendário</p>
                </div>
                <Switch id="compact-view" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Configuracoes;
