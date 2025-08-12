import React, { createContext, useContext, useState } from 'react';

type SalesChannel = 'online' | 'physical_shop';

interface PricingContextType {
  salesChannel: SalesChannel;
  setSalesChannel: (channel: SalesChannel) => void;
  getProductPrice: (onlinePrice: number, physicalShopPrice?: number) => number;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export const PricingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [salesChannel, setSalesChannel] = useState<SalesChannel>('online');

  const getProductPrice = (onlinePrice: number, physicalShopPrice?: number): number => {
    if (salesChannel === 'physical_shop' && physicalShopPrice !== undefined) {
      return physicalShopPrice;
    }
    return onlinePrice;
  };

  const value: PricingContextType = {
    salesChannel,
    setSalesChannel,
    getProductPrice,
  };

  return (
    <PricingContext.Provider value={value}>
      {children}
    </PricingContext.Provider>
  );
};

export const usePricing = (): PricingContextType => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error('usePricing must be used within a PricingProvider');
  }
  return context;
};
