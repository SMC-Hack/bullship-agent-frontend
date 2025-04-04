export default function Heading() {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
        Hi, vitalik.eth!
      </h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Search agents..."
          className="pl-8 pr-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors text-sm"
        />
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
} 