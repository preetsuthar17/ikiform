"use client";

// External imports
import React from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

// Internal imports
import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from "../ui/modal";

const Hero = () => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleOAuthLogin = async (provider: "github" | "google") => {
    toast(`Redirecting to ${provider === "google" ? "Google" : "GitHub"}...`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <section className="flex flex-col items-center justify-center text-center py-12 gap-6 relative overflow-hidden">
      <h1 className="text-4xl md:text-5xl tracking-tight font-medium flex flex-col gap-2 max-w-3xl">
        <span className="inline-block px-2 py-1">
          Beautiful, budget-friendly forms without compromises
        </span>
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Ikiform is an open-source alternative to Typeform and Google Forms,
        designed to help you create beautiful forms effortlessly.
      </p>
      <div className="w-full max-w-md flex gap-2 justify-center items-center flex-wrap">
        {!user ? (
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
              <Button
                className="font-medium grow"
                onClick={() => setOpen(true)}
              >
                Create your first form
              </Button>
            </ModalTrigger>
            <ModalContent className="max-w-sm">
              <ModalHeader>
                <ModalTitle>Choose your login method</ModalTitle>
              </ModalHeader>
              <div className="flex flex-col gap-4">
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
              </div>
              <ModalFooter />
            </ModalContent>
          </Modal>
        ) : (
          <Button className="font-medium grow" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        )}
        <Button className="font-medium grow" variant="secondary" asChild>
          <Link href="/#pricing">Check out pricing</Link>
        </Button>
      </div>
    </section>
  );
};

export default Hero;
