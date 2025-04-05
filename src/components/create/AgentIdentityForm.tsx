import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProfileImageUpload } from "./ProfileImageUpload"
import { ENS_SUFFIX } from "@/constants/ens-suffix"

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

const sanitizeDomainName = (value: string): string => {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '')
}

export function AgentIdentityForm({
  formData,
  profileImage,
  onInputChange,
  onImageUpload,
  onContinue,
}: AgentIdentityFormProps) {
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeDomainName(e.target.value)
    const syntheticEvent = {
      ...e,
      target: {
        name: 'name',
        value: sanitizedValue,
        type: 'text',
        id: 'name'
      } as HTMLInputElement
    } as React.ChangeEvent<HTMLInputElement>
    onInputChange(syntheticEvent)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Agent Identity</h2>
      <div className="space-y-4">
        <ProfileImageUpload profileImage={profileImage} onImageUpload={onImageUpload} />

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="name">Agent Name</Label>
          <div className="flex">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., alphatrader"
              className="rounded-r-none"
            />
            <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
              <span className="text-sm text-muted-foreground">{ENS_SUFFIX}</span>
            </div>
          </div>
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