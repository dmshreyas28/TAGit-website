import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/foundation.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import 'package:uuid/uuid.dart';
import '../models/user_model.dart';

class StorageService {
  final FirebaseStorage _storage = FirebaseStorage.instance;
  final ImagePicker _imagePicker = ImagePicker();
  final Uuid _uuid = const Uuid();

  // Upload progress callback
  Function(double)? onUploadProgress;

  // Pick image from gallery or camera
  Future<File?> pickImage({ImageSource source = ImageSource.gallery}) async {
    try {
      final XFile? image = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );

      if (image != null) {
        return File(image.path);
      }
      return null;
    } catch (e) {
      debugPrint('❌ Error picking image: $e');
      return null;
    }
  }

  // Pick document (PDF, DOC, etc.)
  Future<File?> pickDocument() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
      );

      if (result != null && result.files.single.path != null) {
        return File(result.files.single.path!);
      }
      return null;
    } catch (e) {
      debugPrint('❌ Error picking document: $e');
      return null;
    }
  }

  // Upload medical document to Firebase Storage
  Future<MedicalDocument?> uploadMedicalDocument({
    required String userId,
    required File file,
    required String documentType,
    required String fileName,
  }) async {
    try {
      // Generate unique ID for document
      final docId = _uuid.v4();
      
      // Get file extension
      final extension = fileName.split('.').last;
      
      // Create storage path
      final path = 'medical_documents/$userId/$docId.$extension';
      
      debugPrint('📤 Uploading to: $path');
      
      // Create reference
      final ref = _storage.ref().child(path);
      
      // Get file size
      final fileSize = await file.length();
      debugPrint('📦 File size: ${(fileSize / 1024).toStringAsFixed(2)} KB');
      
      // Upload file with progress tracking
      final uploadTask = ref.putFile(
        file,
        SettableMetadata(
          contentType: _getContentType(extension),
          customMetadata: {
            'userId': userId,
            'documentType': documentType,
            'originalName': fileName,
          },
        ),
      );

      // Listen to upload progress
      uploadTask.snapshotEvents.listen((TaskSnapshot snapshot) {
        final progress = snapshot.bytesTransferred / snapshot.totalBytes;
        onUploadProgress?.call(progress);
        debugPrint('Upload progress: ${(progress * 100).toStringAsFixed(0)}%');
      });

      // Wait for upload to complete
      final snapshot = await uploadTask;
      debugPrint('✅ Upload completed. State: ${snapshot.state}');

      // Get download URL
      final downloadUrl = await ref.getDownloadURL();
      debugPrint('✅ Download URL obtained: $downloadUrl');

      // Create MedicalDocument object
      return MedicalDocument(
        id: docId,
        name: fileName,
        type: documentType,
        url: downloadUrl,
        fileSizeBytes: fileSize,
        uploadedAt: DateTime.now(),
      );
    } catch (e, stackTrace) {
      debugPrint('❌ Error uploading document: $e');
      debugPrint('Stack trace: $stackTrace');
      rethrow; // Rethrow to get better error message in UI
    }
  }

  // Delete medical document from Firebase Storage
  Future<bool> deleteMedicalDocument(String userId, String documentId) async {
    try {
      // Find and delete all files with this document ID
      final listResult = await _storage.ref('medical_documents/$userId').listAll();
      
      for (var item in listResult.items) {
        if (item.name.startsWith(documentId)) {
          await item.delete();
          debugPrint('✅ Document deleted: ${item.name}');
        }
      }
      
      return true;
    } catch (e) {
      debugPrint('❌ Error deleting document: $e');
      return false;
    }
  }

  // Get content type based on file extension
  String _getContentType(String extension) {
    switch (extension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  }

  // Get icon for document type
  static String getDocumentIcon(String type) {
    switch (type.toLowerCase()) {
      case 'prescription':
        return '💊';
      case 'report':
        return '📋';
      case 'insurance':
        return '🛡️';
      case 'vaccine':
        return '💉';
      default:
        return '📄';
    }
  }
}
