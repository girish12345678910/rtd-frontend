import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { ArrowLeft, ThumbsUp, ThumbsDown, MinusCircle, Send, Users, Plus } from 'lucide-react';
import { sessionApi, voteApi } from '@/lib/api';
import { formatTime } from '@/lib/utils';
import { CreateTopicModal } from '@/components/modals/CreateTopicModal';
import { useSocket } from '@/contexts/SocketContext';

interface Session {
  id: string;
  title: string;
  description: string | null;
  status: string;
  team: {
    id: string;
    name: string;
    members: any[];
  };
  topics: Topic[];
  messages: Message[];
}

interface Topic {
  id: string;
  title: string;
  description: string | null;
  status: string;
  votes: Vote[];
}

interface Vote {
  id: string;
  choice: 'YES' | 'NO' | 'ABSTAIN';
  weight: number;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Message {
  id: string;
  content: string;
  type: string;
  sentAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export function Session() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { socket, isConnected } = useSocket();
  
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [localVotes, setLocalVotes] = useState<Record<string, 'YES' | 'NO' | 'ABSTAIN' | null>>({});
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ userId: string; userName: string }>>([]);

  // Load session data
  useEffect(() => {
    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const response = await sessionApi.getOne(sessionId!);
      setSession(response.data.session);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Socket.io real-time listeners
  useEffect(() => {
    if (!socket || !sessionId || !user) return;

    const userName = user.fullName || user.primaryEmailAddress?.emailAddress || 'User';
    const userId = user.id;

    // Join session room with user info
    socket.emit('join-session', { sessionId, userId, userName });

    // Listen for online users updates
    socket.on('users-updated', (users: Array<{ userId: string; userName: string }>) => {
      console.log('Online users:', users);
      setOnlineUsers(users);
    });

    // Listen for new votes - Update state instead of reload
    socket.on('vote-cast', (data: any) => {
      console.log('Vote cast:', data);
      setSession((prev) => {
        if (!prev) return prev;
        
        return {
          ...prev,
          topics: prev.topics.map((topic) => {
            if (topic.id === data.topicId) {
              // Check if vote already exists
              const existingVoteIndex = topic.votes.findIndex(
                (v) => v.user.id === data.vote.user.id
              );
              
              let updatedVotes;
              if (existingVoteIndex >= 0) {
                // Update existing vote
                updatedVotes = [...topic.votes];
                updatedVotes[existingVoteIndex] = data.vote;
              } else {
                // Add new vote
                updatedVotes = [...topic.votes, data.vote];
              }
              
              return {
                ...topic,
                votes: updatedVotes,
              };
            }
            return topic;
          }),
        };
      });
    });

    // Listen for retracted votes
    socket.on('vote-retracted', (data: any) => {
      console.log('Vote retracted:', data);
      setSession((prev) => {
        if (!prev) return prev;
        
        return {
          ...prev,
          topics: prev.topics.map((topic) => {
            if (topic.id === data.topicId) {
              return {
                ...topic,
                votes: topic.votes.filter((v) => v.user.id !== data.userId),
              };
            }
            return topic;
          }),
        };
      });
    });

    // Listen for new messages
    socket.on('new-message', (message: any) => {
      console.log('New message:', message);
      setSession((prev) => {
        if (!prev) return prev;
        
        // Check if message already exists (prevent duplicates)
        const messageExists = prev.messages.some((m) => m.id === message.id);
        if (messageExists) return prev;
        
        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
      
      // Scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.querySelector('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
    });

    // Cleanup
    return () => {
      socket.emit('leave-session', sessionId);
      socket.off('users-updated');
      socket.off('vote-cast');
      socket.off('vote-retracted');
      socket.off('new-message');
    };
  }, [socket, sessionId, user]);

  const handleVote = async (topicId: string, choice: 'YES' | 'NO' | 'ABSTAIN') => {
    try {
      const currentVote = localVotes[topicId];
      
      if (currentVote === choice) {
        // Retract vote if clicking same choice
        await voteApi.retract(topicId);
        setLocalVotes((prev) => ({ ...prev, [topicId]: null }));
      } else {
        // Cast new vote
        await voteApi.cast({ topicId, choice });
        setLocalVotes((prev) => ({ ...prev, [topicId]: choice }));
      }
      
      // DON'T reload - Socket.io will update automatically
    } catch (error) {
      console.error('Failed to vote:', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  const handleCreateTopic = async (title: string, description: string) => {
    try {
      await sessionApi.createTopic({
        sessionId: sessionId!,
        title,
        description,
      });
      await loadSession(); // Reload to show new topic
      setShowCreateTopic(false);
    } catch (error) {
      console.error('Failed to create topic:', error);
      alert('Failed to create topic. Please try again.');
    }
  };

  const getVoteResults = (topic: Topic) => {
    const yes = topic.votes.filter((v) => v.choice === 'YES').reduce((sum, v) => sum + v.weight, 0);
    const no = topic.votes.filter((v) => v.choice === 'NO').reduce((sum, v) => sum + v.weight, 0);
    const abstain = topic.votes
      .filter((v) => v.choice === 'ABSTAIN')
      .reduce((sum, v) => sum + v.weight, 0);
    const total = yes + no + abstain;

    return { yes, no, abstain, total };
  };

  const sendMessage = async () => {
    if (newMessage.trim() && sessionId) {
      try {
        await sessionApi.sendMessage({ sessionId, content: newMessage });
        setNewMessage('');
        // DON'T reload - Socket.io will add message automatically
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  if (loading) {
    return (
      <>
        <SignedOut><RedirectToSignIn /></SignedOut>
        <SignedIn>
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading session...</p>
          </div>
        </SignedIn>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <SignedOut><RedirectToSignIn /></SignedOut>
        <SignedIn>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Session not found</h2>
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
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/team/${session.team.id}`)}
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {session.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {session.description || 'No description'}
                </p>
              </div>
            </div>
            
            {/* Online Users Indicator */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* Online indicator */}
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  <div className="relative flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {onlineUsers.length} online
                  </span>
                </div>
                
                {/* User avatars */}
                <div className="flex -space-x-2">
                  {onlineUsers.slice(0, 5).map((onlineUser, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full bg-primary-600 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                      title={onlineUser.userName}
                    >
                      {onlineUser.userName.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {onlineUsers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                      +{onlineUsers.length - 5}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Topics & Voting (Left 2/3) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {session.topics.length > 0 ? 'Active Topics' : 'No Topics Yet'}
                </h2>
                <Button size="sm" onClick={() => setShowCreateTopic(true)}>
                  <Plus size={16} className="mr-2" />
                  Add Topic
                </Button>
              </div>
              
              {session.topics.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No topics to vote on yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Click "Add Topic" to create a new voting topic
                    </p>
                  </CardContent>
                </Card>
              ) : (
                session.topics.map((topic) => {
                  const results = getVoteResults(topic);
                  const userVote = localVotes[topic.id];

                  return (
                    <Card key={topic.id}>
                      <CardHeader>
                        <CardTitle>{topic.title}</CardTitle>
                        <CardDescription>{topic.description || 'No description'}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Vote Buttons */}
                        <div className="flex items-center space-x-3">
                          <Button
                            variant={userVote === 'YES' ? 'success' : 'secondary'}
                            size="sm"
                            onClick={() => handleVote(topic.id, 'YES')}
                          >
                            <ThumbsUp size={16} className="mr-2" />
                            Yes
                          </Button>
                          <Button
                            variant={userVote === 'NO' ? 'danger' : 'secondary'}
                            size="sm"
                            onClick={() => handleVote(topic.id, 'NO')}
                          >
                            <ThumbsDown size={16} className="mr-2" />
                            No
                          </Button>
                          <Button
                            variant={userVote === 'ABSTAIN' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => handleVote(topic.id, 'ABSTAIN')}
                          >
                            <MinusCircle size={16} className="mr-2" />
                            Abstain
                          </Button>
                        </div>

                        {/* Results Bar Chart */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Results</span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {topic.votes.length} votes
                            </span>
                          </div>

                          {/* Yes Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-success-600 font-medium">Yes</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {results.total > 0
                                  ? ((results.yes / results.total) * 100).toFixed(0)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-success-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    results.total > 0 ? (results.yes / results.total) * 100 : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* No Bar */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-danger-600 font-medium">No</span>
                              <span className="text-gray-600 dark:text-gray-400">
                                {results.total > 0
                                  ? ((results.no / results.total) * 100).toFixed(0)
                                  : 0}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-danger-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    results.total > 0 ? (results.no / results.total) * 100 : 0
                                  }%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Abstain Bar */}
                          {results.abstain > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600 dark:text-gray-400 font-medium">
                                  Abstain
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {results.total > 0
                                    ? ((results.abstain / results.total) * 100).toFixed(0)
                                    : 0}
                                  %
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: `${
                                      results.total > 0 ? (results.abstain / results.total) * 100 : 0
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {/* Chat Panel (Right 1/3) */}
            <div className="lg:col-span-1">
              <Card className="flex flex-col" style={{ height: '600px' }}>
                <CardHeader className="flex-shrink-0">
                  <CardTitle>Team Chat</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                  {/* Messages Container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {session.messages.map((message) => (
                      <div key={message.id} className="flex space-x-3">
                        {message.user.avatarUrl ? (
                          <img
                            src={message.user.avatarUrl}
                            alt={message.user.name || 'User'}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(message.user.name || message.user.email).charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {message.user.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {formatTime(new Date(message.sentAt))}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <Button onClick={sendMessage} size="sm">
                        <Send size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Topic Modal */}
          <CreateTopicModal
            isOpen={showCreateTopic}
            onClose={() => setShowCreateTopic(false)}
            onSubmit={handleCreateTopic}
          />
        </div>
      </SignedIn>
    </>
  );
}
