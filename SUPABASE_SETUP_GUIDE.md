# 🚀 Supabase Setup Guide - Step by Step

**Estimated Time:** 15-20 minutes
**Difficulty:** Easy (just follow the steps!)

---

## ⚠️ BEFORE YOU START

1. **Open this file** in one window
2. **Open your browser** in another window
3. **Follow each step carefully**
4. **Don't skip any step!**

---

## 📝 STEP 1: Create Supabase Account (2 minutes)

### 1.1 Go to Supabase
Open browser and go to: **https://supabase.com**

### 1.2 Sign Up
- Click **"Start your project"** atau **"Sign In"** (top-right)
- Choose sign-up method:
  - ✅ **GitHub** (recommended - fastest)
  - atau Email/Password

### 1.3 Complete Sign Up
- Follow the prompts
- Verify email if needed
- You'll land on Supabase Dashboard

**✅ CHECKPOINT:** You should see "All projects" page

---

## 📝 STEP 2: Create Project (3 minutes)

### 2.1 Create New Project
- Click **"New Project"** button (big green button)

### 2.2 Choose/Create Organization
- If this is your first time:
  - Click **"Create organization"**
  - Name: `kawalbencana` (or anything you want)
  - Choose **"Free"** plan
  - Click **"Create organization"**

### 2.3 Fill Project Details
Now fill in the project form:

**Project Name:**
```
kawalbencana
```

**Database Password:** (IMPORTANT!)
```
Generate a strong password and SAVE IT!
```
- Click the **"Generate a password"** button
- **COPY THE PASSWORD** and save it somewhere safe (you'll need it!)
- Alternatively, create your own (min 8 characters)

**Region:**
```
Southeast Asia (Singapore)
```
(Closest to Indonesia for best performance)

**Pricing Plan:**
```
Free (should be selected by default)
```

### 2.4 Create Project
- Click **"Create new project"** button
- Wait 2-3 minutes while project is being set up
- You'll see a progress indicator

**✅ CHECKPOINT:** Project dashboard loads with "Table Editor" view

---

## 📝 STEP 3: Get Credentials (2 minutes)

### 3.1 Go to API Settings
- In left sidebar, click **⚙️ Settings** (bottom)
- Click **"API"** from the settings menu

### 3.2 Copy Project URL
- Find section **"Project URL"**
- You'll see something like: `https://xxxxxxxxxxxxx.supabase.co`
- Click the **copy icon** 📋 next to it
- **SAVE THIS** - we'll use it in Step 4

### 3.3 Copy Anon Key
- Scroll down to **"Project API keys"**
- Find **"anon" "public"** key
- It's a LONG string (starts with `eyJ...`)
- Click the **copy icon** 📋 to copy it
- **SAVE THIS** - we'll use it in Step 4

**✅ CHECKPOINT:** You have both:
- Project URL: `https://xxxxx.supabase.co`
- Anon Key: `eyJhbGc...` (very long string)

---

## 📝 STEP 4: Update Environment Variables (1 minute)

### 4.1 Open .env.local File
In your kawalbencana project, open:
```
/Users/ainunnajib/kawalbencana/.env.local
```

### 4.2 Replace Values
Replace the placeholder values with your actual credentials:

**BEFORE:**
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**AFTER:** (use your actual values!)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

### 4.3 Save File
- Save the file (Cmd/Ctrl + S)

**✅ CHECKPOINT:** .env.local has real Supabase credentials

---

## 📝 STEP 5: Run Database Schema (3 minutes)

### 5.1 Open SQL Editor
- In Supabase dashboard (left sidebar)
- Click **"SQL Editor"** (icon looks like </> )

### 5.2 Create New Query
- Click **"New Query"** button (top-right, looks like + icon)
- You'll see an empty SQL editor

### 5.3 Copy Schema SQL
- Open file: `/Users/ainunnajib/kawalbencana/supabase-schema.sql`
- **SELECT ALL** (Cmd/Ctrl + A)
- **COPY** (Cmd/Ctrl + C)

### 5.4 Paste into Supabase
- Go back to Supabase SQL Editor
- **PASTE** the entire schema (Cmd/Ctrl + V)
- The editor will fill with SQL code

### 5.5 Run the Query
- Click **"Run"** button (bottom-right, or press Cmd/Ctrl + Enter)
- Wait for execution (should take 5-10 seconds)
- You should see **"Success. No rows returned"** message

### 5.6 Verify Tables Were Created
- In left sidebar, click **"Table Editor"**
- You should see a list of tables:
  - ✅ users
  - ✅ recovery_points
  - ✅ photo_updates
  - ✅ needs
  - ✅ assistance_offers
  - ✅ matches
  - ✅ transactions
  - ✅ comments
  - ✅ notifications

**✅ CHECKPOINT:** All 9 tables are visible in Table Editor

---

## 📝 STEP 6: Create Storage Bucket (3 minutes)

### 6.1 Go to Storage
- In left sidebar, click **"Storage"** (icon looks like 🗄️)
- You'll see "No buckets created yet"

### 6.2 Create New Bucket
- Click **"New bucket"** button (green button)
- A modal will appear

### 6.3 Fill Bucket Details
**Name:**
```
recovery-photos
```

**Public bucket:**
```
✅ YES (check this box!)
```
(Photos should be viewable by everyone)

**File size limit:** (leave default or set to)
```
10 MB
```

**Allowed MIME types:** (leave empty for now, or specify)
```
image/*
```

### 6.4 Create Bucket
- Click **"Create bucket"** button
- Bucket will be created instantly

**✅ CHECKPOINT:** You see "recovery-photos" bucket in the list

---

## 📝 STEP 7: Configure Bucket Policies (3 minutes)

### 7.1 Open Bucket Policies
- Click on the **"recovery-photos"** bucket you just created
- Click **"Policies"** tab (top navigation)
- You'll see "No policies created yet"

### 7.2 Create Upload Policy (INSERT)
- Click **"New Policy"** button
- Choose **"For full customization"** → Click **"Create policy"**

**Fill in the form:**

**Policy name:**
```
Allow authenticated uploads
```

**Allowed operation:**
```
✅ INSERT (check only this one)
```

**Target roles:**
```
authenticated (select from dropdown)
```

**Policy definition (WITH CHECK):**
```sql
(auth.role() = 'authenticated')
```

**Click "Review"** then **"Save policy"**

### 7.3 Create View/Download Policy (SELECT)
- Click **"New Policy"** again
- Choose **"For full customization"** → Click **"Create policy"**

**Fill in the form:**

**Policy name:**
```
Allow public viewing
```

**Allowed operation:**
```
✅ SELECT (check only this one)
```

**Target roles:**
```
anon, authenticated (select both)
```

**Policy definition (USING):**
```sql
true
```

**Click "Review"** then **"Save policy"**

### 7.4 Create Delete Policy (DELETE) - Optional
- Click **"New Policy"** again
- Choose **"For full customization"** → Click **"Create policy"**

**Fill in the form:**

**Policy name:**
```
Allow users to delete own photos
```

**Allowed operation:**
```
✅ DELETE (check only this one)
```

**Target roles:**
```
authenticated
```

**Policy definition (USING):**
```sql
(bucket_id = 'recovery-photos')
```

**Click "Review"** then **"Save policy"**

**✅ CHECKPOINT:** You have at least 2 policies (INSERT and SELECT)

---

## 📝 STEP 8: Enable Email Authentication (1 minute)

### 8.1 Go to Authentication Settings
- In left sidebar, click **"Authentication"** (🔐 icon)
- Click **"Providers"** tab

### 8.2 Enable Email Provider
- You should see **"Email"** in the list
- It should already be **enabled** (toggle should be ON/green)
- If not, click the toggle to enable it

### 8.3 Email Templates (Optional - can do later)
- Click **"Email Templates"** tab
- You can customize emails later
- Default templates work fine for now

**✅ CHECKPOINT:** Email auth is enabled

---

## 📝 STEP 9: Verify Everything (2 minutes)

### 9.1 Check Database Tables
- Go to **"Table Editor"**
- Click on each table to verify:
  - ✅ users
  - ✅ recovery_points
  - ✅ photo_updates
  - ✅ comments
  - (All should show "No rows" - that's OK!)

### 9.2 Check Storage Bucket
- Go to **"Storage"**
- Click **"recovery-photos"** bucket
- You should see empty bucket (that's OK!)
- Check **"Policies"** tab - should have 2+ policies

### 9.3 Check .env.local
- Open `/Users/ainunnajib/kawalbencana/.env.local`
- Verify it has:
  - ✅ Real Supabase URL (not "your-supabase-url")
  - ✅ Real Anon Key (long string starting with eyJ...)

**✅ CHECKPOINT:** Everything is set up!

---

## 📝 STEP 10: Restart Dev Server (1 minute)

### 10.1 Stop Current Server
In your terminal where `npm run dev` is running:
- Press **Ctrl + C** to stop the server

### 10.2 Start Server Again
```bash
npm run dev
```

- Wait for server to start
- You should see: "Ready in XX ms"

### 10.3 Verify Env Vars Loaded
- Open browser: http://localhost:3000
- Open browser console (F12)
- Type:
```javascript
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```
- Should show your Supabase URL (not undefined)

**✅ CHECKPOINT:** Server running with new env vars

---

## 🎉 SETUP COMPLETE!

You now have:
- ✅ Supabase project created
- ✅ Database with all tables
- ✅ Storage bucket for photos
- ✅ Bucket policies configured
- ✅ Email authentication enabled
- ✅ Environment variables set
- ✅ Dev server running with credentials

---

## 📊 What You Have Now

### Database Tables (9 total)
1. **users** - User accounts and profiles
2. **recovery_points** - All recovery points
3. **photo_updates** - Photo timeline data
4. **needs** - Assistance needs
5. **assistance_offers** - Help offered
6. **matches** - Need-offer matches
7. **transactions** - Assistance transactions
8. **comments** - User comments
9. **notifications** - User notifications

### Storage
- **recovery-photos bucket** - For uploaded photos
- **Policies** - Upload (auth), View (public), Delete (own)

### Authentication
- **Email provider** - For user login/signup

---

## ❓ Troubleshooting

### "Error: Invalid API key"
- Check .env.local has correct NEXT_PUBLIC_SUPABASE_ANON_KEY
- Make sure you copied the "anon public" key, not "service_role"
- Restart dev server after changing .env.local

### "Error: fetch failed"
- Check .env.local has correct NEXT_PUBLIC_SUPABASE_URL
- Make sure URL starts with https://
- No trailing slash in URL

### Tables not created
- Re-run the SQL schema (Step 5)
- Check SQL Editor for error messages
- Make sure you copied the ENTIRE schema file

### Bucket policies not working
- Double-check policy definitions (Step 7)
- Make sure "authenticated" and "anon" roles are selected
- Try deleting and recreating policies

### Can't upload files
- Check bucket is PUBLIC (Step 6.3)
- Verify INSERT policy exists (Step 7.2)
- Make sure you're authenticated (will implement auth next)

---

## 📞 Next Steps

After this setup is complete, tell me and I will:

1. **Wire up Photo Upload** to Supabase Storage (30 min)
2. **Wire up Comments** to Supabase Database (20 min)
3. **Add Authentication** - Login/signup system (40 min)
4. **Enable Real-time Updates** - Live sync (15 min)

**Total implementation:** ~2 hours after your setup!

---

## 🔒 Security Notes

### What's Safe to Share:
- ✅ Project URL (public)
- ✅ Anon Key (public - meant to be in frontend)

### What to KEEP SECRET:
- ❌ Database password
- ❌ Service Role Key (never expose this!)
- ❌ JWT Secret

### .env.local Security:
- Already in .gitignore (won't be committed)
- Never commit to GitHub
- Never share in public

---

**Ready? Start with STEP 1!** 🚀

When you finish all steps, tell me:
"Supabase setup done! Ready for integration."
