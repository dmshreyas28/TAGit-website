import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';
import 'local_storage_service.dart';

class FirestoreService extends ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isOffline = false;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isOffline => _isOffline;

  FirestoreService() {
    _enableOfflinePersistence();
  }

  // Enable offline persistence
  Future<void> _enableOfflinePersistence() async {
    try {
      // Enable offline persistence for Firestore
      _db.settings = const Settings(
        persistenceEnabled: true,
        cacheSizeBytes: Settings.CACHE_SIZE_UNLIMITED,
      );
      debugPrint('✅ Offline persistence enabled');
    } catch (e) {
      debugPrint('⚠️ Offline persistence error: $e');
    }
  }

  // Check network connectivity status
  void updateOfflineStatus(bool offline) {
    if (_isOffline != offline) {
      _isOffline = offline;
      notifyListeners();
    }
  }

  // Create user profile in Firestore
  Future<bool> createUserProfile(UserModel user) async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      await _db.collection('users').doc(user.uid).set(user.toMap());

      _currentUser = user;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Failed to create profile: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  // Get user profile from Firestore
  Future<UserModel?> getUserProfile(String uid) async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      final doc = await _db.collection('users').doc(uid).get();

      if (doc.exists) {
        _currentUser = UserModel.fromMap(doc.data()!);
        
        // Check if data is from cache (offline)
        if (doc.metadata.isFromCache) {
          _isOffline = true;
          debugPrint('📦 Data loaded from cache (offline mode)');
        } else {
          _isOffline = false;
          debugPrint('🌐 Data loaded from server (online mode)');
          // Save to local storage when online
          await LocalStorageService.saveUserProfile(_currentUser!);
        }
        
        _isLoading = false;
        notifyListeners();
        return _currentUser;
      } else {
        _isLoading = false;
        _errorMessage = 'User profile not found';
        notifyListeners();
        return null;
      }
    } catch (e) {
      // Try loading from local storage if network fails
      debugPrint('⚠️ Network error, trying local storage: $e');
      final localUser = await LocalStorageService.getUserProfile();
      
      if (localUser != null) {
        _currentUser = localUser;
        _isOffline = true;
        _isLoading = false;
        notifyListeners();
        debugPrint('✅ Loaded profile from local storage');
        return _currentUser;
      }
      
      _isLoading = false;
      _errorMessage = 'Failed to load profile: ${e.toString()}';
      _isOffline = true;
      notifyListeners();
      return null;
    }
  }

  // Update user profile
  Future<bool> updateUserProfile(UserModel user) async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      final updatedUser = user.copyWith(updatedAt: DateTime.now());
      await _db.collection('users').doc(user.uid).update(updatedUser.toMap());

      _currentUser = updatedUser;
      
      // Save to local storage
      await LocalStorageService.saveUserProfile(updatedUser);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      // If offline, save locally and queue for sync
      debugPrint('⚠️ Update failed, saving locally: $e');
      _currentUser = user.copyWith(updatedAt: DateTime.now());
      await LocalStorageService.saveUserProfile(_currentUser!);
      
      _isLoading = false;
      _errorMessage = 'Saved locally. Will sync when online.';
      _isOffline = true;
      notifyListeners();
      return true; // Return true since we saved locally
    }
  }

  // Add emergency contact
  Future<bool> addEmergencyContact(String uid, EmergencyContact contact) async {
    try {
      if (_currentUser == null) {
        await getUserProfile(uid);
      }

      if (_currentUser == null) return false;

      final contacts = List<EmergencyContact>.from(_currentUser!.emergencyContacts)
        ..add(contact);

      final updatedUser = _currentUser!.copyWith(
        emergencyContacts: contacts,
        updatedAt: DateTime.now(),
      );

      return await updateUserProfile(updatedUser);
    } catch (e) {
      _errorMessage = 'Failed to add emergency contact: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  // Remove emergency contact
  Future<bool> removeEmergencyContact(String uid, int index) async {
    try {
      if (_currentUser == null) {
        await getUserProfile(uid);
      }

      if (_currentUser == null) return false;

      final contacts = List<EmergencyContact>.from(_currentUser!.emergencyContacts)
        ..removeAt(index);

      final updatedUser = _currentUser!.copyWith(
        emergencyContacts: contacts,
        updatedAt: DateTime.now(),
      );

      return await updateUserProfile(updatedUser);
    } catch (e) {
      _errorMessage = 'Failed to remove emergency contact: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  // Clear current user
  void clearCurrentUser() {
    _currentUser = null;
    notifyListeners();
  }

  // Clear error message
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
