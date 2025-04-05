import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export default function CreateScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isVerified, setIsVerified] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [selectedTokens, setSelectedTokens] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    persona: "",
    enterPosition: "",
    takeProfit: "",
    stopLoss: "",
    tradingInstructions: ""
  })

  const availableTokens = [
    { id: "btc", name: "Bitcoin (BTC)" },
    { id: "eth", name: "Ethereum (ETH)" },
    { id: "sol", name: "Solana (SOL)" },
    { id: "avax", name: "Avalanche (AVAX)" },
    { id: "matic", name: "Polygon (MATIC)" },
    { id: "dot", name: "Polkadot (DOT)" },
    { id: "link", name: "Chainlink (LINK)" },
    { id: "uni", name: "Uniswap (UNI)" },
  ]

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/")
    }
  }

  const handleVerify = () => {
    // Simulate World ID verification
    setTimeout(() => {
      setIsVerified(true)
      setStep(2)
    }, 1500)
  }

  const handleContinue = () => {
    setStep(step + 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTokenToggle = (tokenId: string) => {
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(selectedTokens.filter((id) => id !== tokenId))
    } else {
      setSelectedTokens([...selectedTokens, tokenId])
    }
  }

  const handleCreateAgent = () => {
    // Simulate agent creation
    setTimeout(() => {
      // Navigate to the newly created agent page
      router.push("/agent/new-agent")
    }, 2000)
  }

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-bold">Create Agent</h1>
      </div>

      <div className="mb-6">
        <div className="flex mb-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {i}
              </div>
              {i < 2 && <div className={`h-1 flex-1 mx-2 ${i < step ? "bg-blue-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Agent Identity</h2>
            <div className="space-y-4">
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
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
                  placeholder="Describe your agent in a few sentences..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 mt-4"
                disabled={!formData.name || !formData.symbol}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Trading Strategy</h2>
            <div className="space-y-4">
              <div>
                <Label>Trading Tokens</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableTokens.map((token) => (
                    <div
                      key={token.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedTokens.includes(token.id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleTokenToggle(token.id)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleTokenToggle(token.id)
                        }
                      }}
                      aria-label={`Select ${token.name}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{token.name}</span>
                        {selectedTokens.includes(token.id) && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tradingInstructions">Trading Instructions</Label>
                <Textarea
                  id="tradingInstructions"
                  name="tradingInstructions"
                  value={formData.tradingInstructions}
                  onChange={handleInputChange}
                  placeholder="How to enter positions, take profit, and cut losses?"
                  className="mt-1"
                  rows={20}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <Button variant="outline" onClick={handleGoBack} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleCreateAgent}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  disabled={
                    selectedTokens.length === 0 || !formData.tradingInstructions
                  }
                >
                  Create Agent
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

