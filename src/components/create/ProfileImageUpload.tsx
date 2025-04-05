import Image from "next/image"
import { Upload } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProfileImageUploadProps {
  profileImage: string | null
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function ProfileImageUpload({ profileImage, onImageUpload }: ProfileImageUploadProps) {
  return (
    <div>
      <Label htmlFor="profileImage">Profile Image</Label>
      <div className="mt-1 flex items-center">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 mr-4">
          {profileImage ? (
            <Image
              src={profileImage || "/placeholder.svg"}
              alt="Agent profile"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Upload size={24} />
            </div>
          )}
        </div>
        <label className="cursor-pointer">
          <span className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium">
            Upload Image
          </span>
          <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
        </label>
      </div>
    </div>
  )
} 