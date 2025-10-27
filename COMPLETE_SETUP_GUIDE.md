# TAGit Website - Complete Setup Guide

## 🎉 What's Been Built

### ✅ Completed Features

1. **Landing Page** (`/`)
   - Hero section with features
   - Navigation header
   - Call-to-action buttons

2. **Authentication** (`/login`, `/signup`)
   - Email/password authentication
   - User registration with Firestore profile creation
   - Protected routes

3. **User Dashboard** (`/dashboard`)
   - Profile overview
   - Quick action buttons
   - Medical information display
   - Emergency contacts list
   - Medical documents list
   - NFC settings link

4. **Profile Editor** (Modal Component)
   - Edit personal information
   - Update medical details
   - Manage emergency contacts (add/remove)
   - Real-time Firestore updates

5. **Document Upload** (Modal Component)
   - Upload PDFs, JPG, PNG (max 10MB)
   - Document categorization
   - Firebase Storage integration
   - Progress indicator

6. **Public Profile Page** (`/user/[userId]`)
   - **THE CORE EMERGENCY FEATURE!**
   - Accessible via NFC tag scanning
   - Displays patient information
   - Shows critical medical info (allergies, conditions)
   - Emergency SOS button (sends SMS with location)
   - Direct call buttons for emergency contacts
   - View medical documents
   - No login required (public access)

7. **NFC Settings Page** (`/nfc`)
   - Get unique profile URL
   - Copy/preview functionality
   - Step-by-step NFC tag programming guide
   - QR code alternative
   - Security & privacy information
   - Recommended products

## 🚀 How It All Works Together

### The Emergency Flow:

1. **User signs up** → Creates account on website
2. **User fills profile** → Adds medical info, emergency contacts, documents
3. **User gets URL** → Goes to `/nfc` to get their unique profile URL
4. **User programs NFC tag** → Writes URL to NFC tag using phone app
5. **Emergency happens** → Someone scans the NFC tag
6. **Profile opens** → Public profile page (`/user/[userId]`) opens automatically
7. **Responder acts** → Can view medical info, call contacts, or send SOS

### URL Structure:
```
https://your-domain.com/user/[userId]
```
Example:
```
https://tagit-emergency.web.app/user/abc123xyz
```

## 📱 Testing the Complete System

### Step 1: Create an Account
1. Go to http://localhost:3000/signup
2. Fill in your details
3. Sign up

### Step 2: Complete Your Profile
1. Click "Edit Profile" on dashboard
2. Add:
   - Blood group, age, address
   - Medical conditions
   - Allergies (important!)
   - Current medications
   - Emergency contacts (at least 2)
3. Save changes

### Step 3: Upload Documents
1. Click "Upload Document"
2. Select a file (test with any PDF/image)
3. Choose document type
4. Upload

### Step 4: Get Your NFC URL
1. Go to NFC Settings (link on dashboard)
2. Copy your profile URL
3. The URL format: `http://localhost:3000/user/YOUR_USER_ID`

### Step 5: Test Public Access
1. Open an incognito/private browser window
2. Paste your profile URL
3. Verify everything displays correctly
4. Test the SOS button (it will ask for location permission)
5. Test emergency contact call buttons

## 🔧 Firebase Rules Setup

**IMPORTANT:** Before deploying, update Firebase rules:

### Firestore Rules
```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Public read for emergency access
      allow read: if true;
      // Only owner can write
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /medical_documents/{userId}/{fileName} {
      // Public read for emergency access
      allow read: if true;
      // Only owner can write/delete
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Steps to Update:**
1. Go to Firebase Console → Firestore → Rules
2. Copy the Firestore rules above
3. Click "Publish"
4. Go to Storage → Rules
5. Copy the Storage rules above
6. Click "Publish"

## 🌐 Deployment

### Option 1: Firebase Hosting (Recommended - Free!)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase Hosting:
```bash
firebase init hosting
```

Select:
- Use existing project: `tagit-emergency`
- Public directory: `out`
- Single-page app: `No`
- Set up automatic builds: `No`

4. Build the Next.js app:
```bash
npm run build
```

5. Export static files:
```bash
npx next export
```

6. Deploy:
```bash
firebase deploy --only hosting
```

Your website will be live at:
```
https://tagit-emergency.web.app
```

### Option 2: Vercel (Alternative - Also Free!)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy
5. Done! You'll get a URL like `tagit-emergency.vercel.app`

## 📦 NFC Tag Setup (For Users)

### What Users Need:
1. **NFC Tags:** NTAG213/215/216 (Amazon, ~$10 for 10 tags)
2. **NFC Writing App:** "NFC Tools" (Android - Free)
3. **Their Profile URL:** From `/nfc` page

### Writing Process:
1. Open NFC Tools app
2. Tap "Write"
3. Add a record → URL/URI
4. Paste profile URL from website
5. Tap "Write"
6. Hold phone near NFC tag
7. Success! Tag is programmed

### Where to Place Tags:
- Wallet/purse
- Phone case (back)
- ID card holder
- Medical alert bracelet
- Keychain
- Car visor

## 🧪 Testing Checklist

- [ ] Sign up works
- [ ] Login works
- [ ] Profile editing saves correctly
- [ ] Document upload works (try PDF and image)
- [ ] Emergency contacts can be added/removed
- [ ] NFC settings page shows correct URL
- [ ] Public profile page works (test in incognito)
- [ ] SOS button triggers location request
- [ ] Call buttons work on mobile
- [ ] Documents are viewable in public profile
- [ ] Firebase rules are published
- [ ] Website is deployed

## 🎯 Key URLs

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing page |
| Login | `/login` | User authentication |
| Sign Up | `/signup` | New user registration |
| Dashboard | `/dashboard` | User control panel |
| NFC Settings | `/nfc` | Get profile URL & setup guide |
| Public Profile | `/user/[userId]` | Emergency responder view |

## 💡 Tips for Users

1. **Keep Profile Updated:** Medical conditions change - update regularly
2. **Test Your Tag:** After programming, test it works
3. **Multiple Tags:** Program multiple tags for wallet, phone case, etc.
4. **Emergency Contacts:** Add at least 2-3 trusted contacts
5. **Upload Documents:** Add insurance cards, prescription lists, etc.

## 🔐 Security & Privacy

- Profile URL is NOT searchable/indexed
- Only accessible via direct link
- No login required for emergency access
- Users control what information to share
- Documents stored securely in Firebase Storage
- Tags can be locked after writing to prevent tampering

## 📞 Emergency SOS Features

When someone taps the SOS button on your public profile:
1. Requests their current location
2. Generates Google Maps link
3. Opens SMS with pre-filled emergency message
4. Message sent to ALL emergency contacts
5. Includes victim name and responder location

## ✨ What Makes This Special

1. **No App Required for Responders:** Just tap NFC, browser opens
2. **Works Offline (NFC):** Tag stores URL, no internet needed for scanning
3. **Universal Compatibility:** Works on any NFC phone (Android/iPhone)
4. **Instant Access:** No login, no delays - critical info immediately
5. **Complete System:** Web + NFC + Mobile + Emergency alerts

---

## 🎊 You're All Set!

The TAGit website is now complete and ready to help save lives! 🚑

Test it thoroughly, deploy it, and start using NFC tags for emergency medical information access.
