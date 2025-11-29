import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// Assign cards to a group
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params;
    const { cardIds } = await request.json();

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return NextResponse.json(
        { error: "cardIds array is required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // Update all cards to belong to this group
    const { error } = await supabase
      .from("cards")
      .update({ group_id: groupId })
      .in("id", cardIds);

    if (error) {
      console.error("Error assigning cards to group:", error);
      return NextResponse.json(
        { error: "Failed to assign cards to group" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/groups/[id]/cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
