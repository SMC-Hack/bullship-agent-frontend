import type React from "react";
import { AgentIdentityForm } from "@/components/create/AgentIdentityForm";
import { TradingStrategyForm } from "@/components/create/TradingStrategyForm";
import useAvailableChains from "@/hooks/useAvailableChains";
import useAvailableTokensInChains from "@/hooks/useAvailableTokensInChains";
import useCreateAgentFormStore from "@/store/create-agent-form-store";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import uploadService from "@/services/upload.service";
import useMerchant from "@/hooks/useMerchant";
import { ethers } from "ethers";
import agentService from "@/services/agent.service";
import { CreateAgentDto } from "@/interfaces/agent.interface";
import { useMemo } from "react";

export default function CreateScreen() {
  const router = useRouter();
  const step = Number(router.query.step || "1");

  const { session } = useAuth();
  const { data: chains } = useAvailableChains();
  const { data: tokens } = useAvailableTokensInChains(
    chains?.map((chain) => chain.chainId)
  );

  const {
    formData,
    setFormData,
    profileImage,
    setProfileImage,
    selectedTokens,
    setSelectedTokens,
  } = useCreateAgentFormStore();

  // const { createAgent, createAgentState, getAgentInfo } = useMerchant();

  const accessToken = session?.accessToken || "";
  const availableTokens = useMemo(() => {
    return Object.values(tokens ?? {}).map(
      (chainTokens) => chainTokens[0]
    );
  }, [tokens])

  const selectedTokenList = useMemo(() => {
    return Object.values(tokens ?? {}).flatMap(item => item).filter((token) =>
      selectedTokens.includes(token.symbol)
    );
  }, [tokens, selectedTokens])
  
  Object.values(tokens ?? {}).flatMap(item => item).filter((token) =>
    selectedTokens.includes(token.symbol)
  );

  const handleGoBack = () => {
    if (step > 1) {
      router.push(`/create?step=${step - 1}`);
    } else {
      router.push("/");
    }
  };

  const handleContinue = () => {
    router.push(`/create?step=${step + 1}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        setProfileImage(event.target?.result as string);

        try {
          const uploadedFile = await uploadService.uploadFile(
            file,
            accessToken
          );
          const imageUrl = uploadService.getFileUrl(uploadedFile.filename);
          setProfileImage(imageUrl);
        } catch (e) {
          console.error(e);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTokenToggle = (tokenId: string) => {
    if (selectedTokens.includes(tokenId)) {
      setSelectedTokens(selectedTokens.filter((id) => id !== tokenId));
    } else {
      setSelectedTokens([...selectedTokens, tokenId]);
    }
  };

  const handleCreateAgent = async () => {
    const dto: CreateAgentDto = {
      name: formData.name,
      strategy: formData.tradingInstructions,
      selectedTokens: JSON.stringify(selectedTokenList),
    }

    console.log(dto);
    // const agent = await agentService.createAgent(dto)
    // const agentWalletAddress = ethers.Wallet.createRandom().address;
    // console.log("Agent wallet address: ", agentWalletAddress)
    // // Step 2: Register agent in smart contract
    // await createAgent(agentWalletAddress, formData.name, formData.symbol);
    // // Step 3: Register agent token in backend
    // const agentInfo = await getAgentInfo(agentWalletAddress);
    // if (agentInfo) {
    //   console.log("Agent info: ", agentInfo)
    //   const agentTokenAddress = agentInfo.stockTokenAddress;
    //   console.log("Agent token address: ", agentTokenAddress)
    // }
    // // TO DO KAE: update agent info in backend
    // // Step 4: Navigate to agent detail page
  };

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
                  i <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i}
              </div>
              {i < 2 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    i < step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
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
  );
}
