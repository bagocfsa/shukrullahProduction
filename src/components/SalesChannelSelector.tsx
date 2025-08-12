import React from 'react';
import { BuildingStorefrontIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { usePricing } from '../context/PricingContext';

const SalesChannelSelector: React.FC = () => {
  const { salesChannel, setSalesChannel } = usePricing();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 hidden sm:block">View prices for:</span>
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSalesChannel('online')}
          className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            salesChannel === 'online'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ComputerDesktopIcon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Online</span>
        </button>
        <button
          onClick={() => setSalesChannel('physical_shop')}
          className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            salesChannel === 'physical_shop'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Shop</span>
        </button>
      </div>
    </div>
  );
};

export default SalesChannelSelector;
