import Link from 'next/link';
import { Heart, Shield, Zap, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50/20 to-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">TAGit</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-red-600 transition px-4 py-2 rounded-lg hover:bg-red-50">
              Login
            </Link>
            <Link href="/signup" className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-semibold">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-block mb-6 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
            🚨 Emergency Response System
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight">
            Save Lives with{' '}
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-900 bg-clip-text text-transparent">
              NFC Technology
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Instant access to critical medical information in emergencies. 
            <span className="font-semibold text-red-600"> One tap. One life saved.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Create Free Account →
            </Link>
            <Link href="#how-it-works" className="px-8 py-4 text-lg font-bold bg-white text-red-600 rounded-2xl hover:shadow-xl transition-all duration-300 border-2 border-red-200 hover:border-red-300">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Why TAGit?</h2>
            <p className="text-xl text-gray-600">Life-saving technology at your fingertips</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-white" />}
              title="Instant Access"
              description="First responders get critical medical info in seconds with just an NFC tap"
              gradient="from-yellow-500 to-orange-600"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-white" />}
              title="Secure & Private"
              description="Your data is encrypted and only accessible when needed for emergencies"
              gradient="from-purple-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Smartphone className="w-12 h-12 text-white" />}
              title="Easy to Use"
              description="Simple setup. Works on any NFC-enabled phone. No app download needed for responders"
              gradient="from-blue-500 to-cyan-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-red-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to safety</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <Step number="1" title="Create Profile" description="Sign up and add your medical information, allergies, and emergency contacts" />
            <Step number="2" title="Get NFC Tag" description="Link your profile to an NFC tag on your helmet, wallet, or ID" />
            <Step number="3" title="Stay Safe" description="In an emergency, responders tap your tag to access vital information instantly" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 via-red-700 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-2xl mb-10 opacity-90">Join thousands of users protecting themselves with TAGit</p>
          <Link href="/signup" className="inline-block px-10 py-5 bg-white text-red-600 hover:bg-gray-50 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="w-6 h-6" />
            <span className="text-xl font-bold">TAGit</span>
          </div>
          <p className="text-gray-400 mb-4">Emergency Response NFC System</p>
          <p className="text-sm text-gray-500">© 2025 TAGit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>
      <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center group">
      <div className="relative inline-block mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 text-white rounded-3xl flex items-center justify-center text-4xl font-bold mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-300">
          {number}
        </div>
        <div className="absolute -inset-2 bg-gradient-to-br from-red-400 to-red-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </div>
  );
}
