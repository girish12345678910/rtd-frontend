import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, SignUpButton, SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  Vote, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle, 
  Zap,
  Shield,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

export function Landing() {
  const navigate = useNavigate();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const features = [
    {
      icon: <Vote className="w-12 h-12 text-blue-600" />,
      title: 'Real-Time Voting',
      description: 'Make decisions instantly with weighted voting and live results that update in real-time'
    },
    {
      icon: <MessageSquare className="w-12 h-12 text-blue-600" />,
      title: 'Team Chat',
      description: 'Discuss decisions seamlessly with built-in real-time messaging'
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: 'User Presence',
      description: 'See who\'s online and actively participating in your decision sessions'
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-blue-600" />,
      title: 'Live Analytics',
      description: 'Track participation, votes, and decision progress with beautiful charts'
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      title: 'Secure & Private',
      description: 'Enterprise-grade security with role-based access control'
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: 'Lightning Fast',
      description: 'Instant updates powered by Socket.io real-time communication'
    }
  ];

  const screenshots = [
    {
      title: 'Dashboard',
      description: 'Manage all your teams and sessions in one place',
      image: '📊' // Replace with actual screenshot
    },
    {
      title: 'Live Voting',
      description: 'Real-time voting with instant results',
      image: '🗳️'
    },
    {
      title: 'Team Chat',
      description: 'Collaborate with your team in real-time',
      image: '💬'
    }
  ];

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">D</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DecisionHub
              </span>
            </div>

            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                How it Works
              </a>
              <a href="#screenshots" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                Screenshots
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button onClick={() => navigate('/dashboard')} size="sm">
                  Go to Dashboard
                </Button>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Make Team Decisions in
                <span className="text-blue-600"> Real-Time</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Collaborate, vote, and decide faster with your team. Built for distributed teams who need to make decisions quickly and efficiently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
  <SignedOut>
    <SignUpButton mode="modal">
      <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        <span className="relative z-10 flex items-center">
          Get Started Free
          <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
        </span>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
      </button>
    </SignUpButton>
  </SignedOut>
  <SignedIn>
    <button 
      onClick={() => navigate('/dashboard')}
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
    >
      <span className="relative z-10 flex items-center">
        Go to Dashboard
        <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
      </span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
    </button>
  </SignedIn>
  <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
    <Play className="mr-2 group-hover:text-blue-600" size={20} />
    Watch Demo
  </button>
</div>


              <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-2" size={20} />
                  Free forever
                </div>
              </div>
            </div>

            {/* Right: Hero Image/Animation */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">Live Session</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Should we launch the new feature?</span>
                      <span className="text-xs text-green-600 font-semibold">✓ 85% Yes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Users size={14} />
                      <span>12 team members voting</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to make decisions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Powerful features built for modern teams who need to collaborate and decide quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get started in 3 simple steps
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Start making better decisions in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Team',
                description: 'Set up your team and invite members via email. Everyone gets instant access.',
                icon: <Users className="w-16 h-16 text-blue-600" />
              },
              {
                step: '2',
                title: 'Start a Session',
                description: 'Create a decision session, add topics, and let team members join in real-time.',
                icon: <Vote className="w-16 h-16 text-blue-600" />
              },
              {
                step: '3',
                title: 'Vote & Decide',
                description: 'Vote on topics, see live results, and reach consensus faster than ever.',
                icon: <TrendingUp className="w-16 h-16 text-blue-600" />
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {step.step}
                    </span>
                  </div>
                  {step.icon}
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3 mt-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Carousel */}
      <section id="screenshots" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See it in action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Beautiful, intuitive interface designed for team collaboration
            </p>
          </div>

          <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="flex-[0_0_100%] min-w-0 px-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 shadow-2xl">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center">
                        <div className="text-8xl mb-6">{screenshot.image}</div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {screenshot.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {screenshot.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Navigation */}
            <button
              onClick={scrollPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to make better decisions?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join teams who are already making faster, better decisions with DecisionHub
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </SignedIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">D</span>
                </div>
                <span className="text-lg font-bold text-white">DecisionHub</span>
              </div>
              <p className="text-sm">
                Making team decisions faster and easier.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#screenshots" className="hover:text-white">Screenshots</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; 2025 DecisionHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
