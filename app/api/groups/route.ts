import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { boardId, columnId, name, sortOrder } = await request.json();

    if (!boardId || !columnId || !name) {
      return NextResponse.json(
        { error: "boardId, columnId, and name are required" },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    // If sortOrder not provided, get the max sort_order for this column and add 1
    let finalSortOrder = sortOrder;
    if (finalSortOrder === undefined) {
      const { data: existingGroups } = await supabase
        .from("groups")
        .select("sort_order")
        .eq("board_id", boardId)
        .eq("column_id", columnId)
        .order("sort_order", { ascending: false })
        .limit(1);

      finalSortOrder =
        existingGroups && existingGroups.length > 0
          ? existingGroups[0].sort_order + 1
          : 0;
    }

    const { data: group, error } = await supabase
      .from("groups")
      .insert({
        board_id: boardId,
        column_id: columnId,
        name,
        sort_order: finalSortOrder,
      })
      .select()
      .single();

    if (error || !group) {
      console.error("Error creating group:", error);
      return NextResponse.json(
        { error: "Failed to create group" },
        { status: 500 }
      );
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error in POST /api/groups:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
