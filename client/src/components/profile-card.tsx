import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
  onUpdateFunds: (id: string, funds: number) => void;
  isUpdating: boolean;
}

export function ProfileCard({ profile, onUpdateFunds, isUpdating }: ProfileCardProps) {
  const [funds, setFunds] = useState(profile.funds.toString());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setFunds(profile.funds.toString());
  }, [profile.funds]);

  const handleFundsChange = (value: string) => {
    setFunds(value);
  };

  const handleFundsBlur = () => {
    setIsEditing(false);
    const numericValue = parseInt(funds) || 0;
    if (numericValue !== profile.funds && numericValue >= 0) {
      onUpdateFunds(profile.id, numericValue);
    } else {
      setFunds(profile.funds.toString());
    }
  };

  const handleFundsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFundsBlur();
    } else if (e.key === 'Escape') {
      setFunds(profile.funds.toString());
      setIsEditing(false);
    }
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
      className="bg-game-card rounded-xl p-6 border border-slate-700 hover:border-game-accent/50 transition-all duration-200 group"
      data-testid={`card-profile-${profile.id}`}
    >
      {/* Player Avatar */}
      <img 
        src={profile.avatarUrl}
        alt={`${profile.name} Avatar`}
        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-slate-600 group-hover:border-game-accent/50 transition-colors"
        data-testid={`img-avatar-${profile.id}`}
      />
      
      <div className="text-center mb-4">
        <h3 className="text-game-text font-semibold text-lg" data-testid={`text-name-${profile.id}`}>
          {profile.name}
        </h3>
        <span className="text-game-muted text-sm" data-testid={`text-level-${profile.id}`}>
          Level {profile.level}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-game-muted text-sm">Current Funds:</span>
          <div className="relative">
            <Input
              type="number"
              value={funds}
              onChange={(e) => handleFundsChange(e.target.value)}
              onFocus={() => setIsEditing(true)}
              onBlur={handleFundsBlur}
              onKeyDown={handleFundsKeyDown}
              min="0"
              max="999999999"
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-game-text text-right font-mono focus:border-game-accent focus:ring-1 focus:ring-game-accent outline-none w-32 transition-colors pl-6"
              disabled={isUpdating}
              data-testid={`input-funds-${profile.id}`}
            />
            <span className="absolute left-2 top-2 text-game-accent text-sm">$</span>
            {isUpdating && (
              <div className="absolute right-2 top-2">
                <div className="w-3 h-3 border border-game-accent border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-game-muted">Last Updated:</span>
          <span className="text-game-text" data-testid={`text-last-updated-${profile.id}`}>
            {formatLastUpdated(profile.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}
