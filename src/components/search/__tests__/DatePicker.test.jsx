import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../DatePicker';

const mockProps = {
  label: 'Departure',
  field: 'departureDate',
  disabledDates: vi.fn(()=>[]),
  UrlValue: null,
  handleDateChange: vi.fn()
}

describe ('DatePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the label', () => {
    render(<DatePicker {...mockProps}/>);
    expect(screen.getByLabelText('Departure')).toBeInTheDocument();
  });

  it("shows 'select date' when nothing is selected", () => {
    render(<DatePicker {...mockProps}/>);
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });
  
  it("calls handleDateChange when date is selected", async () => {
    const user = userEvent.setup();
    render(<DatePicker {...mockProps}/>);
    await user.click(screen.getByRole('button',{name: 'Select Departure date'}));
    await user.click(screen.getByRole('button', { name: 'Sunday, March 1st, 2026' }));
    expect(mockProps.handleDateChange).toHaveBeenCalledOnce();
  });

  it("prefills date from urlValue when it is present", () => {
    render(<DatePicker {...mockProps} UrlValue="2026-03-10"/>);
    expect(screen.getByText('Mar 10, 2026')).toBeInTheDocument();
  });

  it("closes the popover after a date is selected", async () => {
    const user = userEvent.setup();
    render(<DatePicker {...mockProps}/>);
    await user.click(screen.getByRole('button',{name: 'Select Departure date'}));
    await user.click(screen.getByRole('button', { name: 'Sunday, March 1st, 2026' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("shows formatted date after date is selected", async () => {
    const user = userEvent.setup();
    render(<DatePicker {...mockProps}/>);
    await user.click(screen.getByRole('button',{name: 'Select Departure date'}));
    await user.click(screen.getByRole('button', { name: 'Sunday, March 1st, 2026' }));
    expect(screen.getByText('Mar 1, 2026')).toBeInTheDocument();
  });
});
