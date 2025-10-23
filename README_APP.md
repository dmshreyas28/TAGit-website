# TAGit - Emergency Response System

A Flutter-based emergency response application using NFC technology, Firebase, and location services to provide instant access to medical information and emergency contacts during critical situations.

## 🎯 Features Implemented

### ✅ Authentication
- **Login Screen**: Email/password authentication with Firebase Auth
- **Signup Screen**: User registration with profile creation
- **Auth State Management**: Automatic routing based on authentication status
- **Password Reset**: Email-based password recovery (ready to implement)

### ✅ Profile Management
- **View Profile**: Display user information and medical data
- **Edit Profile**: Update personal and medical information
- **Emergency Contacts**: Add/remove unlimited emergency contacts
- **Medical Information**: Blood group, conditions, allergies
- **Profile Completeness**: Visual progress indicator

### ✅ NFC Features
- **Write to Tag**: Write complete emergency profile to NFC tags
- **Read from Tag**: Scan and display emergency information from tags
- **NFC Availability Check**: Automatic detection of NFC support
- **Data Preview**: See what will be written before writing
- **Emergency Data Format**: JSON-based structured data storage

### ✅ Emergency/SOS System
- **Emergency Alert**: Trigger SOS with current location
- **Location Sharing**: GPS coordinates and Google Maps link
- **Contact Alerts**: Send SMS/call emergency contacts
- **Quick Dial 911**: Direct emergency services access
- **Medical Info Display**: Show critical medical data in alerts

### ✅ Home Dashboard
- **Profile Status**: View completeness percentage
- **Quick Actions**: Fast access to all features
- **User Welcome**: Personalized greeting
- **Navigation**: Easy access to Profile, NFC, and Emergency screens

## 📱 Technology Stack

- **Flutter**: 3.35.6
- **Dart**: 3.9.2
- **Firebase Auth**: User authentication
- **Cloud Firestore**: User profile and data storage
- **NFC Manager**: Read/write NFC tags
- **Geolocator**: GPS location services
- **Permission Handler**: Runtime permissions
- **Provider**: State management
- **URL Launcher**: Phone calls and SMS
- **Flutter ScreenUtil**: Responsive UI

## 🏗️ Project Structure

```
lib/
├── models/
│   ├── user_model.dart           # User profile data model
│   └── nfc_data_model.dart        # NFC tag data structure
├── services/
│   ├── auth_service.dart          # Firebase authentication
│   ├── firestore_service.dart     # Database operations
│   ├── nfc_service.dart           # NFC read/write
│   └── location_service.dart      # GPS and location
├── screens/
│   ├── auth/
│   │   ├── login_screen.dart      # Login UI
│   │   └── signup_screen.dart     # Registration UI
│   ├── home/
│   │   └── home_screen.dart       # Main dashboard
│   ├── profile/
│   │   └── profile_screen.dart    # Profile management
│   ├── nfc/
│   │   ├── nfc_write_screen.dart  # Write NFC tags
│   │   └── nfc_read_screen.dart   # Read NFC tags
│   └── emergency/
│       └── emergency_screen.dart  # SOS and alerts
└── main.dart                       # App entry point
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (3.0+)
- Android Studio / VS Code
- Android device with NFC (for NFC features)
- Firebase project configured

### Installation

1. **Clone/Open the project**
   ```bash
   cd tagit_app
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Firebase Setup** (Already configured)
   - `google-services.json` is in `android/app/`
   - Firebase Auth and Firestore are enabled
   - Package name: `com.tagit.emergency`

4. **Run the app**
   ```bash
   # Check available devices
   flutter devices
   
   # Run on connected device
   flutter run
   
   # Or run on specific device
   flutter run -d <device_id>
   ```

## 📝 Usage Guide

### First Time Setup

1. **Create Account**
   - Open app and tap "Sign Up"
   - Enter name, email, phone, and password
   - Tap "Create Account"

2. **Complete Profile**
   - Add medical information (blood group, conditions, allergies)
   - Add emergency contacts (name, phone, relationship)
   - Save changes

3. **Write NFC Tag** (Optional - requires NFC-enabled device)
   - Go to "NFC Tag Management"
   - Review profile data
   - Tap "Write to NFC Tag"
   - Hold phone near NFC tag

### Using Emergency Features

#### Trigger SOS Alert
1. Open "Emergency SOS" from home
2. Tap "Trigger SOS Alert"
3. App gets your location automatically
4. Review emergency message
5. Send via SMS or call contacts directly

#### Quick Call 911
- Tap "Call 911" button on Emergency screen
- Direct dial to emergency services

#### Read Someone's NFC Tag
1. Go to "NFC Tag Management"
2. Tap "Read NFC Tag"
3. Tap "Scan NFC Tag"
4. Hold phone near tag
5. View emergency profile and call contacts

## 🔑 Key Features Explained

### State Management
- **Provider pattern** for reactive state
- Services notify listeners on data changes
- UI automatically updates

### Firebase Integration
- **Authentication**: Secure user accounts
- **Firestore**: Real-time database for profiles
- **Security**: User data isolated by UID

### NFC Implementation
- **NDEF format**: Standard NFC data format
- **JSON payload**: Structured emergency data
- **Text records**: Compatible with all NFC readers

### Location Services
- **GPS accuracy**: High accuracy location
- **Permission handling**: Runtime permission requests
- **Google Maps integration**: Shareable location links

## 🐛 Known Limitations

1. **NFC Testing**: Requires physical Android device with NFC
2. **iOS NFC**: Limited NFC write capabilities (iOS restrictions)
3. **Build Time**: First Android build can take 15-30 minutes
4. **Emulator**: Cannot test NFC features on emulator

## 🔧 Troubleshooting

### Build Issues
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### NFC Not Working
- Enable NFC in device settings
- Check app has NFC permission
- Ensure device supports NFC
- Use actual device, not emulator

### Location Not Working
- Enable location services
- Grant location permission in app
- Check GPS is enabled

### Firebase Connection Issues
- Verify `google-services.json` is present
- Check internet connection
- Confirm Firebase project is active

## 📱 Permissions

The app requests these permissions:
- **NFC**: Read/write NFC tags
- **Location**: Get GPS coordinates for SOS
- **Phone**: Make emergency calls
- **SMS**: Send emergency alerts
- **Internet**: Firebase connection

## 🎨 Customization

### Colors
- Primary: Red (emergency theme)
- Accent colors in `main.dart` ThemeData

### Features to Add
- [ ] Photo upload for profile
- [ ] Multiple languages
- [ ] Offline mode with local database
- [ ] Push notifications for alerts
- [ ] Medical records storage
- [ ] Hospital/clinic locator

## 📄 License

This project is for educational and emergency response purposes.

## 🤝 Contributing

To add features:
1. Create new screen in `lib/screens/`
2. Create service if needed in `lib/services/`
3. Add route in `main.dart` or use Navigator.push
4. Update this README

## 📞 Support

For issues or questions:
1. Check Firebase console for backend issues
2. Run `flutter doctor` to verify setup
3. Check device logs with `flutter logs`

## 🎉 What's Next?

The app is fully functional! You can now:
1. **Build for release**: `flutter build apk --release`
2. **Test all features**: Create account, add profile, try NFC (on device)
3. **Deploy**: Share APK or publish to Play Store
4. **Extend**: Add features from TODO in PROJECT_CONTEXT.md

---

**Built with ❤️ for emergency response and safety**
