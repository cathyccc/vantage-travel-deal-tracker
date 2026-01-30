import AirportSearch from './AirportSearch';
import DatePicker from './DatePicker';

export default function FlightSearchForm() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8 shadow-2xl">
      <form>
        <div className="pb-4">
          <AirportSearch label="Origin"/>
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination"/>
        </div>

        <div className="grid grid-cols-2 gap-4 pb-4">
          <DatePicker label="Departure" />
          <DatePicker label="Return"/>
        </div>
      </form>
    </div>
  )
}