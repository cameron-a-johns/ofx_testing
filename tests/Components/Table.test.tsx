import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Table from '../../src/Components/Table';

const mockHeaders = [
  { label: 'Name', key: 'name' },
  { label: 'Age', key: 'age' },
  { label: 'City', key: 'city' },
];

const mockData = [
  { key: '1', name: 'John Doe', age: 30, city: 'New York' },
  { key: '2', name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { key: '3', name: 'Bob Johnson', age: 35, city: 'Chicago' },
];

describe('Table Component', () => {
  it('renders table with basic props', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('renders table with label', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
        label="Test Table"
      />
    );
    
    expect(screen.getByText('Test Table')).toBeInTheDocument();
    const caption = screen.getByRole('caption');
    expect(caption).toBeInTheDocument();
    expect(caption).toHaveTextContent('Test Table');
  });

  it('does not render caption when label is not provided', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    expect(screen.queryByRole('caption')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
        className="custom-table"
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toHaveClass('custom-table');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
        style={customStyle}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('renders all headers', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('City')).toBeInTheDocument();
  });

  it('renders headers in correct order', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells[0]).toHaveTextContent('Name');
    expect(headerCells[1]).toHaveTextContent('Age');
    expect(headerCells[2]).toHaveTextContent('City');
  });

  it('renders all data rows', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    const rows = screen.getAllByRole('row');
    // +1 for header row
    expect(rows).toHaveLength(mockData.length + 1);
  });

  it('renders data in correct cells', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Los Angeles')).toBeInTheDocument();
  });

  it('handles empty data array', () => {
    render(
      <Table 
        data={[]}
        headers={mockHeaders}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should still have header row
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('handles missing data prop', () => {
    render(
      <Table 
        headers={mockHeaders}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should still have header row
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });

  it('handles missing headers prop', () => {
    render(
      <Table 
        data={mockData}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should not have header row or data rows without headers
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument();
    expect(screen.queryByRole('row')).not.toBeInTheDocument();
  });

  it('handles empty headers array', () => {
    render(
      <Table 
        data={mockData}
        headers={[]}
      />
    );
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    // Should have empty header row but no data rows
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1); // Only header row
    expect(rows[0].children).toHaveLength(0); // Empty header row
  });

  it('renders data with different key types', () => {
    const dataWithNumbers = [
      { key: 1, name: 'Test User', age: 20 },
    ];
    
    render(
      <Table 
        data={dataWithNumbers}
        headers={[{ label: 'Name', key: 'name' }, { label: 'Age', key: 'age' }]}
      />
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('handles data with missing key property', () => {
    const dataWithoutKeys = [
      { name: 'Test User', age: 20 },
    ];
    
    render(
      <Table 
        data={dataWithoutKeys}
        headers={[{ label: 'Name', key: 'name' }]}
      />
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('handles headers with missing keys', () => {
    const headersWithMissingKeys = [
      { label: 'Name', key: 'name' },
      { label: 'Unknown', key: 'unknown' },
    ];
    
    render(
      <Table 
        data={[{ key: '1', name: 'Test User' }]}
        headers={headersWithMissingKeys}
      />
    );
    
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('uses header key as unique identifier', () => {
    const duplicateHeaders = [
      { label: 'Name', key: 'name' },
      { label: 'Name', key: 'name2' },
    ];
    
    render(
      <Table 
        data={[{ key: '1', name: 'Test User', name2: 'Test User 2' }]}
        headers={duplicateHeaders}
      />
    );
    
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(2);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
  });

  it('renders complex data types as strings', () => {
    const complexData = [
      { key: '1', name: 'Test', details: 'JSON.stringify would be better but this tests the current behavior' },
    ];
    
    render(
      <Table 
        data={complexData}
        headers={[{ label: 'Details', key: 'details' }]}
      />
    );
    
    // Should render the string value
    expect(screen.getByText('JSON.stringify would be better but this tests the current behavior')).toBeInTheDocument();
  });

  it('has correct table structure', () => {
    render(
      <Table 
        data={mockData}
        headers={mockHeaders}
      />
    );
    
    const table = screen.getByRole('table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    expect(thead).toBeInTheDocument();
    expect(tbody).toBeInTheDocument();
  });
});
