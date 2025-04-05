import type React from "react";
import { AgentIdentityForm } from "@/components/create/AgentIdentityForm";
import { TradingStrategyForm } from "@/components/create/TradingStrategyForm";
import useAvailableChains from "@/hooks/useAvailableChains";
import useAvailableTokensInChains from "@/hooks/useAvailableTokensInChains";
import useCreateAgentFormStore from "@/store/create-agent-form-store";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import uploadService from "@/services/upload.service";

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

  const accessToken = session?.accessToken || "";

  const availableTokens = Object.values(tokens ?? {})
    .flatMap((chainTokens) =>
      chainTokens.map((token) => ({
        id: token.symbol,
        name: token.name,
      }))
    )
    .slice(0, 10);

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
    // Step 1: Create agent wallet in backend
    // const agent = await agentService.createAgent({
    //   name: formData.name,
    //   strategy: formData.tradingInstructions,
    //   selectedTokens: selectedTokens.join(","),
    // })
    // Step 2: Register agent in smart contract
    // Step 3: Register agent token in backend
    // Step 4: Navigate to agent detail page

    console.log({ formData, selectedTokens, profileImage });
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
