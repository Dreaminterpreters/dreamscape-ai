import Image from "next/image"

export default function DreamsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Image
          src="/images/dreamscape-watermark.png"
          alt="DreamScape AI"
          width={60}
          height={60}
          className="rounded-full"
        />
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Dream Interpretation
        </h1>
      </div>
      {/* Rest of the page content will go here */}
      <p className="text-gray-700">Welcome to the Dream Interpretation page. This page is under construction.</p>
    </div>
  )
}
