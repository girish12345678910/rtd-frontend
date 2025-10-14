import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { SocketProvider } from './contexts/SocketContext';
import App from './App';
import './index.css';
import { authApi } from './lib/api';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

function AppWithSync() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      authApi.sync()
        .then(() => console.log('User synced with backend'))
        .catch((err) => {
          console.error('Failed to sync user:', err);
        });
    }
  }, [isLoaded, isSignedIn]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <SocketProvider>
        <AppWithSync />
      </SocketProvider>
    </ClerkProvider>
  </React.StrictMode>
);
