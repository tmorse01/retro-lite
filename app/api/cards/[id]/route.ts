import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/client";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    const supabase = createSupabaseServerClient();

    const { data: card, error } = await supabase
      .from("cards")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error || !card) {
      console.error("Error updating card:", error);
      return NextResponse.json(
        { error: "Failed to update card" },
        { status: 500 }
      );
    }

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error in PATCH /api/cards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from("cards")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting card:", error);
      return NextResponse.json(
        { error: "Failed to delete card" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/cards/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

