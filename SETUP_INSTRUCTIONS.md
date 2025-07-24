# Baseball Evaluation System - Supabase Setup

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub/Google
4. Create a new project:
   - Project name: `baseball-evaluations` (or any name)
   - Database password: Choose a strong password
   - Region: Choose closest to your location
5. Wait 2-3 minutes for project creation

### Step 2: Set Up Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase_setup.sql`
4. Click **"Run"** to execute the SQL
5. You should see "Success. No rows returned" message

### Step 3: Get Your Credentials
1. Go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **Public anon key** (long string starting with `eyJhbGc...`)

### Step 4: Update the HTML File
1. Open `baseball_supabase_app.html`
2. Find these lines (around line 487):
   ```javascript
   const SUPABASE_URL = 'YOUR_SUPABASE_URL';
   const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
   ```
3. Replace with your actual values:
   ```javascript
   const SUPABASE_URL = 'https://abcdefgh.supabase.co';
   const SUPABASE_ANON_KEY = 'your_actual_anon_key_here';
   ```
4. Save the file

### Step 5: Test It!
1. Open `baseball_supabase_app.html` in your web browser
2. The yellow setup notice should disappear
3. Try submitting a test evaluation
4. You should see it appear in the "Live Evaluations" section instantly

## ✅ What You Get

### Features:
- **Real-time updates** - Multiple users see changes instantly
- **Free hosting** - Up to 50,000 evaluations on Supabase free tier
- **Mobile-friendly** - Works on phones and tablets
- **No coding required** - Just update the credentials
- **Automatic backups** - Your data is safely stored in the cloud
- **Statistics dashboard** - See summaries and trends

### Multi-User Benefits:
- Coaches can evaluate simultaneously
- Instant data sharing across all devices
- No more Google Sheets sharing issues
- Real-time leaderboards and stats
- Works offline (syncs when reconnected)

## 🔧 Advanced Options (Optional)

### View Your Data
1. Go to Supabase → **Table Editor**
2. Click on "evaluations" table
3. See all your data in spreadsheet format
4. Export to CSV if needed

### Add Authentication (Optional)
If you want to restrict access:
1. Go to **Authentication** → **Settings**
2. Enable email/password auth
3. Update the HTML to require login

### Custom Domain (Optional)
Host on your own domain:
1. Upload the HTML file to any web hosting service
2. Point your domain to the hosting service
3. Your evaluation system is live!

## 🆘 Troubleshooting

**"Setup Required" message won't go away:**
- Double-check your URL and key are correct
- Make sure there are no extra spaces or quotes

**Evaluations not saving:**
- Check browser console for errors (F12)
- Verify the SQL setup ran successfully
- Ensure Row Level Security is enabled

**Not seeing real-time updates:**
- Refresh the page
- Check internet connection
- Try opening in a new browser tab

## 📊 Database Schema

Your `evaluations` table includes:
- `player_name` - Player's name
- `evaluation_type` - pitching, infield, outfield, batting, catching, speed
- `ratings` - JSON array of criteria and scores
- `average_score` - Calculated average (2-8 scale)
- `velocity` - MPH for pitching evaluations only
- `created_at` - Timestamp

## 🔒 Security & Privacy

- Data is stored securely in Supabase cloud
- No sensitive information is collected
- Public read/write access for tryout evaluations
- Can be restricted to authenticated users if needed

## 💰 Cost

**Supabase Free Tier includes:**
- 50,000 database rows (evaluations)
- 1GB database storage
- Real-time subscriptions
- 500MB file storage

This should handle thousands of player evaluations for free!

---

**Need help?** The system includes sample data and will work immediately after setup. Try it with test evaluations first!