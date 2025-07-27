// Custom hook for managing premium status

import type { User } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';

// Utils
import { createClient } from '@/utils/supabase/client';

// Types
import type { PremiumStatus } from '../types';

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

      setCheckingPremium(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('users')
          .select('has_premium, polar_customer_id')
          .eq('email', user.email)
          .single();

        if (!error && data) {
          setHasPremium(data.has_premium);
          setHasCustomerPortal(!!data.polar_customer_id);
        } else {
          setHasPremium(false);
          setHasCustomerPortal(false);
        }
        lastCheckedEmail.current = user.email;
      } catch (error) {
        console.error('Error checking premium status:', error);
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
