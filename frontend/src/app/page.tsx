import Link from 'next/link'
import { FileText, Shield, Zap, Lock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">LegalDD</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Legal Due Diligence, Powered by AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your legal due diligence process with AI-powered document
            analysis, VDR integration, and intelligent risk assessment.
          </p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Start Your Free Trial
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-blue-600" />}
            title="Smart Document Analysis"
            description="AI-powered analysis of contracts, financial documents, and legal files"
          />
          <FeatureCard
            icon={<Shield className="h-8 w-8 text-blue-600" />}
            title="VDR Integration"
            description="Seamlessly connect with Datasite, Intralinks, and other major VDR providers"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-blue-600" />}
            title="Real-time Collaboration"
            description="Work together with your team on due diligence projects"
          />
          <FeatureCard
            icon={<Lock className="h-8 w-8 text-blue-600" />}
            title="Enterprise Security"
            description="GDPR compliant with bank-level encryption and security"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Trusted by Leading Law Firms
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Join hundreds of legal professionals who trust our platform for their
            most critical due diligence work.
          </p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">10M+</div>
              <div className="text-sm">Documents Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-sm">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">99.9%</div>
              <div className="text-sm">Uptime SLA</div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 LegalDD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}
