import 'package:cloud_firestore/cloud_firestore.dart';

class UserModel {
  final String uid;
  final String email;
  final String name;
  final String phone;
  final int? age;
  final String? gender;
  final String? bloodGroup;
  final String? medicalConditions;
  final String? allergies;
  final List<EmergencyContact> emergencyContacts;
  final List<MedicalDocument> medicalDocuments;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserModel({
    required this.uid,
    required this.email,
    required this.name,
    required this.phone,
    this.age,
    this.gender,
    this.bloodGroup,
    this.medicalConditions,
    this.allergies,
    this.emergencyContacts = const [],
    this.medicalDocuments = const [],
    required this.createdAt,
    required this.updatedAt,
  });

  // Convert UserModel to Map for Firestore
  Map<String, dynamic> toMap() {
    return {
      'uid': uid,
      'email': email,
      'name': name,
      'phone': phone,
      'age': age,
      'gender': gender,
      'bloodGroup': bloodGroup,
      'medicalConditions': medicalConditions,
      'allergies': allergies,
      'emergencyContacts': emergencyContacts.map((c) => c.toMap()).toList(),
      'medicalDocuments': medicalDocuments.map((d) => d.toMap()).toList(),
      'createdAt': Timestamp.fromDate(createdAt),
      'updatedAt': Timestamp.fromDate(updatedAt),
    };
  }

  // Create UserModel from Firestore document
  factory UserModel.fromMap(Map<String, dynamic> map) {
    return UserModel(
      uid: map['uid'] ?? '',
      email: map['email'] ?? '',
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      age: map['age'],
      gender: map['gender'],
      bloodGroup: map['bloodGroup'],
      medicalConditions: map['medicalConditions'],
      allergies: map['allergies'],
      emergencyContacts: (map['emergencyContacts'] as List<dynamic>?)
              ?.map((c) => EmergencyContact.fromMap(c as Map<String, dynamic>))
              .toList() ??
          [],
      medicalDocuments: (map['medicalDocuments'] as List<dynamic>?)
              ?.map((d) => MedicalDocument.fromMap(d as Map<String, dynamic>))
              .toList() ??
          [],
      createdAt: (map['createdAt'] as Timestamp).toDate(),
      updatedAt: (map['updatedAt'] as Timestamp).toDate(),
    );
  }

  // Create a copy with updated fields
  UserModel copyWith({
    String? uid,
    String? email,
    String? name,
    String? phone,
    int? age,
    String? gender,
    String? bloodGroup,
    String? medicalConditions,
    String? allergies,
    List<EmergencyContact>? emergencyContacts,
    List<MedicalDocument>? medicalDocuments,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserModel(
      uid: uid ?? this.uid,
      email: email ?? this.email,
      name: name ?? this.name,
      phone: phone ?? this.phone,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      bloodGroup: bloodGroup ?? this.bloodGroup,
      medicalConditions: medicalConditions ?? this.medicalConditions,
      allergies: allergies ?? this.allergies,
      emergencyContacts: emergencyContacts ?? this.emergencyContacts,
      medicalDocuments: medicalDocuments ?? this.medicalDocuments,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class EmergencyContact {
  final String name;
  final String phone;
  final String relationship;

  EmergencyContact({
    required this.name,
    required this.phone,
    required this.relationship,
  });

  Map<String, dynamic> toMap() {
    return {
      'name': name,
      'phone': phone,
      'relationship': relationship,
    };
  }

  factory EmergencyContact.fromMap(Map<String, dynamic> map) {
    return EmergencyContact(
      name: map['name'] ?? '',
      phone: map['phone'] ?? '',
      relationship: map['relationship'] ?? '',
    );
  }
}

class MedicalDocument {
  final String id;
  final String name;
  final String type; // 'prescription', 'report', 'insurance', 'other'
  final String url;
  final String? thumbnailUrl;
  final int fileSizeBytes;
  final DateTime uploadedAt;

  MedicalDocument({
    required this.id,
    required this.name,
    required this.type,
    required this.url,
    this.thumbnailUrl,
    required this.fileSizeBytes,
    required this.uploadedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'type': type,
      'url': url,
      'thumbnailUrl': thumbnailUrl,
      'fileSizeBytes': fileSizeBytes,
      'uploadedAt': Timestamp.fromDate(uploadedAt),
    };
  }

  factory MedicalDocument.fromMap(Map<String, dynamic> map) {
    return MedicalDocument(
      id: map['id'] ?? '',
      name: map['name'] ?? '',
      type: map['type'] ?? 'other',
      url: map['url'] ?? '',
      thumbnailUrl: map['thumbnailUrl'],
      fileSizeBytes: map['fileSizeBytes'] ?? 0,
      uploadedAt: (map['uploadedAt'] as Timestamp).toDate(),
    );
  }

  String get formattedSize {
    if (fileSizeBytes < 1024) {
      return '$fileSizeBytes B';
    } else if (fileSizeBytes < 1024 * 1024) {
      return '${(fileSizeBytes / 1024).toStringAsFixed(1)} KB';
    } else {
      return '${(fileSizeBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
  }

  String get fileExtension {
    return name.split('.').last.toUpperCase();
  }
}
