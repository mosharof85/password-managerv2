-- Only create policies that don't exist
-- Run this in Supabase SQL Editor

-- Enable RLS if not already enabled
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_commands ENABLE ROW LEVEL SECURITY;

-- Create SSH keys bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('ssh-keys', 'ssh-keys', false)
ON CONFLICT (id) DO NOTHING;

-- Create policies using DO block to avoid errors
DO $$
BEGIN
  -- Create entries policies
  BEGIN
    CREATE POLICY "Users can view own entries" ON entries FOR SELECT USING (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can insert own entries" ON entries FOR INSERT WITH CHECK (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can update own entries" ON entries FOR UPDATE USING (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can delete own entries" ON entries FOR DELETE USING (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  -- Create agent_commands policies
  BEGIN
    CREATE POLICY "Users can view agent commands" ON agent_commands FOR SELECT USING (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can insert agent commands" ON agent_commands FOR INSERT WITH CHECK (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can update agent commands" ON agent_commands FOR UPDATE USING (true);
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Policy already exists';
  END;

  -- Create storage policies
  BEGIN
    CREATE POLICY "Users can upload SSH keys" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ssh-keys');
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Storage policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can download SSH keys" ON storage.objects FOR SELECT USING (bucket_id = 'ssh-keys');
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Storage policy already exists';
  END;

  BEGIN
    CREATE POLICY "Users can delete SSH keys" ON storage.objects FOR DELETE USING (bucket_id = 'ssh-keys');
  EXCEPTION
    WHEN duplicate_object THEN RAISE NOTICE 'Storage policy already exists';
  END;
END $$;
