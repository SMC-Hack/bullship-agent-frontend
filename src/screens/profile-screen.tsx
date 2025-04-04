import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <div className="container px-4 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
}
