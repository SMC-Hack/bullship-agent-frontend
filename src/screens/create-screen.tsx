import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AgentIdentityForm } from "@/components/create/AgentIdentityForm"
import { TradingStrategyForm } from "@/components/create/TradingStrategyForm"
import agentService from "@/services/agent.service"
import useMerchant from "@/hooks/useMerchant"
import { ethers } from "ethers"
export default function CreateScreen() {
  const router = useRouter()
  const [step, setStep] = useState(1)
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

  const { createAgent, createAgentState, getAgentInfo } = useMerchant();


  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/")
    }
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

  const handleCreateAgent = async () => {
    // Step 1: Create agent wallet in backend
    // const agent = await agentService.createAgent({
    //   name: formData.name,
    //   strategy: formData.tradingInstructions,
    //   selectedTokens: selectedTokens.join(","),
    // })

    // for testing: use random agent wallet address
    const agentWalletAddress = ethers.Wallet.createRandom().address;
    console.log("Agent wallet address: ", agentWalletAddress)

    // Step 2: Register agent in smart contract
    await createAgent(agentWalletAddress, formData.name, formData.symbol);

    // Step 3: Register agent token in backend
    const agentInfo = await getAgentInfo(agentWalletAddress);

    if (agentInfo) {
      console.log("Agent info: ", agentInfo)
      const agentTokenAddress = agentInfo.stockTokenAddress;
      console.log("Agent token address: ", agentTokenAddress)
    }

    // TO DO KAE: update agent info in backend

    // Step 4: Navigate to agent detail page

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
          <AgentIdentityForm
            formData={formData}
            profileImage={profileImage}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onContinue={handleContinue}
          />
        )}

        {step === 2 && (
          <TradingStrategyForm
            availableTokens={availableTokens}
            selectedTokens={selectedTokens}
            tradingInstructions={formData.tradingInstructions}
            onTokenToggle={handleTokenToggle}
            onInputChange={handleInputChange}
            onGoBack={handleGoBack}
            onCreateAgent={handleCreateAgent}
          />
        )}
      </div>
    </div>
  )
}

