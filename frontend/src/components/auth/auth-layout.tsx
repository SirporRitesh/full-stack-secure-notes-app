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
      <div className="flex flex-col justify-center pl-16 pr-12 w-full lg:w-[45%]">
        <div className="space-y-8 max-w-md">
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
          
          {/* Form */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Right side - Image*/}
      <div className="hidden lg:flex lg:w-[55%]">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img
            src="/images/auth-bg.jpg"
            alt="blue design"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl p-1"
          />
        </div>
      </div>
    </div>
  );
}