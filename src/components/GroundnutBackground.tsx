import React from 'react';

interface GroundnutBackgroundProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'dark';
  pattern?: 'subtle' | 'prominent' | 'minimal';
}

const GroundnutBackground: React.FC<GroundnutBackgroundProps> = ({ 
  children, 
  variant = 'light',
  pattern = 'subtle'
}) => {
  const getBackgroundClasses = () => {
    const baseClasses = "min-h-screen relative overflow-hidden";
    
    switch (variant) {
      case 'light':
        return `${baseClasses} bg-gradient-to-br from-primary-50 via-groundnut-50 to-oil-50`;
      case 'medium':
        return `${baseClasses} bg-gradient-to-br from-primary-100 via-groundnut-100 to-oil-100`;
      case 'dark':
        return `${baseClasses} bg-gradient-to-br from-groundnut-800 via-earth-800 to-primary-900`;
      default:
        return `${baseClasses} bg-gradient-to-br from-primary-50 via-groundnut-50 to-oil-50`;
    }
  };

  const getPatternOpacity = () => {
    switch (pattern) {
      case 'subtle':
        return 'opacity-5';
      case 'prominent':
        return 'opacity-10';
      case 'minimal':
        return 'opacity-3';
      default:
        return 'opacity-5';
    }
  };

  return (
    <div className={getBackgroundClasses()}>
      {/* Groundnut Pattern Background */}
      <div className={`absolute inset-0 ${getPatternOpacity()}`}>
        <svg
          className="w-full h-full"
          viewBox="0 0 400 400"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="groundnut-pattern"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Groundnut shapes */}
              <ellipse cx="20" cy="20" rx="8" ry="12" fill="currentColor" className="text-groundnut-600" transform="rotate(15 20 20)" />
              <ellipse cx="60" cy="40" rx="6" ry="10" fill="currentColor" className="text-oil-600" transform="rotate(-20 60 40)" />
              <ellipse cx="40" cy="60" rx="7" ry="11" fill="currentColor" className="text-groundnut-500" transform="rotate(45 40 60)" />
              <ellipse cx="15" cy="65" rx="5" ry="8" fill="currentColor" className="text-oil-500" transform="rotate(-10 15 65)" />
              <ellipse cx="65" cy="15" rx="6" ry="9" fill="currentColor" className="text-groundnut-700" transform="rotate(30 65 15)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#groundnut-pattern)" />
        </svg>
      </div>

      {/* Floating Oil Drops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-oil-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-primary-500 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-4 h-4 bg-groundnut-400 rounded-full opacity-15 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-oil-500 rounded-full opacity-25 animate-pulse delay-3000"></div>
        <div className="absolute top-1/3 left-1/2 w-3 h-3 bg-primary-400 rounded-full opacity-20 animate-pulse delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GroundnutBackground;
