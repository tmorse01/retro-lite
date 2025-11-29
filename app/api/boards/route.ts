import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { DEFAULT_TEMPLATE } from "@/lib/board-templates";

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Create board
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .insert({
        title,
        is_public: true,
        phase: 'gathering', // Default to gathering phase
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

    // Create default columns from template
    const columns = DEFAULT_TEMPLATE.columns.map((title, index) => ({
      board_id: board.id,
      title,
      sort_order: index,
    }));

    const { error: columnsError } = await supabase
      .from("columns")
      .insert(columns);

    if (columnsError) {
      console.error("Error creating columns:", columnsError);
      // Still return the board even if columns fail
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

