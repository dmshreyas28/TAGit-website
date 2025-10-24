import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../services/location_service.dart';
import '../../services/firestore_service.dart';
import '../../utils/app_theme.dart';
import '../../utils/snackbar_helper.dart';
import 'package:url_launcher/url_launcher.dart';

class ImprovedEmergencyScreen extends StatefulWidget {
  const ImprovedEmergencyScreen({super.key});

  @override
  State<ImprovedEmergencyScreen> createState() => _ImprovedEmergencyScreenState();
}

class _ImprovedEmergencyScreenState extends State<ImprovedEmergencyScreen> 
    with SingleTickerProviderStateMixin {
  bool _isGettingLocation = false;
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _setupAnimations();
    _requestLocationPermission();
  }

  void _setupAnimations() {
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(
      begin: 1.0,
      end: 1.1,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));
  }

  Future<void> _requestLocationPermission() async {
    final locationService = Provider.of<LocationService>(context, listen: false);
    await locationService.requestLocationPermission();
  }

  Future<void> _sendToEmergencyContacts(
    BuildContext context,
    String message,
    dynamic user,
  ) async {
    if (user?.emergencyContacts == null || user.emergencyContacts.isEmpty) {
      SnackBarHelper.showWarning(context, 'No emergency contacts added');
      return;
    }

    // Show contact selection dialog
    final selectedContacts = await showDialog<List<int>>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Contacts'),
        content: StatefulBuilder(
          builder: (context, setState) {
            final selected = List<int>.generate(
              user.emergencyContacts.length,
              (index) => index,
            );
            
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text('Send emergency alert to:'),
                const SizedBox(height: 16),
                ...List.generate(
                  user.emergencyContacts.length,
                  (index) {
                    final contact = user.emergencyContacts[index];
                    return CheckboxListTile(
                      title: Text(contact.name),
                      subtitle: Text(contact.phone),
                      value: selected.contains(index),
                      onChanged: (checked) {
                        setState(() {
                          if (checked == true) {
                            selected.add(index);
                          } else {
                            selected.remove(index);
                          }
                        });
                      },
                    );
                  },
                ),
              ],
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, null),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final selected = List<int>.generate(
                user.emergencyContacts.length,
                (index) => index,
              );
              Navigator.pop(context, selected);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryRed,
              foregroundColor: Colors.white,
            ),
            child: const Text('Send Alerts'),
          ),
        ],
      ),
    );

    if (selectedContacts == null || selectedContacts.isEmpty) return;

    // Send SMS to each selected contact
    int successCount = 0;
    int failCount = 0;

    for (final index in selectedContacts) {
      final contact = user.emergencyContacts[index];
      final phoneNumber = contact.phone.replaceAll(RegExp(r'[^\d+]'), '');
      
      try {
        final smsUrl = Uri.parse('sms:$phoneNumber?body=${Uri.encodeComponent(message)}');
        
        if (await canLaunchUrl(smsUrl)) {
          await launchUrl(smsUrl);
          successCount++;
          // Small delay between messages to avoid overwhelming the SMS app
          await Future.delayed(const Duration(milliseconds: 500));
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    if (mounted) {
      if (successCount > 0) {
        SnackBarHelper.showSuccess(
          context,
          'Opening SMS app for $successCount contact(s)',
        );
      }
      if (failCount > 0) {
        SnackBarHelper.showWarning(
          context,
          'Could not send to $failCount contact(s)',
        );
      }
    }
  }

  Future<void> _triggerSOS() async {
    final locationService = Provider.of<LocationService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);

    final confirm = await ConfirmDialog.show(
      context,
      title: '⚠️ Trigger Emergency SOS?',
      message: 'This will:\n'
          '• Get your current location\n'
          '• Prepare emergency alert message\n'
          '• Allow you to contact emergency services\n\n'
          'Continue?',
      confirmText: 'Trigger SOS',
      isDangerous: true,
    );

    if (!confirm) return;

    setState(() {
      _isGettingLocation = true;
    });

    LoadingDialog.show(context, message: 'Getting your location...');

    await locationService.getCurrentLocation();

    if (!mounted) return;

    LoadingDialog.hide(context);

    setState(() {
      _isGettingLocation = false;
    });

    if (locationService.currentPosition != null) {
      _showEmergencyMessage(context, locationService, firestoreService);
    } else {
      SnackBarHelper.showError(
        context,
        locationService.errorMessage ?? 'Failed to get location. Please check permissions.',
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

    final message = '''🚨 EMERGENCY ALERT 🚨

${user?.name ?? 'Someone'} needs immediate assistance!

📍 Location: $locationString
🗺️ Maps: $mapsUrl

${user?.medicalConditions != null && user!.medicalConditions!.isNotEmpty ? '💊 Medical: ${user.medicalConditions}\n' : ''}${user?.allergies != null && user!.allergies!.isNotEmpty ? '⚠️ Allergies: ${user.allergies}\n' : ''}${user?.bloodGroup != null && user!.bloodGroup!.isNotEmpty ? '🩸 Blood: ${user.bloodGroup}\n' : ''}
Please respond immediately!
''';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.75,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (context, scrollController) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Handle bar
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              
              // Title
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: AppTheme.redGradient,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(20),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.warning_amber_rounded, color: Colors.white, size: 28),
                    SizedBox(width: 12),
                    Text(
                      'Emergency SOS Ready',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              
              // Content
              Expanded(
                child: SingleChildScrollView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Emergency Message Card
                      Card(
                        color: AppTheme.lightRed,
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  const Icon(Icons.message, color: AppTheme.primaryRed),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Emergency Message',
                                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                      color: AppTheme.primaryRed,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                message,
                                style: const TextStyle(
                                  fontSize: 14,
                                  color: AppTheme.textDark,
                                  height: 1.5,
                                ),
                              ),
                              const SizedBox(height: 12),
                              OutlinedButton.icon(
                                onPressed: () {
                                  Clipboard.setData(ClipboardData(text: message));
                                  SnackBarHelper.showSuccess(context, 'Message copied!');
                                },
                                icon: const Icon(Icons.copy),
                                label: const Text('Copy Message'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: AppTheme.primaryRed,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      
                      const SizedBox(height: 16),
                      
                      // Quick Actions
                      Text(
                        'Quick Actions',
                        style: Theme.of(context).textTheme.titleLarge,
                      ),
                      const SizedBox(height: 12),
                      
                      // Call Emergency
                      GradientButton(
                        text: '📞 Call Emergency (112)',
                        icon: Icons.phone,
                        onPressed: () async {
                          final url = Uri.parse('tel:112');
                          if (await canLaunchUrl(url)) {
                            await launchUrl(url);
                          } else {
                            if (context.mounted) {
                              SnackBarHelper.showError(
                                context,
                                'Could not make call',
                              );
                            }
                          }
                        },
                        gradient: AppTheme.redGradient,
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Send to Emergency Contacts
                      if (user?.emergencyContacts.isNotEmpty ?? false)
                        GradientButton(
                          text: '📱 Alert Emergency Contacts (${user!.emergencyContacts.length})',
                          icon: Icons.contacts,
                          onPressed: () => _sendToEmergencyContacts(context, message, user),
                          gradient: const LinearGradient(
                            colors: [Color(0xFFFF8C42), Color(0xFFFF6B35)],
                          ),
                        ),
                      
                      // Warning if no contacts
                      if (user?.emergencyContacts.isEmpty ?? true)
                        Card(
                          color: AppTheme.warningOrange.withOpacity(0.1),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Icon(Icons.info_outline, color: AppTheme.warningOrange),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'No Emergency Contacts',
                                        style: TextStyle(
                                          color: AppTheme.warningOrange,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  'Add emergency contacts in your profile to send automatic alerts.',
                                  style: TextStyle(fontSize: 13),
                                ),
                                const SizedBox(height: 8),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context); // Close modal
                                    Navigator.pushNamed(context, '/profile');
                                  },
                                  child: const Text('Add Contacts'),
                                ),
                              ],
                            ),
                          ),
                        ),
                      
                      if (user?.emergencyContacts.isNotEmpty ?? false)
                        const SizedBox(height: 12),
                      
                      // View on Maps
                      OutlinedButton.icon(
                        onPressed: () async {
                          if (mapsUrl.isEmpty) {
                            SnackBarHelper.showError(
                              context,
                              'Location not available',
                            );
                            return;
                          }

                          try {
                            final url = Uri.parse(mapsUrl);
                            await launchUrl(
                              url,
                              mode: LaunchMode.externalApplication,
                            );
                          } catch (e) {
                            if (context.mounted) {
                              SnackBarHelper.showError(
                                context,
                                'Could not open maps',
                              );
                            }
                          }
                        },
                        icon: const Icon(Icons.map),
                        label: const Text('View Location on Maps'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                      
                      const SizedBox(height: 12),
                      
                      // Share Location
                      OutlinedButton.icon(
                        onPressed: () {
                          Clipboard.setData(ClipboardData(text: mapsUrl));
                          SnackBarHelper.showSuccess(
                            context,
                            'Location link copied!',
                          );
                        },
                        icon: const Icon(Icons.share),
                        label: const Text('Copy Location Link'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Emergency SOS'),
      ),
      body: Consumer2<LocationService, FirestoreService>(
        builder: (context, locationService, firestoreService, _) {
          final user = firestoreService.currentUser;
          final hasLocation = locationService.currentPosition != null;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Warning Header
                Card(
                  color: AppTheme.warningOrange.withOpacity(0.1),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        const Icon(
                          Icons.info_outline,
                          color: AppTheme.warningOrange,
                          size: 32,
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Text(
                            'Use this only in real emergencies. False alerts may delay help to others.',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                const SizedBox(height: 24),
                
                // Main SOS Button
                ScaleTransition(
                  scale: _pulseAnimation,
                  child: Container(
                    height: 200,
                    decoration: BoxDecoration(
                      gradient: AppTheme.redGradient,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryRed.withOpacity(0.4),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Material(
                      color: Colors.transparent,
                      child: InkWell(
                        onTap: _isGettingLocation ? null : _triggerSOS,
                        borderRadius: BorderRadius.circular(20),
                        child: Center(
                          child: _isGettingLocation
                              ? const Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    CircularProgressIndicator(
                                      color: Colors.white,
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'Getting location...',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                )
                              : const Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.warning_amber_rounded,
                                      size: 80,
                                      color: Colors.white,
                                    ),
                                    SizedBox(height: 16),
                                    Text(
                                      'EMERGENCY SOS',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 28,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 2,
                                      ),
                                    ),
                                    SizedBox(height: 8),
                                    Text(
                                      'Tap to activate',
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 16,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ),
                  ),
                ),
                
                const SizedBox(height: 32),
                
                // Status Cards
                Text(
                  'Status',
                  style: Theme.of(context).textTheme.titleLarge,
                ),
                const SizedBox(height: 16),
                
                // Location Status
                InfoCard(
                  icon: hasLocation ? Icons.location_on : Icons.location_off,
                  title: hasLocation ? 'Location Ready' : 'Location Not Available',
                  subtitle: hasLocation
                      ? locationService.getLocationString()
                      : 'Tap to get current location',
                  color: hasLocation ? AppTheme.successGreen : AppTheme.errorRed,
                  onTap: hasLocation
                      ? null
                      : () async {
                          setState(() => _isGettingLocation = true);
                          await locationService.getCurrentLocation();
                          if (mounted) {
                            setState(() => _isGettingLocation = false);
                            if (locationService.currentPosition != null) {
                              SnackBarHelper.showSuccess(
                                context,
                                'Location obtained successfully',
                              );
                            }
                          }
                        },
                ),
                
                const SizedBox(height: 12),
                
                // Profile Status
                InfoCard(
                  icon: user != null ? Icons.check_circle : Icons.error,
                  title: user != null ? 'Profile Complete' : 'Profile Incomplete',
                  subtitle: user != null
                      ? 'Medical info will be shared'
                      : 'Complete your profile for better assistance',
                  color: user != null ? AppTheme.successGreen : AppTheme.warningOrange,
                ),
                
                const SizedBox(height: 32),
                
                // Quick Call Emergency
                OutlinedButton.icon(
                  onPressed: () async {
                    final url = Uri.parse('tel:112');
                    if (await canLaunchUrl(url)) {
                      await launchUrl(url);
                    }
                  },
                  icon: const Icon(Icons.phone, size: 24),
                  label: const Text(
                    'Quick Call 112',
                    style: TextStyle(fontSize: 18),
                  ),
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.all(20),
                    foregroundColor: AppTheme.primaryRed,
                    side: const BorderSide(color: AppTheme.primaryRed, width: 2),
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
