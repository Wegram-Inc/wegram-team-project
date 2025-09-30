import { useState, useEffect } from 'react';

interface TrialStatus {
  isTrialMode: boolean;
  daysRemaining: number;
  isActivated: boolean;
  activationDate: string | null;
}

export const useTrialMode = () => {
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isTrialMode: true,
    daysRemaining: 15,
    isActivated: false,
    activationDate: null
  });

  useEffect(() => {
    // Check if product key is activated
    const isActivated = localStorage.getItem('wegram_activated') === 'true';
    const activationDate = localStorage.getItem('wegram_activation_date');
    const trialStartDate = localStorage.getItem('wegram_trial_start');

    if (isActivated) {
      setTrialStatus({
        isTrialMode: false,
        daysRemaining: 0,
        isActivated: true,
        activationDate: activationDate || new Date().toISOString()
      });
    } else {
      // Initialize trial start date if not set
      if (!trialStartDate) {
        localStorage.setItem('wegram_trial_start', new Date().toISOString());
      }

      // Calculate days remaining
      const startDate = new Date(trialStartDate || new Date().toISOString());
      const currentDate = new Date();
      const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const daysRemaining = Math.max(0, 15 - daysPassed);

      setTrialStatus({
        isTrialMode: daysRemaining > 0,
        daysRemaining,
        isActivated: false,
        activationDate: null
      });
    }
  }, []);

  const activateProduct = (productKey: string) => {
    localStorage.setItem('wegram_product_key', productKey);
    localStorage.setItem('wegram_activated', 'true');
    localStorage.setItem('wegram_activation_date', new Date().toISOString());
    
    setTrialStatus({
      isTrialMode: false,
      daysRemaining: 0,
      isActivated: true,
      activationDate: new Date().toISOString()
    });
  };

  const resetTrial = () => {
    localStorage.removeItem('wegram_product_key');
    localStorage.removeItem('wegram_activated');
    localStorage.removeItem('wegram_activation_date');
    localStorage.removeItem('wegram_trial_start');
    
    setTrialStatus({
      isTrialMode: true,
      daysRemaining: 15,
      isActivated: false,
      activationDate: null
    });
  };

  return {
    ...trialStatus,
    activateProduct,
    resetTrial
  };
};
