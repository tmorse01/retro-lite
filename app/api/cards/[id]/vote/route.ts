import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();

    // First, get current vote count
    const { data: card, error: fetchError } = await supabase
      .from("cards")
      .select("votes")
      .eq("id", params.id)
      .single();

    if (fetchError || !card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // Increment votes
    const { data: updatedCard, error: updateError } = await supabase
      .from("cards")
      .update({
        votes: card.votes + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (updateError || !updatedCard) {
      console.error("Error voting on card:", updateError);
      return NextResponse.json(
        { error: "Failed to vote on card" },
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

