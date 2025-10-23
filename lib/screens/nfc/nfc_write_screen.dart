import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/nfc_service.dart';
import '../../services/firestore_service.dart';
import '../../models/nfc_data_model.dart';
import 'nfc_read_screen.dart';

class NFCWriteScreen extends StatefulWidget {
  const NFCWriteScreen({super.key});

  @override
  State<NFCWriteScreen> createState() => _NFCWriteScreenState();
}

class _NFCWriteScreenState extends State<NFCWriteScreen> {
  bool _isWriting = false;

  @override
  void initState() {
    super.initState();
    _checkNFCAvailability();
  }

  Future<void> _checkNFCAvailability() async {
    final nfcService = Provider.of<NFCService>(context, listen: false);
    await nfcService.checkNFCAvailability();

    if (!nfcService.isAvailable && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('NFC is not available on this device'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _writeToTag() async {
    final nfcService = Provider.of<NFCService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);
    final user = firestoreService.currentUser;

    if (user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('User profile not loaded'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Create NFC data from user profile
    final nfcData = NFCDataModel(
      userId: user.uid,
      userName: user.name,
      userPhone: user.phone,
      bloodGroup: user.bloodGroup,
      medicalConditions: user.medicalConditions,
      allergies: user.allergies,
      emergencyContacts: user.emergencyContacts
          .map((c) => {
                'name': c.name,
                'phone': c.phone,
                'relationship': c.relationship,
              })
          .toList(),
      createdAt: DateTime.now(),
    );

    setState(() {
      _isWriting = true;
    });

    final success = await nfcService.writeToTag(nfcData);

    setState(() {
      _isWriting = false;
    });

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Data written to NFC tag successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              nfcService.errorMessage ?? 'Failed to write to NFC tag',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NFC Tag Management'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
      ),
      body: Consumer2<NFCService, FirestoreService>(
        builder: (context, nfcService, firestoreService, _) {
          final user = firestoreService.currentUser;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // NFC Status Card
                Card(
                  color: nfcService.isAvailable ? Colors.green[50] : Colors.red[50],
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Icon(
                          nfcService.isAvailable
                              ? Icons.check_circle
                              : Icons.error,
                          color: nfcService.isAvailable
                              ? Colors.green
                              : Colors.red,
                          size: 40,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                nfcService.isAvailable
                                    ? 'NFC Available'
                                    : 'NFC Not Available',
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                nfcService.isAvailable
                                    ? 'Ready to read/write tags'
                                    : 'This device does not support NFC',
                                style: TextStyle(color: Colors.grey[700]),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Write to Tag Section
                const Text(
                  'Write Your Profile to NFC Tag',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  'This will write your emergency profile information to an NFC tag. '
                  'Emergency responders can tap the tag to instantly access your medical '
                  'information and emergency contacts.',
                  style: TextStyle(color: Colors.grey),
                ),
                const SizedBox(height: 24),

                // Profile Preview Card
                if (user != null)
                  Card(
                    elevation: 2,
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Profile Data to Write:',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const Divider(),
                          _buildInfoRow(Icons.person, 'Name', user.name),
                          _buildInfoRow(Icons.phone, 'Phone', user.phone),
                          if (user.bloodGroup != null)
                            _buildInfoRow(
                                Icons.bloodtype, 'Blood Group', user.bloodGroup!),
                          if (user.medicalConditions != null)
                            _buildInfoRow(Icons.medical_information,
                                'Medical Conditions', user.medicalConditions!),
                          if (user.allergies != null)
                            _buildInfoRow(
                                Icons.warning, 'Allergies', user.allergies!),
                          if (user.emergencyContacts.isNotEmpty)
                            _buildInfoRow(Icons.contact_phone, 'Emergency Contacts',
                                '${user.emergencyContacts.length} contact(s)'),
                        ],
                      ),
                    ),
                  ),
                const SizedBox(height: 24),

                // Write Button
                ElevatedButton.icon(
                  onPressed: (nfcService.isAvailable && !_isWriting && user != null)
                      ? _writeToTag
                      : null,
                  icon: _isWriting
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.nfc),
                  label: Text(_isWriting ? 'Writing...' : 'Write to NFC Tag'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Read Button
                OutlinedButton.icon(
                  onPressed: nfcService.isAvailable
                      ? () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => const NFCReadScreen(),
                            ),
                          );
                        }
                      : null,
                  icon: const Icon(Icons.nfc),
                  label: const Text('Read NFC Tag'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.red,
                    side: const BorderSide(color: Colors.red),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Instructions
                Card(
                  color: Colors.blue[50],
                  child: const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Icon(Icons.info, color: Colors.blue),
                            SizedBox(width: 8),
                            Text(
                              'Instructions',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Text('1. Make sure NFC is enabled on your device'),
                        SizedBox(height: 8),
                        Text('2. Tap "Write to NFC Tag" button'),
                        SizedBox(height: 8),
                        Text('3. Hold your phone near an NFC tag'),
                        SizedBox(height: 8),
                        Text('4. Wait for confirmation'),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: Colors.grey[600]),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  value,
                  style: const TextStyle(fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
