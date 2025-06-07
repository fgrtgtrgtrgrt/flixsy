
import React from 'react';
import { Crown, Zap } from 'lucide-react';
import { useCredits } from '@/contexts/CreditContext';
import { Button } from '@/components/ui/button';

const CreditDisplay = () => {
  const { credits, isPremium, loading, purchasePremium } = useCredits();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-6 bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  if (isPremium) {
    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <Crown className="w-4 h-4" />
        <span className="text-sm font-medium">Premium</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 text-blue-400">
        <Zap className="w-4 h-4" />
        <span className="text-sm font-medium">{credits || 0} credits</span>
      </div>
      <Button
        onClick={purchasePremium}
        size="sm"
        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs px-3 py-1"
      >
        <Crown className="w-3 h-3 mr-1" />
        Get Premium $3.99
      </Button>
    </div>
  );
};

export default CreditDisplay;
