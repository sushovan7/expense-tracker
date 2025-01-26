import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Pyramid } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { LayoutDashboard, Pencil } from "lucide-react";
import { checkUser } from "@/lib/checkUser.js";
import { getUserAccounts } from "@/actions/dashboard.action";
import { updateDefaultAccount } from "@/actions/account.action";

async function Header() {
  await checkUser();
  await getUserAccounts();

  return (
    <header className="fixed bg-white top-0 z-50 w-full py-2 border-b shadow-md">
      <nav className="conatiner mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-3xl flex items-center gap-1 font-bold ">
          <Pyramid size="30px" /> mint
        </Link>
        <div className="flex items-center gap-3">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline">
                <LayoutDashboard />

                <span className="hidden md:inline"> Dashboard</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button>
                <Pencil />

                <span className="hidden md:inline"> Transactions</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button>Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

export default Header;
