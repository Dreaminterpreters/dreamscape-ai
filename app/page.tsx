"use client"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          🌙 DreamScape AI
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Free AI-Powered Dream Interpretation
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Interpret Your Dream</h2>
          <textarea 
            className="w-full h-32 p-4 border rounded-lg mb-4"
            placeholder="Describe your dream in detail..."
          />
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700">
            Interpret Dream
          </button>
        </div>
      </div>
    </div>
  )
}
