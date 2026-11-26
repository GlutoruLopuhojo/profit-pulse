-- Table: calculations
CREATE TABLE IF NOT EXISTS public.calculations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users not null,
    title text not null,
    inputs jsonb not null,
    metrics jsonb not null,
    ai_advice jsonb,
    created_at timestamptz default now()
);

-- Enable RLS
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own calculations" ON public.calculations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calculations" ON public.calculations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calculations" ON public.calculations
    FOR DELETE USING (auth.uid() = user_id);

-- Add profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid primary key references auth.users ON DELETE CASCADE,
    email text,
    is_pro boolean default false
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Create a function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_pro)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
