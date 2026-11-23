import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ServerErrorView } from './ServerErrorView';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terranova GlobalErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleResetData = () => {
    try {
      localStorage.removeItem('terranova_contracts');
      localStorage.removeItem('terranova_properties');
      localStorage.removeItem('terranova_users');
      localStorage.removeItem('terranova_contract_templates');
      localStorage.removeItem('terranova_payroll_records');
      localStorage.removeItem('terranova_employees');
      window.location.reload();
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center p-4">
          <ServerErrorView
            errorCode={500}
            errorMessage={this.state.error?.message || 'Error imprevisto en tiempo de ejecución'}
            errorStack={this.state.error?.stack || this.state.errorInfo?.componentStack || undefined}
            onRetry={this.handleReset}
            onGoHome={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
              window.location.href = '/';
            }}
            onResetData={this.handleResetData}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
