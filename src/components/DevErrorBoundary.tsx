import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const isDev = import.meta.env.DEV;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary para desenvolvimento: quando um erro de React acontece,
 * mostra um aviso no site em vez de tela branca.
 */
export class DevErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (isDev) {
      console.error('DevErrorBoundary:', error, errorInfo);
    }
  }

  render() {
    if (isDev && this.state.hasError && this.state.error) {
      return (
        <div className="fixed inset-0 z-[99] flex items-center justify-center bg-background/95 p-4">
          <div className="max-w-lg w-full rounded-xl border-2 border-destructive/50 bg-card p-6 shadow-xl">
            <div className="flex items-center gap-3 text-destructive mb-4">
              <AlertTriangle className="h-8 w-8 shrink-0" />
              <div>
                <h2 className="font-bold text-lg">Código quebrou (runtime)</h2>
                <p className="text-sm text-muted-foreground">Erro ao renderizar o componente</p>
              </div>
            </div>
            <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto max-h-40 overflow-y-auto font-mono whitespace-pre-wrap break-words mb-4">
              {this.state.error.message}
            </pre>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Tentar de novo
              </Button>
              <Button
                variant="default"
                size="sm"
                className="gap-1"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
