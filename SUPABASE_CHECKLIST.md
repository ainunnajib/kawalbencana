# ✅ Supabase Setup Checklist

Print this or keep it open while you work!

---

## 🎯 Quick Checklist

### Setup Steps
- [ ] **Step 1:** Create Supabase account
- [ ] **Step 2:** Create new project named "kawalbencana"
- [ ] **Step 3:** Copy Project URL and Anon Key
- [ ] **Step 4:** Update .env.local with credentials
- [ ] **Step 5:** Run supabase-schema.sql in SQL Editor
- [ ] **Step 6:** Create "recovery-photos" storage bucket (PUBLIC)
- [ ] **Step 7:** Configure bucket policies (INSERT + SELECT minimum)
- [ ] **Step 8:** Verify Email authentication is enabled
- [ ] **Step 9:** Verify all tables and bucket exist
- [ ] **Step 10:** Restart dev server (Ctrl+C, then npm run dev)

### Verification
- [ ] 9 tables visible in Table Editor
- [ ] recovery-photos bucket exists
- [ ] Bucket has at least 2 policies
- [ ] .env.local has real URL (not "your-supabase-url")
- [ ] .env.local has real Anon Key (starts with "eyJ...")
- [ ] Dev server running without errors
- [ ] Can see Supabase URL in browser console

---

## 📋 What You Need

### Credentials to Collect:
1. **Project URL:** `https://____________.supabase.co`
2. **Anon Key:** `eyJ____________________________`
3. **Database Password:** `________________` (save it!)

### Files to Update:
1. `.env.local` - Add your credentials

### Files to Use:
1. `supabase-schema.sql` - Run this in SQL Editor

---

## ⚡ Quick Reference

### Supabase Dashboard URLs:
- **SQL Editor:** https://supabase.com/dashboard/project/_/sql
- **Table Editor:** https://supabase.com/dashboard/project/_/editor
- **Storage:** https://supabase.com/dashboard/project/_/storage/buckets
- **Auth:** https://supabase.com/dashboard/project/_/auth/users
- **API Settings:** https://supabase.com/dashboard/project/_/settings/api

### Common Issues:
| Problem | Solution |
|---------|----------|
| Tables not showing | Re-run SQL schema |
| Env vars not working | Restart dev server |
| Can't find credentials | Settings → API in Supabase |
| Bucket upload fails | Check policies (INSERT for authenticated) |

---

## 🎯 Success Criteria

You're done when:
- ✅ Supabase dashboard shows your project
- ✅ Table Editor shows 9 tables (users, recovery_points, etc.)
- ✅ Storage shows "recovery-photos" bucket
- ✅ .env.local has your actual credentials
- ✅ Dev server restarts successfully
- ✅ No errors in browser console about Supabase

---

## 📞 After Setup

Tell me: **"Supabase setup done!"**

Then I will wire up:
1. Photo upload → Supabase Storage
2. Comments → Supabase Database
3. User authentication
4. Real-time updates

Estimated time: 2 hours of coding
