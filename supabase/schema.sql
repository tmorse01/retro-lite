-- RetroLite Database Schema
-- Run this in your Supabase SQL Editor

-- Boards: a single retro session
create table boards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  invite_code text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_public boolean default true
);

-- Columns: Went Well / Needs Improvement / Action Items
create table columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  title text not null,
  sort_order int not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (board_id, sort_order)
);

-- Cards: feedback items created by participants
create table cards (
  id uuid primary key default gen_random_uuid(),
  board_id uuid references boards(id) on delete cascade,
  column_id uuid references columns(id) on delete cascade,
  content text not null,
  author text,
  votes int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table boards enable row level security;
alter table columns enable row level security;
alter table cards enable row level security;

-- RLS Policies for public boards (MVP)
-- Allow read/write access to public boards
create policy "Public boards are viewable by everyone"
  on boards for select
  using (is_public = true);

create policy "Public boards are editable by everyone"
  on boards for all
  using (is_public = true);

-- Allow read/write access to columns of public boards
create policy "Columns of public boards are viewable"
  on columns for select
  using (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.is_public = true
    )
  );

create policy "Columns of public boards are editable"
  on columns for all
  using (
    exists (
      select 1 from boards
      where boards.id = columns.board_id
      and boards.is_public = true
    )
  );

-- Allow read/write access to cards of public boards
create policy "Cards of public boards are viewable"
  on cards for select
  using (
    exists (
      select 1 from boards
      where boards.id = cards.board_id
      and boards.is_public = true
    )
  );

create policy "Cards of public boards are editable"
  on cards for all
  using (
    exists (
      select 1 from boards
      where boards.id = cards.board_id
      and boards.is_public = true
    )
  );

-- Enable Realtime for cards and columns
alter publication supabase_realtime add table cards;
alter publication supabase_realtime add table columns;

-- Create indexes for better performance
create index idx_cards_board_id on cards(board_id);
create index idx_cards_column_id on cards(column_id);
create index idx_columns_board_id on columns(board_id);

