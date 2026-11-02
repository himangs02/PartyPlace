# PartyPlace 🎉

> **Your Party. Your Place. Your Choice.**  
> A complete, modern, responsive private event-space marketplace connecting celebration seekers with verified local venues.

---

## 📖 Overview

**PartyPlace** is a two-sided technology marketplace designed specifically for intimate, permitted private celebrations:
- **Event Seekers / Customers**: Discover and book quality-inspected private venues for birthdays, farewell parties, small family functions, get-togethers, private dinners, and photoshoots.
- **Property Owners / Hosts**: Monetize unused or underutilized spaces (villas, terraces, farmhouses, private halls, studios, and private gardens) with guaranteed payouts and clear house rules.
- **Target Capacity**: Approximately 15–30 guests.
- **Business Model**: Transparent 10% platform commission on completed bookings (dynamically configurable via the Admin Panel).

> **Important Positioning**: PartyPlace is **not** a platform for unrestricted wild parties in residential apartments. It is strictly positioned and built as a platform for discovering and booking verified private spaces for small celebrations with host approval, capacity limits, house rules, noise curfews (10:30 PM outdoor music limit), security deposits, and cancellation policies.

---

## 🎨 Design System & Visual Identity

The platform adheres strictly to the **PartyPlace Design Suite**:

- **Primary Burgundy**: `#70152F` (Elegance, sophistication, primary CTAs)
- **Secondary Rose**: `#D94D83` (Accents, highlights, badges, wishlist hearts)
- **Warm Cream**: `#FFF0E8` (Soft card backgrounds, icons, tags)
- **Canvas Background**: `#FFFAF7` (Warm, inviting, clean backdrop)
- **Charcoal Text**: `#29232A` (Crisp readability, high contrast)
- **Typography**: Google Fonts [Poppins](https://fonts.google.com/specimen/Poppins) (Headings & titles) and [Inter](https://fonts.google.com/specimen/Inter) (Body, UI controls, numerals)
- **Icons**: Lucide Icons
- **Responsive Layout**: Fluid experience across mobile, tablet, and desktop with a mobile bottom navigation bar matching the design specification.

---

## 🚀 Complete Platform Ecosystem

### 1. 🏠 Public Landing Website
- **Navigation Bar**: Brand logo, quick links (*Explore Spaces*, *List Your Space*, *How It Works*, *Why Us*), notifications dropdown, demo role switcher (*Customer*, *Host*, *Super Admin*), user avatar dropdown.
- **Hero Section**: Headline *"Your Party. Your Place. Your Choice."*, subheading, and a high-conversion search card (Location, Date, Guests 15–30, Budget range).
- **Trust Highlights Bar**: 4 key value pillars (*Verified Spaces*, *Safe & Compliant*, *Flexible & Affordable*, *Wide Variety*).
- **Featured Categories**: Interactive collection cards (*Villas*, *Farmhouses*, *Terraces*, *Private Halls*, *Studios*, *Private Gardens*).
- **Featured Spaces**: Top-rated Panipat & NCR private venues with real photography, ratings, guest limits, and prices.
- **How It Works**: 3 clear steps for seamless event booking.
- **Why Choose PartyPlace?**: 6 safety and convenience guarantees.
- **Become a Host CTA**: High-impact banner for property owners (*"Have a beautiful space? Turn unused time into income"*).
- **Real Testimonials**: Demo reviews from genuine hosts and celebration seekers.
- **Comprehensive Footer**: Categories, host resources, trust & support links, contact pills, and FAQ modal trigger.

### 2. 🔍 Venue Discovery & Filtering (Explore Spaces)
- **Live Search & Location Filter**: Filter by city/sector (*Sector 11*, *Model Town*, *GT Road*, *Samalkha Road*, etc.).
- **Guest Capacity & Budget Selectors**: Filter by guest counts (15–30) and budget ranges (₹2,000–₹20,000).
- **Category Filter Chips**: Scrollable chips for instant collection switching.
- **Advanced Amenities Filter**: Drawer for swimming pool, lawn/garden, DJ/sound system, air conditioning, Wi-Fi, parking, BBQ grill, etc.
- **Verified Spaces Toggle**: Filter for 100% quality-inspected spaces only.
- **Dynamic Sorting**: Sort by *Recommended & Featured*, *Price: Low to High*, *Price: High to Low*, *Highest Rated*, and *Guest Capacity*.
- **Empty State**: Friendly reset mechanism when no venues match filters.

### 3. 🏰 Space Details & Availability
- **High-Resolution Photo Gallery**: 1 large featured photo + 3 stacked thumbnail views with a **+12 Photos** overlay that opens a full-screen Lightbox Gallery modal with thumbnail navigation.
- **Space Header**: Verified space badge, star ratings, review count, location, wishlist toggle, and share link generator.
- **Highlights & Specs**: Guest capacity chips, category, parking, Wi-Fi, air conditioning.
- **About This Space**: Detailed description and permitted celebrations tags (*Birthdays*, *Farewells*, *Family Dinners*, *Get-togethers*, *Photoshoots*).
- **Amenities Grid**: Visual amenity badges with verification checkmarks.
- **House Rules & Safety Compliance**: Explicit noise curfew callout box (*Outdoor amplified sound allowed strictly till 10:30 PM*), security deposit notice, ID check requirements.
- **Host Profile Card**: Host bio, superhost badge, response time, and interactive *Contact Host* query modal.
- **Customer Reviews**: Detailed rating score bars (*Cleanliness*, *Accuracy*, *Communication*, *Value*) and user reviews list with an interactive *Write a Review* modal.
- **Sticky Booking Widget**: Real-time date selector, time slot dropdown, guest counter, automatic price calculation (Base Price + 10% Platform Fee), *Book Now* CTA, and cancellation policy guarantee.

### 4. 💳 Complete Booking & Payment Workflow
- **Confirm Your Booking (Checkout)**:
  - Venue summary card with thumbnail, dates, time slot, and guest count.
  - Event details form (Primary guest name, phone, celebration type, special host requests).
  - Itemized price breakdown: Base rental, 10% platform fee, refundable security deposit notice, total payable.
  - Standard cancellation policy notice (100% refund up to 24h before event).
- **Simulated Payment Gateway**:
  - **UPI**: Google Pay, PhonePe, Paytm, QR code scan, and custom UPI ID validation.
  - **Debit / Credit Card**: Card number, expiry, CVV formatting.
  - **Net Banking**: HDFC, SBI, ICICI, Axis, Kotak, PNB.
- **Booking Confirmation**:
  - Secure payment simulation with 256-bit SSL encryption indicator.
  - **Confetti Celebration Animation** (`canvas-confetti`).
  - Generated Booking Reference ID (`PP-BK-2026-XXXX`).
  - Printable **Official Booking Pass & QR Entry Code** modal.

### 5. 👤 Customer Dashboard (My Bookings)
- **Tabbed Booking Management**: *Upcoming*, *Completed*, and *Cancelled* bookings.
- **Booking Cards**: Venue photo, booking reference, date & time, guest count, amount paid, and status badge.
- **Actions**:
  - *View Details & QR Pass*: Opens digital gate pass with printable invoice.
  - *Modify / Cancel Reservation*: Modal with automated cancellation fee and refund calculation.
- **Wishlist Tab**: Collection of saved venues with 1-click booking access.
- **Profile & ID Verification**: Government photo ID Level 2 verification badge.
- **Settings**: SMS and email notification preferences.

### 6. 🏡 Host / Property Owner Dashboard
- **Welcome Header**: Personalized greeting and quick *+ List New Space* action.
- **4 KPI Metric Cards**: *Active Listings*, *Total Bookings*, *Total Host Earnings* (net of 10% platform commission), and *Average Rating*.
- **Booking Overview Bar Chart**: Interactive monthly earnings chart (Apr – Sep) with interactive tooltips and growth indicator.
- **Recent Bookings List**: Real-time requests with instant **Approve** and **Decline** actions.
- **My Listings Manager**: Manage listings, toggle status (*Active* / *Paused*), preview public page, or delete space.
- **Earnings & Payouts**: Available balance, linked bank account (HDFC Bank), withdrawal request simulation, and transparent commission breakdown.

### 7. 📝 List Your Space (5-Step Wizard)
- **Left Promotional Banner**: Matching design suite with perks (*Reach genuine event seekers*, *Earn from unused space*, *Secure bookings*, *Set your rules*).
- **Step 1: Basic Info**: Space title, category selector, guest capacity, base rental rate (₹ per 4 hours).
- **Step 2: Location**: City, area/locality, full address, landmark.
- **Step 3: Details & Rules**: Tagline, full description, music curfew time (10:30 PM), refundable security deposit, permitted celebrations.
- **Step 4: Amenities & Photos**: Amenities checklist, image URLs, live thumbnail preview strip.
- **Step 5: Review & Submit**: Comprehensive preview card, terms acknowledgment, and instant submission for quality verification.

### 8. ⚡ Super Admin Dashboard
- **Platform Overview KPI Cards**: *Total Users* (1,248), *Active Listings* (372), *Total Bookings* (1,986), and *Gross Platform Volume* (₹9,82,500).
- **Bookings Trend Chart**: SVG curve representing ecosystem volume.
- **Live Activities Feed**: Real-time feed of submissions, confirmations, and payouts.
- **Space Verification Queue**: Quality inspection table with **Approve**, **Reject**, and **Feature on Homepage** toggles.
- **System Bookings Audit**: Audit log of all transactions with platform fee collected.
- **Dynamic Commission Configuration**: Adjustable platform fee input (Default: 10%) that instantly re-calculates all checkout breakdowns and host payouts across the platform.

### 9. 📱 Mobile Experience
- Responsive hamburger drawer menu with persona switcher.
- **Mobile Bottom Navigation Bar** (*Home*, *Explore*, *Bookings*, *Profile/Host*) matching the design screenshots.
- Mobile filter drawer and responsive touch-friendly cards.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) |
| **Styling** | Vanilla CSS Design Tokens (Strict adherence to brand palette) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Celebration FX** | [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Backend Framework** | [Express 5](https://expressjs.com/) (Node.js) |
| **API Architecture** | RESTful JSON API with CORS and proxy integration |
| **Data Persistence** | File-backed JSON Database (`server/data/db.json`) + Client LocalStorage Sync |
| **Concurrency** | Concurrently for synchronized full-stack development |

---

## 📂 Project Structure

```
PartyPlace/
├── index.html                 # HTML shell with Google Fonts (Poppins & Inter) and SVG favicon
├── package.json               # Full-stack dependencies and scripts
├── vite.config.js             # Vite config with port 3000 and /api reverse proxy
├── server/
│   ├── index.js               # Express API server (REST endpoints, persistence, filters)
│   └── data/
│       ├── initialData.js     # Curated seed database (spaces, bookings, users, reviews)
│       └── db.json            # Persistent JSON database
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # App root, view router, persona state & sync
│   ├── App.css                # Full design suite styles & responsive layouts
│   ├── index.css              # Core design tokens, CSS variables, typography, reset
│   ├── services/
│   │   └── api.js             # Client API service with local storage fallback
│   ├── components/
│   │   ├── Navbar.jsx         # Responsive navbar with notifications & role switcher
│   │   ├── Footer.jsx         # Full footer with trust badges and legal links
│   │   ├── MobileBottomNav.jsx# Mobile bottom navigation bar
│   │   ├── PropertyCard.jsx   # Property card with badges, rating, wishlist
│   │   ├── LightboxModal.jsx  # Full-screen photo gallery viewer
│   │   ├── ReceiptModal.jsx   # Official booking pass & QR entry ticket
│   │   ├── FAQModal.jsx       # FAQ modal on safety, noise curfew, deposits
│   │   └── AuthModal.jsx      # Quick role switcher & account modal
│   └── views/
│       ├── LandingView.jsx    # Hero, search card, categories, why us, CTA
│       ├── ExploreView.jsx    # Filter bar, drawer, sorting, property grid
│       ├── SpaceDetailsView.jsx# Gallery, specs, rules, reviews, booking card
│       ├── CheckoutView.jsx   # Booking review, UPI/Card payment, confirmation
│       ├── CustomerDashboardView.jsx # My Bookings, pass viewer, cancellations
│       ├── HostDashboardView.jsx # KPI stats, bar chart, bookings, listings manager
│       ├── ListSpaceView.jsx  # 5-step property listing wizard
│       └── AdminDashboardView.jsx # Platform stats, verification queue, commission
```

---

## ⚡ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/himangs02/PartyPlace.git
cd PartyPlace
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Full-Stack Application
To run both the **Express REST API backend** (port `5001`) and the **Vite React frontend** (port `3000`) concurrently:
```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

### Available Scripts
- `npm run dev`: Runs both backend server and Vite client concurrently.
- `npm run client`: Starts only the Vite frontend dev server.
- `npm run server`: Starts only the Express API backend.
- `npm run build`: Generates production-ready bundle in `dist/`.
- `npm run preview`: Previews the production build locally.

---

## 🎭 Instant Demo Personas

Use the **Role Switcher** in the top navbar to instantly test each role:

1. **👤 Customer (Akanksha Verma)**:
   - Explore spaces, filter by budget/guests, book *The Palm Villa*, complete simulated UPI/Card payment, receive booking pass with QR code, and manage reservations under *My Bookings*.
2. **🏡 Host (Rohan Mehta)**:
   - Superhost managing *The Palm Villa* & *Skyline Terrace*. View ₹36,500 earnings, review monthly bar chart, accept or decline new booking requests, pause/activate listings, and test the 5-step *List Your Space* wizard.
3. **⚡ Super Admin**:
   - Oversee platform KPIs (₹9,82,500 gross volume), view bookings trend curve, approve or reject pending venues in the verification queue, and adjust the 10% platform commission rate dynamically.

---

## 📄 License & Intellectual Property

Copyright © 2026 PartyPlace Marketplace Technologies Pvt. Ltd. All rights reserved.  
Built for safe, compliant, and unforgettable celebrations.
