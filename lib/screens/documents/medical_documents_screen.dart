import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../services/auth_service.dart';
import '../../services/firestore_service.dart';
import '../../services/storage_service.dart';
import '../../models/user_model.dart';
import '../../utils/app_theme.dart';
import '../../utils/snackbar_helper.dart';
import '../../utils/offline_indicator.dart';

class MedicalDocumentsScreen extends StatefulWidget {
  const MedicalDocumentsScreen({super.key});

  @override
  State<MedicalDocumentsScreen> createState() => _MedicalDocumentsScreenState();
}

class _MedicalDocumentsScreenState extends State<MedicalDocumentsScreen> {
  final StorageService _storageService = StorageService();
  bool _isUploading = false;
  double _uploadProgress = 0.0;

  @override
  void initState() {
    super.initState();
    _storageService.onUploadProgress = (progress) {
      setState(() {
        _uploadProgress = progress;
      });
    };
  }

  Future<void> _showUploadOptions() async {
    final docType = await showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choose Document Type'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildDocTypeOption('Prescription', 'prescription'),
            _buildDocTypeOption('Medical Report', 'report'),
            _buildDocTypeOption('Insurance Card', 'insurance'),
            _buildDocTypeOption('Vaccine Certificate', 'vaccine'),
            _buildDocTypeOption('Other', 'other'),
          ],
        ),
      ),
    );

    if (docType != null && mounted) {
      _showFileSourceOptions(docType);
    }
  }

  Widget _buildDocTypeOption(String title, String type) {
    return ListTile(
      leading: Text(
        StorageService.getDocumentIcon(type),
        style: const TextStyle(fontSize: 24),
      ),
      title: Text(title),
      onTap: () => Navigator.pop(context, type),
    );
  }

  Future<void> _showFileSourceOptions(String docType) async {
    final source = await showModalBottomSheet<String>(
      context: context,
      builder: (context) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: const Text('Take Photo'),
              onTap: () => Navigator.pop(context, 'camera'),
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: const Text('Choose from Gallery'),
              onTap: () => Navigator.pop(context, 'gallery'),
            ),
            ListTile(
              leading: const Icon(Icons.file_present),
              title: const Text('Pick Document (PDF)'),
              onTap: () => Navigator.pop(context, 'document'),
            ),
          ],
        ),
      ),
    );

    if (source != null && mounted) {
      await _uploadDocument(docType, source);
    }
  }

  Future<void> _uploadDocument(String docType, String source) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final firestoreService = Provider.of<FirestoreService>(context, listen: false);

    if (authService.user == null) {
      SnackBarHelper.showError(context, 'Please log in first');
      return;
    }

    File? file;
    String fileName = '';

    if (source == 'camera') {
      file = await _storageService.pickImage(source: ImageSource.camera);
      fileName = 'photo_${DateTime.now().millisecondsSinceEpoch}.jpg';
    } else if (source == 'gallery') {
      file = await _storageService.pickImage(source: ImageSource.gallery);
      fileName = 'image_${DateTime.now().millisecondsSinceEpoch}.jpg';
    } else if (source == 'document') {
      file = await _storageService.pickDocument();
      if (file != null) {
        fileName = file.path.split('/').last;
      }
    }

    if (file == null) {
      SnackBarHelper.showWarning(context, 'No file selected');
      return;
    }

    setState(() {
      _isUploading = true;
      _uploadProgress = 0.0;
    });

    // Show loading dialog
    if (mounted) {
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(
                value: _uploadProgress,
                backgroundColor: Colors.grey[300],
                valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryRed),
              ),
              const SizedBox(height: 16),
              Text('Uploading... ${(_uploadProgress * 100).toStringAsFixed(0)}%'),
            ],
          ),
        ),
      );
    }

    // Upload document
    try {
      final document = await _storageService.uploadMedicalDocument(
        userId: authService.user!.uid,
        file: file,
        documentType: docType,
        fileName: fileName,
      );

      setState(() {
        _isUploading = false;
      });

      // Close loading dialog
      if (mounted) {
        Navigator.pop(context);
      }

      if (document != null) {
        // Add document to user profile
        final currentUser = firestoreService.currentUser;
        if (currentUser != null) {
          final updatedDocs = List<MedicalDocument>.from(currentUser.medicalDocuments)
            ..add(document);
          
          final success = await firestoreService.updateUserProfile(
            currentUser.copyWith(medicalDocuments: updatedDocs),
          );

          if (success && mounted) {
            SnackBarHelper.showSuccess(context, 'Document uploaded successfully!');
          } else if (mounted) {
            SnackBarHelper.showError(context, 'Failed to save document');
          }
        }
      }
    } catch (e) {
      setState(() {
        _isUploading = false;
      });

      // Close loading dialog
      if (mounted) {
        Navigator.pop(context);
      }

      // Show detailed error
      if (mounted) {
        String errorMessage = 'Failed to upload document';
        
        if (e.toString().contains('object-not-found') || e.toString().contains('404')) {
          errorMessage = 'Storage not configured. Please set up Firebase Storage rules.';
        } else if (e.toString().contains('permission-denied')) {
          errorMessage = 'Permission denied. Please check storage rules.';
        } else if (e.toString().contains('unauthorized')) {
          errorMessage = 'Please log in again to upload documents.';
        }
        
        SnackBarHelper.showError(context, errorMessage);
      }
    }
  }

  Future<void> _deleteDocument(MedicalDocument doc) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Document'),
        content: Text('Are you sure you want to delete "${doc.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: AppTheme.primaryRed),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      final authService = Provider.of<AuthService>(context, listen: false);
      final firestoreService = Provider.of<FirestoreService>(context, listen: false);

      // Show loading
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (context) => const Center(child: CircularProgressIndicator()),
      );

      // Delete from storage
      final deleted = await _storageService.deleteMedicalDocument(
        authService.user!.uid,
        doc.id,
      );

      if (deleted) {
        // Remove from user profile
        final currentUser = firestoreService.currentUser;
        if (currentUser != null) {
          final updatedDocs = currentUser.medicalDocuments
              .where((d) => d.id != doc.id)
              .toList();
          
          await firestoreService.updateUserProfile(
            currentUser.copyWith(medicalDocuments: updatedDocs),
          );
        }
      }

      // Close loading dialog
      if (mounted) {
        Navigator.pop(context);
        
        if (deleted) {
          SnackBarHelper.showSuccess(context, 'Document deleted');
        } else {
          SnackBarHelper.showError(context, 'Failed to delete document');
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundLight,
      appBar: AppBar(
        title: const Text('Medical Documents'),
      ),
      body: Column(
        children: [
          const OfflineIndicator(),
          Expanded(
            child: Consumer<FirestoreService>(
              builder: (context, firestoreService, _) {
                final documents = firestoreService.currentUser?.medicalDocuments ?? [];

                if (documents.isEmpty) {
                  return _buildEmptyState();
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    final authService = Provider.of<AuthService>(context, listen: false);
                    if (authService.user != null) {
                      await firestoreService.getUserProfile(authService.user!.uid);
                    }
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: documents.length,
                    itemBuilder: (context, index) {
                      final doc = documents[index];
                      return _buildDocumentCard(doc);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isUploading ? null : _showUploadOptions,
        backgroundColor: AppTheme.primaryRed,
        icon: const Icon(Icons.upload_file),
        label: const Text('Upload'),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(32),
              decoration: BoxDecoration(
                color: AppTheme.accentBlue.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.folder_open_rounded,
                size: 80,
                color: AppTheme.accentBlue.withOpacity(0.5),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'No Documents Yet',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.bold,
                color: AppTheme.textDark,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'Upload medical documents like prescriptions,\nreports, and insurance cards',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppTheme.textGrey,
                height: 1.5,
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: _showUploadOptions,
              icon: const Icon(Icons.upload_file),
              label: const Text('Upload Document'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryRed,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDocumentCard(MedicalDocument doc) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.accentBlue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            StorageService.getDocumentIcon(doc.type),
            style: const TextStyle(fontSize: 28),
          ),
        ),
        title: Text(
          doc.name,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(
              '${doc.fileExtension} • ${doc.formattedSize}',
              style: TextStyle(
                color: AppTheme.textGrey,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              'Uploaded ${_formatDate(doc.uploadedAt)}',
              style: TextStyle(
                color: AppTheme.textGrey,
                fontSize: 12,
              ),
            ),
          ],
        ),
        trailing: PopupMenuButton(
          icon: const Icon(Icons.more_vert),
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'view',
              child: Row(
                children: [
                  Icon(Icons.visibility, size: 20),
                  SizedBox(width: 12),
                  Text('View'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, size: 20, color: Colors.red),
                  SizedBox(width: 12),
                  Text('Delete', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
          onSelected: (value) async {
            if (value == 'view') {
              // Open document URL in browser (Firebase Storage will handle authentication)
              try {
                final uri = Uri.parse(doc.url);
                // Use platformDefault to let the system choose the best app
                final launched = await launchUrl(
                  uri,
                  mode: LaunchMode.platformDefault,
                );
                
                if (!launched && mounted) {
                  // If it fails, try opening in external browser
                  await launchUrl(
                    uri,
                    mode: LaunchMode.externalApplication,
                  );
                }
              } catch (e) {
                if (mounted) {
                  // Show helpful error message
                  SnackBarHelper.showError(
                    context,
                    'Unable to open document. Please ensure you have a compatible app installed.',
                  );
                }
              }
            } else if (value == 'delete') {
              _deleteDocument(doc);
            }
          },
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays < 30) {
      return '${(difference.inDays / 7).floor()} weeks ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }
}
