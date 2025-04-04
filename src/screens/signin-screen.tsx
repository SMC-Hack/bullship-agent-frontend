import React, { useEffect } from "react";
import { CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import useAuth from "@/hooks/useAuth";

const SignInScreen = () => {
  const { address, session, mounted, signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      if (!address) return;
      const signature = "Text";
      const response = await signIn(signature);
      if (response) {
        router.push("/");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen  flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <div className="space-y-2 text-center mb-4">
          {/* TODO: Replace with your actual logo */}
          <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">B</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome to Bull Ship Agent
          </h2>
          <CardDescription>
            Connect your wallet to access the future of crypto currency
            investment
          </CardDescription>
        </div>
        <div className="space-y-4">
          <div className="w-full flex justify-center">
            <div className="w-full flex flex-col gap-4 items-center">
              <ConnectButton
                label="Connect Wallet"
                accountStatus="address"
                chainStatus="none"
              />
              {mounted && address && (
                <Button
                  // className="w-full py-6 text-lg"
                  onClick={handleSignIn}
                >
                  <Key className="mr-2 h-5 w-5" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center px-6">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
