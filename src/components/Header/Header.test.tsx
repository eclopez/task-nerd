import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should render', () => {
    render(<Header />);
    expect(
      screen.getByRole('heading', { name: /task nerd/i }),
    ).toBeInTheDocument();
  });
});
