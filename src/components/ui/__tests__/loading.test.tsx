import { render, screen } from '@testing-library/react';
import { Loading } from '../loading';

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('has correct spinner styling', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-blue-600');
  });

  it('is centered in container', () => {
    const { container } = render(<Loading />);
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toHaveClass('flex', 'items-center', 'justify-center', 'p-8');
  });
});

