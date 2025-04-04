import useAuthStore from "@/store/auth-store";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const useAuth = (options: {
  requireAuth?: boolean;
  authUrl?: string;
} = {}) => {
  const { requireAuth = false, authUrl = "/signin" } = options;

  const router = useRouter();
  const { address } = useAccount();

  const [mounted, setMounted] = useState(false);
  const appSession = useAuthStore((state) => state.appSession);
  const setAppSession = useAuthStore((state) => state.setAppSession);

  const session = appSession ? appSession[address || ""] : null;

  const signIn = async (signature: string) => {
    if (!address) return;
    const updatedAppSession = {
      ...(appSession || {}),
      [address]: {
        accessToken: signature,
      },
    };
    setAppSession(updatedAppSession);
    return updatedAppSession[address];
  };

  const signOut = async () => {
    if (!address) return;
    const updatedAppSession = appSession || {};
    delete updatedAppSession[address];
    setAppSession(updatedAppSession);
  };

  useEffect(() => {
    const session = appSession ? appSession[address || ""] : null;
    if (requireAuth && !session) {
      router.push(authUrl);
    }
  }, [requireAuth, appSession, router, authUrl, address]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { session, address, mounted, signIn, signOut };
};

export default useAuth;
