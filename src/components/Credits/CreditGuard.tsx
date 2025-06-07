
import React from 'react';
import { Crown, Zap, Play } from 'lucide-react';
import { useCredits } from '@/contexts/CreditContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreditGuardProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  contentTitle: string;
}

const CreditGuard: React.FC<CreditGuardProps> = ({ isOpen, onClose, onProceed, contentTitle }) => {
  const { credits, isPremium, useCredit, purchasePremium } = useCredits();

  const handleWatch = async () => {
    if (isPremium) {
      onProceed();
      return;
    }

    const success = await useCredit();
    if (success) {
      onProceed();
    }
  };

  if (isPremium) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-flixsy-gray border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <Crown className="w-5 h-5" />
              Premium Access
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>You have premium access! Enjoy unlimited streaming.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} className="text-white border-gray-600">
                Cancel
              </Button>
              <Button onClick={handleWatch} className="bg-red-600 hover:bg-red-700">
                <Play className="w-4 h-4 mr-2" />
                Watch Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-flixsy-gray border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Watch "{contentTitle}"</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {credits && credits > 0 ? (
            <>
              <div className="flex items-center gap-2 text-blue-400">
                <Zap className="w-5 h-5" />
                <span>You have {credits} credits remaining today</span>
              </div>
              <p className="text-gray-300">
                Watching this will use 1 credit. You get 5 credits daily that reset at midnight.
              </p>
              <div className="flex justify-between items-center gap-2">
                <Button
                  onClick={purchasePremium}
                  variant="outline"
                  className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Get Premium $3.99
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose} className="text-white border-gray-600">
                    Cancel
                  </Button>
                  <Button onClick={handleWatch} className="bg-red-600 hover:bg-red-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Use 1 Credit
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center py-4">
                <Zap className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">No Credits Remaining</h3>
                <p className="text-gray-300 mb-4">
                  You've used all your daily credits. Get premium for unlimited access!
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={onClose} className="text-white border-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={purchasePremium}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Get Premium $3.99
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditGuard;
