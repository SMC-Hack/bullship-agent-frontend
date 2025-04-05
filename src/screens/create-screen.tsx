import type React from "react";
import { AgentIdentityForm } from "@/components/create/agent-identity-form";
import { TradingStrategyForm } from "@/components/create/trading-strategy-form";
import useAvailableChains from "@/hooks/useAvailableChains";
import useAvailableTokensInChains from "@/hooks/useAvailableTokensInChains";
import useCreateAgentFormStore from "@/store/create-agent-form-store";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import uploadService from "@/services/upload.service";
import useMerchant from "@/hooks/useMerchant";
import agentService from "@/services/agent.service";
import { CreateAgentDto } from "@/interfaces/agent.interface";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AxiosError } from "axios";

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

  const [isLoading, setIsLoading] = useState(false);

  const { createAgent, createAgentState, getAgentInfo } = useMerchant();

  const accessToken = session?.accessToken || "";
  const availableTokens = useMemo(() => {
    return Object.values(tokens ?? {}).map((chainTokens) => chainTokens[0]);
  }, [tokens]);

  const selectedTokenList = useMemo(() => {
    return Object.values(tokens ?? {})
      .flatMap((item) => item)
      .filter((token) => selectedTokens.includes(token.symbol));
  }, [tokens, selectedTokens]);

  Object.values(tokens ?? {})
    .flatMap((item) => item)
    .filter((token) => selectedTokens.includes(token.symbol));

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
    setIsLoading(true);
    try {
      const createAgentToastId = toast.loading("Creating agent...");

      // Step 1: Create agent in backend
      const dto: CreateAgentDto = {
        name: formData.name,
        stockSymbol: formData.symbol,
        description: formData.description,
        strategy: formData.strategy,
        selectedTokens: JSON.stringify(selectedTokenList),
      };

      const agent = await agentService.createAgent(dto, accessToken);
      const agentWalletAddress = agent.walletAddress;

      toast.dismiss(createAgentToastId);
      const registerAgentToastId = toast.loading(
        "Registering agent in smart contract..."
      );

      // Step 2: Register agent in smart contract
      await createAgent(agentWalletAddress, formData.name, formData.symbol);

      toast.dismiss(registerAgentToastId);
      const registerAgentTokenToastId = toast.loading(
        "Registering agent token in backend..."
      );

      // Step 3: Register agent token in backend
      const agentInfo = await getAgentInfo(agentWalletAddress);

      if (agentInfo) {
        const agentTokenAddress = agentInfo.stockTokenAddress;
        await agentService.createAgentToken(
          agent.id.toString(),
          {
            stockAddress: agentTokenAddress,
          },
          accessToken
        );

        toast.dismiss(registerAgentTokenToastId);
        toast.success("Agent created successfully!");

        // Step 5: Navigate to agent detail page
        router.push(`/agent/${agent.id}`);
      }
    } catch (e) {
      let errMessage = "Failed to create agent!";
      if (e instanceof AxiosError && e.response?.data?.message) {
        errMessage = e.response.data.message;
      }
      console.error(e);
      toast.dismiss();
      toast.error(errMessage);
    }
    setIsLoading(false);
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
            strategy={formData.strategy}
            onTokenToggle={handleTokenToggle}
            onInputChange={handleInputChange}
            onGoBack={handleGoBack}
            onCreateAgent={handleCreateAgent}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
