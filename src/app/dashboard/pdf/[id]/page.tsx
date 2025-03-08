import EnhancedPdfReader from "@/components/enhanced-pdf-reader";
import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function PdfViewerPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch PDF data from the database
  const { data: pdf, error } = await supabase
    .from("pdfs")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (error || !pdf) {
    return redirect("/dashboard");
  }

  return (
    <SubscriptionCheck>
      <EnhancedPdfReader
        pdfId={pdf.id}
        pdfUrl={pdf.file_url}
        title={pdf.title}
        author={pdf.author}
        initialProgress={pdf.progress || 0}
      />
    </SubscriptionCheck>
  );
}
