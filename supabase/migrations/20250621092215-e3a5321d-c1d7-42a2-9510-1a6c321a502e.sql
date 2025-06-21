
-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create biography content table
CREATE TABLE public.biography_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'biography', 'achievements', 'declaration'
  title TEXT,
  content TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create family messages table
CREATE TABLE public.family_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'video', 'audio'
  media_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media gallery table
CREATE TABLE public.media_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video'
  album TEXT DEFAULT 'general',
  year INTEGER,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create will and wishes table
CREATE TABLE public.will_wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  access_password TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guestbook entries table
CREATE TABLE public.guestbook_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biography_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.will_wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can manage profiles" ON public.profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admin can manage biography content" ON public.biography_content
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can read published biography content" ON public.biography_content
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage family messages" ON public.family_messages
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can read active family messages" ON public.family_messages
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage media gallery" ON public.media_gallery
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can read published media" ON public.media_gallery
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admin can manage will and wishes" ON public.will_wishes
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can read published will content" ON public.will_wishes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can create guestbook entries" ON public.guestbook_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage guestbook entries" ON public.guestbook_entries
  FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can read approved guestbook entries" ON public.guestbook_entries
  FOR SELECT USING (is_approved = true);

-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('legacy-media', 'legacy-media', true);

-- Create storage policies
CREATE POLICY "Admin can upload media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'legacy-media' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'legacy-media' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete media" ON storage.objects
  FOR DELETE USING (bucket_id = 'legacy-media' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Public can view media" ON storage.objects
  FOR SELECT USING (bucket_id = 'legacy-media');

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default content
INSERT INTO public.biography_content (section_type, title, content, order_index) VALUES
('biography', 'Early Life', 'Born in Springfield to loving parents who taught me the value of kindness and hard work.', 1),
('biography', 'Education & Career', 'Earned a degree in Education, beginning a lifelong journey of learning and teaching.', 2),
('achievements', 'Teacher of the Year', 'Recognized for excellence in education and positive impact on students (1995)', 1),
('achievements', 'Community Service', 'Volunteered over 1000 hours at local food bank and literacy programs', 2),
('declaration', 'My Legacy Message', 'Life is not measured by the number of breaths we take, but by the moments that take our breath away. I believe in the power of kindness, the importance of family, and the lasting impact of education.', 1);
