import 'dart:convert';

class NFCDataModel {
  final String userId;
  final String userName;
  final String userPhone;
  final String? bloodGroup;
  final String? medicalConditions;
  final String? allergies;
  final List<Map<String, String>> emergencyContacts;
  final DateTime createdAt;

  NFCDataModel({
    required this.userId,
    required this.userName,
    required this.userPhone,
    this.bloodGroup,
    this.medicalConditions,
    this.allergies,
    required this.emergencyContacts,
    required this.createdAt,
  });

  // Convert to JSON string for NFC writing
  String toJson() {
    return jsonEncode({
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'bloodGroup': bloodGroup,
      'medicalConditions': medicalConditions,
      'allergies': allergies,
      'emergencyContacts': emergencyContacts,
      'createdAt': createdAt.toIso8601String(),
    });
  }

  // Create from JSON string (NFC reading)
  factory NFCDataModel.fromJson(String jsonString) {
    final map = jsonDecode(jsonString) as Map<String, dynamic>;
    return NFCDataModel(
      userId: map['userId'] ?? '',
      userName: map['userName'] ?? '',
      userPhone: map['userPhone'] ?? '',
      bloodGroup: map['bloodGroup'],
      medicalConditions: map['medicalConditions'],
      allergies: map['allergies'],
      emergencyContacts: (map['emergencyContacts'] as List<dynamic>?)
              ?.map((e) => Map<String, String>.from(e as Map))
              .toList() ??
          [],
      createdAt: DateTime.parse(map['createdAt'] ?? DateTime.now().toIso8601String()),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'userId': userId,
      'userName': userName,
      'userPhone': userPhone,
      'bloodGroup': bloodGroup,
      'medicalConditions': medicalConditions,
      'allergies': allergies,
      'emergencyContacts': emergencyContacts,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
