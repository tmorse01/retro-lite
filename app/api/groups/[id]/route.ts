import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, sortOrder } = await request.json();

    const supabase = createServerClient();

    const updateData: { name?: string; sort_order?: number } = {};
    if (name !== undefined) updateData.name = name;
    if (sortOrder !== undefined) updateData.sort_order = sortOrder;

    const { data: group, error } = await supabase
      .from("groups")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !group) {
      console.error("Error updating group:", error);
      return NextResponse.json(
        { error: "Failed to update group" },
        { status: 500 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error in PATCH /api/groups/[id]:", error);
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

    // First, ungroup all cards in this group
    await supabase.from("cards").update({ group_id: null }).eq("group_id", id);

    // Then delete the group
    const { error } = await supabase.from("groups").delete().eq("id", id);

    if (error) {
      console.error("Error deleting group:", error);
      return NextResponse.json(
        { error: "Failed to delete group" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/groups/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
