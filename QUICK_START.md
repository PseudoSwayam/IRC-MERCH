# 🎯 QUICK START - Firebase Setup

## What You Need to Do (2 Simple Steps)

---

### Step 1: Create Firebase Project (5 minutes)

1. Go to: **https://console.firebase.google.com/**
2. Click **"Add project"**
3. Name it: **`irc-merch`**
4. Click through setup (disable Analytics if you want)
5. Click the **`</>`** (web) icon
6. Register app as **"IRC Merch Website"**

---

### Step 2: Copy Your Keys (2 minutes)

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "irc-merch.firebaseapp.com",
  projectId: "irc-merch",
  storageBucket: "irc-merch.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abc123"
};
```

---

### Step 3: Create `.env.local` File (1 minute)

Create file: `/Users/swayamsahoo/Projects/IRC_MERCH/.env.local`

Paste this and **replace with YOUR values**:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...YOUR_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=irc-merch.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=irc-merch
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=irc-merch.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
```

---

### Step 4: Enable Firestore (2 minutes)

1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Production mode"**
4. Select location (closest to you)
5. Go to **"Rules"** tab, paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

6. Click **"Publish"**

---

### Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## ✅ Test It!

1. Go to: `http://localhost:3000`
2. Fill order form with name and size
3. Click "Show QR Code"
4. Enter Transaction ID: `TEST123456`
5. Click "Confirm Order"
6. You should see **"Order Submitted Successfully!"** with an Order ID
7. Check Firebase Console → Firestore → `orders` collection

---

## 📊 View Orders

**Firebase Console → Firestore Database → orders**

You'll see:
- Customer name
- Size selected
- Transaction ID
- Timestamp
- Status

---

## 🚨 Troubleshooting

**Problem:** "Firebase not configured"
→ Make sure `.env.local` exists with all 6 variables

**Problem:** Can't see `.env.local` file
→ It might be hidden. In VS Code: View → Show Hidden Files

**Problem:** Orders not saving
→ Check Firestore rules are published (Step 4)

**Problem:** Still not working
→ Restart dev server after creating `.env.local`

---

## 📚 Need More Help?

Check browser console for detailed error messages

---

**That's it! Your merch store is now connected to Firebase! 🎉**
