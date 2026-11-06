import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

 type Props = { children: ReactNode };
 type State = { hasError: boolean; reference: string };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, reference: "" };

  static getDerivedStateFromError(): State {
    return {
      hasError: true,
      reference: `DX-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("DivyaNexus application boundary", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main id="main-content" className="app-error-boundary" tabIndex={-1}>
        <div className="app-error-boundary__panel">
          <AlertTriangle size={42} aria-hidden="true" />
          <p className="scene-kicker">Recoverable application error</p>
          <h1>This study path could not open safely.</h1>
          <p>The page encountered an unexpected browser-side error. No account or cloud data was changed by this screen.</p>
          <p className="app-error-boundary__reference">Reference: {this.state.reference}</p>
          <div>
            <button type="button" onClick={() => window.location.reload()}><RefreshCw size={17} aria-hidden="true" />Reload page</button>
            <a href="/"><Home size={17} aria-hidden="true" />Return home</a>
          </div>
        </div>
      </main>
    );
  }
}
