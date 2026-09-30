import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  readonly fallback: ReactNode;
  readonly children: ReactNode;
}

interface State {
  readonly hasError: boolean;
}

/**
 * Catches errors thrown while rendering. A rejected promise never reaches it — the preview and
 * download handle their own failures — so this is the net for genuine bugs only.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    console.error('Invoicer hit an unexpected error.', error, info.componentStack);
  }

  render(): ReactNode {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
