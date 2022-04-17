import React, { ErrorInfo } from 'react';
import Bugsnag from '@bugsnag/js';
import { Button } from '@nextui-org/react';

class ErrorBoundary extends React.Component<{ children: JSX.Element }> {
  state: { hasError: boolean };

  constructor(props: any) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Bugsnag.notify(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Looks like there is an error 🙄. Try to reload the page.</h2>
          <Button
            color="primary"
            size="xl"
            onClick={() => window.location.reload()}>
            Reload?
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
