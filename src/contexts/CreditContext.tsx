
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface CreditContextType {
  credits: number | null;
  isPremium: boolean;
  loading: boolean;
  canWatch: boolean;
  useCredit: () => Promise<boolean>;
  checkCredits: () => Promise<void>;
  purchasePremium: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredits = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
};

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [canWatch, setCanWatch] = useState(false);
  const { user, session } = useAuth();

  const checkCredits = async () => {
    if (!user || !session) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-credits', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setIsPremium(data.isPremium);
      setCredits(data.credits);
      setCanWatch(data.canWatch);
    } catch (error) {
      console.error('Error checking credits:', error);
    } finally {
      setLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    if (!user || !session) return false;

    try {
      const { data, error } = await supabase.functions.invoke('use-credit', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.success) {
        if (data.isPremium) {
          setIsPremium(true);
          setCredits(null);
        } else {
          setCredits(data.creditsRemaining);
        }
        setCanWatch(data.creditsRemaining > 0 || data.isPremium);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error using credit:', error);
      return false;
    }
  };

  const purchasePremium = async () => {
    if (!user || !session) return;

    try {
      const { data, error } = await supabase.functions.invoke('create-premium-payment', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      // Open Stripe checkout in a new tab
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating premium payment:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkCredits();
    } else {
      setLoading(false);
      setCredits(null);
      setIsPremium(false);
      setCanWatch(false);
    }
  }, [user, session]);

  const value = {
    credits,
    isPremium,
    loading,
    canWatch,
    useCredit,
    checkCredits,
    purchasePremium,
  };

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
};
