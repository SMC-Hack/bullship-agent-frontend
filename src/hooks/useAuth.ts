import authService from "@/services/auth.service";
import useAuthStore from "@/store/auth-store";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { jwtDecode } from "jwt-decode";

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

  const signIn = async (signature: string, nonce: number) => {
    if (!address) return;
    const response = await authService.signIn(signature, address, nonce);
    if (!response) return;

    const updatedAppSession = {
      ...(appSession || {}),
      [address]: {
        accessToken: response.accessToken,
      },
    };
    setAppSession(updatedAppSession);
    return updatedAppSession[address];
  };

  const signOut = useCallback(async () => {
    if (!address) return;
    const updatedAppSession = appSession || {};
    delete updatedAppSession[address];
    setAppSession(updatedAppSession);
  }, [address, appSession, setAppSession]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const session = appSession ? appSession[address || ""] : null;
    if (mounted && requireAuth && !session) {
      router.push(authUrl);
    }
  }, [requireAuth, appSession, router, authUrl, address, mounted]);

  useEffect(() => {
    const session = appSession ? appSession[address || ""] : null;
    if (mounted && session) {
      const decodedToken = jwtDecode(session.accessToken);
      if (decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        signOut();
      }
    }
  }, [mounted, appSession, address, signOut]);

  return { session, address, mounted, signIn, signOut };
};

export default useAuth;
