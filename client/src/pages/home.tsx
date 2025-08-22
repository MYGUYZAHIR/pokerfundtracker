import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProfiles } from "../hooks/use-profiles";
import { ProfileCard } from "../components/profile-card";
import { StatusBar } from "../components/status-bar";
import { BankCard } from "../components/bank-card";
import { CreditCard, Plus } from "lucide-react";
import type { InsertProfile } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { profiles, bank, isLoading, updateFunds, updateName, createProfile, deleteProfile } = useProfiles();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newPlayerForm, setNewPlayerForm] = useState({
    name: '',
    level: 1,
    funds: 0,
    avatarUrl: ''
  });

  // All logic is now handled by the useProfiles hook

  // Local state for loading states
  const [operationLoading, setOperationLoading] = useState(false);

  const handleUpdateFunds = async (id: string, funds: number) => {
    try {
      setOperationLoading(true);
      await updateFunds(id, funds);
      toast({
        title: "Funds Updated",
        description: "Player funds have been successfully updated.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update player funds.";
      toast({
        title: "Update Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateName = async (id: string, name: string) => {
    try {
      setOperationLoading(true);
      await updateName(id, name);
      toast({
        title: "Name Updated",
        description: "Player name has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update player name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeletePlayer = async (id: string) => {
    if (confirm('Are you sure you want to delete this player? This action cannot be undone.')) {
      try {
        setOperationLoading(true);
        await deleteProfile(id);
        toast({
          title: "Player Deleted",
          description: "Player has been successfully removed. Funds returned to bank.",
        });
      } catch (error) {
        toast({
          title: "Deletion Failed",
          description: "Failed to delete player. Please try again.",
          variant: "destructive",
        });
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleCreatePlayer = async () => {
    if (!newPlayerForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Player name is required.",
        variant: "destructive",
      });
      return;
    }

    if (bank && newPlayerForm.funds > bank.funds) {
      toast({
        title: "Insufficient Bank Funds",
        description: `Bank only has ${bank.funds.toLocaleString()} available. Cannot create player with ${newPlayerForm.funds.toLocaleString()} funds.`,
        variant: "destructive",
      });
      return;
    }
    
    const avatarUrl = newPlayerForm.avatarUrl || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200`;
    
    try {
      setOperationLoading(true);
      await createProfile({
        ...newPlayerForm,
        avatarUrl
      });
      setShowCreateDialog(false);
      setNewPlayerForm({ name: '', level: 1, funds: 0, avatarUrl: '' });
      toast({
        title: "Player Created",
        description: "New player has been successfully created.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create player.";
      toast({
        title: "Creation Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setOperationLoading(false);
    }
  };

  const saveAllChanges = () => {
    toast({
      title: "All Changes Saved",
      description: "All player fund changes have been saved successfully.",
    });
  };

  const totalPlayers = profiles.length;
  const totalFunds = profiles.reduce((sum, profile) => sum + profile.funds, 0);
  const averageFunds = totalPlayers > 0 ? Math.round(totalFunds / totalPlayers) : 0;
  const highestLevel = Math.max(...profiles.map(p => p.level), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-game-dark flex items-center justify-center">
        <div className="text-game-text">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="bg-game-dark font-inter min-h-screen">
      {/* Header */}
      <header className="bg-game-card border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-game-accent rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-game-text">Game Fund Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-game-muted text-sm">
                Total Players: <span className="text-game-accent font-semibold" data-testid="text-total-players">{totalPlayers}</span>
              </span>
              
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                    data-testid="button-create-player"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Player
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-game-card border-slate-700">
                  <DialogHeader>
                    <DialogTitle className="text-game-text">Create New Player</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name" className="text-game-text">Name</Label>
                      <Input
                        id="name"
                        value={newPlayerForm.name}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-game-text focus:border-game-accent"
                        placeholder="Enter player name"
                        data-testid="input-new-player-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="level" className="text-game-text">Level</Label>
                      <Input
                        id="level"
                        type="number"
                        min="1"
                        max="100"
                        value={newPlayerForm.level}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, level: parseInt(e.target.value) || 1 })}
                        className="bg-slate-700 border-slate-600 text-game-text focus:border-game-accent"
                        data-testid="input-new-player-level"
                      />
                    </div>
                    <div>
                      <div>
                        <Label htmlFor="funds" className="text-game-text">Initial Funds</Label>
                        {bank && (
                          <p className="text-yellow-200/70 text-xs mb-2">
                            Available in bank: {bank.funds.toLocaleString()}
                          </p>
                        )}
                        <Input
                          id="funds"
                          type="number"
                          min="0"
                          max={bank?.funds || 999999999}
                          value={newPlayerForm.funds}
                          onChange={(e) => setNewPlayerForm({ ...newPlayerForm, funds: parseInt(e.target.value) || 0 })}
                          className="bg-slate-700 border-slate-600 text-game-text focus:border-game-accent"
                          data-testid="input-new-player-funds"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="avatar" className="text-game-text">Avatar URL (optional)</Label>
                      <Input
                        id="avatar"
                        value={newPlayerForm.avatarUrl}
                        onChange={(e) => setNewPlayerForm({ ...newPlayerForm, avatarUrl: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-game-text focus:border-game-accent"
                        placeholder="https://example.com/avatar.jpg"
                        data-testid="input-new-player-avatar"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setShowCreateDialog(false)}
                        className="border-slate-600 text-game-text hover:bg-slate-700"
                        data-testid="button-cancel-create"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePlayer}
                        disabled={operationLoading}
                        className="bg-game-accent hover:bg-emerald-600 text-white"
                        data-testid="button-confirm-create"
                      >
                        {operationLoading ? 'Creating...' : 'Create Player'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={saveAllChanges}
                className="bg-game-accent hover:bg-emerald-600 text-white font-medium transition-colors"
                data-testid="button-save-all"
              >
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-game-text mb-2">Player Profiles</h2>
          <p className="text-game-muted">Click on any fund amount to edit. Changes are saved automatically.</p>
        </div>

        {/* Bank Profile */}
        {bank && (
          <BankCard bank={bank} />
        )}

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onUpdateFunds={handleUpdateFunds}
              onUpdateName={handleUpdateName}
              onDeleteProfile={handleDeletePlayer}
              isUpdating={operationLoading}
            />
          ))}
        </div>

        {/* Status Bar */}
        <StatusBar
          totalFunds={totalFunds}
          averageFunds={averageFunds}
          highestLevel={highestLevel}
          bankFunds={bank?.funds}
          totalSystemCapacity={bank && totalFunds ? bank.funds + totalFunds : undefined}
        />
      </main>
    </div>
  );
}
