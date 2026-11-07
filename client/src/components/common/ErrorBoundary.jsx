import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[DSAvation UI ErrorBoundary]', error, errorInfo?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback-container" role="alert">
          <div className="error-fallback-card">
            <div className="error-fallback-icon" aria-hidden="true">⚠️</div>
            <h2>Something went wrong</h2>
            <p>
              An unexpected display issue occurred in this section. Your personal and club progress remains safe in the database.
            </p>
            <div className="error-fallback-actions">
              <button type="button" className="button button-dark" onClick={this.handleReset}>
                Try again
              </button>
              <button type="button" className="button button-quiet" onClick={this.handleReload}>
                Reload page
              </button>
            </div>
            {this.state.error?.message && (
              <details className="error-fallback-details">
                <summary>Technical error details</summary>
                <code>{this.state.error.message}</code>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

