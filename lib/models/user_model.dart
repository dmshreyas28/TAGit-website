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
