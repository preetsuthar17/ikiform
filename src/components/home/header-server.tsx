import { LogIn, MessageCircleIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "../ui/button";
import { HeaderClient } from "./header-client";

/**
 * Server-rendered header component with authentication state
 * Minimizes client-side JavaScript by pre-rendering navigation
 */
export default async function HeaderServer() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="mx-auto mt-10 flex w-full max-w-[95%] flex-wrap items-center justify-between gap-8 p-4 font-inter text-sm">
      <div className="flex flex-shrink-0 items-center gap-2">
        <Link href="/">
          <span className="flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight">
            <Image
              alt="Ikiform Logo"
              className="invert"
              height={40}
              src="/favicon.ico"
              width={40}
            />
            <span>Ikiform</span>
          </span>
        </Link>
      </div>

      {}
      <div className="hidden items-center gap-8 sm:flex">
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#features">Features</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/#pricing">Pricing</Link>
          </Button>
        </nav>
      </div>

      {}
      <div className="hidden gap-2 sm:flex">
        <HeaderClient initialUser={user} />
        <Button asChild>
          <Link
            className="flex items-center gap-2 font-medium"
            href="/f/feedback-form-evtu2f"
          >
            <MessageCircleIcon />
            Feedback
          </Link>
        </Button>
      </div>

      {}
      <HeaderClient initialUser={user} mobileOnly />
    </nav>
  );
}
