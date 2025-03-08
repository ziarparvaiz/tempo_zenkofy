-- Create PDF notes table
CREATE TABLE IF NOT EXISTS pdf_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID NOT NULL REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  page INTEGER NOT NULL,
  text TEXT NOT NULL,
  color TEXT DEFAULT 'yellow',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PDF bookmarks table
CREATE TABLE IF NOT EXISTS pdf_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pdf_id UUID NOT NULL REFERENCES pdfs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  page INTEGER NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS pdf_notes_pdf_id_idx ON pdf_notes(pdf_id);
CREATE INDEX IF NOT EXISTS pdf_notes_user_id_idx ON pdf_notes(user_id);
CREATE INDEX IF NOT EXISTS pdf_bookmarks_pdf_id_idx ON pdf_bookmarks(pdf_id);
CREATE INDEX IF NOT EXISTS pdf_bookmarks_user_id_idx ON pdf_bookmarks(user_id);

-- Enable realtime for notes and bookmarks
ALTER PUBLICATION supabase_realtime ADD TABLE pdf_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE pdf_bookmarks;
