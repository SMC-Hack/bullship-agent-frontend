import React from "react";
import { CardDescription } from "@/components/ui/card";

const SignInLogo = () => {
  return (
    <div className="space-y-2 text-center mb-4">
      {/* TODO: Replace with your actual logo */}
      <div className="mx-auto w-12 h-12 rounded-full bg-primary flex items-center justify-center">
        <span className="text-xl font-bold text-primary-foreground">B</span>
      </div>
      <h2 className="text-2xl font-bold tracking-tight">
        Welcome to Bull Ship Agent
      </h2>
      <p>
        Connect your wallet to access the future of crypto currency investment
      </p>
    </div>
  );
};

export default SignInLogo; 