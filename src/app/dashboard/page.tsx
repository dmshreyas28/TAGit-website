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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">Welcome back, {userProfile.name} 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 border border-transparent hover:border-red-200"
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
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-900 p-8 mb-8 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative flex items-start gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h2>
              <div className="space-y-1.5">
                <p className="text-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full"></span>
                  {userProfile.email}
                </p>
                <p className="text-red-100 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-200 rounded-full"></span>
                  {userProfile.phone}
                </p>
                {userProfile.bloodGroup && (
                  <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                    <Heart className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">
                      Blood Group: {userProfile.bloodGroup}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button 
            onClick={() => setShowBasicInfoEditor(true)}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Edit Profile</h3>
              <p className="text-sm text-gray-600 mt-2">Update your information</p>
            </div>
          </button>

          <button 
            onClick={() => setShowMedicalInfoEditor(true)}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Medical Info</h3>
              <p className="text-sm text-gray-600 mt-2">Manage health details</p>
            </div>
          </button>

          <button 
            onClick={() => setShowDocumentUpload(true)}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Documents</h3>
              <p className="text-sm text-gray-600 mt-2">Upload medical files</p>
            </div>
          </button>

          <button 
            onClick={() => setShowEmergencyContactsEditor(true)}
            className="group relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Emergency Contacts</h3>
              <p className="text-sm text-gray-600 mt-2">Manage contacts</p>
            </div>
          </button>
        </div>

        {/* NFC Settings Card */}
        <Link href="/nfc" className="relative overflow-hidden group block rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[2px] hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
          <div className="bg-white rounded-2xl p-6 h-full">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <NfcIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  NFC Tag Settings
                  <span className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-full">New</span>
                </h3>
                <p className="text-sm text-gray-600">
                  Get your emergency profile URL and learn how to program your NFC tag
                </p>
              </div>
              <div className="text-2xl text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text group-hover:translate-x-2 transition-transform">→</div>
            </div>
          </div>
        </Link>

        {/* Info Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Medical Information</h3>
          </div>
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
              <span className="text-sm font-semibold text-red-900 uppercase tracking-wide">Medical Conditions</span>
              <p className="text-gray-700 mt-2">{userProfile.medicalConditions || 'Not specified'}</p>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-100">
              <span className="text-sm font-semibold text-orange-900 uppercase tracking-wide">Allergies</span>
              <p className="text-gray-700 mt-2">{userProfile.allergies || 'Not specified'}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Medications</span>
              <p className="text-gray-700 mt-2">{userProfile.medications || 'Not specified'}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Emergency Contacts</h3>
          </div>
          {userProfile.emergencyContacts && userProfile.emergencyContacts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.emergencyContacts.map((contact, index) => (
                <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{contact.name}</p>
                        <p className="text-sm text-purple-700 font-medium">{contact.relationship}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-mono text-sm mt-3 bg-white/60 px-3 py-2 rounded-lg inline-block">
                      {contact.phone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No emergency contacts added yet</p>
              <button
                onClick={() => setShowEmergencyContactsEditor(true)}
                className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Add Emergency Contact
              </button>
            </div>
          )}
        </div>

        {/* Medical Documents */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mt-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Medical Documents</h3>
            </div>
            <button
              onClick={() => setShowDocumentUpload(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Upload className="w-4 h-4" />
              Upload
            </button>
          </div>

          {userProfile.medicalDocuments && userProfile.medicalDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userProfile.medicalDocuments.map((doc) => (
                <div key={doc.id} className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-all duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/20 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{doc.name}</p>
                      <p className="text-sm text-green-700 font-medium mt-1">{doc.type}</p>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-white/80 text-green-700 rounded-lg hover:bg-white transition-colors text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-green-50/30 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-2">No documents uploaded yet</p>
              <p className="text-gray-500 mb-6">Upload your medical records, prescriptions, or reports</p>
              <button
                onClick={() => setShowDocumentUpload(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold"
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
