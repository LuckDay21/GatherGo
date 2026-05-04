# 🚀 GatherGo - Collaborative Social Event Planner

GatherGo is a real-time social event planning application designed to organize meetups, coordinate logistics, and manage shared expenses among friends.

![GatherGo Hero](https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

- **Real-time RSVP**: Instant updates for guest attendance status via Supabase WebSockets.
- **Interactive Live Polling**: Create polls and watch the votes roll in live.
- **Split Bill Calculator**: Dynamic algorithmic calculation to minimize transaction counts between friends.
- **Premium UI**: Built with a sleek, dark-themed modern aesthetic using Tailwind CSS.
- **Mobile First**: Optimized for seamless coordination on the go.

## 🛠 Tech Stack

- **Frontend**: React.js (JSX)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend-as-a-Service**: Supabase (PostgreSQL, Auth, Realtime)
- **Icons**: Lucide React

## 🚦 Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase Project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LuckDay21/GatherGo.git
   cd gather-go
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Setup Database**
   Run the SQL provided in `supabase_schema.sql` (if available in artifacts) or follow the schema guidelines in the docs.

5. **Run locally**
   ```bash
   npm run dev
   ```

## 🏗 Project Structure

- `/src/components`: Modular UI components.
- `/src/pages`: Main application views.
- `/src/hooks`: Business logic and real-time data sync.
- `/src/utils`: Helper functions and API clients.

## 📄 License

MIT
