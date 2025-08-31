import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Calendar } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { GoogleLogin } from '@react-oauth/google';
import { CredentialResponse } from '@react-oauth/google';

export const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { sendOTP, signInWithGoogle, user, loading } = useAuth();
  const [otpLoading, setOtpLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!fullName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!dateOfBirth) {
      toast({
        title: "Date of birth required",
        description: "Please select your date of birth",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleGetOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setOtpLoading(true);
    const result = await sendOTP(email);
    setOtpLoading(false);
    if (result.success) {
      setIsOtpSent(true);
    } else {
      // Show error toast, etc.
    }
  };

  // OTP validation helper
  const isValidOtp = (otp: string) => /^\d{6}$/.test(otp);

  const handleVerifyOtp = async () => {
    if (!isValidOtp(otp)) {
      toast({
        title: "Invalid OTP",
        description: "OTP must be exactly 6 digits.",
        variant: "destructive",
      });
      return;
    }
    setOtpLoading(true);
    const res = await fetch("http://localhost:4000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    setOtpLoading(false);
    if (res.ok) {
      navigate("/dashboard");
    } else {
      const { error } = await res.json();
      toast({
        title: "Invalid OTP",
        description: error || "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignUp = async () => {
    await signInWithGoogle();
  };

  return (
    <AuthLayout
      title="Sign up"
      subtitle="Sign up to enjoy the feature of HD"
    >
      <form onSubmit={handleGetOTP} className="space-y-6">
        <div className="space-y-4">
          {/* Full Name Input */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-text-medium">
              Your Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 border-form-border focus:border-form-border-focus"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Date of Birth Input */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-sm font-medium text-text-medium">
              Date of Birth
            </Label>
            <div className="relative">
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-12 border-form-border focus:border-form-border-focus pr-10"
                required
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light" size={20} />
            </div>
          </div>

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
        </div>

        {/* Get OTP / Success Message */}
        {!isOtpSent ? (
          <Button
            type="submit"
            className="w-full h-12 bg-hd-blue hover:bg-hd-blue-dark text-white font-medium text-base"
            disabled={otpLoading}
          >
            {otpLoading ? 'Sending OTP...' : 'Get OTP'}
          </Button>
        ) : (
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">OTP sent to your email!</p>
            <p className="text-green-600 text-sm mt-1">
              Please check your email for the OTP code.
            </p>
          </div>
        )}

        {/* OTP Input and Verify Button */}
        {isOtpSent && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-text-medium">
                Enter OTP
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="h-12 border-form-border focus:border-form-border-focus"
                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full h-12 bg-hd-blue hover:bg-hd-blue-dark text-white font-medium text-base"
              disabled={otpLoading || !isValidOtp(otp)}
            >
              {otpLoading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>
        )}

        {/* Google Sign Up */}
        <GoogleLogin
          onSuccess={(credentialResponse: CredentialResponse) => { /* handle login */ }}
          onError={() => { /* handle error */ }}
        />

        {/* Sign in link */}
        <div className="text-center">
          <span className="text-sm text-text-light">Already have an account? </span>
          <Link
            to="/auth/sign-in"
            className="text-sm text-hd-blue hover:text-hd-blue-dark font-medium"
          >
            Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};