"use client";

import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

interface PremiumStatus {
  hasPremium: boolean;
  hasCustomerPortal: boolean;
  checkingPremium: boolean;
}

const premiumStatusCache = new Map<
  string,
  { hasPremium: boolean; hasCustomerPortal: boolean }
>();

export function usePremiumStatus(user: User | null): PremiumStatus {
  const [hasPremium, setHasPremium] = useState(false);
  const [hasCustomerPortal, setHasCustomerPortal] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(false);
  const lastCheckedEmail = useRef<string | null>(null);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.email) {
        setHasPremium(false);
        setHasCustomerPortal(false);
        setCheckingPremium(false);
        lastCheckedEmail.current = null;
        return;
      }

      if (lastCheckedEmail.current === user.email) {
        return;
      }

      const cached = premiumStatusCache.get(user.email);
      if (cached) {
        setHasPremium(cached.hasPremium);
        setHasCustomerPortal(cached.hasCustomerPortal);
        setCheckingPremium(false);
        lastCheckedEmail.current = user.email;
        return;
      }

      setCheckingPremium(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("has_premium, polar_customer_id")
          .eq("email", user.email)
          .single();

        if (!error && data) {
          const premiumData = {
            hasPremium: data.has_premium || false,
            hasCustomerPortal: !!data.polar_customer_id,
          };
          setHasPremium(premiumData.hasPremium);
          setHasCustomerPortal(premiumData.hasCustomerPortal);
          premiumStatusCache.set(user.email, premiumData);
        } else {
          setHasPremium(false);
          setHasCustomerPortal(false);
        }
        lastCheckedEmail.current = user.email;
      } catch (error) {
        console.error("Error checking premium status:", error);
        setHasPremium(false);
        setHasCustomerPortal(false);
      } finally {
        setCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user?.email]);

  return {
    hasPremium,
    hasCustomerPortal,
    checkingPremium,
  };
}

export function clearPremiumStatusCache(email?: string) {
  if (email) {
    premiumStatusCache.delete(email);
  } else {
    premiumStatusCache.clear();
  }
}
