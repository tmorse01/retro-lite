// TypeScript types matching the Supabase schema

export type BoardPhase = 'gathering' | 'grouping' | 'voting' | 'actions';

export type Board = {
  id: string;
  title: string;
  invite_code: string | null;
  phase: BoardPhase;
  created_at: string;
  updated_at: string;
  is_public: boolean;
};

export type Column = {
  id: string;
  board_id: string;
  title: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Card = {
  id: string;
  board_id: string;
  column_id: string;
  content: string;
  author: string | null;
  votes: number;
  created_at: string;
  updated_at: string;
};

export type BoardWithDetails = Board & {
  columns: Column[];
  cards: Card[];
};

