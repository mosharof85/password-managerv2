# Password Manager

A password manager application built with Next.js and Supabase.

## Features

- **Credential Management**: Store and manage login credentials for websites
- **Supabase Backend**: Secure database with Row Level Security
- **Docker Ready**: Easy deployment with Docker
- **SSH Key Storage**: Upload/download SSH keys securely to Supabase Storage
- **FTP/SFTP Integration**: Launch FileZilla with pre-filled credentials (client-side)

## Prerequisites

- Node.js 20+
- Docker (optional)
- Supabase project

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://bdyxvwdtqogjerbjdtgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_secret_jdAHBH7CGvQN7WeDkF8VRA_57hGMdgS
PORT=3001
SECRET_KEY=AlphaEnginePasswordManager2026SecureKey
```

## Setup

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Docker Deployment

```bash
# Build the image
docker build -t password-manager .

# Run the container
docker run -p 3001:3001 --env-file .env.local password-manager
```

### VPS Deployment

```bash
# SSH to your VPS
ssh -i "path/to/ssh-key" ubuntu@158.180.30.52

# Clone and setup
cd ~/projects
git clone <your-repo> password-manager
cd password-manager

# Copy .env.local and install
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
npm install
npm run build

# Start the application
npm start
```

## Database Schema

The app uses a single `entries` table with the following structure:

- `id` (uuid)
- `domain` (text) - Required
- `wp_user`, `wp_password` (WordPress credentials)
- `login_url` (WordPress login URL)
- `notes` (text)
- `hosting_url`, `hosting_user`, `hosting_password`
- `ftp_url`, `ftp_user`, `ftp_password`, `port`, `ftp_directory`
- `private_key`, `local_directory`
- `ssh_host`, `ssh_port`, `ssh_user`, `ssh_pass`, `ssh_key_ref`
- `created_at`, `updated_at` (timestamps)

## Storage

SSH keys are stored in Supabase Storage bucket `ssh-keys` (private, 500MB free tier).

## Security

- JWT authentication via Supabase Auth
- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- HTTPS enforced in production

## API Endpoints

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `GET /api/entries` - Get all entries
- `POST /api/entries` - Create new entry
- `PUT /api/entries/[domain]` - Update entry
- `DELETE /api/entries/[domain]` - Delete entry
- `POST /api/ssh/upload` - Upload SSH key
- `GET /api/ssh/download?key_ref=drive://filename` - Download SSH key

## Pages

- `/` - Login page
- `/dashboard` - Entries list
- `/entry/new` - New entry form
- `/entry/[domain]` - Edit entry form
- `/settings` - Settings page
