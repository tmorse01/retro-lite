-- Migration: Add groups table and group_id to cards
-- Run this to add smart grouping functionality
-- This migration is idempotent - safe to run multiple times

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid REFERENCES boards(id) ON DELETE CASCADE,
  column_id uuid REFERENCES columns(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order int NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (board_id, column_id, sort_order)
);

-- Add group_id column to cards table (if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'group_id'
  ) THEN
    ALTER TABLE cards 
    ADD COLUMN group_id uuid REFERENCES groups(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable Row Level Security for groups (if not already enabled)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for groups (if they don't exist)
DO $$ 
BEGIN
  -- Policy for viewing groups of public boards
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'groups' AND policyname = 'Groups of public boards are viewable'
  ) THEN
    CREATE POLICY "Groups of public boards are viewable"
      ON groups FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM boards
          WHERE boards.id = groups.board_id
          AND boards.is_public = true
        )
      );
  END IF;

  -- Policy for editing groups of public boards
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'groups' AND policyname = 'Groups of public boards are editable'
  ) THEN
    CREATE POLICY "Groups of public boards are editable"
      ON groups FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM boards
          WHERE boards.id = groups.board_id
          AND boards.is_public = true
        )
      );
  END IF;
END $$;

-- Enable Realtime for groups table (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'groups'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE groups;
  END IF;
END $$;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_groups_board_id ON groups(board_id);
CREATE INDEX IF NOT EXISTS idx_groups_column_id ON groups(column_id);
CREATE INDEX IF NOT EXISTS idx_cards_group_id ON cards(group_id);

