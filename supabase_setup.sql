-- Create tasks table in Supabase
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow full access to authenticated users" 
  ON public.tasks 
  USING (true) 
  WITH CHECK (true);

-- Allow public access for demo purposes (remove in production)
CREATE POLICY "Allow public access" 
  ON public.tasks 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Insert sample data
INSERT INTO public.tasks (title, description, is_completed) VALUES
  ('Complete Supabase integration', 'Implement full Supabase integration with the API', false),
  ('Add authentication', 'Implement user authentication using Supabase Auth', false),
  ('Deploy to production', 'Deploy the application to production environment', false);