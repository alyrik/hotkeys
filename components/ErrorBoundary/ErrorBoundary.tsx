import React, { ErrorInfo } from 'react';
import Bugsnag from '@bugsnag/js';
import { Button, Container, Row } from '@nextui-org/react';

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
        <Container
          direction="column"
          display="flex"
          style={{ minHeight: '100%' }}>
          <Container
            direction="column"
            display="flex"
            justify="center"
            css={{ flex: '1', maxWidth: 800, p: 0 }}>
            <Row>
              <h2>Looks like there is an error 🙄. Try to reload the page.</h2>
            </Row>
            <Row>
              <Button
                color="primary"
                size="xl"
                onClick={() => window.location.reload()}>
                Reload?
              </Button>
            </Row>
          </Container>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
