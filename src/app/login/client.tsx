"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";

import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function LoginForm() {
  const { user } = useAuth();

  if (user) {
    redirect("/dashboard");
  }

  const handleOAuthLogin = async (provider: "github" | "google") => {
    toast(`Redirecting to ${provider === "google" ? "Google" : "GitHub"}...`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4 scale-110">
        <Card className="max-w-sm w-full flex flex-col gap-6 items-center justify-center text-center bg-[#fafafa] border-black/10  shadow-md/2">
          <CardHeader>
            <div className="flex-shrink-0">
              <Link href="/">
                <span
                  className={`text-3xl font-semibold tracking-tight flex items-center gap-2 justify-center`}
                >
                  <Image
                    src="/favicon.ico"
                    alt="Ikiform Logo"
                    width={40}
                    height={40}
                  />
                  <span className="text-black">Ikiform</span>
                </span>
              </Link>
            </div>
          </CardHeader>
          <Separator className="opacity-10" />
          <CardContent className="w-full">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleOAuthLogin("google")}
              className="font-medium w-full flex items-center gap-2"
            >
              <FcGoogle size={22} />
              Login with Google
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleOAuthLogin("github")}
              className="font-medium w-full flex items-center gap-2"
            >
              <FaGithub size={22} />
              Login with GitHub
            </Button>
          </CardContent>
        </Card>
        <div className="text-muted-foreground text-sm text-center">
          <p>
            By signing up, you agree our{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              className="underline text-muted-foreground"
            >
              Terms of Services
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
