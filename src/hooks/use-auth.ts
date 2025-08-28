import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string, dateOfBirth?: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
            date_of_birth: dateOfBirth,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link to complete your signup.",
      });

      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during signup';
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during signin';
      toast({
        title: "Signin failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithOTP = async (email: string, token: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;

      toast({
        title: "Welcome!",
        description: "You have successfully signed in.",
      });

      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid OTP code';
      toast({
        title: "OTP verification failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred with Google signin';
      toast({
        title: "Google signin failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOTP,
    signInWithGoogle,
    signOut,
  };
};