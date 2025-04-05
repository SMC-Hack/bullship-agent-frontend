import React, { useEffect } from "react";
import { useRouter } from "next/router";
import useAuth from "@/hooks/useAuth";
import SignInLogo from "@/components/signin/sign-in-logo";
import SignInForm from "@/components/signin/sign-in-form";
import SignInTerms from "@/components/signin/sign-in-terms";

const SignInScreen = () => {
  const { session, mounted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="w-full max-w-md">
        <SignInLogo />
        <div className="space-y-4">
          <SignInForm />
          <SignInTerms />
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
