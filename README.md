# Re-Wire

Re-Wire is a modern web application designed to connect households with verified e-waste recyclers. It streamlines the doorstep e-waste collection process and provides instant rewards to users. 

The platform features two distinct roles:
1. **Households (Users):** Can estimate the value of their e-waste, schedule doorstep pickups, and redeem earned points for cash, UPI transfers, or vouchers.
2. **Recyclers (Partners):** Have access to a partner dashboard where they can accept pickup requests, scale their supply chain, and ensure compliance with e-waste quotas.

## Architecture

This project is structured as a monorepo containing both the frontend and the backend.

### Frontend (`/rewire-app`)
* Framework: React with Vite
* Routing: React Router
* Styling: Vanilla CSS with custom properties and responsive layouts
* Payments: Stripe Integration

### Backend (`/rewire-backend`)
* Framework: Node.js with Express
* Database: MongoDB (via Mongoose)
* Authentication: JWT based authentication
* Roles: Differentiates between 'user' and 'recycler' roles

## Features

* **E-Waste Valuation Engine:** Users can input their e-waste category and weight to see real-time estimated rewards.
* **Geospatial Matching:** The platform connects users with nearby CPCB-authorised recyclers in the Asansol district.
* **Reward Wallet System:** Users accumulate ReWire points that can be redeemed for UPI cash or digital vouchers (Amazon, Swiggy, Flipkart).
* **Partner Dashboard:** Recyclers can view incoming requests, accept jobs, and track their monthly collection analytics.
* **Role-based Authentication:** Secure access control ensuring recyclers and users only see data relevant to them.

## Local Development

### Prerequisites
* Node.js v18 or higher
* MongoDB connection string

### Setup

1. Clone the repository
2. Set up environment variables in the `rewire-backend` directory by creating a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
3. Install dependencies for both frontend and backend:
   ```bash
   # From the root directory
   npm run install:all
   ```
   *(Alternatively, run `npm install` inside both `rewire-app` and `rewire-backend` directories.)*

4. Start the development servers:
   * Backend: Run `npm run dev` inside `rewire-backend` (Starts on http://localhost:5000)
   * Frontend: Run `npm run dev` inside `rewire-app` (Proxy routes `/api` requests to the backend)

## Deployment

This repository is pre-configured for a single-project deployment on Vercel.

1. Import the repository into your Vercel dashboard.
2. Add the environment variables (`MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`) to the Vercel project settings.
3. Deploy. Vercel will automatically read the root `vercel.json` file, using `@vercel/node` to host the backend at `/api/*` and `@vercel/static-build` to build and serve the React frontend.
