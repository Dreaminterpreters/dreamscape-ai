import DreamTestScenarios from "@/components/dream-test-scenarios"

export default function TestDreamsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Dream Interpretation Testing
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive testing suite to ensure our dream interpretation system provides specific, authentic insights
            rather than generic responses.
          </p>
        </div>

        <DreamTestScenarios />
      </div>
    </div>
  )
}
