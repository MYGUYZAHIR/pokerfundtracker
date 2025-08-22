import { Landmark } from "lucide-react";
import type { Profile } from "@shared/schema";

interface BankCardProps {
  bank: Profile;
}

export function BankCard({ bank }: BankCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatLastUpdated = (timestamp: string) => {
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMs = now.getTime() - updated.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes === 1) return "1 min ago";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  return (
    <div 
      className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-6 border-2 border-yellow-600/50 hover:border-yellow-500/70 transition-all duration-200 group col-span-full mb-6"
      data-testid={`card-bank-${bank.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-yellow-400 mb-1" data-testid={`text-bank-name-${bank.id}`}>
              {bank.name}
            </h3>
            <p className="text-yellow-200/70 text-sm">Central Treasury</p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold text-yellow-400 mb-1" data-testid={`text-bank-funds-${bank.id}`}>
            {formatCurrency(bank.funds)}
          </div>
          <div className="text-yellow-200/70 text-sm">Available Funds</div>
          <div className="text-yellow-200/50 text-xs mt-2">
            Last Updated: <span data-testid={`text-bank-last-updated-${bank.id}`}>{formatLastUpdated(bank.lastUpdated)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-yellow-600/30">
        <div className="flex justify-between items-center">
          <span className="text-yellow-200/70 text-sm">
            Total System Capacity: {formatCurrency(1000000)}
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-yellow-200/70 text-sm">System Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}