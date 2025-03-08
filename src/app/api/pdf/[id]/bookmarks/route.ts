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

    // Get bookmarks for this PDF
    const { data: bookmarks, error } = await supabase
      .from("pdf_bookmarks")
      .select("*")
      .eq("pdf_id", params.id)
      .eq("user_id", user.id)
      .order("page", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookmarks });
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
    const { page, title } = await request.json();

    if (!page) {
      return NextResponse.json(
        { error: "Page number is required" },
        { status: 400 },
      );
    }

    // Check if bookmark already exists for this page
    const { data: existingBookmark } = await supabase
      .from("pdf_bookmarks")
      .select("*")
      .eq("pdf_id", params.id)
      .eq("user_id", user.id)
      .eq("page", page)
      .maybeSingle();

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark already exists for this page" },
        { status: 400 },
      );
    }

    // Create bookmark
    const { data: bookmark, error } = await supabase
      .from("pdf_bookmarks")
      .insert([
        {
          pdf_id: params.id,
          user_id: user.id,
          page,
          title: title || `Page ${page}`,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookmark });
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

    // Get bookmark ID from URL
    const url = new URL(request.url);
    const bookmarkId = url.searchParams.get("bookmarkId");

    if (!bookmarkId) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 },
      );
    }

    // Delete bookmark
    const { error } = await supabase
      .from("pdf_bookmarks")
      .delete()
      .eq("id", bookmarkId)
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
