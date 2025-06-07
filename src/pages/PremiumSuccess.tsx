
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Crown, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useCredits } from '@/contexts/CreditContext';

const PremiumSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const { checkCredits } = useCredits();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      setVerifying(false);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
      });

      if (error) throw error;

      if (data.success) {
        setVerified(true);
        // Refresh credit status
        await checkCredits();
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-flixsy-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flixsy-darker flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-flixsy-gray rounded-lg p-8 text-center border border-gray-700">
        {verified ? (
          <>
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Welcome to Premium!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for your purchase! You now have unlimited access to all movies and TV shows.
            </p>
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <h3 className="text-yellow-400 font-semibold mb-2">Premium Benefits:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Unlimited movies and TV shows</li>
                <li>• No daily credit limits</li>
                <li>• Lifetime access</li>
                <li>• HD quality streaming</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Payment Verification</h1>
            <p className="text-gray-300 mb-6">
              We're having trouble verifying your payment. Please contact support if this issue persists.
            </p>
          </>
        )}
        
        <Button
          onClick={() => navigate('/')}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          Continue to Flixsy
        </Button>
      </div>
    </div>
  );
};

export default PremiumSuccess;
