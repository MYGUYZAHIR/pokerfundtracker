import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ProfileCard } from "@/components/profile-card";
import { StatusBar } from "@/components/status-bar";
import { CreditCard } from "lucide-react";
import type { Profile } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const updateFundsMutation = useMutation({
    mutationFn: async ({ id, funds }: { id: string; funds: number }) => {
      const response = await apiRequest("PATCH", `/api/profiles/${id}/funds`, { funds });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profiles"] });
      toast({
        title: "Funds Updated",
        description: "Player funds have been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update player funds. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateFunds = (id: string, funds: number) => {
    updateFundsMutation.mutate({ id, funds });
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

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onUpdateFunds={handleUpdateFunds}
              isUpdating={updateFundsMutation.isPending}
            />
          ))}
        </div>

        {/* Status Bar */}
        <StatusBar
          totalFunds={totalFunds}
          averageFunds={averageFunds}
          highestLevel={highestLevel}
        />
      </main>
    </div>
  );
}
