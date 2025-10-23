import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/firestore_service.dart';
import '../../services/auth_service.dart';
import '../../models/user_model.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _phoneController;
  late TextEditingController _ageController;
  late TextEditingController _bloodGroupController;
  late TextEditingController _medicalConditionsController;
  late TextEditingController _allergiesController;
  
  String? _selectedGender;

  bool _isEditing = false;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController();
    _phoneController = TextEditingController();
    _ageController = TextEditingController();
    _bloodGroupController = TextEditingController();
    _medicalConditionsController = TextEditingController();
    _allergiesController = TextEditingController();
    _loadUserData();
  }

  void _loadUserData() {
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);
    final user = firestoreService.currentUser;
    print('Loading user data: ${user?.name ?? "No user"}'); // Debug
    if (user != null) {
      _nameController.text = user.name;
      _phoneController.text = user.phone;
      _ageController.text = user.age?.toString() ?? '';
      _selectedGender = user.gender;
      _bloodGroupController.text = user.bloodGroup ?? '';
      _medicalConditionsController.text = user.medicalConditions ?? '';
      _allergiesController.text = user.allergies ?? '';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _ageController.dispose();
    _bloodGroupController.dispose();
    _medicalConditionsController.dispose();
    _allergiesController.dispose();
    super.dispose();
  }

  Future<void> _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;

    final authService = Provider.of<AuthService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);
    final currentUser = firestoreService.currentUser;

    // If no user profile exists, create one
    if (currentUser == null) {
      if (authService.user == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please log in first'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }

      // Create new user profile
      final newUser = UserModel(
        uid: authService.user!.uid,
        email: authService.user!.email ?? '',
        name: _nameController.text.trim(),
        phone: _phoneController.text.trim(),
        age: _ageController.text.trim().isEmpty
            ? null
            : int.tryParse(_ageController.text.trim()),
        gender: _selectedGender,
        bloodGroup: _bloodGroupController.text.trim().isEmpty
            ? null
            : _bloodGroupController.text.trim(),
        medicalConditions: _medicalConditionsController.text.trim().isEmpty
            ? null
            : _medicalConditionsController.text.trim(),
        allergies: _allergiesController.text.trim().isEmpty
            ? null
            : _allergiesController.text.trim(),
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );

      final success = await firestoreService.createUserProfile(newUser);
      
      if (mounted) {
        if (success) {
          // Reload the profile
          await firestoreService.getUserProfile(authService.user!.uid);
          setState(() {
            _isEditing = false;
          });
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile created successfully'),
              backgroundColor: Colors.green,
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                firestoreService.errorMessage ?? 'Failed to create profile',
              ),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
      return;
    }

    // Update existing user profile
    final updatedUser = currentUser.copyWith(
      name: _nameController.text.trim(),
      phone: _phoneController.text.trim(),
      age: _ageController.text.trim().isEmpty
          ? null
          : int.tryParse(_ageController.text.trim()),
      gender: _selectedGender,
      bloodGroup: _bloodGroupController.text.trim().isEmpty
          ? null
          : _bloodGroupController.text.trim(),
      medicalConditions: _medicalConditionsController.text.trim().isEmpty
          ? null
          : _medicalConditionsController.text.trim(),
      allergies: _allergiesController.text.trim().isEmpty
          ? null
          : _allergiesController.text.trim(),
    );

    final success = await firestoreService.updateUserProfile(updatedUser);

    if (mounted) {
      if (success) {
        setState(() {
          _isEditing = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profile updated successfully'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              firestoreService.errorMessage ?? 'Failed to update profile',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _showAddContactDialog() {
    final nameController = TextEditingController();
    final phoneController = TextEditingController();
    final relationshipController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Emergency Contact'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(
                  labelText: 'Name',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: phoneController,
                keyboardType: TextInputType.phone,
                decoration: const InputDecoration(
                  labelText: 'Phone',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: relationshipController,
                decoration: const InputDecoration(
                  labelText: 'Relationship',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              if (nameController.text.isNotEmpty &&
                  phoneController.text.isNotEmpty &&
                  relationshipController.text.isNotEmpty) {
                final authService = Provider.of<AuthService>(context, listen: false);
                final firestoreService =
                    Provider.of<FirestoreService>(context, listen: false);
                
                final navigator = Navigator.of(context);
                final scaffoldMessenger = ScaffoldMessenger.of(context);

                final contact = EmergencyContact(
                  name: nameController.text.trim(),
                  phone: phoneController.text.trim(),
                  relationship: relationshipController.text.trim(),
                );

                final success = await firestoreService.addEmergencyContact(
                  authService.user!.uid,
                  contact,
                );

                if (!mounted) return;
                
                // Reload user data to show the new contact
                if (success) {
                  await firestoreService.getUserProfile(authService.user!.uid);
                }
                
                navigator.pop();
                if (success) {
                  setState(() {});
                  scaffoldMessenger.showSnackBar(
                    const SnackBar(
                      content: Text('Emergency contact added'),
                      backgroundColor: Colors.green,
                    ),
                  );
                } else {
                  scaffoldMessenger.showSnackBar(
                    SnackBar(
                      content: Text(
                        firestoreService.errorMessage ?? 'Failed to add contact',
                      ),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
        actions: [
          if (!_isEditing)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                setState(() {
                  _isEditing = true;
                });
              },
            ),
          if (_isEditing)
            IconButton(
              icon: const Icon(Icons.save),
              onPressed: _saveProfile,
            ),
        ],
      ),
      body: Consumer<FirestoreService>(
        builder: (context, firestoreService, _) {
          final user = firestoreService.currentUser;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Profile header
                  const CircleAvatar(
                    radius: 50,
                    backgroundColor: Colors.red,
                    child: Icon(Icons.person, size: 50, color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    user?.name ?? 'Your Name',
                    style: Theme.of(context).textTheme.headlineSmall,
                    textAlign: TextAlign.center,
                  ),
                  Text(
                    user?.email ?? 'your.email@example.com',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 32),

                  // Personal Information
                  const Text(
                    'Personal Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _nameController,
                    readOnly: !_isEditing,
                    decoration: InputDecoration(
                      labelText: 'Full Name',
                      prefixIcon: const Icon(Icons.person),
                      border: const OutlineInputBorder(),
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                    validator: (value) =>
                        value?.isEmpty ?? true ? 'Name is required' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _phoneController,
                    readOnly: !_isEditing,
                    keyboardType: TextInputType.phone,
                    decoration: InputDecoration(
                      labelText: 'Phone Number',
                      prefixIcon: const Icon(Icons.phone),
                      border: const OutlineInputBorder(),
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                    validator: (value) =>
                        value?.isEmpty ?? true ? 'Phone is required' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _ageController,
                    readOnly: !_isEditing,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      labelText: 'Age',
                      prefixIcon: const Icon(Icons.cake),
                      border: const OutlineInputBorder(),
                      hintText: 'Enter your age',
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                    validator: (value) {
                      if (value != null && value.isNotEmpty) {
                        final age = int.tryParse(value);
                        if (age == null || age < 1 || age > 120) {
                          return 'Enter a valid age';
                        }
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: _selectedGender,
                    decoration: InputDecoration(
                      labelText: 'Gender',
                      prefixIcon: const Icon(Icons.person_outline),
                      border: const OutlineInputBorder(),
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                    items: const [
                      DropdownMenuItem(value: 'Male', child: Text('Male')),
                      DropdownMenuItem(value: 'Female', child: Text('Female')),
                      DropdownMenuItem(value: 'Other', child: Text('Other')),
                    ],
                    onChanged: _isEditing ? (value) {
                      setState(() {
                        _selectedGender = value;
                      });
                    } : null,
                  ),
                  const SizedBox(height: 32),

                  // Medical Information
                  const Text(
                    'Medical Information',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _bloodGroupController,
                    readOnly: !_isEditing,
                    decoration: InputDecoration(
                      labelText: 'Blood Group',
                      prefixIcon: const Icon(Icons.bloodtype),
                      border: const OutlineInputBorder(),
                      hintText: 'e.g., O+, A-, B+',
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _medicalConditionsController,
                    readOnly: !_isEditing,
                    maxLines: 3,
                    decoration: InputDecoration(
                      labelText: 'Medical Conditions',
                      prefixIcon: const Icon(Icons.medical_information),
                      border: const OutlineInputBorder(),
                      hintText: 'Any existing medical conditions',
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _allergiesController,
                    readOnly: !_isEditing,
                    maxLines: 2,
                    decoration: InputDecoration(
                      labelText: 'Allergies',
                      prefixIcon: const Icon(Icons.warning),
                      border: const OutlineInputBorder(),
                      hintText: 'Any known allergies',
                      filled: !_isEditing,
                      fillColor: !_isEditing ? Colors.grey.withValues(alpha: 0.1) : null,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Emergency Contacts
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Emergency Contacts',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.add_circle, color: Colors.red),
                        onPressed: _showAddContactDialog,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (user?.emergencyContacts.isEmpty ?? true)
                    const Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text(
                          'No emergency contacts added yet',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Colors.grey),
                        ),
                      ),
                    )
                  else
                    ...(user?.emergencyContacts ?? []).asMap().entries.map((entry) {
                      final index = entry.key;
                      final contact = entry.value;
                      return Card(
                        margin: const EdgeInsets.only(bottom: 8),
                        child: ListTile(
                          leading: const CircleAvatar(
                            backgroundColor: Colors.red,
                            child: Icon(Icons.person, color: Colors.white),
                          ),
                          title: Text(contact.name),
                          subtitle: Text(
                            '${contact.phone}\n${contact.relationship}',
                          ),
                          isThreeLine: true,
                          trailing: IconButton(
                            icon: const Icon(Icons.delete, color: Colors.red),
                            onPressed: () async {
                              final authService =
                                  Provider.of<AuthService>(context, listen: false);
                              final scaffoldMessenger = ScaffoldMessenger.of(context);
                              
                              final success =
                                  await firestoreService.removeEmergencyContact(
                                authService.user!.uid,
                                index,
                              );
                              if (!mounted) return;
                              if (success) {
                                setState(() {});
                                scaffoldMessenger.showSnackBar(
                                  const SnackBar(
                                    content: Text('Contact removed'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              }
                            },
                          ),
                        ),
                      );
                    }),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
