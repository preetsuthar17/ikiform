"use client";

import { useState, useEffect } from "react";
import { waitlistService } from "@/lib/supabase/waitlist";
import confetti from "canvas-confetti";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { toast } from "../../hooks/use-toast";

const Hero = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [countLoading, setCountLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const result = await waitlistService.getWaitlistCount();
        setWaitlistCount(result.count);
      } catch (error) {
        console.error("Failed to fetch waitlist count:", error);
      } finally {
        setCountLoading(false);
      }
    };

    fetchCount();
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return;
    }

    setLoading(true);

    try {
      const result = await waitlistService.addToWaitlist(email);

      if (result.success) {
        setEmail("");
        triggerConfetti();
        toast("Successfully joined waitlist!");
        const countResult = await waitlistService.getWaitlistCount();
        setWaitlistCount(countResult.count);
      } else {
        if (result.message.includes("already")) {
          toast("You've already joined waitlist!");
        } else {
          toast("Something went wrong!");
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center max-w-6xl w-[95%] mx-auto py-12 gap-5">
      <h1 className="text-4xl md:text-5xl tracking-tight font-medium mt-10 flex flex-col gap-3 max-w-3xl">
        Beautiful, budget-friendly forms without compromises
      </h1>
      <p className="text-muted-foreground max-w-2xl">
        Ikiform is an open-source alternative to Typeform and Google Forms,
        designed to help you create beautiful forms effortlessly.
      </p>

      <div className="w-full max-w-md mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 text-sm">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exampe@0.email"
              disabled={loading}
              required
              size={"lg"}
            />
            <Button type="submit" disabled={loading} size={"lg"}>
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-green-500 text-sm">
          {countLoading ? "0 " : waitlistCount.toLocaleString()} people have
          already joined the waitlist!
        </p>{" "}
      </div>
    </section>
  );
};

export default Hero;
