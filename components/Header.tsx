
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700">
      <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-400">
        AI Deforestation Monitor
      </h1>
      <p className="mt-2 text-md md:text-lg text-gray-400">
        Upload satellite imagery to detect and analyze forest loss with AI.
      </p>
    </header>
  );
};
