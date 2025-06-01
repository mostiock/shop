# 🗄️ **Step-by-Step Supabase Setup for BOLES Smart Home**

## 🎯 **What We're Setting Up**
- User authentication database (synced with Clerk)
- Order management system
- Wishlist functionality
- Admin panel data storage

---

## 📝 **Step 1: Create Supabase Account & Project**

### **1.1 Sign Up/Login**
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up with GitHub, Google, or email
3. Verify your email if needed

### **1.2 Create New Project**
1. Click **"New Project"** (green button)
2. Select your organization (or create one)
3. Fill in project details:
   ```
   Project Name: boles-smart-home
   Database Password: [CREATE STRONG PASSWORD - SAVE IT!]
   Region: Choose closest to your users
   Pricing Plan: Free (perfect for development)
   ```
4. Click **"Create new project"**
5. ⏱️ **Wait 2-3 minutes** for database to initialize

---

## 🔑 **Step 2: Get Your API Keys**

### **2.1 Find Your Credentials**
1. In your project dashboard, click **"Settings"** (gear icon)
2. Click **"API"** in the sidebar
3. You'll see:
   ```
   Project URL: https://[your-project-ref].supabase.co
   API Keys:
     - anon public: eyJhbGc... (this is safe for frontend)
     - service_role: eyJhbGc... (keep this secret!)
   ```

### **2.2 Copy Your Credentials**
- **Project URL**: Copy the full URL
- **Anon Key**: Copy the `anon` `public` key (not service_role)

---

## ⚙️ **Step 3: Update Environment Variables**

### **3.1 Edit .env.local**
Replace the placeholder values in your `.env.local` file:

```env
# Supabase Database - REPLACE WITH YOUR ACTUAL VALUES
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
```

### **3.2 Restart Your Development Server**
```bash
# Stop current server (Ctrl+C)
cd boles-smart-shop
bun dev
```

---

## 🗄️ **Step 4: Set Up Database Schema**

### **4.1 Open SQL Editor**
1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**

### **4.2 Run Database Setup Script**
1. Copy **ALL** content from `.same/supabase-database-setup.sql`
2. Paste it into the SQL Editor
3. Click **"Run"** (or Ctrl+Enter)
4. You should see: ✅ **"Success. No rows returned"**

### **4.3 Verify Tables Created**
1. Click **"Database"** in sidebar
2. Click **"Tables"**
3. You should see 4 tables:
   - ✅ `users`
   - ✅ `products` (optional)
   - ✅ `orders`
   - ✅ `wishlist`

---

## ✅ **Step 5: Test Your Setup**

### **5.1 Test Database Connection**
```bash
cd boles-smart-shop
bun dev
```

### **5.2 Test User Registration**
1. Visit: http://localhost:3000/auth/signup
2. Create a new account
3. Check if it works without errors

### **5.3 Verify User in Database**
1. Go to Supabase dashboard
2. Click **"Authentication"** → **"Users"**
3. Your new user should appear here
4. Also check **"Database"** → **"Tables"** → **"users"**

---

## 🔧 **Step 6: Set Up Admin Access**

### **6.1 Create Admin User**
1. Sign up for an account in your app
2. In Supabase dashboard, go to **"Database"** → **"Tables"** → **"users"**
3. Find your user record
4. Click **"Edit"** (pencil icon)
5. Change `role` from `user` to `admin`
6. Click **"Save"**

### **6.2 Test Admin Panel**
1. Visit: http://localhost:3000/admin
2. Should show admin dashboard if you're signed in

---

## 🎯 **Verification Checklist**

### **✅ Database Setup Complete When:**
- [ ] Supabase project created successfully
- [ ] Environment variables updated with real credentials
- [ ] Database schema script ran without errors
- [ ] 4 tables visible in Supabase dashboard
- [ ] User registration works in your app
- [ ] New users appear in both Clerk and Supabase
- [ ] Admin access works after setting role

### **✅ Expected Results:**
```
✅ No "Supabase not configured" errors
✅ User signup creates records in database
✅ Admin panel accessible with proper role
✅ Orders and wishlist features ready to use
```

---

## 🚨 **Troubleshooting Common Issues**

### **Issue: "Failed to collect page data"**
**Solution**:
- Double-check your Supabase URL and key
- Make sure project is active (not paused)
- Restart development server

### **Issue: "Permission denied for table users"**
**Solution**:
- Run the complete SQL setup script
- Check Row Level Security policies were created

### **Issue: "Invalid JWT"**
**Solution**:
- Ensure Clerk and Supabase are both properly configured
- Check that authentication is working

### **Issue: Tables don't exist**
**Solution**:
- Re-run the SQL setup script
- Check for any error messages in SQL Editor

---

## 🎉 **Success!**

Your BOLES Smart Home platform now has:
- 🗄️ **Database**: Supabase PostgreSQL database
- 👥 **Users**: Clerk + Supabase user management
- 🛒 **Orders**: Full order management system
- ❤️ **Wishlist**: User wishlist functionality
- 🔐 **Security**: Row Level Security enabled
- 👨‍💼 **Admin**: Role-based access control

**Ready for production deployment!** 🚀
