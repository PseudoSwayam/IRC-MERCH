# 🔥 Firebase Setup Complete Guide

## Overview

Your IRC Merch website stores orders in Firebase Firestore. No file storage needed - just text data (name, size, transaction ID).

---

## 🚀 Setup Steps

### 1. Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"**
3. Enter project name: `irc-merch` (or any name you like)
4. Click **Continue**
5. Disable Google Analytics (optional - not needed for this project)
6. Click **Create project**
7. Wait ~30 seconds, then click **Continue**

---

### 2. Register Web App

1. On the Firebase project page, click the **Web icon** (`</>`)
2. App nickname: `IRC Merch Website`
3. **Don't check** "Firebase Hosting"
4. Click **Register app**
5. You'll see your Firebase configuration

**Copy this config - you'll need it next!**

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

6. Click **Continue to console**

---

### 3. Create `.env.local` File

In your project root, create a file named `.env.local`:

**Location:** `/Users/swayamsahoo/Projects/IRC_MERCH/.env.local`

**Content:** (replace with YOUR values from step 2)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

**Important Notes:**
- ✅ File is already in `.gitignore` - won't be committed
- ✅ Must use `NEXT_PUBLIC_` prefix for Next.js
- ✅ Replace ALL values with your actual Firebase config
- ✅ No quotes needed around values

---

### 4. Enable Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"** button
3. Select **"Start in production mode"**
4. Click **Next**
5. Choose **Cloud Firestore location**: Select closest to your users
   - India: `asia-south1`
   - US: `us-central1`
   - Europe: `europe-west1`
6. Click **Enable**
7. Wait for database creation (~1-2 minutes)

---

### 5. Set Firestore Security Rules

1. In Firestore Database, click the **"Rules"** tab at the top
2. Delete all existing rules
3. Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders collection
    match /orders/{orderId} {
      // Allow anyone to create new orders
      allow create: if true;
      
      // Prevent public reading/updating (only you via console)
      allow read, update, delete: if false;
    }
  }
}
```

4. Click **"Publish"** button

**What this does:**
- ✅ Anyone can submit orders
- ❌ Nobody can read others' orders (privacy)
- 👀 Only you can view orders in Firebase Console

---

### 6. Restart Development Server

**Stop your current dev server:**
- Press `Ctrl+C` in terminal

**Start it again:**
```bash
npm run dev
```

The app will now connect to Firebase using your `.env.local` config.

---

## ✅ Testing

### Submit Test Order

1. Open **http://localhost:3000**
2. Scroll to order form section
3. Fill in:
   - **Name:** `Test User`
   - **Size:** Select any size (e.g., `M`)
4. Click **"Show QR Code"** button
5. In the modal, enter:
   - **Transaction ID:** `TEST123456`
6. Click **"Confirm Order"**

### Expected Behavior

✅ Button shows "Submitting..." with spinner
✅ Green success message appears
✅ Order ID displayed (e.g., `abc123def456`)
✅ Form resets to empty
✅ No errors in browser console

---

## 📊 View Orders in Firebase

### Access Orders

1. Go to **Firebase Console**
2. Click **"Firestore Database"**
3. You'll see **"orders"** collection in the left sidebar
4. Click on it to see all orders

### Order Data Structure

Each order document contains:

```javascript
{
  name: "Customer Name",
  size: "M",
  transactionId: "ABC123456",
  status: "pending",
  timestamp: Firestore Timestamp Object,
  createdAt: "2026-01-28T12:34:56.789Z"
}
```

### Manage Orders

**View Order Details:**
- Click any order document to see full details

**Update Order Status:**
1. Click on an order
2. Click "Edit" icon (pencil)
3. Change `status` field:
   - `pending` → `confirmed` → `processing` → `completed`
4. Click "Update"

**Export Orders:**
1. Click three dots menu in Firestore
2. Select "Export"
3. Choose format (JSON, CSV)

---

## 🎯 What Happens When User Submits

1. **Form Validation** → Validates name (2+ chars), size, transaction ID (6+ chars)
2. **Firebase Write** → Creates document in `orders` collection
3. **Server Timestamp** → Adds server-side timestamp (can't be manipulated)
4. **Auto ID** → Firebase generates unique order ID
5. **Success Feedback** → User sees confirmation with order ID
6. **Form Reset** → Form clears for next customer

---

## 🔒 Security

Your setup is secure:

✅ **Write-Only Access:** Users can only create orders, not read others' orders
✅ **Server Timestamps:** Prevents client-side time manipulation
✅ **Input Validation:** Zod schema validates all data before submission
✅ **No Authentication Required:** Simple checkout flow
✅ **Private Data:** Only you can view orders via Firebase Console

---

## 🐛 Troubleshooting

### Problem: "Firebase not configured"

**Solution:**
1. Verify `.env.local` file exists in project root
2. Check all 6 environment variables are present
3. Verify no typos in variable names (must be `NEXT_PUBLIC_`)
4. Restart dev server after creating file

### Problem: "Permission denied" when submitting

**Solution:**
1. Go to Firebase Console → Firestore → Rules
2. Verify rules are exactly as shown in Step 5
3. Click "Publish" if you made changes
4. Wait 30 seconds for rules to propagate

### Problem: Orders not appearing in Firestore

**Solution:**
1. Check browser console for error messages
2. Verify project ID in `.env.local` matches Firebase Console
3. Make sure Firestore database is enabled
4. Try refreshing Firestore page in console

### Problem: "Module not found" errors

**Solution:**
```bash
npm install
npm run dev
```

---

## 📱 Deployment (Vercel/Netlify)

When deploying your site:

### 1. Add Environment Variables

In your deployment platform (Vercel/Netlify):

**Settings → Environment Variables**

Add all 6 variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### 2. Redeploy

Trigger a new deployment to pick up environment variables.

### 3. Test Production

Submit a test order on your live site to verify everything works.

---

## 📊 Firestore Free Tier Limits

Your current setup stays well within free limits:

| Resource | Free Tier | Your Usage (Est.) |
|----------|-----------|-------------------|
| **Document Writes** | 20,000/day | ~100-500/day |
| **Document Reads** | 50,000/day | 0 (no reads) |
| **Storage** | 1 GB | ~1 MB (text only) |
| **Network** | 10 GB/month | Negligible |

**You can process thousands of orders per day for free!** 🎉

---

## 🎓 Next Steps

### Optional Enhancements

1. **Email Notifications**
   - Use Firebase Cloud Functions
   - Send email when new order submitted
   - Notify customer of order confirmation

2. **Admin Dashboard**
   - Build admin panel to manage orders
   - Update order status from website
   - View analytics

3. **Spam Prevention**
   - Add reCAPTCHA to form
   - Rate limiting with Firebase rules
   - Duplicate transaction ID prevention

4. **Order Tracking**
   - Let users check order status
   - Provide tracking link
   - SMS notifications

---

## 📞 Support

### Firebase Resources
- **Console:** https://console.firebase.google.com/
- **Docs:** https://firebase.google.com/docs/firestore
- **Status:** https://status.firebase.google.com/

### Check Logs
- **Browser Console:** `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows)
- **Firebase Logs:** Console → Functions → Logs (if using Cloud Functions)

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Firebase project created
- [ ] Web app registered
- [ ] `.env.local` created with all 6 variables
- [ ] Firestore database enabled
- [ ] Security rules published
- [ ] Dev server restarted
- [ ] Test order submitted successfully
- [ ] Order appears in Firestore console
- [ ] No console errors
- [ ] Form resets after submission
- [ ] Success message displays order ID

---

**🎉 Congratulations! Your IRC Merch store is now powered by Firebase!**

Orders will be stored securely and you can access them anytime from the Firebase Console.
