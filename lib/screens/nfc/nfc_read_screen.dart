import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../services/nfc_service.dart';
import '../../models/nfc_data_model.dart';
import 'package:url_launcher/url_launcher.dart';

class NFCReadScreen extends StatefulWidget {
  const NFCReadScreen({super.key});

  @override
  State<NFCReadScreen> createState() => _NFCReadScreenState();
}

class _NFCReadScreenState extends State<NFCReadScreen> {
  bool _isReading = false;
  NFCDataModel? _readData;

  Future<void> _readTag() async {
    final nfcService = Provider.of<NFCService>(context, listen: false);

    setState(() {
      _isReading = true;
      _readData = null;
    });

    final data = await nfcService.readFromTag();

    setState(() {
      _isReading = false;
      _readData = data;
    });

    if (mounted) {
      if (data != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Tag read successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              nfcService.errorMessage ?? 'Failed to read NFC tag',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _makePhoneCall(String phoneNumber) async {
    final uri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  void _copyToClipboard(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$label copied to clipboard'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Read NFC Tag'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Instructions Card
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
                          'How to Read',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Text('1. Tap the "Scan NFC Tag" button below'),
                    SizedBox(height: 8),
                    Text('2. Hold your phone near the NFC tag'),
                    SizedBox(height: 8),
                    Text('3. Emergency information will appear'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Scan Button
            ElevatedButton.icon(
              onPressed: !_isReading ? _readTag : null,
              icon: _isReading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.nfc),
              label: Text(_isReading ? 'Scanning...' : 'Scan NFC Tag'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Read Data Display
            if (_readData != null) ...[
              const Text(
                'Emergency Profile',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),

              // Personal Information Card
              Card(
                elevation: 2,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Personal Information',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const Divider(),
                      _buildDataRow(
                        Icons.person,
                        'Name',
                        _readData!.userName,
                        onTap: () =>
                            _copyToClipboard(_readData!.userName, 'Name'),
                      ),
                      _buildDataRow(
                        Icons.phone,
                        'Phone',
                        _readData!.userPhone,
                        onTap: () => _makePhoneCall(_readData!.userPhone),
                        trailing: IconButton(
                          icon: const Icon(Icons.copy, size: 20),
                          onPressed: () =>
                              _copyToClipboard(_readData!.userPhone, 'Phone'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Medical Information Card
              if (_readData!.bloodGroup != null ||
                  _readData!.medicalConditions != null ||
                  _readData!.allergies != null)
                Card(
                  elevation: 2,
                  color: Colors.red[50],
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.medical_information, color: Colors.red),
                            SizedBox(width: 8),
                            Text(
                              'Medical Information',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.red,
                              ),
                            ),
                          ],
                        ),
                        const Divider(),
                        if (_readData!.bloodGroup != null)
                          _buildDataRow(
                            Icons.bloodtype,
                            'Blood Group',
                            _readData!.bloodGroup!,
                            onTap: () => _copyToClipboard(
                                _readData!.bloodGroup!, 'Blood Group'),
                          ),
                        if (_readData!.medicalConditions != null)
                          _buildDataRow(
                            Icons.medical_information,
                            'Medical Conditions',
                            _readData!.medicalConditions!,
                            onTap: () => _copyToClipboard(
                                _readData!.medicalConditions!,
                                'Medical Conditions'),
                          ),
                        if (_readData!.allergies != null)
                          _buildDataRow(
                            Icons.warning,
                            'Allergies',
                            _readData!.allergies!,
                            onTap: () => _copyToClipboard(
                                _readData!.allergies!, 'Allergies'),
                          ),
                      ],
                    ),
                  ),
                ),
              const SizedBox(height: 16),

              // Emergency Contacts Card
              if (_readData!.emergencyContacts.isNotEmpty)
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Emergency Contacts',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Divider(),
                        ..._readData!.emergencyContacts.map((contact) {
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            color: Colors.green[50],
                            child: ListTile(
                              leading: const CircleAvatar(
                                backgroundColor: Colors.green,
                                child: Icon(Icons.person, color: Colors.white),
                              ),
                              title: Text(contact['name'] ?? ''),
                              subtitle: Text(
                                '${contact['phone'] ?? ''}\n${contact['relationship'] ?? ''}',
                              ),
                              isThreeLine: true,
                              trailing: IconButton(
                                icon: const Icon(Icons.phone, color: Colors.green),
                                onPressed: () =>
                                    _makePhoneCall(contact['phone'] ?? ''),
                              ),
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ),
            ] else if (!_isReading)
              const Card(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Column(
                    children: [
                      Icon(Icons.nfc, size: 80, color: Colors.grey),
                      SizedBox(height: 16),
                      Text(
                        'No Tag Scanned',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'Tap the button above to scan an NFC tag',
                        style: TextStyle(color: Colors.grey),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildDataRow(
    IconData icon,
    String label,
    String value, {
    VoidCallback? onTap,
    Widget? trailing,
  }) {
    return InkWell(
      onTap: onTap,
      child: Padding(
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
            if (trailing != null) trailing,
          ],
        ),
      ),
    );
  }
}
