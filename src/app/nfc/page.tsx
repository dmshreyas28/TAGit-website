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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2.5 hover:bg-purple-50 rounded-xl transition-all text-gray-700 hover:text-purple-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                NFC Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1">Manage your emergency profile tag</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Profile URL Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ExternalLink className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Emergency Profile URL</h2>
              <p className="text-sm text-gray-600">Share this URL or encode it in your NFC tag</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border-2 border-blue-200 mb-6">
            <p className="text-sm font-mono text-gray-800 break-all font-semibold">{profileUrl}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopyUrl}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] font-semibold"
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
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border-2 border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold"
            >
              <ExternalLink className="w-5 h-5" />
              Preview Profile
            </button>
          </div>
        </div>

        {/* NFC Setup Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <NfcIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">How to Program Your NFC Tag</h2>
              <p className="text-sm text-gray-600">Follow these simple steps to set up your emergency tag</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Get NFC Tags</h3>
                <p className="text-gray-600">
                  Purchase NFC tags (NTAG213/215/216) from Amazon, AliExpress, or local electronics stores.
                  Recommended: waterproof, adhesive tags.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Download NFC Writing App</h3>
                <p className="text-gray-600 mb-3">
                  Install an NFC writing app on your Android phone:
                </p>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <strong>NFC Tools</strong> (Recommended - Free)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <strong>NFC TagWriter by NXP</strong>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <strong>Trigger</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Write Your Profile URL</h3>
                <p className="text-gray-600 mb-3">Using the NFC app:</p>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li className="flex gap-3">
                      <span className="font-semibold text-blue-700 min-w-[1.5rem]">1.</span>
                      <span>Open the app and select "Write"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-blue-700 min-w-[1.5rem]">2.</span>
                      <span>Choose "URL/URI" or "Web Link"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-blue-700 min-w-[1.5rem]">3.</span>
                      <span>Copy and paste your profile URL (above)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-blue-700 min-w-[1.5rem]">4.</span>
                      <span>Hold your phone near the NFC tag</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-blue-700 min-w-[1.5rem]">5.</span>
                      <span>Wait for confirmation</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg">
                4
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Test Your Tag</h3>
                <p className="text-gray-600">
                  After writing, test the tag by scanning it with any NFC-enabled phone. 
                  It should automatically open your emergency profile in the browser.
                </p>
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-lg">
                5
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">Place Your Tag</h3>
                <p className="text-gray-600 mb-3">
                  Attach the NFC tag to items you carry daily:
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • Wallet or purse
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • Phone case (back)
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • ID card holder
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • Medical bracelet
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • Keychain
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-sm text-gray-700">
                    • Helmet/bag
                  </div>
                </div>
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
