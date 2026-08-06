# ✈️ Vantage Flight Deal Tracker

Vantage is a high-performance flight search and deal tracking application designed to help users find the best airfare with a seamless, modern interface. 

## 🚀 Features

* **Real-time Search:** Powered by the **Duffel API** for accurate, live pricing.
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
🎯 Current Focus: Test Automation
- [ ] End-to-End Suite (Playwright): Implementing robust coverage for the full booking journey:
  - [x] Search & Offer Selection flow.
  - [ ] Passenger form validation & data submission.
- [ ] Confirmation UI verification.
- [ ] Unit/Integration Testing: Implementing tests for core helper functions and API error handling.

🎨 Polish & Accessibility
- [ ] Responsive Design & UX Refinement: Final CSS tweaks and loading state animations.
- [ ] Accessibility Audit: Implementing ARIA labels and keyboard navigation for WCAG compliance.
- [x] Infrastructure: Next.js, Vite, and Fuse.js fuzzy search implementation.
- [x] Flight Engine: Successful migration from Amadeus to Duffel API.
- [x] Booking Flow: Fully functional flight search, passenger collection, mock payment, and order confirmation.
- [x] Data Management: Cleaned airport JSON data for commercial relevance.

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
