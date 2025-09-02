"use client";

import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { createClient } from "@/utils/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return { user, loading, signOut };
}
