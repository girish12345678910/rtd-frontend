import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { CreateSessionModal } from '@/components/modals/CreateSessionModal';
import { AddMemberModal } from '@/components/modals/AddMemberModal';

import {
  ArrowLeft,
  Plus,
  Users,
  Settings,
  Crown,
  Shield,
  User,
  Eye,
  MoreVertical,
  MessageSquare,
} from 'lucide-react';
import { teamApi, sessionApi } from '@/lib/api';
import { formatDate } from '@/lib/utils';

interface TeamMember {
  id: string;
  role: string;
  voteWeight: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface Team {
  id: string;
  name: string;
  description: string | null;
  members: TeamMember[];
  sessions: any[];
  settings: any;
}

export function Team() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);

  // Load team data
  useEffect(() => {
    if (teamId) {
      loadTeam();
    }
  }, [teamId]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      const response = await teamApi.getOne(teamId!);
      setTeam(response.data.team);
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle session creation
  const handleCreateSession = async (title: string, description: string) => {
    try {
      await sessionApi.create({
        teamId: teamId!,
        title,
        description,
      });
      await loadTeam(); // Reload team data to show new session
      setShowCreateSession(false);
    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session. Please try again.');
    }
  };
  const handleAddMember = async (email: string, role: string) => {
  try {
    await teamApi.addMember(teamId!, { email, role });
    await loadTeam(); // Reload to show new member
    setShowAddMember(false);
  } catch (error) {
    console.error('Failed to add member:', error);
    alert('Failed to add member. Make sure the user exists with that email.');
  }
};


  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown size={16} className="text-yellow-500" />;
      case 'MODERATOR':
        return <Shield size={16} className="text-blue-500" />;
      case 'MEMBER':
        return <User size={16} className="text-gray-500" />;
      case 'GUEST':
        return <Eye size={16} className="text-gray-400" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'MODERATOR':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'MEMBER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'GUEST':
        return 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <>
        <SignedOut><RedirectToSignIn /></SignedOut>
        <SignedIn>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading team...</p>
          </div>
        </SignedIn>
      </>
    );
  }

  if (!team) {
    return (
      <>
        <SignedOut><RedirectToSignIn /></SignedOut>
        <SignedIn>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team not found</h2>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Back to Dashboard
            </Button>
          </div>
        </SignedIn>
      </>
    );
  }

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{team.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{team.description || 'No description'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {team.members.length} members
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {team.sessions.length} sessions
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {team.members.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</p>
                  <p className="text-2xl font-bold text-warning-600 mt-1">
                    {team.sessions.filter((s) => s.status === 'ACTIVE').length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {team.sessions.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Settings</p>
                  <p className="text-sm text-green-600 mt-1">
                    {team.settings?.allowWeightedVotes ? 'Weighted Voting' : 'Simple Voting'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Sessions */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sessions</h2>
                  <Button size="sm" onClick={() => setShowCreateSession(true)}>
                    <Plus size={16} className="mr-2" />
                    New Session
                  </Button>
                </div>

                {team.sessions.length > 0 ? (
                  <div className="space-y-3">
                    {team.sessions.map((session) => (
                      <Card key={session.id} onClick={() => navigate(`/session/${session.id}`)}>
                        <CardHeader>
                          <CardTitle className="text-base">{session.title}</CardTitle>
                          <CardDescription>{session.description || 'No description'}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-600 dark:text-gray-400 mb-4">No sessions yet</p>
                      <Button size="sm" onClick={() => setShowCreateSession(true)}>
                        <Plus size={16} className="mr-2" />
                        Create First Session
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Members */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Members</h2>
                  <Button size="sm" variant="secondary" onClick={() => setShowAddMember(true)}>
                    <Plus size={16} className="mr-2" />
                    Add
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {team.members.map((member) => (
                        <div key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {member.user.avatarUrl ? (
                                <img
                                  src={member.user.avatarUrl}
                                  alt={member.user.name || 'User'}
                                  className="w-10 h-10 rounded-full"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                                  {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {member.user.name || 'User'}
                                  </p>
                                  {getRoleIcon(member.role)}
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {member.user.email}
                                </p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>

                          {/* Vote Weight Indicator */}
                          {member.voteWeight !== 1.0 && (
                            <div className="mt-2 flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div
                                  className="bg-primary-600 h-1.5 rounded-full"
                                  style={{ width: `${(member.voteWeight / 2) * 100}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {member.voteWeight}x weight
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Create Session Modal */}
          <CreateSessionModal
            isOpen={showCreateSession}
            onClose={() => setShowCreateSession(false)}
            onSubmit={handleCreateSession}
          />

          {/* Add Member Modal */}
<AddMemberModal
  isOpen={showAddMember}
  onClose={() => setShowAddMember(false)}
  onSubmit={handleAddMember}
/>

        </div>
        
      </SignedIn>
    </>
  );
}
