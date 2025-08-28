import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';

export const Welcome = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-semibold text-foreground">HD</span>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="text-sm"
          >
            Sign Out
          </Button>
        </header>

        {/* Welcome Content */}
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to HD!
            </h1>
            <p className="text-lg text-text-light">
              Hello {user?.user_metadata?.full_name || user?.email}! 
              Your account has been successfully created.
            </p>
          </div>

          {/* User Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Account Details</h2>
            <div className="space-y-3 text-left">
              <div>
                <span className="text-sm text-text-light">Email:</span>
                <p className="text-text-regular font-medium">{user?.email}</p>
              </div>
              {user?.user_metadata?.full_name && (
                <div>
                  <span className="text-sm text-text-light">Name:</span>
                  <p className="text-text-regular font-medium">{user.user_metadata.full_name}</p>
                </div>
              )}
              {user?.user_metadata?.date_of_birth && (
                <div>
                  <span className="text-sm text-text-light">Date of Birth:</span>
                  <p className="text-text-regular font-medium">{user.user_metadata.date_of_birth}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-text-light">Account Created:</span>
                <p className="text-text-regular font-medium">
                  {new Date(user?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-hd-blue/5 border border-hd-blue/20 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-hd-blue mb-2">What's Next?</h3>
            <p className="text-text-light text-sm">
              Your note-taking application is being prepared. Soon you'll be able to create, 
              edit, and manage your notes with ease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};