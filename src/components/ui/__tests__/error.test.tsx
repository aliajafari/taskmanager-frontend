import { render, screen } from '@testing-library/react';
import { Error } from '../error';

describe('Error', () => {
  it('renders default error message', () => {
    render(<Error />);
    expect(screen.getByText('An error occurred')).toBeInTheDocument();
  });

  it('renders custom error message', () => {
    render(<Error message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('has correct error styling', () => {
    const { container } = render(<Error message="Test error" />);
    const errorDiv = container.firstChild as HTMLElement;
    expect(errorDiv).toHaveClass(
      'p-4',
      'bg-red-50',
      'border',
      'border-red-200',
      'rounded-lg',
      'text-red-700'
    );
  });

  it('displays multiple error messages correctly', () => {
    const { rerender } = render(<Error message="First error" />);
    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(<Error message="Second error" />);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });
});

