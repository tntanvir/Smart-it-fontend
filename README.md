# TechBridge Support Platform - Frontend

The frontend for TechBridge, a modern, highly responsive, and interactive IT support booking platform. It provides separate portals for Customers and Technicians, allowing them to manage tickets, communicate via real-time live chat, and process payments securely.

## 🚀 Features

- **Dynamic Role-Based Dashboards:** Separate, secure interfaces for Customers (creating/managing tickets, payments, reviews) and Technicians (accepting jobs, tracking earnings).
- **Real-Time Live Chat:** Seamless real-time messaging between customers and technicians using WebSockets.
- **Secure Authentication:** OTP-based login flow with Zustand state management handling session persistence via JWT tokens.
- **Modern UI & Animations:** Beautiful, glassmorphic design utilizing TailwindCSS v4 and Framer Motion for highly interactive page transitions and micro-animations.
- **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing, with mobile-first sliding sidebars and navigation menus.
- **Dynamic Content:** Server-Side Rendering (SSR) and Client-Side rendering powered by Next.js App Router for optimal SEO and fast load times.
- **Payment Integration:** Stripe checkout flow for seamless job payments.

---

## 🛠 Tech Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Library:** React 19
- **Styling:** TailwindCSS v4
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Data Fetching:** Axios & React Query
- **Form Handling:** React Hook Form & Zod
- **Icons:** Lucide React
- **Carousels:** Swiper

---

## 💻 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/tntanvir/Smart-it-fontend.git
cd Smart-it-fontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env.local` file in the root of the frontend directory and add your API endpoints and Stripe keys:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8001
NEXT_PUBLIC_WS_URL=ws://127.0.0.1:8001
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_...
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```
frontend/
│
├── public/                 # Static assets (images, logos, fonts)
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API routes)
│   │   ├── dashboard/      # Role-based dashboard layouts
│   │   ├── jobs/           # Public job listings
│   │   ├── login/          # Auth routes
│   │   ├── register/       # Registration flow
│   │   ├── support/        # Support chat routes
│   │   └── page.js         # Landing page
│   │
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Navbar, Footer, Sidebars
│   │   ├── ui/             # Buttons, Inputs, Dialogs, Cards
│   │   └── ThemeProvider   # Dark/Light mode toggle
│   │
│   ├── store/              # Zustand global state (useAuthStore)
│   └── lib/                # Utility functions (Axios interceptors)
│
├── .env.local              # Environment Variables
├── package.json            # NPM dependencies
├── tailwind.config.js      # Tailwind configurations (if applicable)
└── README.md               # Project documentation
```
