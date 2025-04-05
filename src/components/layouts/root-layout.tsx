import type React from "react";
import BottomNavigation from "@/components/navigation/bottom-navigation";
import useAuth from "@/hooks/useAuth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuth({ requireAuth: true, authUrl: "/signin" });

  return (
    <div>
      <div className="max-w-md mx-auto">
        <main className="min-h-screen pb-16">{children}</main>
        <BottomNavigation />
      </div>
    </div>
  );
}
