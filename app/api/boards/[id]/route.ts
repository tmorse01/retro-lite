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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { phase } = await request.json();
    const supabase = createServerClient();

    // Validate phase
    const validPhases = ['gathering', 'grouping', 'voting', 'actions'];
    if (phase && !validPhases.includes(phase)) {
      return NextResponse.json(
        { error: "Invalid phase. Must be one of: gathering, grouping, voting, actions" },
        { status: 400 }
      );
    }

    // Update board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .update({ 
        phase: phase || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (boardError || !board) {
      return NextResponse.json(
        { error: "Failed to update board" },
        { status: 500 }
      );
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error in PATCH /api/boards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

