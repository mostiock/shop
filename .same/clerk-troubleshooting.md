# 🔧 Clerk Authentication Troubleshooting Guide

## 🚨 **Issue: Sign-up page not working**

### **Quick Diagnostic Steps**

1. **Check Debug Page**: Visit http://localhost:3000/test-auth to see Clerk status
2. **Check Console**: Open browser dev tools to see any JavaScript errors
3. **Check Network**: Look for failed API calls to Clerk in Network tab

---

## ⚙️ **Environment Configuration Check**

### **Step 1: Verify Environment Variables**
Open `.env.local` and ensure you have:

```env
# These should be from your Clerk Dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

### **Step 2: Get Correct Clerk Keys**
1. Go to https://dashboard.clerk.com
2. Select your application (or create one)
3. Go to **"Developers" → "API Keys"**
4. Copy the **Publishable Key** and **Secret Key**
5. Replace the keys in `.env.local`

---

## 🌐 **Clerk Dashboard Configuration**

### **Step 3: Configure Allowed Origins**
In your Clerk Dashboard:

1. Go to **"Developers" → "Webhooks"** (if using webhooks)
2. Go to **"Configure" → "Paths"**
3. Set the following paths:
   - **Sign-in URL**: `/auth/signin`
   - **Sign-up URL**: `/auth/signup`
   - **Home URL**: `/`

### **Step 4: Domain Settings**
1. Go to **"Configure" → "General"**
2. Add your domain: `http://localhost:3000` (for development)
3. For production, add your actual domain

---

## 🔍 **Common Issues & Solutions**

### **Issue 1: Publishable Key Format**
❌ **Wrong**: Truncated or incomplete key
✅ **Correct**: Full key starting with `pk_test_` or `pk_live_`

### **Issue 2: Missing Redirect URLs**
The sign-up component needs proper redirect configuration:

```tsx
<SignUp
  forceRedirectUrl="/"
  fallbackRedirectUrl="/"
  signInUrl="/auth/signin"
/>
```

### **Issue 3: ClerkProvider Configuration**
Ensure the provider is properly configured in `layout.tsx`:

```tsx
<ClerkProvider>
  {/* Your app content */}
</ClerkProvider>
```

### **Issue 4: Middleware Conflicts**
Check `middleware.ts` - ensure auth routes are not being protected:

```tsx
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  // Don't include /auth routes here
])
```

---

## 🧪 **Testing Steps**

### **Step 1: Basic Clerk Test**
1. Visit: http://localhost:3000/test-auth
2. Check if auth is loaded and configured properly

### **Step 2: Sign-up Flow Test**
1. Visit: http://localhost:3000/auth/signup
2. Try to create an account
3. Check browser console for errors

### **Step 3: Sign-in Test**
1. Visit: http://localhost:3000/auth/signin
2. Try to sign in with existing account

---

## 🔧 **Fix Checklist**

- [ ] **Environment Variables**: Correct Clerk keys in `.env.local`
- [ ] **Clerk Dashboard**: Application configured with correct domain
- [ ] **Redirect URLs**: Sign-up component has proper redirect settings
- [ ] **ClerkProvider**: Properly wrapped around app in `layout.tsx`
- [ ] **Middleware**: Not blocking auth routes
- [ ] **Console Errors**: No JavaScript errors in browser
- [ ] **Network Requests**: Clerk API calls are successful

---

## 📋 **Most Common Solutions**

### **Solution 1: Update Environment Variables**
```bash
# Stop the dev server
# Update .env.local with correct Clerk keys
# Restart the dev server
bun run dev
```

### **Solution 2: Clear Browser Cache**
```bash
# Clear browser cache and cookies
# Or try in incognito/private mode
```

### **Solution 3: Restart Development Server**
```bash
# Kill the server (Ctrl+C)
bun run dev
```

---

## 🆘 **If Still Not Working**

1. **Check Clerk Status**: Visit https://status.clerk.com
2. **Check Browser Compatibility**: Try different browser
3. **Check Network**: Ensure no firewall blocking clerk.com
4. **Check Clerk Documentation**: https://clerk.com/docs/nextjs/quickstart

---

## 🔍 **Debug Information Available**

Visit `/test-auth` to see:
- Auth loaded status
- User loaded status
- Sign-in status
- Environment configuration
- Troubleshooting tips

---

## 📞 **Getting Help**

If the issue persists:
1. Check the `/test-auth` page for specific error details
2. Look at browser console for JavaScript errors
3. Verify Clerk dashboard configuration
4. Ensure environment variables are correctly set

**Most sign-up issues are related to incorrect environment variables or Clerk dashboard configuration.**
