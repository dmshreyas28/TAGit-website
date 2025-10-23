import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/firestore_service.dart';
import '../profile/profile_screen.dart';
import '../nfc/nfc_write_screen.dart';
import '../emergency/emergency_screen.dart';
import '../auth/login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);

    if (authService.user != null && firestoreService.currentUser == null) {
      await firestoreService.getUserProfile(authService.user!.uid);
    }
  }

  Future<void> _handleLogout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Logout'),
          ),
        ],
      ),
    );

    if (confirm == true && mounted) {
      final authService = Provider.of<AuthService>(context, listen: false);
      final firestoreService = Provider.of<FirestoreService>(context, listen: false);

      await authService.signOut();
      firestoreService.clearCurrentUser();

      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('TAGit'),
        backgroundColor: Colors.red,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: _handleLogout,
          ),
        ],
      ),
      body: Consumer2<AuthService, FirestoreService>(
        builder: (context, authService, firestoreService, _) {
          final user = firestoreService.currentUser;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Welcome Card
                Card(
                  elevation: 4,
                  color: Colors.red[50],
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      children: [
                        const CircleAvatar(
                          radius: 40,
                          backgroundColor: Colors.red,
                          child: Icon(
                            Icons.person,
                            size: 40,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Welcome, ${user?.name ?? "User"}!',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          user?.email ?? '',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[700],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Quick Actions
                const Text(
                  'Quick Actions',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),

                // Emergency SOS Button
                _buildActionCard(
                  context,
                  title: 'Emergency SOS',
                  subtitle: 'Trigger emergency alert with location',
                  icon: Icons.emergency,
                  color: Colors.red,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const EmergencyScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 12),

                // NFC Management Button
                _buildActionCard(
                  context,
                  title: 'NFC Tag Management',
                  subtitle: 'Write/Read emergency data to NFC tags',
                  icon: Icons.nfc,
                  color: Colors.blue,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const NFCWriteScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 12),

                // Profile Button
                _buildActionCard(
                  context,
                  title: 'My Profile',
                  subtitle: 'View and edit your profile information',
                  icon: Icons.person,
                  color: Colors.green,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ProfileScreen(),
                      ),
                    );
                  },
                ),
                const SizedBox(height: 32),

                // Profile Status
                const Text(
                  'Profile Status',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),

                // Profile Completeness Card
                Card(
                  elevation: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Profile Completeness',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${_calculateProfileCompleteness(user)}%',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 12),
                        LinearProgressIndicator(
                          value: _calculateProfileCompleteness(user) / 100,
                          backgroundColor: Colors.grey[300],
                          valueColor:
                              const AlwaysStoppedAnimation<Color>(Colors.blue),
                        ),
                        const SizedBox(height: 12),
                        _buildProfileCheckItem(
                          'Basic Info',
                          user?.name != null && user?.phone != null,
                        ),
                        _buildProfileCheckItem(
                          'Medical Info',
                          user?.bloodGroup != null ||
                              user?.medicalConditions != null ||
                              user?.allergies != null,
                        ),
                        _buildProfileCheckItem(
                          'Emergency Contacts',
                          user?.emergencyContacts.isNotEmpty ?? false,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Info Card
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
                              'About TAGit',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 12),
                        Text(
                          'TAGit is an emergency response system that uses '
                          'NFC technology to provide instant access to your '
                          'medical information and emergency contacts during '
                          'critical situations.',
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

  Widget _buildActionCard(
    BuildContext context, {
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 3,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 32, color: color),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios, color: Colors.grey[400]),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildProfileCheckItem(String label, bool isComplete) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(
            isComplete ? Icons.check_circle : Icons.circle_outlined,
            color: isComplete ? Colors.green : Colors.grey,
            size: 20,
          ),
          const SizedBox(width: 8),
          Text(label),
        ],
      ),
    );
  }

  int _calculateProfileCompleteness(user) {
    if (user == null) return 0;

    int score = 0;
    if (user.name.isNotEmpty && user.phone.isNotEmpty) {
      score += 40;
    }
    if (user.bloodGroup != null ||
        user.medicalConditions != null ||
        user.allergies != null) {
      score += 30;
    }
    if (user.emergencyContacts.isNotEmpty) {
      score += 30;
    }

    return score;
  }
}
