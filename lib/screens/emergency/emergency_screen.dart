import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../services/location_service.dart';
import '../../services/firestore_service.dart';
import 'package:url_launcher/url_launcher.dart';

class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({super.key});

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  bool _isGettingLocation = false;

  @override
  void initState() {
    super.initState();
    _requestLocationPermission();
  }

  Future<void> _requestLocationPermission() async {
    final locationService = Provider.of<LocationService>(context, listen: false);
    await locationService.requestLocationPermission();
  }

  Future<void> _triggerSOS() async {
    // Capture providers before async gap
    final locationService = Provider.of<LocationService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);

    // Show confirmation dialog
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Trigger SOS?'),
        content: const Text(
          'This will:\n'
          '• Get your current location\n'
          '• Prepare emergency message\n'
          '• Allow you to send to emergency contacts\n\n'
          'Continue?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Trigger SOS'),
          ),
        ],
      ),
    );

    if (confirm != true) return;

    setState(() {
      _isGettingLocation = true;
    });

    // Get current location
    await locationService.getCurrentLocation();

    if (!mounted) return;

    setState(() {
      _isGettingLocation = false;
    });

    final scaffoldMessenger = ScaffoldMessenger.of(context);

    if (locationService.currentPosition != null) {
      _showEmergencyMessage(context, locationService, firestoreService);
    } else {
      scaffoldMessenger.showSnackBar(
        SnackBar(
          content: Text(
            locationService.errorMessage ?? 'Failed to get location',
          ),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showEmergencyMessage(
    BuildContext context,
    LocationService locationService,
    FirestoreService firestoreService,
  ) {
    final user = firestoreService.currentUser;
    final locationString = locationService.getLocationString();
    final mapsUrl = locationService.getGoogleMapsUrl();

    final message = '''
🚨 EMERGENCY ALERT 🚨

${user?.name ?? 'Someone'} needs immediate assistance!

Location: $locationString
Maps Link: $mapsUrl

${user?.medicalConditions != null ? 'Medical Conditions: ${user!.medicalConditions}\n' : ''}${user?.allergies != null ? 'Allergies: ${user!.allergies}\n' : ''}${user?.bloodGroup != null ? 'Blood Group: ${user!.bloodGroup}\n' : ''}
Please respond immediately!
''';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) => Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Text(
                '🚨 SOS Alert Ready',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.red,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Card(
                        color: Colors.red[50],
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Emergency Message:',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(message),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: message));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Message copied to clipboard'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.copy),
                        label: const Text('Copy Message'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Send to Emergency Contacts:',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 8),
                      if (user?.emergencyContacts.isEmpty ?? true)
                        const Card(
                          child: Padding(
                            padding: EdgeInsets.all(16),
                            child: Text(
                              'No emergency contacts added.\nAdd contacts in your profile.',
                              style: TextStyle(color: Colors.grey),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        )
                      else
                        ...user!.emergencyContacts.map((contact) {
                          return Card(
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
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.phone,
                                        color: Colors.green),
                                    onPressed: () async {
                                      final uri = Uri(
                                        scheme: 'tel',
                                        path: contact.phone,
                                      );
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.message,
                                        color: Colors.blue),
                                    onPressed: () async {
                                      final uri = Uri(
                                        scheme: 'sms',
                                        path: contact.phone,
                                        queryParameters: {'body': message},
                                      );
                                      if (await canLaunchUrl(uri)) {
                                        await launchUrl(uri);
                                      }
                                    },
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              OutlinedButton(
                onPressed: () => Navigator.pop(context),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                child: const Text('Close'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _call112() async {
    final uri = Uri(scheme: 'tel', path: '112');
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency SOS'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
      ),
      body: Consumer2<LocationService, FirestoreService>(
        builder: (context, locationService, firestoreService, _) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Warning Card
                Card(
                  color: Colors.red[50],
                  child: const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Icon(Icons.warning, color: Colors.red, size: 40),
                        SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            'Use only in real emergencies.\n'
                            'For life-threatening situations, call 112 immediately.',
                            style: TextStyle(fontSize: 14),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Emergency Call 112
                ElevatedButton.icon(
                  onPressed: _call112,
                  icon: const Icon(Icons.phone, size: 32),
                  label: const Text(
                    'Call 112',
                    style: TextStyle(fontSize: 20),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[700],
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                const Divider(),
                const SizedBox(height: 24),

                // SOS Alert Button
                const Text(
                  'Alert Emergency Contacts',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton.icon(
                  onPressed: _isGettingLocation ? null : _triggerSOS,
                  icon: _isGettingLocation
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Icon(Icons.emergency, size: 28),
                  label: Text(
                    _isGettingLocation
                        ? 'Getting Location...'
                        : 'Trigger SOS Alert',
                    style: const TextStyle(fontSize: 18),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.orange,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Current Location Card
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Current Location',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Divider(),
                        if (locationService.currentPosition != null) ...[
                          Row(
                            children: [
                              const Icon(Icons.location_on, color: Colors.red),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(locationService.getLocationString()),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          OutlinedButton.icon(
                            onPressed: () async {
                              try {
                                final url = locationService.getGoogleMapsUrl();
                                if (url.isEmpty) {
                                  if (context.mounted) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Location not available'),
                                        backgroundColor: Colors.orange,
                                      ),
                                    );
                                  }
                                  return;
                                }
                                
                                final uri = Uri.parse(url);
                                final launched = await launchUrl(
                                  uri,
                                  mode: LaunchMode.externalApplication,
                                );
                                
                                if (!launched && context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Could not open Google Maps'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              } catch (e) {
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(
                                      content: Text('Error opening maps: $e'),
                                      backgroundColor: Colors.red,
                                    ),
                                  );
                                }
                              }
                            },
                            icon: const Icon(Icons.map),
                            label: const Text('View on Maps'),
                          ),
                        ] else
                          const Text(
                            'Location not available',
                            style: TextStyle(color: Colors.grey),
                          ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Emergency Contacts Summary
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Your Emergency Contacts',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Divider(),
                        if (firestoreService.currentUser?.emergencyContacts
                                .isEmpty ??
                            true)
                          const Text(
                            'No emergency contacts added.\nAdd contacts in your profile.',
                            style: TextStyle(color: Colors.grey),
                          )
                        else
                          Column(
                            children: firestoreService
                                .currentUser!.emergencyContacts
                                .map((contact) {
                              return ListTile(
                                contentPadding: EdgeInsets.zero,
                                leading: const CircleAvatar(
                                  backgroundColor: Colors.red,
                                  child:
                                      Icon(Icons.person, color: Colors.white),
                                ),
                                title: Text(contact.name),
                                subtitle: Text(contact.phone),
                                trailing: IconButton(
                                  icon: const Icon(Icons.phone,
                                      color: Colors.green),
                                  onPressed: () async {
                                    final uri = Uri(
                                      scheme: 'tel',
                                      path: contact.phone,
                                    );
                                    if (await canLaunchUrl(uri)) {
                                      await launchUrl(uri);
                                    }
                                  },
                                ),
                              );
                            }).toList(),
                          ),
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
}
