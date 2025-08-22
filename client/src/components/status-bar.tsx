import { useState } from "react";

interface StatusBarProps {
  totalFunds: number;
  averageFunds: number;
  highestLevel: number;
  bankFunds?: number;
  totalSystemCapacity?: number;
}

export function StatusBar({ totalFunds, averageFunds, highestLevel, bankFunds, totalSystemCapacity }: StatusBarProps) {
  const [autoSave, setAutoSave] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-game-card rounded-xl p-6 border border-slate-700" data-testid="status-bar">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-game-accent" data-testid="text-total-player-funds">
              {formatCurrency(totalFunds)}
            </div>
            <div className="text-game-muted text-sm">Player Funds</div>
          </div>
          {bankFunds !== undefined && (
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400" data-testid="text-bank-funds">
                {formatCurrency(bankFunds)}
              </div>
              <div className="text-game-muted text-sm">Bank Reserve</div>
            </div>
          )}
          {totalSystemCapacity && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400" data-testid="text-system-capacity">
                {formatCurrency(totalSystemCapacity)}
              </div>
              <div className="text-game-muted text-sm">System Capacity</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl font-bold text-game-text" data-testid="text-average-funds">
              {formatCurrency(averageFunds)}
            </div>
            <div className="text-game-muted text-sm">Avg Player Funds</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400" data-testid="text-highest-level">
              Level {highestLevel}
            </div>
            <div className="text-game-muted text-sm">Highest Level</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              className="sr-only"
              data-testid="toggle-auto-save"
            />
            <div className="relative">
              <div className="w-11 h-6 bg-slate-600 rounded-full shadow-inner"></div>
              <div 
                className={`absolute inset-y-0 left-0 w-6 h-6 bg-game-accent rounded-full shadow transform transition-transform ${
                  autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              ></div>
            </div>
            <span className="text-game-text text-sm">Auto-save</span>
          </label>
          
          <div className="h-6 w-px bg-slate-600"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-game-muted text-sm" data-testid="text-save-status">All changes saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}
