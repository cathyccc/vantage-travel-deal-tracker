import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AirportSearch from '../AirportSearch';

const mockProps = {
  label: 'Origin',
  field: 'originLocationCode',
  UrlValue: null,
  handleSelectedAirportCode: vi.fn()
}

describe("AirportSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'Search airport or city' placeholder when nothing is selected", () => {
    render(<AirportSearch {...mockProps} />);
    expect(screen.getByPlaceholderText('Search airport or city...')).toBeInTheDocument();
  });

  it('shows airport results when searching for an IATA code', async () => {
    const user = userEvent.setup();
    render(<AirportSearch {...mockProps}/>);
    await user.type(screen.getByPlaceholderText('Search airport or city...'), 'YYZ');
    expect(screen.getByText((content) => content.includes('Toronto Pearson'))).toBeInTheDocument();
  });

  it('shows airport results when searching for a city', async () => {
    const user = userEvent.setup();
    render(<AirportSearch {...mockProps}/>);
    await user.type(screen.getByPlaceholderText('Search airport or city...'), 'Toronto');
    expect(screen.getByText((content) => content.includes('Toronto Pearson'))).toBeInTheDocument();
  });

  it('shows airport results when searching for a airport name', async () => {
    const user = userEvent.setup();
    render(<AirportSearch {...mockProps}/>);
    await user.type(screen.getByPlaceholderText('Search airport or city...'), 'Toronto Pearson');
    expect(screen.getByText((content) => content.includes('YYZ'))).toBeInTheDocument();
  });

  it.skip('shows no results for unmatched search', () => {
    // covered in e2e testing due to shadcn command component jsdom limitations
  });

  it('prefills airport when urlValue is present', () => {
    render(<AirportSearch {...mockProps} UrlValue="YYZ"/>);
    expect(screen.getByDisplayValue('Toronto (YYZ - Toronto Pearson Intl. Airport, CA)')).toBeInTheDocument();
  });

  it('calls handleSelectedAirportCode when airport is selected', async () => {
    const user = userEvent.setup();
    render (<AirportSearch {...mockProps}/>);
    await user.type(screen.getByPlaceholderText('Search airport or city...'), "YYZ");
    await user.click(screen.getByText((content) => content.includes("Toronto Pearson")));
    expect(mockProps.handleSelectedAirportCode).toHaveBeenCalledOnce();
  });

  it("clearing the search input would clear search results", async () => {
    const user = userEvent.setup();
    render (<AirportSearch {...mockProps}/>);
    await user.type(screen.getByPlaceholderText('Search airport or city...'), "YYZ");
    await user.clear(screen.getByPlaceholderText('Search airport or city...'));
    expect(screen.queryByText((content) => content.includes('Toronto Pearson'))).not.toBeInTheDocument();
  });
});