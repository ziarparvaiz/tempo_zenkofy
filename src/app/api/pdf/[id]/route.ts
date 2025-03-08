import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

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

    // Get PDF data
    const { data: pdf, error } = await supabase
      .from("pdfs")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pdf) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    return NextResponse.json({ pdf });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("PATCH request received for PDF:", params.id);
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
    const { progress, status, last_read } = await request.json();

    // Build update object
    const updateData: any = {};
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;
    if (last_read !== undefined) updateData.last_read = last_read;
    else if (progress !== undefined || status !== undefined) {
      updateData.last_read = new Date().toISOString();
    }

    // Update PDF
    const { data, error } = await supabase
      .from("pdfs")
      .update(updateData)
      .eq("id", params.id)
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
