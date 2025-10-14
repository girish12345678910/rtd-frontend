import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Plus, Users, Clock, CheckCircle } from 'lucide-react';
import { CreateTeamModal } from '@/components/modals/CreateTeamModal';
import { teamApi } from '@/lib/api';

interface Team {
  id: string;
  name: string;
  description?: string;
  members: any[];
  sessions: any[];
  userRole: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teams from API
  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      const response = await teamApi.getAll();
      setTeams(response.data.teams || []);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (name: string, description: string) => {
    try {
      await teamApi.create({ name, description });
      await loadTeams(); // Reload teams
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create team:', error);
      alert('Failed to create team. Please try again.');
    }
  };

  const activeSessions = teams.reduce((sum, team) => sum + team.sessions.length, 0);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your teams and decision sessions
              </p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus size={18} className="mr-2" />
              Create Team
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Teams</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teams.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary-600" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeSessions}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning-500" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between py-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Role</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {teams.filter((t) => t.userRole === 'ADMIN').length} Admin
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success-500" />
              </CardContent>
            </Card>
          </div>

          {/* Teams List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Your Teams
            </h2>
            {loading ? (
              <p className="text-gray-600 dark:text-gray-400">Loading teams...</p>
            ) : teams.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No teams yet</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus size={18} className="mr-2" />
                    Create Your First Team
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} onClick={() => navigate(`/team/${team.id}`)}>
                    <CardHeader>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>
                        {team.members.length} members • {team.userRole}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-warning-600 dark:text-warning-500">
                          <Clock size={16} className="mr-1" />
                          <span>{team.sessions.length} sessions</span>
                        </div>
                        <div className="text-gray-600 dark:text-gray-400">
                          {team.description || 'No description'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Create Team Modal */}
          <CreateTeamModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTeam}
          />
        </div>
      </SignedIn>
    </>
  );
}
