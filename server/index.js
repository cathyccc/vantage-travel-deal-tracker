const express = require('express');
const cors = require('cors');
const Amadeus = require('amadeus');
require('dotenv').config();

// mock results from 4 offers
// query: {
//     "originLocationCode": "YYZ", 
//     "destinationLocationCode": "SFO", 
//     "departureDate": "2026-10-21", 
//     "adults": 1
// }
const mockAPIResults = require('./api-results.json')

const app = express();
const PORT = process.env.PORT;
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});
// const amadeus = new Amadeus();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/api/test', (req, res) => {
  res.status(200).json({message: 'Backend is connected!'});
});

app.post('/api/data', (req, res) => {
  const data = req.body;
  console.log('Received:', data)
  res.status(200).json({success: true, received: data});
});

// Amadeus Routes
app.get('/api/flight-offers-search', async (req, res) => {
  const {originLocationCode, destinationLocationCode, departureDate, adults} = req.body;
  try {
    // receives 30 offers from API
    // const response = await amadeus.shopping.flightOffersSearch.get({
    //     originLocationCode,
    //     destinationLocationCode,
    //     departureDate,
    //     adults
    //   });
    // res.status(200).json(response.data);

    // FOR TESTING PURPOSES
    res.status(200).json(mockAPIResults);
    //
  } catch(error) {
    res.status(500).json({
      errorCode: error.code,
      errorStatusCode: error.response.statusCode,
      errorMessage: error.response.result.error,
      responseRequest: error.response.request,
      error: "Failed to search flights. Please try again"
    })
  }

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});