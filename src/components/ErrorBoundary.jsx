import { Component } from 'react';

// Catches render-time errors anywhere below it so a single component
// crash doesn't blank the whole app.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging; wire to an error service here if desired.
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink text-fg font-sans flex items-center justify-center px-5 text-center">
          <div className="max-w-md">
            <h1 className="font-display font-extrabold text-2xl tracking-tight">Something went wrong.</h1>
            <p className="font-sans text-[14px] text-mid mt-3">
              An unexpected error occurred. Please reload the page.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="font-sans text-sm font-semibold text-ink bg-fg hover:bg-indigo hover:text-fg px-6 py-3.5 rounded-full transition-colors duration-500 shadow-glow mt-7"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
