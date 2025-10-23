import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/foundation.dart';
import '../models/user_model.dart';

class FirestoreService extends ChangeNotifier {
  final FirebaseFirestore _db = FirebaseFirestore.instance;
  UserModel? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

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
      _isLoading = false;
      _errorMessage = 'Failed to load profile: ${e.toString()}';
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
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Failed to update profile: ${e.toString()}';
      notifyListeners();
      return false;
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
