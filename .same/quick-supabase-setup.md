# ⚡ 5-Minute Supabase Setup for BOLES Smart Home

## 🚀 **Quick Start (5 minutes)**

### **1. Create Supabase Project** (2 minutes)
```
🌐 Go to: https://app.supabase.com
➕ Click: "New Project"
📝 Fill in:
   - Name: boles-smart-home
   - Password: [create strong password]
   - Region: [closest to you]
⏱️ Wait: 2-3 minutes for setup
```

### **2. Get Your Credentials** (1 minute)
```
⚙️ Go to: Settings → API
📋 Copy:
   - Project URL: https://xxxxx.supabase.co
   - Anon Key: eyJhbGc... (long string)
```

### **3. Update Environment** (30 seconds)
Replace in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### **4. Setup Database** (1 minute)
```
🗄️ Go to: SQL Editor in Supabase
📄 Copy: All content from `.same/supabase-database-setup.sql`
📋 Paste: Into SQL Editor
▶️ Click: "Run"
```

### **5. Test Connection** (30 seconds)
```bash
cd boles-smart-shop
bun dev
# Visit: http://localhost:3000
# Try signing up - should work!
```

---

## 🎯 **That's It!**

Your BOLES Smart Home platform now has:
- ✅ **User Authentication** (via Clerk + Supabase)
- ✅ **Database Storage** (users, orders, wishlist)
- ✅ **Admin Panel** (with proper permissions)
- ✅ **Security** (Row Level Security enabled)

---

## 🆘 **If Something Goes Wrong**

### **Most Common Issues:**

**Error: "Supabase not configured"**
→ Double-check your URL and key in `.env.local`

**Error: "Table doesn't exist"**
→ Run the SQL setup script in Supabase SQL Editor

**Error: "Permission denied"**
→ Make sure you ran the complete SQL script (including RLS policies)

---

## 🔧 **Pro Tips**

1. **Save your database password** - you'll need it later
2. **Bookmark your Supabase dashboard** - you'll use it often
3. **Test with a real signup** - create an account to verify everything works
4. **Set yourself as admin**: In Supabase, go to **Authentication** → **Users** → Edit your user → Set role to 'admin'

---

**Your database is now ready for production! 🎉**
