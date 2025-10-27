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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <Siren className="w-6 h-6 animate-pulse" />
          <p className="text-lg font-bold">EMERGENCY MEDICAL PROFILE</p>
          <Siren className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* SOS Button - Most Prominent */}
        <div className="card bg-gradient-to-r from-red-600 to-red-700 text-white border-4 border-red-800 shadow-2xl">
          <button
            onClick={handleEmergencySMS}
            className="w-full py-8 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center animate-pulse">
              <Siren className="w-12 h-12 text-red-600" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">EMERGENCY SOS</h2>
              <p className="text-xl">Tap to Alert All Emergency Contacts</p>
              <p className="text-sm mt-2 opacity-90">This will send your location and emergency alert</p>
            </div>
          </button>
        </div>

        {/* Patient Information */}
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.phone}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.bloodGroup && (
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <p className="text-sm text-gray-600 mb-1">Blood Group</p>
                <p className="text-2xl font-bold text-red-600">{profile.bloodGroup}</p>
              </div>
            )}
            {profile.age && (
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Age</p>
                <p className="text-2xl font-bold text-blue-600">{profile.age}</p>
              </div>
            )}
          </div>

          {profile.address && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{profile.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Critical Medical Information */}
        <div className="card bg-yellow-50 border-2 border-yellow-300">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Critical Medical Information</h2>
          </div>

          <div className="space-y-4">
            {profile.medicalConditions && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Medical Conditions</h3>
                <div className="bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-gray-900">{profile.medicalConditions}</p>
                </div>
              </div>
            )}

            {profile.allergies && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Allergies - IMPORTANT
                </h3>
                <div className="bg-red-50 p-3 rounded-lg border-2 border-red-300">
                  <p className="text-gray-900 font-medium">{profile.allergies}</p>
                </div>
              </div>
            )}

            {profile.medications && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Current Medications</h3>
                <div className="bg-white p-3 rounded-lg border border-yellow-200">
                  <p className="text-gray-900">{profile.medications}</p>
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
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-bold text-gray-900">Emergency Contacts</h2>
            </div>

            <div className="grid gap-3">
              {profile.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                  </div>
                  <button
                    onClick={() => handleEmergencyCall(contact.phone)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {contact.phone}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medical Documents */}
        {profile.medicalDocuments && profile.medicalDocuments.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Medical Documents</h2>
            </div>

            <div className="grid gap-3">
              {profile.medicalDocuments.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{doc.name}</p>
                      <p className="text-sm text-gray-600">{doc.type}</p>
                    </div>
                  </div>
                  <span className="text-blue-600 font-medium">View →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="card bg-blue-50 border-2 border-blue-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-2">For Emergency Responders</p>
              <ul className="space-y-1 text-blue-800">
                <li>• This profile is accessible via NFC tag scanning</li>
                <li>• All information is provided by the individual</li>
                <li>• Use the SOS button to alert all emergency contacts</li>
                <li>• Contact information is for emergency use only</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download App CTA */}
        <div className="card bg-gradient-primary text-white text-center">
          <h3 className="text-xl font-bold mb-2">Get TAGit App</h3>
          <p className="mb-4">Create your own emergency profile and NFC tag</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
