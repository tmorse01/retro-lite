-- Migration: Add phase column to boards table
-- Run this if you have existing boards without the phase column

-- Add phase column with default value
ALTER TABLE boards 
ADD COLUMN IF NOT EXISTS phase text NOT NULL DEFAULT 'gathering' 
CHECK (phase IN ('gathering', 'grouping', 'voting', 'actions'));

-- Update any existing boards to have 'gathering' phase if they don't have one
UPDATE boards 
SET phase = 'gathering' 
WHERE phase IS NULL;

-- Enable Realtime for boards table (if not already enabled)
ALTER PUBLICATION supabase_realtime ADD TABLE boards;

