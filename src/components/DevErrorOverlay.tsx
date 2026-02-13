import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const isDev = import.meta.env.DEV;

/**
 * Em desenvolvimento: mostra um aviso fixo no site quando o código quebra
 * (erro de compilação Vite ou erro de runtime React).
 */
export function DevErrorOverlay() {
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);

  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (!isDev || !import.meta.hot) return;

    const unregisterError = import.meta.hot.on('vite:error', (payload: { err?: { message?: string; stack?: string } }) => {
      const msg = payload.err?.message ?? 'Erro de compilação';
      const details = payload.err?.stack?.split('\n').slice(0, 3).join('\n');
      setError({ message: msg, details });
    });

    const unregisterOk = import.meta.hot.on('vite:afterUpdate', () => {
      setError(null);
    });

    return () => {
      unregisterError();
      unregisterOk();
    };
  }, []);

  if (!isDev || !error) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] flex items-start gap-3 bg-destructive text-destructive-foreground px-4 py-3 shadow-lg border-b border-destructive/50"
      role="alert"
    >
      <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Código quebrou</p>
        <p className="text-xs opacity-90 truncate mt-0.5" title={error.message}>
          {error.message}
        </p>
        {error.details && (
          <pre className="text-[10px] mt-2 p-2 bg-black/20 rounded overflow-x-auto max-h-20 overflow-y-auto font-mono whitespace-pre-wrap break-all">
            {error.details}
          </pre>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive-foreground hover:bg-destructive-foreground/20 h-8"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          Recarregar
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive-foreground hover:bg-destructive-foreground/20 h-8 w-8"
          onClick={clearError}
          aria-label="Fechar aviso"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
