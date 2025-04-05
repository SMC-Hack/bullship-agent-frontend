import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProfileImageUpload } from "./ProfileImageUpload"

interface FormData {
  name: string
  symbol: string
  description: string
}

interface AgentIdentityFormProps {
  formData: FormData
  profileImage: string | null
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onContinue: () => void
}

export function AgentIdentityForm({
  formData,
  profileImage,
  onInputChange,
  onImageUpload,
  onContinue,
}: AgentIdentityFormProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Agent Identity</h2>
      <div className="space-y-4">
        <ProfileImageUpload profileImage={profileImage} onImageUpload={onImageUpload} />

        <div>
          <Label htmlFor="name">Agent Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="e.g., Alpha Trader"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="symbol">Agent Symbol</Label>
          <Input
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={onInputChange}
            placeholder="e.g., ALPHA"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Short Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Describe your agent in a few sentences..."
            className="mt-1"
            rows={3}
          />
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 mt-4"
          disabled={!formData.name || !formData.symbol}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 