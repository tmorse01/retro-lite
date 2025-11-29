import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, author } = await request.json();

    const supabase = createServerClient();

    const updateData: { content?: string; author?: string | null } = {};
    if (content !== undefined) updateData.content = content;
    if (author !== undefined) updateData.author = author || null;

    const { data: card, error } = await supabase
      .from("cards")
      .update(updateData)
      .eq("id", id)
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { error } = await supabase.from("cards").delete().eq("id", id);

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

