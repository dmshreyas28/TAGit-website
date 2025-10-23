import 'package:flutter/foundation.dart';
import 'package:nfc_manager/nfc_manager.dart';
import '../models/nfc_data_model.dart';

class NFCService extends ChangeNotifier {
  bool _isAvailable = false;
  bool _isReading = false;
  bool _isWriting = false;
  String? _errorMessage;
  NFCDataModel? _lastReadData;

  bool get isAvailable => _isAvailable;
  bool get isReading => _isReading;
  bool get isWriting => _isWriting;
  String? get errorMessage => _errorMessage;
  NFCDataModel? get lastReadData => _lastReadData;

  Future<void> checkNFCAvailability() async {
    try {
      _isAvailable = await NfcManager.instance.isAvailable();
      notifyListeners();
    } catch (e) {
      _isAvailable = false;
      _errorMessage = 'Failed to check NFC availability';
      notifyListeners();
    }
  }

  Future<bool> writeToTag(NFCDataModel data) async {
    if (!_isAvailable) {
      _errorMessage = 'NFC not available on device';
      notifyListeners();
      return false;
    }

    _isWriting = true;
    _errorMessage = 'NFC Write: Hold tag near phone...';
    notifyListeners();

    try {
      bool success = false;
      
      await NfcManager.instance.startSession(
        pollingOptions: {NfcPollingOption.iso14443, NfcPollingOption.iso15693},
        onDiscovered: (NfcTag tag) async {
          debugPrint('NFC Tag discovered');
          _errorMessage = 'Tag detected! Writing data...';
          notifyListeners();
          
          await Future.delayed(Duration(seconds: 1));
          
          success = true;
          _errorMessage = 'Write successful! (Simulated)';
          _isWriting = false;
          notifyListeners();
          await NfcManager.instance.stopSession();
        },
      );
      
      if (!success) {
        _isWriting = false;
        _errorMessage = 'No tag detected';
        notifyListeners();
      }
      
      return success;
    } catch (e) {
      _isWriting = false;
      _errorMessage = 'Write failed: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  Future<NFCDataModel?> readFromTag() async {
    if (!_isAvailable) {
      _errorMessage = 'NFC not available on device';
      notifyListeners();
      return null;
    }

    _isReading = true;
    _errorMessage = 'NFC Read: Hold tag near phone...';
    _lastReadData = null;
    notifyListeners();

    try {
      NFCDataModel? data;
      
      await NfcManager.instance.startSession(
        pollingOptions: {NfcPollingOption.iso14443, NfcPollingOption.iso15693},
        onDiscovered: (NfcTag tag) async {
          debugPrint('NFC Tag discovered for reading');
          _errorMessage = 'Tag detected! Reading data...';
          notifyListeners();
          
          await Future.delayed(Duration(seconds: 1));
          
          data = NFCDataModel(
            userId: 'demo-user',
            userName: 'Demo User',
            userPhone: '+91 1234567890',
            bloodGroup: 'O+',
            medicalConditions: 'None',
            allergies: 'None',
            emergencyContacts: [
              {'name': 'Emergency Contact', 'phone': '+91 9876543210'}
            ],
            createdAt: DateTime.now(),
          );
          
          _lastReadData = data;
          _errorMessage = 'Read successful! (Demo data)';
          _isReading = false;
          notifyListeners();
          await NfcManager.instance.stopSession();
        },
      );
      
      if (data == null) {
        _isReading = false;
        _errorMessage = 'No tag detected';
        notifyListeners();
      }
      
      return data;
    } catch (e) {
      _isReading = false;
      _errorMessage = 'Read failed: ${e.toString()}';
      notifyListeners();
      return null;
    }
  }

  Future<void> stopSession() async {
    try {
      await NfcManager.instance.stopSession();
      _isReading = false;
      _isWriting = false;
      notifyListeners();
    } catch (e) {
      debugPrint('Stop session error: $e');
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void clearLastReadData() {
    _lastReadData = null;
    notifyListeners();
  }
}
