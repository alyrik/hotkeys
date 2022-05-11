import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import IndexPage from '@/pages/index';

describe('IndexPage', () => {
  it('renders page with default button text when screenNumber is 0', () => {
    render(<IndexPage screenNumber={0} />);

    const button = screen.getByText('Continue your survey!');

    expect(button).toBeInTheDocument();
  });
});
