import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ErrorPage, 
  BadRequestPage, 
  UnauthorizedPage, 
  ConflictPage, 
  APILimitExceededPage, 
  ServerErrorPage 
} from '../pages/UserMessages';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const error = this.state.error as any;
      if (error.response) {
        switch (error.response.status) {
          case 400:
            return <BadRequestPage message={error.response.data.message} />;
          case 401:
            return <UnauthorizedPage />;
          case 409:
            return <ConflictPage />;
          case 429:
            return <APILimitExceededPage />;
          case 500:
            return <ServerErrorPage />;
          default:
            return <ErrorPage message={error.response.data.message} />;
        }
      }
      return <ErrorPage message={error.message} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;