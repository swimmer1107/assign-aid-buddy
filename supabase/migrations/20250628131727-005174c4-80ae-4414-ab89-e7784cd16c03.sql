
-- Create wishlists table for users to save notes they're interested in
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  note_id UUID REFERENCES public.notes NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, note_id)
);

-- Enable Row Level Security
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wishlists
CREATE POLICY "Users can view their own wishlist" ON public.wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist" ON public.wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own wishlist" ON public.wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_downloads(note_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.notes 
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = note_id;
END;
$$;
