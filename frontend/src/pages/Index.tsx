import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Welcome } from './welcome';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '711660885906-lshuamm32lv5ro25qlq8093cljuctlar.apps.googleusercontent.com';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hd-blue mx-auto mb-4"></div>
          <p className="text-text-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Welcome />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3">
          <Logo className="w-12 h-12" />
          <span className="text-3xl font-bold text-foreground">HD</span>
        </div>
        
        {/* Welcome Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Welcome to HD</h1>
          <p className="text-lg text-text-light">
            Your intelligent note-taking application. Sign in to get started.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/auth/sign-in')}
            className="w-full h-12 bg-hd-blue hover:bg-hd-blue-dark text-white font-medium text-base"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate('/auth/sign-up')}
            variant="outline"
            className="w-full h-12 font-medium text-base"
          >
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <GoogleOAuthProvider clientId={CLIENT_ID}>
    <Index />
  </GoogleOAuthProvider>
);

export default AppWrapper;
