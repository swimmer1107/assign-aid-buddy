
-- Create table for sellable notes
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  university TEXT NOT NULL,
  course_code TEXT,
  professor_name TEXT,
  semester TEXT,
  year INTEGER,
  content_type TEXT NOT NULL CHECK (content_type IN ('pdf', 'doc', 'image', 'video')),
  file_path TEXT NOT NULL,
  file_size BIGINT,
  price DECIMAL(10,2) NOT NULL,
  preview_available BOOLEAN DEFAULT false,
  preview_file_path TEXT,
  downloads_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending_review')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for note purchases
CREATE TABLE public.note_purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users NOT NULL,
  note_id UUID REFERENCES public.notes NOT NULL,
  purchase_price DECIMAL(10,2) NOT NULL,
  payment_method_id TEXT,
  transaction_id TEXT,
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(buyer_id, note_id)
);

-- Create table for note reviews
CREATE TABLE public.note_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_id UUID REFERENCES auth.users NOT NULL,
  note_id UUID REFERENCES public.notes NOT NULL,
  purchase_id UUID REFERENCES public.note_purchases NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(reviewer_id, note_id)
);

-- Create table for note categories/tags
CREATE TABLE public.note_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES public.notes NOT NULL,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notes
CREATE POLICY "Anyone can view active notes" ON public.notes
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create their own notes" ON public.notes
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Users can update their own notes" ON public.notes
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete their own notes" ON public.notes
  FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for note purchases
CREATE POLICY "Users can view their own purchases" ON public.note_purchases
  FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Users can create their own purchases" ON public.note_purchases
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies for note reviews
CREATE POLICY "Anyone can view reviews" ON public.note_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their purchases" ON public.note_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND 
    EXISTS (SELECT 1 FROM public.note_purchases WHERE buyer_id = auth.uid() AND note_id = note_reviews.note_id)
  );

CREATE POLICY "Users can update their own reviews" ON public.note_reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- RLS Policies for note tags
CREATE POLICY "Anyone can view tags" ON public.note_tags
  FOR SELECT USING (true);

CREATE POLICY "Note owners can manage tags" ON public.note_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.notes WHERE id = note_tags.note_id AND seller_id = auth.uid())
  );

-- Create storage bucket for notes files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes-files', 'notes-files', false);

-- Storage policies for notes files
CREATE POLICY "Anyone can view note files" ON storage.objects
  FOR SELECT USING (bucket_id = 'notes-files');

CREATE POLICY "Authenticated users can upload note files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'notes-files' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own note files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'notes-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own note files" ON storage.objects
  FOR DELETE USING (bucket_id = 'notes-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to update note rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_note_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.notes 
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.note_reviews 
      WHERE note_id = COALESCE(NEW.note_id, OLD.note_id)
    ),
    reviews_count = (
      SELECT COUNT(*) 
      FROM public.note_reviews 
      WHERE note_id = COALESCE(NEW.note_id, OLD.note_id)
    )
  WHERE id = COALESCE(NEW.note_id, OLD.note_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update note rating
CREATE TRIGGER update_note_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.note_reviews
  FOR EACH ROW EXECUTE FUNCTION update_note_rating();
