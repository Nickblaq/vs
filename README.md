# Paid Voting System

A fully self‑contained Next.js application that simulates a paid voting system with mock authentication, mock payment, and in‑memory storage. **No external APIs, no real database, no payment gateway** – everything runs locally and can be deployed to Vercel in one click.

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Deploy to Vercel

1. Push this project to a GitHub/GitLab/Bitbucket repository.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Vercel will auto‑detect Next.js – no environment variables are needed.
4. Click **Deploy**. The app will be live in seconds.

## Testing the Mock Features

### Public Voting Page
- Visit `/vote` (the home page).
- You’ll see pre‑seeded participants with a “Vote” button.
- Click “Vote” → enter an amount in Naira → see a live vote preview based on the current exchange rate.
- Click “Pay (Mock)” – a 1‑second simulated payment runs, then the vote count updates immediately.

### Mock Admin Login
- Navigate to `/admin/login`.
- Use any username and the password **`admin`**.
- After successful login, you are redirected to the participant management page.
- You can also manually add the `adminToken` to localStorage (key: `adminToken`, value: `mock-admin-token`) to skip the login form.

### Admin Panel
- **Participants** (`/admin/participants`): add, edit, delete, toggle visibility, change sort order.
- **Exchange Rate** (`/admin/rate`): view current rate, update it, see rate change history.
- **Audit Logs** (`/admin/logs`): see a chronological list of all votes and admin actions.

All changes are stored in memory and persist as long as the serverless function is warm (Vercel) or until you restart `npm run dev`.

## Technology Stack (Mock‑Friendly)
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- In‑memory store (no database)
- Mock authentication (hardcoded password)
- Simulated payment (client‑side delay)

No real external services are used – everything is mocked.
