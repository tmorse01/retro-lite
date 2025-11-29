# RetroLite Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor
3. Copy and paste the contents of `supabase/schema.sql` into the SQL Editor
4. Run the SQL script to create the tables, RLS policies, and enable Realtime
5. Go to Project Settings > API to get your credentials:
   - Project URL
   - `anon` public key

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholders with your actual Supabase credentials.

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

1. Visit the landing page at `/`
2. Click "View Demo Board" to see the demo board with mock data
3. Click "Start a Retro" to create a new board (requires Supabase setup)

## Next Steps

### Wire Up Realtime Subscriptions

The app currently uses API calls for updates. To enable real-time collaboration:

1. Update `components/board/BoardView.tsx` to subscribe to Supabase Realtime changes
2. Use Supabase's `channel()` API to listen for `INSERT`, `UPDATE`, and `DELETE` events on the `cards` table
3. Update local state when events are received

Example subscription code:

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`board:${boardId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cards",
        filter: `board_id=eq.${boardId}`,
      },
      (payload) => {
        // Handle INSERT, UPDATE, DELETE events
        // Update local state accordingly
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [boardId]);
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Project Structure

```
retro-lite/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── board/             # Board pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── board/            # Board-specific components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Helper functions
├── types/                 # TypeScript types
├── supabase/             # Database schema
└── package.json          # Dependencies
```

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure your `.env.local` file exists and contains the correct Supabase credentials.

### Database errors

Ensure you've run the SQL schema in your Supabase project's SQL Editor.

### Realtime not working

Check that Realtime is enabled in your Supabase project settings and that you've added the tables to the Realtime publication in the SQL schema.

