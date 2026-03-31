import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addDays, format, startOfTomorrow, startOfToday } from 'date-fns'
import DatePicker, { type DatePickerProps } from '../DatePicker';

const mockProps: DatePickerProps = {
  label: 'Departure',
  field: 'departureDate',
  disabledDates: vi.fn() as DatePickerProps['disabledDates'],
  UrlValue: undefined,
  handleDateChange: vi.fn()
}

describe('DatePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the label', () => {
    render(<DatePicker {...mockProps} />);
    expect(screen.getByLabelText('Departure')).toBeInTheDocument();
  });

  it("shows 'select date' when nothing is selected", () => {
    render(<DatePicker {...mockProps} />);
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });

  it("calls handleDateChange when date is selected", async () => {
    const tomorrow: Date = startOfTomorrow();
    const formattedTomorrow: string = format(tomorrow, 'eeee, MMMM do, yyyy');
    const monthOfToday: string = format(startOfToday(), 'M');
    const monthOfTomorrow: string = format(tomorrow, 'M');

    const user = userEvent.setup();
    render(<DatePicker {...mockProps} />);
    await user.click(screen.getByRole('button', { name: 'Select Departure date' }));
    if (monthOfTomorrow !== monthOfToday) {
      await user.click(screen.getByRole('button', { name: 'Go to the Next Month' }));
    }
    await user.click(screen.getByRole('button', { name: formattedTomorrow }));
    expect(mockProps.handleDateChange).toHaveBeenCalledOnce();
  });

  it("prefills date from urlValue when it is present", () => {
    const tomorrow: Date = startOfTomorrow();
    const UrlStringTomorrow: string = format(tomorrow, 'yyyy-MM-dd');
    const formattedTomorrow: string = format(tomorrow, 'MMM d, yyyy');

    render(<DatePicker {...mockProps} UrlValue={UrlStringTomorrow} />);
    expect(screen.getByText(formattedTomorrow)).toBeInTheDocument();
  });

  it("closes the popover after a date is selected", async () => {
    const returnDate: Date = addDays(startOfTomorrow(), 5);
    const formattedReturnDate: string = format(returnDate, 'eeee, MMMM do, yyyy');
    const monthOfToday: string = format(startOfToday(), 'M');
    const monthOfReturn: string = format(returnDate, 'M');

    const user = userEvent.setup();
    render(<DatePicker {...mockProps} />);
    await user.click(screen.getByRole('button', { name: 'Select Departure date' }));
    if (monthOfReturn !== monthOfToday) {
      await user.click(screen.getByRole('button', { name: 'Go to the Next Month' }));
    }
    await user.click(screen.getByRole('button', { name: formattedReturnDate }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("shows formatted date after date is selected", async () => {
    const tomorrow: Date = startOfTomorrow();
    const inputTextTomorrow: string = format(tomorrow, 'MMM d, yyyy');
    const formattedTomorrow: string = format(tomorrow, 'eeee, MMMM do, yyyy');
    const monthOfToday: string = format(startOfToday(), 'M');
    const monthOfTomorrow: string = format(tomorrow, 'M');

    const user = userEvent.setup();
    render(<DatePicker {...mockProps} />);
    await user.click(screen.getByRole('button', { name: 'Select Departure date' }));
    if (monthOfTomorrow !== monthOfToday) {
      await user.click(screen.getByRole('button', { name: 'Go to the Next Month' }));
    }
    await user.click(screen.getByRole('button', { name: formattedTomorrow }));
    expect(screen.getByText(inputTextTomorrow)).toBeInTheDocument();
  });
});
