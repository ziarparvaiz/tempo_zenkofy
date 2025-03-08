-- Create extension for UUID generation if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create pdfs table
CREATE TABLE IF NOT EXISTS public.pdfs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'to-read',
  progress INTEGER DEFAULT 0,
  last_read TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for PDFs if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on pdfs table
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;

-- Create policies for pdfs table
DROP POLICY IF EXISTS "Users can view their own PDFs" ON public.pdfs;
CREATE POLICY "Users can view their own PDFs"
  ON public.pdfs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own PDFs" ON public.pdfs;
CREATE POLICY "Users can insert their own PDFs"
  ON public.pdfs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own PDFs" ON public.pdfs;
CREATE POLICY "Users can update their own PDFs"
  ON public.pdfs FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own PDFs" ON public.pdfs;
CREATE POLICY "Users can delete their own PDFs"
  ON public.pdfs FOR DELETE
  USING (auth.uid() = user_id);

-- Create storage policies
DROP POLICY IF EXISTS "Users can upload PDFs" ON storage.objects;
CREATE POLICY "Users can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their PDFs" ON storage.objects;
CREATE POLICY "Users can update their PDFs"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can read PDFs" ON storage.objects;
CREATE POLICY "Users can read PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');

DROP POLICY IF EXISTS "Users can delete their PDFs" ON storage.objects;
CREATE POLICY "Users can delete their PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS pdfs_user_id_idx ON public.pdfs (user_id);
