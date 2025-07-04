"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("useAuth: useEffect triggered");
    const supabase = createClient();
    const getUser = async () => {
      console.log("useAuth: Getting initial user");
      const { data } = await supabase.auth.getUser();
      console.log("useAuth: Initial user data:", data.user?.id || "null");
      setUser(data.user ?? null);
      setLoading(false);
      console.log("useAuth: Initial loading set to false");
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("useAuth: Auth state change event:", event);
        console.log("useAuth: Session user:", session?.user?.id || "null");
        const newUser = session?.user ?? null;
        setUser((prevUser) => {
          console.log("useAuth: Previous user:", prevUser?.id || "null");
          console.log("useAuth: New user:", newUser?.id || "null");
          if (prevUser?.id === newUser?.id) {
            console.log("useAuth: User unchanged, returning previous user");
            return prevUser;
          }
          console.log("useAuth: User changed, updating state");
          return newUser;
        });
      }
    );
    return () => {
      console.log("useAuth: Cleaning up auth listener");
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    console.log("useAuth: Sign out initiated");
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      console.log("useAuth: Sign out successful");
      setUser(null);
      console.log("useAuth: User set to null");
      router.push("/");
      console.log("useAuth: Navigating to home");
    } catch (error) {
      console.error("useAuth: Sign out error:", error);
    }
  };

  return { user, loading, signOut };
}
