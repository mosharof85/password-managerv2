-- Only create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('ssh-keys', 'ssh-keys', false)
ON CONFLICT (id) DO NOTHING;
