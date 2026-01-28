"use client"

import { useState, useEffect } from 'react';
import FlightSearchForm from './FlightSearchForm';
import FeaturedOffers from './FeaturedOffers'

export default function Main() {
  // const [data, setData] = useState(null)
  // const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log('test')
  //     try {
  //       const response = await fetch("http://localhost:5000/api/test", {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         // body: JSON.stringify()
  //       });
  //       const data = await response.json();
  //       console.log(data)
  //     } catch(err) {
  //       setError("Something went wrong. Please try again.");
  //       console.error('Error: ', err);
  //     }
  //   };
  return (
    <div className="grid md:grid-cols-4 p-8 text-white">
      <div className="col-span-1 md:col-span-2 lg:col-span-1">
        <div className="text-3xl font-light mb-8">BOOK NEW FLIGHT</div>
        <FlightSearchForm/>
      </div>
      <FeaturedOffers/>
    </div>
  )
}