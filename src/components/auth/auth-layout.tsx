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
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-600/30 to-blue-800/40"></div>
        <div className="relative z-10 text-white text-center">
          <div className="w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};