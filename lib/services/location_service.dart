import 'package:flutter/foundation.dart';
import 'package:geolocator/geolocator.dart';
import 'package:permission_handler/permission_handler.dart';

class LocationService extends ChangeNotifier {
  Position? _currentPosition;
  bool _isLoading = false;
  String? _errorMessage;

  Position? get currentPosition => _currentPosition;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  // Check and request location permissions
  Future<bool> requestLocationPermission() async {
    try {
      final status = await Permission.location.request();
      
      if (status.isGranted) {
        return true;
      } else if (status.isDenied) {
        _errorMessage = 'Location permission denied';
        notifyListeners();
        return false;
      } else if (status.isPermanentlyDenied) {
        _errorMessage = 'Location permission permanently denied. Please enable in settings';
        notifyListeners();
        return false;
      }
      
      return false;
    } catch (e) {
      _errorMessage = 'Failed to request location permission: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  // Get current location
  Future<Position?> getCurrentLocation() async {
    try {
      _isLoading = true;
      _errorMessage = null;
      notifyListeners();

      // Check if location service is enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        _isLoading = false;
        _errorMessage = 'Location services are disabled';
        notifyListeners();
        return null;
      }

      // Check permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          _isLoading = false;
          _errorMessage = 'Location permission denied';
          notifyListeners();
          return null;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _isLoading = false;
        _errorMessage = 'Location permission permanently denied';
        notifyListeners();
        return null;
      }

      // Get position
      _currentPosition = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      _isLoading = false;
      notifyListeners();
      return _currentPosition;
    } catch (e) {
      _isLoading = false;
      _errorMessage = 'Failed to get location: ${e.toString()}';
      notifyListeners();
      return null;
    }
  }

  // Get location as formatted string
  String getLocationString() {
    if (_currentPosition == null) return 'Location not available';
    return 'Lat: ${_currentPosition!.latitude.toStringAsFixed(6)}, '
        'Long: ${_currentPosition!.longitude.toStringAsFixed(6)}';
  }

  // Get Google Maps URL
  String getGoogleMapsUrl() {
    if (_currentPosition == null) return '';
    // Use https:// Google Maps URL for better compatibility across apps
    return 'https://www.google.com/maps?q=${_currentPosition!.latitude},${_currentPosition!.longitude}';
  }
  
  // Get geo URI (for native map apps)
  String getGeoUri() {
    if (_currentPosition == null) return '';
    return 'geo:${_currentPosition!.latitude},${_currentPosition!.longitude}?q=${_currentPosition!.latitude},${_currentPosition!.longitude}';
  }

  // Clear error
  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }
}
