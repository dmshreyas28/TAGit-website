# Firebase Security Rules Setup

## Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/tagit-emergency/firestore/rules)
2. Copy the contents of `firestore.rules` file
3. Paste it in the Rules editor
4. Click "Publish"

## Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/project/tagit-emergency/storage/rules)
2. Copy the contents of `storage.rules` file
3. Paste it in the Rules editor
4. Click "Publish"

## What These Rules Do

### Firestore Rules:
- Users can read and write their own profile data
- All authenticated users can read any profile (for emergency access)
- Public read access enabled for emergency responders (NFC scanning)

### Storage Rules:
- Users can upload documents to their own folder
- Users can only delete their own documents
- Public read access for emergency scenarios (responders can view documents)

## Security Notes

- All writes require authentication
- Public read is enabled for emergency scenarios
- Each user's documents are in a separate folder: `medical_documents/{userId}/`
