import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");
    const tag = url.searchParams.get("tag");

    // Build query
    let query = supabase.from("pdfs").select("*").eq("user_id", user.id);

    // Apply filters if provided
    if (status) {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    if (tag) {
      query = query.contains("tags", [tag]);
    }

    // Execute query
    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pdfs: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
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
    const { id, status, progress, tags } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "PDF ID is required" },
        { status: 400 },
      );
    }

    // Build update object
    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (tags !== undefined) updateData.tags = tags;

    // Add last_read timestamp if updating progress
    if (progress !== undefined) {
      updateData.last_read = new Date().toISOString();
    }

    // Update PDF
    const { data, error } = await supabase
      .from("pdfs")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ pdf: data[0] });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get PDF ID from URL
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "PDF ID is required" },
        { status: 400 },
      );
    }

    // Get file path before deleting the record
    const { data: pdf } = await supabase
      .from("pdfs")
      .select("file_path")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // Delete PDF record
    const { error: deleteError } = await supabase
      .from("pdfs")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Delete file from storage
    if (pdf.file_path) {
      await supabase.storage.from("pdfs").remove([pdf.file_path]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
