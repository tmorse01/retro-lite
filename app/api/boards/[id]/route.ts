import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Fetch board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("*")
      .eq("id", id)
      .single();

    if (boardError || !board) {
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    // Fetch columns
    const { data: columns, error: columnsError } = await supabase
      .from("columns")
      .select("*")
      .eq("board_id", id)
      .order("sort_order");

    if (columnsError) {
      console.error("Error fetching columns:", columnsError);
    }

    // Fetch cards
    const { data: cards, error: cardsError } = await supabase
      .from("cards")
      .select("*")
      .eq("board_id", id)
      .order("votes", { ascending: false });

    if (cardsError) {
      console.error("Error fetching cards:", cardsError);
    }

    return NextResponse.json({
      ...board,
      columns: columns || [],
      cards: cards || [],
    });
  } catch (error) {
    console.error("Error in GET /api/boards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

