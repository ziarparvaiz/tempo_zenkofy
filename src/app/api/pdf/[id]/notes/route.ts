import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get notes for this PDF
    const { data: notes, error } = await supabase
      .from("pdf_notes")
      .select("*")
      .eq("pdf_id", params.id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notes });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const { page, text, color } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 },
      );
    }

    // Create note
    const { data: note, error } = await supabase
      .from("pdf_notes")
      .insert([
        {
          pdf_id: params.id,
          user_id: user.id,
          page,
          text,
          color: color || "yellow",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ note });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get note ID from URL
    const url = new URL(request.url);
    const noteId = url.searchParams.get("noteId");

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 },
      );
    }

    // Delete note
    const { error } = await supabase
      .from("pdf_notes")
      .delete()
      .eq("id", noteId)
      .eq("pdf_id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
