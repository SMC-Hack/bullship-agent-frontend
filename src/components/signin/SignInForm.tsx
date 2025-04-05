import React from "react";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAuth from "@/hooks/useAuth";
import useAuthMessage from "@/hooks/useAuthMessage";
import { useSignMessage } from "wagmi";

const SignInForm = () => {
  const { address, mounted, signIn } = useAuth();
  const { data: authMessageRes } = useAuthMessage(address);
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: async (signature: `0x${string}`) => {
        if (!address || !authMessageRes) return;
        const nonce = authMessageRes?.authMessage.nonce;
        await signIn(signature, nonce);
      },
    },
  });

  const handleSignSignature = () => {
    if (!address || !authMessageRes) return;
    signMessage({ message: authMessageRes.authMessage.message });
  };

  if (!mounted) return null;

  return (
    <div className="w-full flex justify-center">
      <div className="w-full flex flex-col gap-4 items-center">
        <ConnectButton
          label="Connect Wallet"
          accountStatus="address"
          chainStatus="none"
        />
        {mounted && address && (
          <Button onClick={handleSignSignature}>
            <Key className="mr-2 h-5 w-5" />
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignInForm; 