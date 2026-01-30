import React from "react";
import { FaCcVisa, FaCcMastercard, FaBitcoin } from "react-icons/fa";
import { SiCoinbase } from "react-icons/si";

export function GoldPaymentOptions({ onSelect }: { onSelect: (method: string) => void }) {
  return (
    <div className="flex flex-col gap-4 my-6">
      <h3 className="text-lg font-semibold mb-4 text-yellow-800">Choose Payment Method</h3>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6">
        {/* Stripe Card */}
        <button
          className="flex-1 group bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg p-5 flex flex-col items-start justify-between min-h-[120px] border-2 border-transparent hover:border-blue-300 transition relative overflow-hidden"
          onClick={() => onSelect("stripe")}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaCcVisa className="text-white text-3xl drop-shadow" />
            <FaCcMastercard className="text-yellow-200 text-2xl drop-shadow" />
          </div>
          <div className="text-white font-bold text-lg tracking-wide mb-1">Pay with Card</div>
          <div className="text-blue-100 text-xs font-medium opacity-80">Stripe Secure</div>
          <div className="absolute right-4 bottom-4 opacity-20 text-6xl pointer-events-none select-none">💳</div>
        </button>
        {/* Coinbase Card */}
        <button
          className="flex-1 group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-5 flex flex-col items-start justify-between min-h-[120px] border-2 border-transparent hover:border-yellow-400 transition relative overflow-hidden"
          onClick={() => onSelect("coinbase")}
        >
          <div className="flex items-center gap-3 mb-2">
            <FaBitcoin className="text-yellow-400 text-3xl drop-shadow" />
            <SiCoinbase className="text-blue-400 text-2xl drop-shadow" />
          </div>
          <div className="text-yellow-100 font-bold text-lg tracking-wide mb-1">Pay with Crypto</div>
          <div className="text-yellow-300 text-xs font-medium opacity-80">Coinbase Commerce</div>
          <div className="absolute right-4 bottom-4 opacity-10 text-6xl pointer-events-none select-none">₿</div>
        </button>
      </div>
    </div>
  );
}
