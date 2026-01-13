'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import {
  FileText,
  FolderOpen,
  BarChart3,
  Users,
  Shield,
  LogOut,
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, clearAuth } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">LegalDD</span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your due diligence projects and documents
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FolderOpen className="h-8 w-8 text-blue-600" />}
            title="Active Projects"
            value="0"
            subtitle="No projects yet"
          />
          <StatCard
            icon={<FileText className="h-8 w-8 text-green-600" />}
            title="Documents"
            value="0"
            subtitle="Ready to upload"
          />
          <StatCard
            icon={<BarChart3 className="h-8 w-8 text-purple-600" />}
            title="Analysis Complete"
            value="0%"
            subtitle="Get started"
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-orange-600" />}
            title="Team Members"
            value="1"
            subtitle="Invite your team"
          />
        </div>

        {/* Getting Started */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <GettingStartedCard
              step="1"
              title="Create a Project"
              description="Start by creating your first due diligence project"
            />
            <GettingStartedCard
              step="2"
              title="Upload Documents"
              description="Upload contracts, financial documents, and legal files"
            />
            <GettingStartedCard
              step="3"
              title="AI Analysis"
              description="Get instant AI-powered analysis and risk assessment"
            />
          </div>
          <div className="mt-8 text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Create Your First Project
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <FeatureCard
            title="VDR Integration"
            description="Connect to your Virtual Data Room providers like Datasite and Intralinks"
            icon={<Shield className="h-6 w-6 text-blue-600" />}
          />
          <FeatureCard
            title="AI-Powered Analysis"
            description="Leverage Claude AI to analyze documents for risks, key clauses, and insights"
            icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
          />
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
      </div>
      <h3 className="text-2xl font-bold mb-1">{value}</h3>
      <p className="text-gray-600 text-sm mb-1">{title}</p>
      <p className="text-gray-400 text-xs">{subtitle}</p>
    </div>
  )
}

function GettingStartedCard({
  step,
  title,
  description,
}: {
  step: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full font-bold text-lg mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  )
}
