import Link from 'next/link';
import { Heart, Shield, Zap, Smartphone } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-500" />
            <span className="text-2xl font-bold gradient-text">TAGit</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-700 hover:text-primary-500 transition">
              Login
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Save Lives with{' '}
          <span className="gradient-text">NFC Technology</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Instant access to critical medical information in emergencies. 
          One tap. One life saved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary text-lg px-8 py-4">
            Create Free Account
          </Link>
          <Link href="#how-it-works" className="btn-secondary text-lg px-8 py-4">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why TAGit?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-primary-500" />}
              title="Instant Access"
              description="First responders get critical medical info in seconds with just an NFC tap"
            />
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-primary-500" />}
              title="Secure & Private"
              description="Your data is encrypted and only accessible when needed for emergencies"
            />
            <FeatureCard
              icon={<Smartphone className="w-12 h-12 text-primary-500" />}
              title="Easy to Use"
              description="Simple setup. Works on any NFC-enabled phone. No app download needed for responders"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Step number="1" title="Create Profile" description="Sign up and add your medical information, allergies, and emergency contacts" />
            <Step number="2" title="Get NFC Tag" description="Link your profile to an NFC tag on your helmet, wallet, or ID" />
            <Step number="3" title="Stay Safe" description="In an emergency, responders tap your tag to access vital information instantly" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users protecting themselves with TAGit</p>
          <Link href="/signup" className="btn-secondary bg-white text-primary-500 hover:bg-gray-100 text-lg px-8 py-4 inline-block">
            Create Free Account
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

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
