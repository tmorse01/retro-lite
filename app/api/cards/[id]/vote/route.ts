import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    // Get card with board_id to check phase
    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("votes, board_id")
      .eq("id", id)
      .single();

    if (fetchError || !card) {
      console.error("Error fetching card:", fetchError);
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Get board to check phase
    const { data: board, error: boardError } = await supabase
      .from("boards")
      .select("phase")
      .eq("id", card.board_id)
      .single();

    if (boardError || !board) {
      console.error("Error fetching board:", boardError);
      return NextResponse.json(
        { error: "Board not found" },
        { status: 404 }
      );
    }

    // Only allow voting in voting phase
    if (board.phase !== "voting") {
      return NextResponse.json(
        { error: "Voting is only allowed in the voting phase" },
        { status: 403 }
      );
    }

    // Increment votes
    const { data: updatedCard, error: updateError } = await supabase
      .from("cards")
      .update({ votes: card.votes + 1 })
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updatedCard) {
      console.error("Error updating votes:", updateError);
      return NextResponse.json(
        { error: "Failed to vote" },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error in POST /api/cards/[id]/vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

