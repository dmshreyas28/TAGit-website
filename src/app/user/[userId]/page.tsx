'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { UserProfile } from '@/types';
import { 
  Loader2, 
  Heart, 
  Phone, 
  AlertCircle, 
  FileText, 
  MapPin,
  Shield,
  User,
  Siren
} from 'lucide-react';
import Link from 'next/link';

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          setError('Profile not found');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleEmergencyCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmergencySMS = async () => {
    if (!profile) return;

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const message = `🚨 EMERGENCY ALERT 🚨\n\nI found ${profile.name} in need of help!\n\nLocation: ${mapsUrl}\n\nPlease respond immediately!`;
          
          // Send SMS to all emergency contacts
          profile.emergencyContacts.forEach((contact) => {
            const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
            window.open(smsUrl, '_blank');
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Send SMS without location
          const message = `🚨 EMERGENCY ALERT 🚨\n\nI found ${profile.name} in need of help!\n\nPlease respond immediately!`;
          profile.emergencyContacts.forEach((contact) => {
            const smsUrl = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
            window.open(smsUrl, '_blank');
          });
        }
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading emergency profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
        <div className="card max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This emergency profile does not exist.'}</p>
          <Link href="/" className="btn-primary inline-block">
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-50">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-6 sticky top-0 z-10 shadow-2xl backdrop-blur-md border-b-4 border-red-900">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight">EMERGENCY MEDICAL PROFILE</p>
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* SOS Button - Most Prominent */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white border-4 border-red-900/50 shadow-2xl rounded-2xl overflow-hidden">
          <button
            onClick={handleEmergencySMS}
            className="w-full py-8 flex flex-col md:flex-row items-center justify-center gap-4 hover:scale-[1.02] transition-all hover:shadow-red-500/50"
          >
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Siren className="w-10 h-10 animate-pulse" />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">EMERGENCY SOS</h2>
              <p className="text-xl md:text-2xl font-semibold">Tap to Alert All Emergency Contacts</p>
              <p className="text-base mt-2 text-red-100">This will send your location and emergency alert</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Siren className="w-10 h-10 animate-pulse" />
            </div>
          </button>
        </div>

        {/* Patient Information */}
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 border-2 border-gray-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{profile.name}</h1>
              <p className="text-gray-600 text-lg font-medium">{profile.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.bloodGroup && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-300 shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-sm font-semibold text-red-700 mb-2">Blood Group</p>
                <p className="text-3xl font-bold text-red-600">{profile.bloodGroup}</p>
              </div>
            )}
            {profile.age && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
                <p className="text-sm font-semibold text-blue-700 mb-2">Age</p>
                <p className="text-3xl font-bold text-blue-600">{profile.age}</p>
              </div>
            )}
          </div>

          {profile.address && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Address</p>
                  <p className="text-gray-900 font-medium">{profile.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Critical Medical Information */}
        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 border-4 border-yellow-400">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Critical Medical Information</h2>
          </div>

          <div className="space-y-6">
            {profile.medicalConditions && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                  Medical Conditions
                </h3>
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200 shadow-md">
                  <p className="text-gray-900 text-lg">{profile.medicalConditions}</p>
                </div>
              </div>
            )}

            {profile.allergies && (
              <div>
                <h3 className="text-base font-bold text-red-700 mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  ALLERGIES - CRITICAL ALERT
                </h3>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl border-4 border-red-400 shadow-lg">
                  <p className="text-gray-900 font-bold text-lg">{profile.allergies}</p>
                </div>
              </div>
            )}

            {profile.medications && (
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  Current Medications
                </h3>
                <div className="bg-white p-5 rounded-xl border-2 border-blue-200 shadow-md">
                  <p className="text-gray-900 text-lg">{profile.medications}</p>
                </div>
              </div>
            )}

            {!profile.medicalConditions && !profile.allergies && !profile.medications && (
              <p className="text-gray-600 text-center py-4">No medical information provided</p>
            )}
          </div>
        </div>

        {/* Emergency Contacts */}
        {profile.emergencyContacts && profile.emergencyContacts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 border-2 border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Emergency Contacts</h2>
            </div>

            <div className="grid gap-4">
              {profile.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl hover:shadow-lg transition-all"
                >
                  <div>
                    <p className="font-bold text-gray-900 text-xl">{contact.name}</p>
                    <p className="text-base text-gray-600 font-medium">{contact.relationship}</p>
                  </div>
                  <button
                    onClick={() => handleEmergencyCall(contact.phone)}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    <Phone className="w-6 h-6" />
                    <span className="font-semibold">{contact.phone}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Documents */}
        {profile.medicalDocuments && profile.medicalDocuments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow p-8 border-2 border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Medical Documents</h2>
            </div>

            <div className="grid gap-4">
              {profile.medicalDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] transform group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{doc.name}</p>
                      <p className="text-base text-gray-600 font-medium">{doc.type}</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-bold text-lg group-hover:translate-x-2 transition-transform">View →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl shadow-xl p-8 border-2 border-blue-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-900 text-xl mb-3">For Emergency Responders</p>
              <ul className="space-y-2 text-blue-800 text-base">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>This profile is accessible via NFC tag scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>All information is provided by the individual</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Use the SOS button to alert all emergency contacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">•</span>
                  <span>Contact information is for emergency use only</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download App CTA */}
        <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white text-center rounded-2xl shadow-2xl p-8 border-2 border-red-900">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Get TAGit App</h3>
          <p className="mb-6 text-red-100 text-lg">Create your own emergency profile and NFC tag</p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-white text-red-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
