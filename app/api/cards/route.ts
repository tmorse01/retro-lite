import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(request: NextRequest) {
  try {
    const { boardId, columnId, content, author } = await request.json();

    if (!boardId || !columnId || !content) {
      return NextResponse.json(
        { error: "boardId, columnId, and content are required" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    const { data: card, error } = await supabase
      .from("cards")
      .insert({
        board_id: boardId,
        column_id: columnId,
        content,
        author: author || null,
        votes: 0,
      })
      .select()
      .single();

    if (error || !card) {
      console.error("Error creating card:", error);
      return NextResponse.json(
        { error: "Failed to create card" },
        { status: 500 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error in POST /api/cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

