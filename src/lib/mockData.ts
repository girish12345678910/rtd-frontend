export interface Notification {
  id: string;
  type: 'vote' | 'message' | 'invite' | 'mention';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  sessions: Session[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'GUEST';
  avatar: string;
  voteWeight: number;
}

export interface Session {
  id: string;
  teamId: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'CLOSED' | 'ARCHIVED';
  topics: Topic[];
  messages: Message[];
  startedAt: Date;
  endedAt?: Date;
}

export interface Topic {
  id: string;
  sessionId: string;
  title: string;
  description: string;
  status: 'OPEN' | 'CLOSED';
  votes: Vote[];
  createdAt: Date;
  closedAt?: Date;
}

export interface Vote {
  id: string;
  topicId: string;
  userId: string;
  choice: 'YES' | 'NO' | 'ABSTAIN';
  weight: number;
  castedAt: Date;
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'CHAT' | 'SYSTEM' | 'NOTIFICATION';
  sentAt: Date;
}

// Mock Users
export const mockUsers: TeamMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    voteWeight: 1.5,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'MODERATOR',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    voteWeight: 1.2,
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'MEMBER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    voteWeight: 1.0,
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'MEMBER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    voteWeight: 1.0,
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: '1',
    sessionId: 'session-1',
    userId: '1',
    userName: 'Alice Johnson',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    content: 'Welcome to the Q4 planning session!',
    type: 'CHAT',
    sentAt: new Date('2025-10-13T09:00:00'),
  },
  {
    id: '2',
    sessionId: 'session-1',
    userId: '2',
    userName: 'Bob Smith',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    content: 'Thanks! Ready to discuss our priorities.',
    type: 'CHAT',
    sentAt: new Date('2025-10-13T09:02:00'),
  },
  {
    id: '3',
    sessionId: 'session-1',
    userId: '3',
    userName: 'Charlie Brown',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    content: 'I think we should focus on the mobile app redesign',
    type: 'CHAT',
    sentAt: new Date('2025-10-13T09:05:00'),
  },
];

// Mock Topics with Votes
export const mockTopics: Topic[] = [
  {
    id: 'topic-1',
    sessionId: 'session-1',
    title: 'Should we prioritize mobile app redesign?',
    description: 'Discuss whether the mobile app redesign should be our top priority for Q4',
    status: 'OPEN',
    votes: [
      {
        id: 'vote-1',
        topicId: 'topic-1',
        userId: '1',
        choice: 'YES',
        weight: 1.5,
        castedAt: new Date('2025-10-13T09:10:00'),
      },
      {
        id: 'vote-2',
        topicId: 'topic-1',
        userId: '2',
        choice: 'YES',
        weight: 1.2,
        castedAt: new Date('2025-10-13T09:11:00'),
      },
      {
        id: 'vote-3',
        topicId: 'topic-1',
        userId: '3',
        choice: 'NO',
        weight: 1.0,
        castedAt: new Date('2025-10-13T09:12:00'),
      },
    ],
    createdAt: new Date('2025-10-13T09:08:00'),
  },
  {
    id: 'topic-2',
    sessionId: 'session-1',
    title: 'Increase marketing budget by 20%?',
    description: 'Vote on whether to allocate additional funds to marketing',
    status: 'OPEN',
    votes: [
      {
        id: 'vote-4',
        topicId: 'topic-2',
        userId: '1',
        choice: 'NO',
        weight: 1.5,
        castedAt: new Date('2025-10-13T09:20:00'),
      },
      {
        id: 'vote-5',
        topicId: 'topic-2',
        userId: '4',
        choice: 'YES',
        weight: 1.0,
        castedAt: new Date('2025-10-13T09:21:00'),
      },
    ],
    createdAt: new Date('2025-10-13T09:18:00'),
  },
];

// Mock Sessions
export const mockSessions: Session[] = [
  {
    id: 'session-1',
    teamId: 'team-1',
    title: 'Q4 Planning Session',
    description: 'Quarterly planning and priority setting',
    status: 'ACTIVE',
    topics: mockTopics,
    messages: mockMessages,
    startedAt: new Date('2025-10-13T09:00:00'),
  },
];

// Mock Teams
export const mockTeams: Team[] = [
  {
    id: 'team-1',
    name: 'Product Team',
    description: 'Product development and strategy',
    members: mockUsers,
    sessions: mockSessions,
  },
  {
    id: 'team-2',
    name: 'Engineering',
    description: 'Engineering and technical decisions',
    members: mockUsers.slice(0, 3),
    sessions: [],
  },
];


export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'vote',
    title: 'New vote on Q4 Planning',
    message: 'Bob Smith voted "Yes" on mobile app redesign',
    timestamp: new Date('2025-10-14T09:30:00'),
    read: false,
    link: '/session/session-1',
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New message in Product Team',
    message: 'Charlie: I think we should focus on the mobile app',
    timestamp: new Date('2025-10-14T09:15:00'),
    read: false,
    link: '/session/session-1',
  },
  {
    id: 'notif-3',
    type: 'invite',
    title: 'Team invitation',
    message: 'You were added to Engineering team',
    timestamp: new Date('2025-10-13T16:20:00'),
    read: true,
    link: '/team/team-2',
  },
  {
    id: 'notif-4',
    type: 'mention',
    title: 'You were mentioned',
    message: 'Alice mentioned you in Q4 Planning session',
    timestamp: new Date('2025-10-13T14:10:00'),
    read: true,
    link: '/session/session-1',
  },
];