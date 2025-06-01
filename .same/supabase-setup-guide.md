# 🗄️ Supabase Configuration Guide for BOLES Smart Home

## 📋 **Quick Setup Steps**

### **Step 1: Create Supabase Project**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Project Name**: `boles-smart-home`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### **Step 2: Get Your Database Credentials**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Public Key** (starts with `eyJhbGc...`)

### **Step 3: Update Environment Variables**
Replace the placeholder values in your `.env.local` file:

```env
# Supabase Database (REPLACE WITH YOUR ACTUAL VALUES)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### **Step 4: Set Up Database Schema**
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `.same/supabase-database-setup.sql`
3. Paste it in the SQL Editor
4. Click **Run** to create all tables and policies

### **Step 5: Test Connection**
Run your application to test:
```bash
cd boles-smart-shop
bun dev
```

---

## 🔧 **Manual Setup Instructions**

### **Alternative Setup via CLI**
If you prefer command line:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push database schema
supabase db push
```

### **Environment Variables Explained**
```env
# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co

# Public anon key (safe to expose in frontend)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service role key for admin operations
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 **Database Schema Overview**

Your BOLES Smart Home database includes:

### **Tables Created:**
- 🧑 **users**: Customer accounts (synced with Clerk)
- 📦 **products**: Product catalog (optional)
- 🛒 **orders**: Customer orders
- ❤️ **wishlist**: User wishlists

### **Security Features:**
- ✅ **Row Level Security (RLS)**: Enabled on all tables
- 🔐 **Authentication**: Integrated with Clerk
- 👥 **Role-based access**: User vs Admin permissions
- 🛡️ **Data protection**: Users can only access their own data

---

## ✅ **Verification Steps**

### **Check if Setup Worked:**

1. **Database Connection Test:**
   ```bash
   # Run this in your project
   cd boles-smart-shop
   bun dev

   # Check browser console for any Supabase errors
   ```

2. **Sign Up Test:**
   - Visit: `http://localhost:3000/auth/signup`
   - Create a new account
   - Check Supabase dashboard → **Authentication** → **Users**
   - Your user should appear in both Clerk and Supabase

3. **Admin Panel Test:**
   - Visit: `http://localhost:3000/admin`
   - Should show authentication screen if not signed in
   - After signing in, check if user data loads

---

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Supabase not configured"**
**Solution**: Update `.env.local` with your actual Supabase credentials

### **Issue 2: Database connection fails**
**Solution**:
- Check your Project URL and Anon Key are correct
- Ensure your Supabase project is active (not paused)
- Check internet connection

### **Issue 3: RLS policies blocking requests**
**Solution**:
- Ensure you ran the complete SQL setup script
- Check that Clerk authentication is working
- Verify JWT tokens are being passed correctly

### **Issue 4: Tables don't exist**
**Solution**:
- Run the SQL setup script in Supabase SQL Editor
- Check **Database** → **Tables** to verify tables were created

---

## 🔑 **Production Configuration**

### **For Deployment:**
1. **Environment Variables**: Add to your hosting platform
2. **Domain Setup**: Configure your production domain in Supabase
3. **Database Backup**: Set up automated backups
4. **Monitoring**: Enable Supabase logging and monitoring

### **Security Checklist:**
- ✅ RLS policies enabled
- ✅ Anon key (public) vs Service role key (private)
- ✅ Proper CORS configuration
- ✅ SSL/HTTPS enabled

---

## 📞 **Getting Help**

### **If You're Still Having Issues:**

1. **Check Supabase Logs**: Dashboard → **Logs** → **Database**
2. **Verify Credentials**: Double-check Project URL and keys
3. **Test Connection**: Use Supabase dashboard to run queries manually
4. **Community Support**: [Supabase Discord](https://discord.supabase.com)

### **Quick Debug:**
```javascript
// Add this to any page to test Supabase connection
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...');
```

---

## 🎯 **Next Steps After Setup**

1. ✅ **Test Authentication**: Sign up → Check users table
2. ✅ **Test Admin Access**: Set user role to 'admin'
3. ✅ **Test Orders**: Place a test order
4. ✅ **Test Wishlist**: Add items to wishlist
5. ✅ **Deploy**: Deploy to production with Supabase

Your BOLES Smart Home platform will be fully functional with user management, orders, and admin capabilities! 🚀
