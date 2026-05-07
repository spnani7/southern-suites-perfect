# Development Setup & Quick Start Guide

## Prerequisites

Ensure you have installed:
- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** 10+ (comes with Node.js)
- **PostgreSQL** 15+ ([download](https://www.postgresql.org/))
- **Redis** 7+ ([download](https://redis.io/))
- **Git** ([download](https://git-scm.com/))
- **Docker & Docker Compose** ([download](https://www.docker.com/)) - recommended
- **VS Code** or your preferred editor

---

## 1. Clone Repository

```bash
git clone https://github.com/spnani7/southern-suites-perfect.git
cd southern-suites-perfect
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Setup Environment Variables

### Option A: Quick Setup (Recommended for Development)

```bash
cp .env.local.example .env.local
```

Then fill in `.env.local` with development credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Admin
SUPER_ADMIN_EMAIL=dev@southernsuites.com
SUPER_ADMIN_PASSWORD=DevPassword123!
ADMIN_SECRET_KEY=dev-secret-key-12345

# Razorpay (test keys)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@southernsuites.com

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENV=development
```

### Option B: Docker Setup (For Full Local Environment)

```bash
docker-compose up -d
# This starts PostgreSQL, Redis, and other services
```

Then update `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/southern-suites
REDIS_URL=redis://localhost:6379
```

---

## 4. Database Setup

### Using Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Create a free account and new project
3. Go to **SQL Editor** and paste contents of `lib/schema.sql`
4. Run the SQL script
5. Copy credentials to `.env.local`

### Using Docker

```bash
# Database is automatically initialized by docker-compose
# Connect with: psql postgresql://postgres:postgres@localhost:5432/southern-suites
```

---

## 5. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

### Access Different Pages

- **Homepage**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Hotel Page**: http://localhost:3000/hotels/tirupati

### Admin Credentials (from .env.local)
- Email: `dev@southernsuites.com`
- Password: `DevPassword123!`

---

## 6. Available Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Building
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues automatically
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier

# Testing
npm test             # Run all tests
npm test:watch       # Run tests in watch mode
npm test:coverage    # Generate coverage report

# Database
npm run db:reset     # Reset database to initial state
npm run db:seed      # Seed database with sample data

# Production
npm run build && npm start  # Build and run production
```

---

## 7. Project Structure

```
southern-suites-perfect/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── hotels/[slug]/page.tsx     # Hotel detail page
│   ├── booking/[slug]/page.tsx    # Booking flow
│   ├── confirmation/[id]/page.tsx # Booking confirmation
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── hotels/page.tsx
│   │   ├── bookings/page.tsx
│   │   └── settings/page.tsx
│   └── api/
│       ├── bookings/
│       ├── payment/
│       └── admin/
├── components/
│   ├── ui/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── hotel/
│   │   ├── SearchBar.tsx
│   │   ├── HotelGallery.tsx
│   │   └── ...
│   ├── booking/
│   │   ├── BookingForm.tsx
│   │   └── ...
│   └── admin/
│       ├── AdminSidebar.tsx
│       └── ...
├── lib/
│   ├── hotels-data.ts              # Hotel data
│   ├── supabase.ts                 # Database client
│   ├── utils.ts                    # Utility functions
│   ├── email.ts                    # Email templates
│   └── schema.sql                  # Database schema
├── styles/
│   └── globals.css                 # Global styles
├── public/
│   ├── images/
│   │   ├── hotels/
│   │   ├── hero-video.mp4
│   │   └── ...
│   └── favicon.png
├── .github/
│   └── workflows/                  # CI/CD workflows
├── middleware.ts                   # Next.js middleware
├── next.config.js                  # Next.js config
├── tailwind.config.js              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
├── CONTRIBUTING.md                 # Contribution guide
├── ARCHITECTURE.md                 # Architecture docs
└── README.md                       # Project overview
```

---

## 8. Key Technologies

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Next.js API Routes** - Serverless functions
- **Supabase** - PostgreSQL database
- **Razorpay** - Payment processing
- **Resend** - Email service

### Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Playwright** - E2E testing

---

## 9. Common Tasks

### Add a New Hotel

Edit `lib/hotels-data.ts` and add to `HOTELS` array:

```typescript
{
  id: '10',
  slug: 'new-city',
  name: 'Hotel Southern Suites New City',
  shortName: 'New City',
  // ... other fields
  rooms: [
    {
      id: 'new-001',
      name: 'Room Type',
      price: 2000,
      // ... other fields
    }
  ]
}
```

### Add a New API Endpoint

Create file `app/api/[endpoint]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Your logic
}
```

### Add a New Component

Create `components/YourComponent.tsx`:

```typescript
import React from 'react';

interface YourComponentProps {
  title: string;
  onAction?: () => void;
}

export const YourComponent: React.FC<YourComponentProps> = ({
  title,
  onAction,
}) => {
  return <div>{title}</div>;
};

export default YourComponent;
```

### Update Database Schema

Edit `lib/schema.sql` and re-run in Supabase SQL Editor, or:

```bash
npm run db:migrate
```

---

## 10. Testing

### Run Tests

```bash
npm test
```

### Write a Test

Create `lib/utils.test.ts`:

```typescript
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should calculate total with taxes', () => {
    const result = calculateTotal(3000, 2, 0.12);
    expect(result).toBe(6720);
  });
});
```

---

## 11. Debugging

### Enable Debug Mode

```bash
DEBUG=* npm run dev
```

### Debug in VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/next",
      "args": ["dev"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Browser Console

Use browser DevTools (F12 in Chrome/Firefox) to debug frontend issues.

---

## 12. Deployment

### Deploy to Vercel

```bash
# Push to GitHub
git push origin main

# Go to vercel.com → Import project
# Add environment variables from .env.local
# Deploy!
```

### Deploy to Custom Server

```bash
npm run build
npm start
```

---

## 13. Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# or on Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error

```bash
# Check Supabase credentials in .env.local
# Verify database is running (Docker or Supabase)
# Test connection:
psql $DATABASE_URL
```

### Build Fails

```bash
# Clear cache
rm -rf .next
npm run build
```

### Type Errors

```bash
npm run type-check
# Fix TypeScript errors shown
```

---

## 14. IDE Setup

### VS Code Extensions (Recommended)

- **ES7+ React/Redux/React-Native snippets** - dsznajder.es7-react-js-snippets
- **Prettier** - esbenp.prettier-vscode
- **ESLint** - dbaeumer.vscode-eslint
- **Thunder Client** - rangav.vscode-thunder-client (API testing)
- **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
- **TypeScript Vue Plugin** - vue.volar

### Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 15. Next Steps

- [ ] Complete setup following steps 1-7
- [ ] Run `npm run dev` and verify homepage loads
- [ ] Log in to admin panel with test credentials
- [ ] Review project structure
- [ ] Read [CONTRIBUTING.md](./CONTRIBUTING.md)
- [ ] Read [ARCHITECTURE.md](./ARCHITECTURE.md)
- [ ] Join team Slack channel

---

## Getting Help

- **Documentation**: Check [README.md](./README.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Slack**: #development channel
- **Email**: dev-support@southernsuites.com

---

**Happy coding! 🚀**
