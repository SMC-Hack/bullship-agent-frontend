import { AppSession } from "@/interfaces/session.interface";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  appSession: AppSession | null;
  setAppSession: (appSession: AppSession | null) => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      appSession: null,
      setAppSession: (appSession: AppSession | null) =>
        set({ appSession: { ...appSession } }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
