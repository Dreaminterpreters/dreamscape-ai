export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-300 mb-6 drop-shadow-lg">🌙 DreamSage</h1>
        <h2 className="text-3xl font-bold text-indigo-200 mb-2">404 – Page Not Found</h2>
        <p className="text-lg text-gray-300 mb-8">
          The realm you seek is beyond our dreams.
          <br />
          <a href="/" className="text-purple-400 underline hover:text-purple-200 transition">
            Return home
          </a>
        </p>
      </div>
    </div>
  )
}
