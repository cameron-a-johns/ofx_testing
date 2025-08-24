import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DropDown from '../../src/Components/DropDown/DropDown';

const mockOptions = [
  { option: 'Option 1', key: 'opt1', icon: <span>🚀</span> },
  { option: 'Option 2', key: 'opt2', icon: <span>⭐</span> },
  { option: 'Option 3', key: 'opt3', icon: <span>🎯</span> },
];

describe('DropDown Component', () => {
  let mockSetSelected: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSetSelected = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropdown with basic props', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Current Selection')).toBeInTheDocument();
  });

  it('renders with label when provided', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
        label="Test Label"
      />
    );
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const container = screen.getByRole('button').closest('div');
    expect(container?.querySelector('span:first-child')).toHaveTextContent('Current Selection');
  });

  it('applies custom className', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
        className="custom-class"
      />
    );
    
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
        style={customStyle}
      />
    );
    
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('renders left icon when provided', () => {
    const leftIcon = <span data-testid="left-icon">📍</span>;
    
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
        leftIcon={leftIcon}
      />
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('does not show menu initially', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });

  it('shows menu when dropdown is clicked', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('hides menu when dropdown is clicked twice', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    
    // Open menu
    fireEvent.click(button);
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    // Close menu
    fireEvent.click(button);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders all options with icons', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('🚀')).toBeInTheDocument();
    expect(screen.getByText('⭐')).toBeInTheDocument();
    expect(screen.getByText('🎯')).toBeInTheDocument();
  });

  it('calls setSelected when option is clicked', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const dropdown = screen.getByRole('button');
    fireEvent.click(dropdown);
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(mockSetSelected).toHaveBeenCalledTimes(1);
    expect(mockSetSelected).toHaveBeenCalledWith('opt1');
  });

  it('closes menu after option selection', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const dropdown = screen.getByRole('button');
    fireEvent.click(dropdown);
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    const option1 = screen.getByText('Option 1');
    fireEvent.click(option1);
    
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('stops propagation on dropdown toggle click', () => {
    const mockParentClick = vi.fn();
    
    render(
      <div onClick={mockParentClick}>
        <DropDown 
          selected="Current Selection"
          setSelected={mockSetSelected}
          options={mockOptions}
        />
      </div>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockParentClick).not.toHaveBeenCalled();
  });

  it('closes menu when clicking outside', async () => {
    render(
      <div>
        <DropDown 
          selected="Current Selection"
          setSelected={mockSetSelected}
          options={mockOptions}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByRole('list')).toBeInTheDocument();
    
    const outside = screen.getByTestId('outside');
    fireEvent.click(outside);
    
    await waitFor(() => {
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  it('does not close menu when already closed and clicking outside', async () => {
    render(
      <div>
        <DropDown 
          selected="Current Selection"
          setSelected={mockSetSelected}
          options={mockOptions}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );
    
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    
    const outside = screen.getByTestId('outside');
    fireEvent.click(outside);
    
    // Should remain closed
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('handles empty options array', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={[]}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.children).toHaveLength(0);
  });

  it('handles options without icons', () => {
    const optionsWithoutIcons = [
      { option: 'Option 1', key: 'opt1' },
      { option: 'Option 2', key: 'opt2' },
    ];
    
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={optionsWithoutIcons}
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('renders correct selected text', () => {
    render(
      <DropDown 
        selected="My Selected Value"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    expect(screen.getByText('My Selected Value')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabIndex', '0');
  });

  it('renders SVG toggle arrow', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('multiple option selections work correctly', () => {
    render(
      <DropDown 
        selected="Current Selection"
        setSelected={mockSetSelected}
        options={mockOptions}
      />
    );
    
    const button = screen.getByRole('button');
    
    // Select first option
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Option 1'));
    
    expect(mockSetSelected).toHaveBeenCalledWith('opt1');
    
    // Select second option
    fireEvent.click(button);
    fireEvent.click(screen.getByText('Option 2'));
    
    expect(mockSetSelected).toHaveBeenCalledWith('opt2');
    expect(mockSetSelected).toHaveBeenCalledTimes(2);
  });
});
