# ✈️ Vantage Flight Deal Tracker

Vantage is a high-performance flight search and deal tracking application designed to help users find the best airfare with a seamless, modern interface. 

## 🚀 Features

* **Real-time Search:** Powered by the **Amadeus Flight Offers API** for accurate, live pricing.
* **Smart Autofill:** Currently leveraging **Fuse.js** for lightning-fast local fuzzy searching.
* **Modern UI:** A sleek, responsive interface built with **Tailwind CSS** and **shadcn/ui** components.
* **Hybrid Architecture:** Leveraging **Next.js** for routing and **Vite** for optimized development.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js (App Router) |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Search Logic** | Fuse.js |
| **Flight Data** | Duffel API |

---

## 🗺️ Roadmap
- [x] Initial Next.js & Vite setup.
- [x] Amadeus API flight search integration.
- [x] Display flight offer details after "View Details" button.
- [x] Transitioning autofill from Supabase to Fuse.js for local fuzzy searching.
- [x] Migrate from Amadeus API (decommissioning in July 2026) to Duffel API for flight offers.
- [ ] In Progress: Display fare details after "Continue to Fare Details" button.
- [ ] Clean airports JSON data: Remove entries for airports that do not support commercial aviation.
- [ ] Implement offer selection UI: Add functionality to select a specific flight offer from search results, storing the selected offer ID and details in state (e.g., using React Context or Redux).
- [ ] Create passenger details form: Build a form to collect traveler information (name, DOB, passport details, etc.) required by Duffel API for order creation; include validation for required fields.
- [ ] Integrate Duffel API for offer request/creation: Use the selected offer to call Duffel's "Create Offer Request" endpoint if needed, or directly proceed to "Create Order" with passenger data; handle API responses and errors.
- [ ] Simulate fake payment process: Implement a mock payment gateway UI (e.g., a form with dummy card details) that "processes" payment without real transactions; use Duffel's payment intent simulation if available, or a simple client-side mock with success/failure states.
- [ ] Handle order creation with Duffel: Submit the order to Duffel API including passenger details and fake payment confirmation; retrieve and display order confirmation details (e.g., booking reference, itinerary).
- [ ] Build confirmation page: Create a dedicated page or modal to show booking summary, confirmation number, and downloadable itinerary after successful order creation.
- [ ] Add error handling and loading states: Implement global error boundaries, loading spinners, and user-friendly messages for API failures, invalid inputs, or payment simulation issues throughout the flow.
- [ ] Test end-to-end flow: Write unit/integration tests for key components (search, offer selection, form validation, API calls); perform manual testing for the full user journey from search to fake booking.
- [ ] Optimize UI/UX: Refine styling, add responsive design tweaks, and incorporate accessibility features (e.g., ARIA labels for forms and buttons).

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

# Duffel Configuration
DUFFEL_ACCESS_TOKEN=your_duffel_test_access_token
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
---

## 📄 License
Distributed under the MIT License.
