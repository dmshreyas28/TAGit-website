'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { 
  ArrowLeft,
  Copy,
  ExternalLink,
  CheckCircle,
  QrCode,
  NfcIcon,
  Smartphone,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NFCSettingsPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !userProfile) {
    return null;
  }

  const profileUrl = `${window.location.origin}/user/${user.uid}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success('Profile URL copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleViewProfile = () => {
    window.open(profileUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">NFC Settings</h1>
              <p className="text-sm text-gray-600 mt-1">Manage your emergency profile tag</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile URL Card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Emergency Profile URL</h2>
              <p className="text-sm text-gray-600">Share this URL or encode it in your NFC tag</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 mb-4">
            <p className="text-sm font-mono text-gray-700 break-all">{profileUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopyUrl}
              className="btn-primary flex items-center gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy URL
                </>
              )}
            </button>
            <button
              onClick={handleViewProfile}
              className="btn-secondary flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              Preview Profile
            </button>
          </div>
        </div>

        {/* NFC Setup Instructions */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <NfcIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">How to Program Your NFC Tag</h2>
              <p className="text-sm text-gray-600">Follow these steps to set up your emergency tag</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Get NFC Tags</h3>
                <p className="text-gray-600 text-sm">
                  Purchase NFC tags (NTAG213/215/216) from Amazon, AliExpress, or local electronics stores.
                  Recommended: waterproof, adhesive tags.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Download NFC Writing App</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Install an NFC writing app on your Android phone:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• <strong>NFC Tools</strong> (Recommended - Free)</li>
                  <li>• <strong>NFC TagWriter by NXP</strong></li>
                  <li>• <strong>Trigger</strong></li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Write Your Profile URL</h3>
                <p className="text-gray-600 text-sm mb-2">Using the NFC app:</p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>1. Open the app and select "Write"</li>
                  <li>2. Choose "URL/URI" or "Web Link"</li>
                  <li>3. Copy and paste your profile URL (above)</li>
                  <li>4. Hold your phone near the NFC tag</li>
                  <li>5. Wait for confirmation</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Test Your Tag</h3>
                <p className="text-gray-600 text-sm">
                  After writing, test the tag by scanning it with any NFC-enabled phone. 
                  It should automatically open your emergency profile in the browser.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Place Your Tag</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Attach the NFC tag to items you carry daily:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Wallet or purse</li>
                  <li>• Phone case (back)</li>
                  <li>• ID card holder</li>
                  <li>• Medical alert bracelet</li>
                  <li>• Keychain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Alternative */}
        <div className="card bg-blue-50 border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <QrCode className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Alternative: QR Code</h3>
              <p className="text-sm text-blue-800 mb-3">
                Don't have NFC tags? You can also create a QR code with your profile URL and:
              </p>
              <ul className="text-sm text-blue-800 space-y-1 ml-4">
                <li>• Print it on a card and keep in your wallet</li>
                <li>• Add it to your medical ID bracelet</li>
                <li>• Set it as your phone's lock screen wallpaper</li>
              </ul>
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Generate QR Code
              </a>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Security & Privacy</h2>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Your profile is only accessible via the direct URL - it's not searchable or indexed</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>You can update your information anytime from the dashboard</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>Only share critical medical information - don't include sensitive financial data</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>The NFC tag can be locked to prevent tampering after writing</p>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="card bg-purple-50 border-2 border-purple-200">
          <div className="flex items-start gap-3">
            <Smartphone className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-purple-900 mb-2">Recommended NFC Tags</h3>
              <p className="text-sm text-purple-800 mb-3">
                Look for these specifications when buying NFC tags:
              </p>
              <ul className="text-sm text-purple-800 space-y-2 ml-4">
                <li>
                  <strong>Chip Type:</strong> NTAG213, NTAG215, or NTAG216
                </li>
                <li>
                  <strong>Memory:</strong> At least 144 bytes (NTAG213)
                </li>
                <li>
                  <strong>Form Factor:</strong> Adhesive stickers, cards, or keychains
                </li>
                <li>
                  <strong>Features:</strong> Waterproof, lockable, Android & iOS compatible
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
