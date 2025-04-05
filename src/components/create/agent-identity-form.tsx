import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ProfileImageUpload } from "./profile-image-upload"
import { ENS_SUFFIX } from "@/constants/ens-suffix"
import { useState, useEffect } from "react"
import { sanitizeDomainName } from "@/utils/format"

interface FormData {
  name: string
  symbol: string
  description: string
}

interface FormErrors {
  name?: string
  symbol?: string
  description?: string
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return !value.trim() ? 'Agent name is required' : ''
      case 'symbol':
        return !value.trim() ? 'Agent symbol is required' : ''
      case 'description':
        return !value.trim() ? 'Description is required' : ''
      default:
        return ''
    }
  }

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
    setTouched(prev => ({ ...prev, name: true }))
    setErrors(prev => ({ ...prev, name: validateField('name', sanitizedValue) }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    onInputChange(e)
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name as keyof FormData]) }))
  }

  const isFormValid = () => {
    return !Object.values(errors).some(error => error) &&
           formData.name.trim() !== '' &&
           formData.symbol.trim() !== '' &&
           formData.description.trim() !== ''
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Agent Identity</h2>
      <div className="space-y-4">
        <ProfileImageUpload profileImage={profileImage} onImageUpload={onImageUpload} />

        <div className="grid w-full items-center gap-1.5">
          {/* TODO: Check duplicate agent name */}
          <Label htmlFor="name">
            Agent Name <span className="text-red-500">*</span>
          </Label>
          <div className="flex">
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              placeholder="e.g., alphatrader"
              className={`rounded-r-none ${touched.name && errors.name ? 'border-red-500' : ''}`}
            />
            <div className="bg-muted flex items-center px-3 rounded-r-md border border-l-0 border-input">
              <span className="text-sm text-muted-foreground">{ENS_SUFFIX}</span>
            </div>
          </div>
          {touched.name && errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="symbol">
            Agent Symbol <span className="text-red-500">*</span>
          </Label>
          <Input
            id="symbol"
            name="symbol"
            value={formData.symbol}
            onChange={handleInputChange}
            onBlur={() => handleBlur('symbol')}
            placeholder="e.g., ALPHA"
            className={`mt-1 ${touched.symbol && errors.symbol ? 'border-red-500' : ''}`}
          />
          {touched.symbol && errors.symbol && (
            <p className="text-sm text-red-500 mt-1">{errors.symbol}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">
            Short Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            placeholder="Describe your agent in a few sentences..."
            className={`mt-1 ${touched.description && errors.description ? 'border-red-500' : ''}`}
            rows={3}
          />
          {touched.description && errors.description && (
            <p className="text-sm text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        <Button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 mt-4"
          disabled={!isFormValid()}
        >
          Continue
        </Button>
      </div>
    </div>
  )
} 