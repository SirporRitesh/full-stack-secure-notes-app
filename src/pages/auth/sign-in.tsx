import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/use-auth';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const { signInWithOTP, signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!otp.trim()) {
      toast({
        title: "OTP required",
        description: "Please enter the OTP code",
        variant: "destructive",
      });
      return;
    }

    await signInWithOTP(email, otp);
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address first",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingOtp(true);
    try {
      // This would typically call a resend OTP endpoint
      toast({
        title: "OTP sent",
        description: "A new OTP has been sent to your email",
      });
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOtp(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Please login to continue to your account."
    >
      <form onSubmit={handleSignIn} className="space-y-6">
        <div className="space-y-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-text-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-form-border focus:border-form-border-focus"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* OTP Input */}
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-sm font-medium text-text-medium">
              OTP
            </Label>
            <div className="relative">
              <Input
                id="otp"
                type={showOtp ? "text" : "password"}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 border-form-border focus:border-form-border-focus pr-10"
                placeholder="Enter OTP"
                required
              />
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light hover:text-text-medium"
              >
                {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Resend OTP */}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isLoadingOtp}
            className="text-sm text-hd-blue hover:text-hd-blue-dark font-medium"
          >
            {isLoadingOtp ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        {/* Keep me logged in */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="keep-logged-in"
            checked={keepLoggedIn}
            onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
          />
          <Label htmlFor="keep-logged-in" className="text-sm text-text-medium">
            Keep me logged in
          </Label>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-hd-blue hover:bg-hd-blue-dark text-white font-medium text-base"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>

        {/* Google Sign In */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          variant="outline"
          className="w-full h-12 font-medium text-base"
          disabled={loading}
        >
          Continue with Google
        </Button>

        {/* Sign up link */}
        <div className="text-center">
          <span className="text-sm text-text-light">Need an account? </span>
          <Link
            to="/auth/sign-up"
            className="text-sm text-hd-blue hover:text-hd-blue-dark font-medium"
          >
            Create one
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
