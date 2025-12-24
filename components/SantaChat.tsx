
import React, { useState } from 'react';
import { getSantaRecommendation } from '../services/geminiService';

interface SantaChatProps {
  productName: string;
}

const SantaChat: React.FC<SantaChatProps> = ({ productName }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskSanta = async () => {
    setIsLoading(true);
    const rec = await getSantaRecommendation(productName);
    setMessage(rec);
    setIsLoading(false);
  };

  return (
    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-600 rounded-r-lg shadow-inner">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🎅</span>
        <button 
          onClick={handleAskSanta}
          disabled={isLoading}
          className="text-sm font-bold text-green-800 hover:text-green-600 disabled:opacity-50"
        >
          {isLoading ? "Santa is thinking..." : "Ask Santa about this!"}
        </button>
      </div>
      {message && (
        <p className="mt-2 text-sm italic text-green-700 font-medium">"{message}"</p>
      )}
    </div>
  );
};

export default SantaChat;
