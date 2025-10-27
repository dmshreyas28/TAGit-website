# TAGit Website

Emergency Response NFC System - Web Application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account (same project as Flutter app)

### Installation

1. **Install dependencies:**
```bash
cd website
npm install
```

2. **Configure Firebase:**
   
   Update `src/lib/firebase/config.ts` with your Firebase configuration:
   
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Select your project: `tagit-emergency`
   - Click "Project Settings" → "General"
   - Scroll to "Your apps" → Select web app (or create one)
   - Copy the configuration and replace in `config.ts`

3. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
website/
├── src/
│   ├── app/                    # Next.js 14 App Router
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── profile/[userId]/  # Public profile pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   ├── lib/                   # Utilities and configurations
│   │   └── firebase/          # Firebase setup
│   ├── contexts/              # React contexts
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── package.json
```

## 🌟 Features

### For Users (Dashboard)
- **Profile Management**: Edit medical info, emergency contacts
- **Document Upload**: Manage medical certificates, prescriptions
- **NFC Tag Management**: Link/unlink NFC tags
- **Account Settings**: Update password, preferences

### For Emergency Responders (Public Profile)
- **Quick Access**: View victim's medical info via NFC scan
- **Emergency SOS**: Trigger emergency alert with location
- **Contact Emergency**: Direct call/SMS to emergency contacts
- **Medical Details**: Blood group, allergies, conditions

## 🔧 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 🔐 Firebase Configuration

### Required Services
1. **Authentication**: Email/Password enabled
2. **Firestore**: Database rules configured
3. **Storage**: File upload for medical documents

### Security Rules

**Firestore Rules** (`firestore.rules`):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

**Storage Rules** (`storage.rules`):
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /medical_documents/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Integration with Flutter App

This website shares the same Firebase backend with the Flutter app:
- Same user accounts (Firebase Auth)
- Same database structure (Firestore)
- Same file storage (Firebase Storage)
- Compatible data models

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

### Manual Build
```bash
npm run build
npm run start
```

## 📝 Environment Variables

Create `.env.local` file (optional, for additional config):
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tagit-emergency.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tagit-emergency
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase not initialized**: 
   - Check `src/lib/firebase/config.ts` has correct values
   
2. **Build errors**:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

3. **Hot reload not working**:
   ```bash
   npm run dev -- --turbo
   ```

## 📄 License

This project is part of the TAGit Emergency Response System.

## 👨‍💻 Developer

D M Shreyas (Registration: 23FE10CSE00526)
Supervisor: Ms. Neha Singh

---

**Note**: This is the website component of the TAGit project. For the mobile app, see the Flutter application in the root directory.
