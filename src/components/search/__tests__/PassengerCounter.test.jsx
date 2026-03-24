import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PassengerCounter from '../PassengerCounter'

const mockProps = {
  label: 'Adults',
  field: 'adults',
  value: 1,
  onChange: vi.fn(),
  errors: null
}

describe('PassengerCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the correct label", () => {
    render(<PassengerCounter {...mockProps}/>)
    expect(screen.getByText('Adults')).toBeInTheDocument();
  });

  it("should render hidden input with correct name and value", () => {
    render(<PassengerCounter {...mockProps}/>)
    const hiddenInput = document.querySelector("input[type='hidden']");
    expect(hiddenInput).toHaveAttribute('name','adults');
    expect(hiddenInput).toHaveAttribute('value', "1");
  });
  
  it("adults passenger count should display 1 on load", () => {
    render(<PassengerCounter {...mockProps}/>)
    expect(screen.getByText("1")).toBeInTheDocument()
  });

  it("children passenger count should display 0 on load", () => {
    render(<PassengerCounter {...mockProps} field="children" value={0}/>)
    expect(screen.getByText("0")).toBeInTheDocument()
  });

  it("should not call onChange when subtract is clicked at minimum", async () => {
    const user = userEvent.setup();
    render(<PassengerCounter {...mockProps}/>)
    await user.click(screen.getByRole('button', { name: "Remove Adults passenger"}));
    expect(mockProps.onChange).not.toHaveBeenCalled();
  });

  it("'subtract' button should be disabled when the counter for adult is 1", () => {
    render(<PassengerCounter {...mockProps}/>);
    expect(screen.getByRole('button', { name: "Remove Adults passenger"})).toBeDisabled();
  });

  it("'subtract' button should be disabled when the counter for children is 0", () => {
    render(<PassengerCounter {...mockProps} label="Children" field="children" value={0}/>);
    expect(screen.getByRole('button', { name: "Remove Children passenger"})).toBeDisabled();
  });

  it("should call onChange with the correct value when add is clicked", async () => {
    const user = userEvent.setup();
    render(<PassengerCounter {...mockProps} value={2} />);
    await user.click(screen.getByRole('button', { name: "Add Adults passenger" }));
    expect(mockProps.onChange).toHaveBeenCalledWith(3); 
  });

  it("should call onChange with the correct value when subtract is clicked", async () => {
    const user = userEvent.setup();
    render(<PassengerCounter {...mockProps} value={5}/>);
    await user.click(screen.getByRole('button', { name: 'Remove Adults passenger'}));
    expect(mockProps.onChange).toHaveBeenCalledWith(4);
  });

  it("should not call onChange when add is clicked at maximum (9)", async () => {
    const user = userEvent.setup()
    render(<PassengerCounter {...mockProps} value={9}/>);
    await user.click(screen.getByRole('button', { name: "Add Adults passenger"}));
    expect(mockProps.onChange).not.toHaveBeenCalled();
  });

  it("when the counter is at 9, the 'add' button should be disabled", () => {
    render(<PassengerCounter {...mockProps} value={9}/>);
    expect(screen.getByRole('button', { name: "Add Adults passenger"})).toBeDisabled();
  });

  it("should render the error message when errors are passed", () => {
    render(<PassengerCounter {...mockProps} errors={{ adults: ["At least 1 adult"] }}/>);
    expect(screen.getByText("At least 1 adult")).toBeInTheDocument();
  });

  it("should render the error message when field is children", () => {
    render(<PassengerCounter {...mockProps} field="children" errors={{ children: ["Max 9 children"] }}/>);
    expect(screen.getByText("Max 9 children")).toBeInTheDocument();
  });
})