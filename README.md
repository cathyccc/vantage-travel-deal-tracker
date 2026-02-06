# ✈️ Vantage Flight Deal Tracker

Vantage is a high-performance flight search and deal tracking application designed to help users find the best airfare with a seamless, modern interface. 

## 🚀 Features

* **Real-time Search:** Powered by the **Amadeus Flight Offers API** for accurate, live pricing.
* **Smart Autofill:** Currently leveraging **Supabase** for destination data, with a migration to **Fuse.js** underway for lightning-fast local fuzzy searching.
* **Modern UI:** A sleek, responsive interface built with **Tailwind CSS** and **shadcn/ui** components.
* **Hybrid Architecture:** Leveraging **Next.js** for routing and **Vite** for optimized development.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Database/Backend** | Supabase |
| **Search Logic** | Fuse.js (Transitioning) |
| **Flight Data** | Amadeus Flight Offers API |

---

## 🗺️ Roadmap
- [x] Initial Next.js & Vite setup.
- [x] Amadeus API flight search integration.
- [ ] In Progress: Display flight offer details after "View Details" button.
- [ ] Confirm the availability and price with Amadeus Flight Offers Price API.
- [ ] Create the reservation with Amadeus Flight Create Orders API.
- [ ] Transitioning autofill from Supabase to Fuse.js for local fuzzy searching.

---

## ⚙️ Setup & Configuration

### 1. Clone the Repository
```bash
git clone [https://github.com/cathyccc/vantage-flight-deal-tracker.git](https://github.com/cathyccc/vantage-flight-deal-tracker.git)
cd vantage-flight-deal-tracker
```

### 2. Configure Environment Variables
Create a file named .env in the root directory and add your credentials:
```code
# Amadeus API Credentials
AMADEUS_CLIENT_ID=your_amadeus_key_here
AMADEUS_CLIENT_SECRET=your_amadeus_secret_here

# Next Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
---

## 🗄️ Database Setup

To power the destination autofill, you need to set up an `airports` table in Supabase. Run the following SQL in your **Supabase SQL Editor**:

```sql
-- Create table for airport data
CREATE TABLE airports (
  id bigint primary key generated always as identity,
  iata_code text unique not null,
  name text not null,
  city text not null,
  country text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable pg_trgm for optimized searching
CREATE extension if not exists pg_trgm;

-- Create indexes
CREATE INDEX airports_iata_idx ON airports(iata_code);
CREATE INDEX airports_city_idx ON airports USING gin(city gin_trgm_ops);

-- Security: Enable RLS and public read access
ALTER TABLE airports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON airports FOR SELECT TO anon USING (true);
Note: This table currently handles the autofill logic. We are in the process of migrating this data to a local airports.json file to be handled by Fuse.js for zero-latency client-side searching.
```
## 🏗️ Seeding the Database

To populate your `airports` table, you will need a dataset of IATA codes. 

### 1. Source the Data
You can download the latest global airport datasets in CSV format from:
* **[OurAirports Data](https://ourairports.com/data/)** (Download `airports.csv`)
* **[OpenFlights Data](https://openflights.org/data.html)**

### 2. Prepare the Data
Since these CSVs contain hundreds of columns, you'll want to filter for "large_airports" or "medium_airports" to keep your search relevant.

### 3. Run the Seed Command
In your Supabase SQL Editor, you can use the `INSERT` statement. For a small set of major hubs, you can use this snippet to test:

```sql
INSERT INTO airports (iata_code, name, city, country)
VALUES 
  ('JFK', 'John F. Kennedy International Airport', 'New York', 'United States'),
  ('LHR', 'London Heathrow Airport', 'London', 'United Kingdom'),
  ('HND', 'Haneda Airport', 'Tokyo', 'Japan'),
  ('CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
  ('DXB', 'Dubai International Airport', 'Dubai', 'United Arab Emirates'),
  ('SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore');
```

## 📄 License
Distributed under the MIT License.
