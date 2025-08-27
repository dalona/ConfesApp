import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 flex items-center justify-center">
      <div className="text-center">
        <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-purple-600 mx-auto mb-4`}></div>
        <div className="text-xl text-purple-600 dark:text-purple-300">{text}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;