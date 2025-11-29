import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Create board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert({
        title,
        is_public: true,
      })
      .select()
      .single();

    if (boardError || !board) {
      console.error("Error creating board:", boardError);
      return NextResponse.json(
        { error: "Failed to create board" },
        { status: 500 }
      );
    }

    // Create default columns
    const columns = [
      { board_id: board.id, title: "Went Well", sort_order: 0 },
      { board_id: board.id, title: "Needs Improvement", sort_order: 1 },
      { board_id: board.id, title: "Action Items", sort_order: 2 },
    ];

    const { error: columnsError } = await supabase
      .from("columns")
      .insert(columns);

    if (columnsError) {
      console.error("Error creating columns:", columnsError);
      // Board was created, so we'll return it anyway
    }

    return NextResponse.json(board);
  } catch (error) {
    console.error("Error in POST /api/boards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

