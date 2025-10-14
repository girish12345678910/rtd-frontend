import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { MessageSquare, BarChart3, Users, Zap } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6 text-primary-600" />,
      title: 'Real-Time Chat',
      description: 'Discuss decisions with your team in real-time',
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary-600" />,
      title: 'Live Voting',
      description: 'Vote and see results update instantly',
    },
    {
      icon: <Users className="w-6 h-6 text-primary-600" />,
      title: 'Team Collaboration',
      description: 'Invite members and assign roles',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary-600" />,
      title: 'AI Summaries',
      description: 'Generate meeting summaries automatically',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Make Better Decisions,
          <span className="text-primary-600"> Together</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Real-time collaboration platform for distributed teams to discuss, vote, and decide
          on important topics with live data visualization.
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Button size="lg" onClick={() => navigate('/dashboard')}>
            Get Started
          </Button>
          <Button variant="secondary" size="lg">
            View Demo
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
