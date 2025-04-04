import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function SearchBar() {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        placeholder="Search agents..."
        className="pl-10 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  )
} 