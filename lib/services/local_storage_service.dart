import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class LocalStorageService {
  static const String _userProfileKey = 'user_profile';
  static const String _lastSyncKey = 'last_sync_time';

  // Save user profile locally
  static Future<bool> saveUserProfile(UserModel user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = jsonEncode(user.toMap());
      await prefs.setString(_userProfileKey, userJson);
      await prefs.setString(_lastSyncKey, DateTime.now().toIso8601String());
      debugPrint('✅ User profile saved to local storage');
      return true;
    } catch (e) {
      debugPrint('❌ Failed to save user profile locally: $e');
      return false;
    }
  }

  // Get user profile from local storage
  static Future<UserModel?> getUserProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_userProfileKey);
      
      if (userJson != null) {
        final userMap = jsonDecode(userJson) as Map<String, dynamic>;
        final user = UserModel.fromMap(userMap);
        debugPrint('✅ User profile loaded from local storage');
        return user;
      }
      
      debugPrint('⚠️ No user profile found in local storage');
      return null;
    } catch (e) {
      debugPrint('❌ Failed to load user profile from local storage: $e');
      return null;
    }
  }

  // Get last sync time
  static Future<DateTime?> getLastSyncTime() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final syncTimeStr = prefs.getString(_lastSyncKey);
      
      if (syncTimeStr != null) {
        return DateTime.parse(syncTimeStr);
      }
      return null;
    } catch (e) {
      debugPrint('❌ Failed to get last sync time: $e');
      return null;
    }
  }

  // Clear all local data
  static Future<bool> clearAll() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_userProfileKey);
      await prefs.remove(_lastSyncKey);
      debugPrint('✅ Local storage cleared');
      return true;
    } catch (e) {
      debugPrint('❌ Failed to clear local storage: $e');
      return false;
    }
  }

  // Check if data exists locally
  static Future<bool> hasLocalData() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.containsKey(_userProfileKey);
    } catch (e) {
      return false;
    }
  }

  // Get data age in hours
  static Future<int?> getDataAgeInHours() async {
    final lastSync = await getLastSyncTime();
    if (lastSync == null) return null;
    
    final difference = DateTime.now().difference(lastSync);
    return difference.inHours;
  }
}
