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
import GoogleLogin from "@/components/auth/GoogleLogin";

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { sendOTP, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

    try {
      const res = await fetch("http://localhost:4000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        // Success! Redirect to dashboard
        toast({ title: "Sign-in successful" });
        navigate("/dashboard");
      } else {
        const { error } = await res.json();
        toast({
          title: "Sign-in Failed",
          description: error || "The OTP you entered is incorrect.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Sign-in Error",
        description: "A network error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Initial send OTP logic (could be triggered by a button or after entering email)
  const handleSendOtp = async () => {
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
      await sendOTP(email);
      setIsOtpSent(true);
      setResendCooldown(60); // Start cooldown after initial send
      toast({
        title: "OTP sent",
        description: "A new OTP has been sent to your email",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOtp(false);
    }
  };

  // Resend OTP logic
  const handleResendOtp = async () => {
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
      await sendOTP(email);
      setResendCooldown(60); // Start 60s cooldown
      toast({
        title: "OTP sent",
        description: "A new OTP has been sent.",
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

          {/* Send OTP or Resend OTP */}
          {!isOtpSent ? (
            <Button
  type="button"
  onClick={handleSendOtp}
  disabled={isLoadingOtp}
  className="text-[#367AFF] underline decoration-[#367AFF] font-medium text-sm
             p-0 bg-transparent 
             hover:text-[#367AFF] focus:text-[#367AFF] active:text-[#367AFF]
             hover:underline focus:underline active:underline
             hover:decoration-[#367AFF] focus:decoration-[#367AFF] active:decoration-[#367AFF]
             outline-none ring-0"
>
  {isLoadingOtp ? 'Resending...' : 'Resend OTP'}
</Button>

          ) : (
            <Button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoadingOtp || resendCooldown > 0}
              className="text-sm text-hd-blue hover:text-hd-blue-dark font-medium"
            >
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : isLoadingOtp
                ? 'Sending...'
                : 'Resend OTP'}
            </Button>
          )}
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
        <GoogleLogin />

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

export default SignIn;
