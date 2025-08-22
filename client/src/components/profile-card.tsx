import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Edit3, Check, X } from "lucide-react";
import type { Profile } from "@shared/schema";

interface ProfileCardProps {
  profile: Profile;
  onUpdateFunds: (id: string, funds: number) => void;
  onUpdateName: (id: string, name: string) => void;
  onDeleteProfile: (id: string) => void;
  isUpdating: boolean;
}

export function ProfileCard({ profile, onUpdateFunds, onUpdateName, onDeleteProfile, isUpdating }: ProfileCardProps) {
  const [funds, setFunds] = useState(profile.funds.toString());
  const [name, setName] = useState(profile.name);
  const [isEditingFunds, setIsEditingFunds] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);

  useEffect(() => {
    setFunds(profile.funds.toString());
    setName(profile.name);
  }, [profile.funds, profile.name]);

  const handleFundsChange = (value: string) => {
    setFunds(value);
  };

  const handleFundsBlur = () => {
    setIsEditingFunds(false);
    const numericValue = parseInt(funds) || 0;
    if (numericValue !== profile.funds && numericValue >= 0) {
      onUpdateFunds(profile.id, numericValue);
    } else {
      setFunds(profile.funds.toString());
    }
  };

  const handleNameBlur = () => {
    setIsEditingName(false);
    const trimmedName = name.trim();
    if (trimmedName && trimmedName !== profile.name) {
      onUpdateName(profile.id, trimmedName);
    } else {
      setName(profile.name);
    }
  };

  const handleFundsKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFundsBlur();
    } else if (e.key === 'Escape') {
      setFunds(profile.funds.toString());
      setIsEditingFunds(false);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setName(profile.name);
      setIsEditingName(false);
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
        <div className="flex items-center justify-center gap-2 mb-1">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                onKeyDown={handleNameKeyDown}
                className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-game-text text-center font-semibold text-lg w-40 focus:border-game-accent"
                disabled={isUpdating}
                data-testid={`input-name-${profile.id}`}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleNameBlur}
                className="p-1 h-6 w-6 text-game-accent hover:text-white"
                data-testid={`button-save-name-${profile.id}`}
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setName(profile.name);
                  setIsEditingName(false);
                }}
                className="p-1 h-6 w-6 text-red-400 hover:text-red-300"
                data-testid={`button-cancel-name-${profile.id}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-game-text font-semibold text-lg" data-testid={`text-name-${profile.id}`}>
                {profile.name}
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditingName(true)}
                className="p-1 h-6 w-6 text-game-muted hover:text-game-accent"
                data-testid={`button-edit-name-${profile.id}`}
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
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
              onFocus={() => setIsEditingFunds(true)}
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
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="text-game-muted">Last Updated:</span>
          <span className="text-game-text" data-testid={`text-last-updated-${profile.id}`}>
            {formatLastUpdated(profile.lastUpdated)}
          </span>
        </div>
        <div className="pt-3 border-t border-slate-700">
          <Button
            onClick={() => onDeleteProfile(profile.id)}
            variant="outline"
            size="sm"
            className="w-full bg-red-900/20 border-red-600/50 text-red-400 hover:bg-red-900/40 hover:border-red-500 hover:text-red-300 transition-colors"
            disabled={isUpdating}
            data-testid={`button-delete-${profile.id}`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Player
          </Button>
        </div>
      </div>
    </div>
  );
}
