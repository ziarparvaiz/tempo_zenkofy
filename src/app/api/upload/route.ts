import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const tagsString = formData.get("tags") as string;
    const tags = tagsString ? JSON.parse(tagsString) : [];

    if (!file || !title) {
      return NextResponse.json(
        { error: "File and title are required" },
        { status: 400 },
      );
    }

    // Check file type
    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 },
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const fileName = `${user.id}/${timestamp}-${file.name.replace(/\s+/g, "_")}`;

    // Upload file to Supabase Storage
    const { data: fileData, error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(fileName, file, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Error uploading file", details: uploadError.message },
        { status: 500 },
      );
    }

    // Get the public URL for the uploaded file
    const {
      data: { publicUrl },
    } = supabase.storage.from("pdfs").getPublicUrl(fileName);

    // Generate a random cover image from Unsplash
    const randomId = Math.floor(1000000000 + Math.random() * 9000000000);
    const coverUrl = `https://images.unsplash.com/photo-${randomId}?w=500&q=80`;

    // Store PDF metadata in the database
    const { data: pdfData, error: dbError } = await supabase
      .from("pdfs")
      .insert([
        {
          user_id: user.id,
          title,
          author,
          file_path: fileName,
          file_url: publicUrl,
          cover_url: coverUrl,
          tags,
          status: "to-read",
          progress: 0,
        },
      ])
      .select();

    if (dbError) {
      console.error("Database error:", dbError);
      // If database insert fails, try to delete the uploaded file
      await supabase.storage.from("pdfs").remove([fileName]);

      return NextResponse.json(
        { error: "Error saving PDF metadata", details: dbError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      pdf: pdfData[0],
    });
  } catch (error: any) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 },
    );
  }
}
