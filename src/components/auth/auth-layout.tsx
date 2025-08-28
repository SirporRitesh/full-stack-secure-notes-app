import React from 'react';
import { Logo } from '@/components/ui/logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8" />
            <span className="text-xl font-semibold text-foreground">HD</span>
          </div>
          
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-text-light font-light">{subtitle}</p>
          </div>
          
          {/* Form Content */}
          {children}
        </div>
      </div>
      
      {/* Right side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <img 
          src="/images/auth-bg.png" 
          alt="Abstract blue design" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-hd-blue/20 via-hd-blue/30 to-hd-blue-dark/40"></div>
      </div>
    </div>
  );
};