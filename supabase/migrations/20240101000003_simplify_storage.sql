-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can read PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their PDFs" ON storage.objects;

-- Create simplified storage policies
CREATE POLICY "Allow all storage operations"
  ON storage.objects FOR ALL
  USING (bucket_id = 'pdfs');

-- Make sure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;
