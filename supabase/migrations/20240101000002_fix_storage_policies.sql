-- Create storage bucket for PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Fix storage policies
DROP POLICY IF EXISTS "Users can upload PDFs" ON storage.objects;
CREATE POLICY "Users can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs');

DROP POLICY IF EXISTS "Users can update their PDFs" ON storage.objects;
CREATE POLICY "Users can update their PDFs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pdfs');

DROP POLICY IF EXISTS "Users can read PDFs" ON storage.objects;
CREATE POLICY "Users can read PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');

DROP POLICY IF EXISTS "Users can delete their PDFs" ON storage.objects;
CREATE POLICY "Users can delete their PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pdfs');
