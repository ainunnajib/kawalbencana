# Supabase Setup

## Running Migrations

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/001_create_comments_and_photos.sql`
4. Paste and run the SQL

### Option 2: Supabase CLI
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref fdgrafmtvwllvgnbbrbg

# Run migrations
supabase db push
```

## Tables Created

### comments
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users |
| recovery_point_id | VARCHAR(50) | ID of the recovery point |
| content | TEXT | Comment content |
| created_at | TIMESTAMP | Creation timestamp |

### photo_updates
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| recovery_point_id | VARCHAR(50) | ID of the recovery point |
| image_url | TEXT | URL to full image |
| thumbnail_url | TEXT | URL to thumbnail |
| uploaded_by | UUID | References auth.users |
| upload_date | TIMESTAMP | Upload timestamp |
| description | TEXT | Photo description |
| verification_status | VARCHAR(20) | pending/verified/rejected |
| geolocation_verified | BOOLEAN | Whether location was verified |
| created_at | TIMESTAMP | Creation timestamp |

## Storage Bucket

### recovery-photos
- Public bucket for storing recovery point photos
- Authenticated users can upload
- Anyone can view

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:
- **SELECT**: Anyone can read
- **INSERT**: Authenticated users only (for their own records)
- **UPDATE**: Users can only update their own records
- **DELETE**: Users can only delete their own records
