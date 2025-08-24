import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../../src/Components/Input';

describe('Input Component', () => {
  it('renders input with basic props', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value="test value"
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('test value');
  });

  it('renders with label when provided', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
        label="Test Label"
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
      />
    );
    
    const container = screen.getByRole('textbox').closest('div');
    expect(container?.querySelector('span')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
        className="custom-class"
      />
    );
    
    const container = screen.getByRole('textbox').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom style', () => {
    const mockOnChange = vi.fn();
    const customStyle = { backgroundColor: 'red' };
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
        style={customStyle}
      />
    );
    
    const container = screen.getByRole('textbox').closest('div');
    expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('defaults to text type when type not specified', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('accepts custom input type', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
        type="email"
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('calls onChange when input value changes', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  it('calls onChange multiple times for multiple changes', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.change(input, { target: { value: 'second' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenNthCalledWith(1, 'first');
    expect(mockOnChange).toHaveBeenNthCalledWith(2, 'second');
  });

  it('renders with password type', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
        type="password"
      />
    );
    
    const input = screen.getByDisplayValue('');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('handles empty string value', () => {
    const mockOnChange = vi.fn();
    
    render(
      <Input 
        value=""
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });
});
