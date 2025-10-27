'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';
import toast from 'react-hot-toast';
import BasicInfoEditor from '@/components/BasicInfoEditor';
import MedicalInfoEditor from '@/components/MedicalInfoEditor';
import EmergencyContactsEditor from '@/components/EmergencyContactsEditor';
import DocumentUpload from '@/components/DocumentUpload';
import Link from 'next/link';
import { 
  LogOut, 
  User, 
  Heart, 
  FileText, 
  Settings, 
  Shield,
  Loader2,
  Upload,
  Eye,
  Trash2,
  Download,
  NfcIcon
} from 'lucide-react';

export default function DashboardPage() {
  const { user, userProfile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [showBasicInfoEditor, setShowBasicInfoEditor] = useState(false);
  const [showMedicalInfoEditor, setShowMedicalInfoEditor] = useState(false);
  const [showEmergencyContactsEditor, setShowEmergencyContactsEditor] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {userProfile.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary Card */}
        <div className="card mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
              <p className="text-gray-600">{userProfile.email}</p>
              <p className="text-gray-600">{userProfile.phone}</p>
              {userProfile.bloodGroup && (
                <p className="text-sm text-gray-500 mt-2">Blood Group: {userProfile.bloodGroup}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button 
            onClick={() => setShowBasicInfoEditor(true)}
            className="card hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-600 mt-1">Update your information</p>
            </div>
          </button>

          <button 
            onClick={() => setShowMedicalInfoEditor(true)}
            className="card hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Medical Info</h3>
              <p className="text-sm text-gray-600 mt-1">Manage health details</p>
            </div>
          </button>

          <button 
            onClick={() => setShowDocumentUpload(true)}
            className="card hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Documents</h3>
              <p className="text-sm text-gray-600 mt-1">Upload medical files</p>
            </div>
          </button>

          <button 
            onClick={() => setShowEmergencyContactsEditor(true)}
            className="card hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Emergency Contacts</h3>
              <p className="text-sm text-gray-600 mt-1">Manage contacts</p>
            </div>
          </button>
        </div>

        {/* NFC Settings Card */}
        <Link href="/nfc" className="card hover:shadow-lg transition-all group block mt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <NfcIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">NFC Tag Settings</h3>
              <p className="text-sm text-gray-600">
                Get your emergency profile URL and learn how to program your NFC tag
              </p>
            </div>
            <div className="text-primary">→</div>
          </div>
        </Link>

        {/* Info Section */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Medical Conditions:</span>
              <p className="text-gray-600">{userProfile.medicalConditions || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Allergies:</span>
              <p className="text-gray-600">{userProfile.allergies || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Medications:</span>
              <p className="text-gray-600">{userProfile.medications || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="card mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
          {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {userProfile.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  <p className="text-gray-700">{contact.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No emergency contacts added yet</p>
          )}
        </div>

        {/* Medical Documents */}
        <div className="card mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Medical Documents</h3>
            <button
              onClick={() => setShowDocumentUpload(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Document
            </button>
          </div>

          {userProfile.medicalDocuments && userProfile.medicalDocuments.length > 0 ? (
            <div className="space-y-3">
              {userProfile.medicalDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View document"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No documents uploaded yet</p>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="btn-secondary"
              >
                Upload Your First Document
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showBasicInfoEditor && (
        <BasicInfoEditor onClose={() => setShowBasicInfoEditor(false)} />
      )}

      {showMedicalInfoEditor && (
        <MedicalInfoEditor onClose={() => setShowMedicalInfoEditor(false)} />
      )}

      {showEmergencyContactsEditor && (
        <EmergencyContactsEditor onClose={() => setShowEmergencyContactsEditor(false)} />
      )}

      {showDocumentUpload && (
        <DocumentUpload 
          onClose={() => setShowDocumentUpload(false)}
          onUploadComplete={refreshProfile}
        />
      )}
    </div>
  );
}
