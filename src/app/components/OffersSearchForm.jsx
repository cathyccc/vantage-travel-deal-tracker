import { useState } from 'react'
import { Button } from '@/components/ui/button'
import AirportSearch from './AirportSearch';
import DatePicker from './DatePicker';

export default function FlightSearchForm({searchOffers}) {
  const [formData, setFormData] = useState({
    originLocationCode: '',
    destinationLocationCode: '',
    departureDate: '',
    adults: 1
  });

  const minusAdult = () => {
    setFormData(prevForm => ({
      ...prevForm,
      adults: prevForm.adults > 1 ? prevForm.adults- 1 : 1
    }))
  }

  const addAdult = () => {
    setFormData(prevForm => ({
      ...prevForm,
      adults: prevForm.adults+1
    }))
  }

  const updateFormField = (field, text) => {
    setFormData(prevForm => ({
      ...prevForm,
      [field]: text
    }))
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(formData)
    searchOffers(formData)
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 md:p-8 shadow-2xl">
      <form onSubmit={handleSubmit}>
        <div className="pb-4">
          <AirportSearch label="Origin" field="originLocationCode" updateFormField={updateFormField}/>
        </div>

        <div className="pb-4">
          <AirportSearch label="Destination" field="destinationLocationCode" updateFormField={updateFormField}/>
        </div>

       <div className="pb-4">
          <DatePicker label="Departure" field="departureDate" updateFormField={updateFormField}/>
        </div>

       <div className="pb-4 flex justify-between items-center">
          <label className="text-sm text-zinc-400">Adults</label>
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              disabled={formData.adults <= 1}
              onClick={minusAdult}
              className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                -
            </Button>
            <span className="inline-block w-12 text-center">{formData.adults}</span>
            <Button
              type="button"
              onClick={addAdult}
              className="bg-zinc-800 text-zinc-100 rounded-sm hover:bg-zinc-700"
            >
                +
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-violet-600 text-sm tracking-wide hover:bg-violet-500"
        >
          SEARCH OFFERS
        </Button>
      </form>
    </div>
  )
}