import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../select';

describe('Select', () => {
  it('renders select without label', () => {
    render(
      <Select>
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders select with label', () => {
    render(
      <Select label="Choose option">
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
      </Select>
    );
    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <Select error="This field is required">
        <option value="">Choose...</option>
      </Select>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-500');
  });

  it('applies error styling when error is present', () => {
    render(
      <Select error="Error message">
        <option value="">Choose...</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
  });

  it('does not apply error styling when error is not present', () => {
    render(
      <Select>
        <option value="">Choose...</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-gray-300');
    expect(select).not.toHaveClass('border-red-500');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    
    await user.selectOptions(select, '1');
    expect(select.value).toBe('1');
  });

  it('applies custom className', () => {
    render(
      <Select className="custom-select">
        <option value="">Choose...</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-select');
  });

  it('passes through other HTML select attributes', () => {
    render(
      <Select required aria-label="Select an option">
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
    expect(select).toHaveAttribute('aria-label', 'Select an option');
  });

  it('renders all children options', () => {
    render(
      <Select>
        <option value="">Choose...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });
});

