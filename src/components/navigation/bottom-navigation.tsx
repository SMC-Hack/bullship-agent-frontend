import Link from "next/link";
import { useRouter } from "next/router";
import { Home, PlusCircle, Wallet, Activity, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const navItems = [
    {
      name: "Market",
      href: "/",
      icon: Home,
    },
    {
      name: "Create",
      href: "/create",
      icon: PlusCircle,
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: Wallet,
    },
    {
      name: "Activity",
      href: "/activity",
      icon: Activity,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto">
        <div className="w-full flex justify-around items-center h-16 bg-white border-t border-gray-200 shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full",
                  "transition-colors duration-200",
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-blue-400"
                )}
                aria-label={item.name}
                tabIndex={0}
              >
                <item.icon
                  className={cn(
                    "w-6 h-6 mb-1",
                    isActive ? "text-blue-600" : "text-gray-500"
                  )}
                />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
