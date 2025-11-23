# TinyLink - URL Shortener

A simple URL shortener built with Next.js, Tailwind CSS, and Neon Postgres.

## Features

- Create short links with custom or auto-generated codes
- Redirect to original URLs with click tracking
- View link statistics
- Delete links
- Clean, responsive UI

## Setup

### 1. Database Setup (Neon Postgres)

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in
3. Create a new project
4. Copy the connection string (it looks like: `postgresql://username:password@hostname/database`)
5. Run the schema:

   ```sql
   -- Copy the contents of schema.sql and run in your Neon SQL editor
   ```

### 2. Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your DATABASE_URL from Neon
3. Set NEXT_PUBLIC_BASE_URL to your deployment URL (e.g., https://your-app.vercel.app)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

### 5. Deploy

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## API Endpoints

- `GET /healthz` - Health check
- `POST /api/links` - Create link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get link stats
- `DELETE /api/links/:code` - Delete link

## Pages

- `/` - Dashboard
- `/code/:code` - Link stats
- `/:code` - Redirect
