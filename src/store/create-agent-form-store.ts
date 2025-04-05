import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CreateAgentFormStore {
  formData: {
    name: string;
    symbol: string;
    description: string;
    strategy: string;
  };
  profileImage: string | null;
  selectedTokens: string[];
  setFormData: (formData: CreateAgentFormStore["formData"]) => void;
  setProfileImage: (image: string | null) => void;
  setSelectedTokens: (tokens: string[]) => void;
}

const useCreateAgentFormStore = create<CreateAgentFormStore>()(
  persist(
    (set) => ({
      formData: {
        name: "",
        symbol: "",
        description: "",
        strategy: "",
      },
      profileImage: null,
      selectedTokens: [],
      setFormData: (formData) => set({ formData: { ...formData } }),
      setProfileImage: (image) => set({ profileImage: image }),
      setSelectedTokens: (tokens) => set({ selectedTokens: [...tokens] }),
    }),
    {
      name: "create-agent-form-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCreateAgentFormStore;
