"use client";

import { AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";

// Dynamically import Clerk components to avoid SSR issues
const SignIn = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignIn),
  {
    ssr: false,
    loading: () => <AuthFormSkeleton />,
  },
);

const SignUp = dynamic(
  () => import("@clerk/nextjs").then((mod) => mod.SignUp),
  {
    ssr: false,
    loading: () => <AuthFormSkeleton />,
  },
);

type AuthDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "signin" | "signup";
  onToggleMode: () => void;
};

export function AuthDialog({
  isOpen,
  onOpenChange,
  mode,
  onToggleMode,
}: AuthDialogProps) {
  const [isClient, setIsClient] = useState(false);
  const [showClerkForm, setShowClerkForm] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => setShowClerkForm(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const isClerkConfigured =
    publishableKey && publishableKey !== "pk_test_YOUR_PUBLISHABLE_KEY_HERE";

  // Handle auth events
  const handleSignInSuccess = () => {
    toast({
      title: "Welcome back!",
      description: "You have successfully signed in",
      variant: "success",
      duration: 3000,
    });
    onOpenChange(false);
    router.refresh();
  };

  const handleSignUpSuccess = () => {
    toast({
      title: "Account created!",
      description: "Your BOLES Smart Home account has been created",
      variant: "success",
      duration: 3000,
    });
    onOpenChange(false);
    router.refresh();
  };

  const handleSignOutSuccess = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
      variant: "info",
      duration: 3000,
    });
  };

  const handleAuthError = (errorMessage: string) => {
    toast({
      title: "Authentication error",
      description: errorMessage,
      variant: "destructive",
      duration: 5000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md mx-4 w-[calc(100%-2rem)] sm:w-full sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-[#43abc3] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <p className="text-sm text-center text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your BOLES Smart Home account"
              : "Create a new BOLES Smart Home account"}
          </p>
        </DialogHeader>

        {!isClient ? (
          <AuthFormSkeleton />
        ) : !isClerkConfigured ? (
          <ClerkNotConfigured />
        ) : showClerkForm ? (
          <>
            {mode === "signin" ? (
              <SignIn
                appearance={{
                  variables: {
                    colorPrimary: "#43abc3",
                    colorBackground: "#ffffff",
                    colorInputBackground: "#ffffff",
                    colorInputText: "#112137",
                    colorText: "#112137",
                    colorTextSecondary: "#8090af",
                    borderRadius: "0.5rem",
                  },
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    footerActionLink: "text-[#43abc3] hover:text-[#3a9bb5]",
                    formButtonPrimary: "bg-[#43abc3] hover:bg-[#3a9bb5]",
                    form: "gap-2",
                    formFieldInput: "h-10",
                    formFieldLabel: "text-sm",
                  },
                }}
                routing="virtual"
                afterSignInUrl="/"
                afterSignUpUrl="/"
                signUpUrl="/"
                redirectUrl="/"
                signInCompleteCallback={handleSignInSuccess}
                signUpCompleteCallback={handleSignUpSuccess}
                signOutCallback={handleSignOutSuccess}
                afterSignInCallback={handleSignInSuccess}
                afterSignUpCallback={handleSignUpSuccess}
              />
            ) : (
              <SignUp
                appearance={{
                  variables: {
                    colorPrimary: "#43abc3",
                    colorBackground: "#ffffff",
                    colorInputBackground: "#ffffff",
                    colorInputText: "#112137",
                    colorText: "#112137",
                    colorTextSecondary: "#8090af",
                    borderRadius: "0.5rem",
                  },
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none p-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    footerActionLink: "text-[#43abc3] hover:text-[#3a9bb5]",
                    formButtonPrimary: "bg-[#43abc3] hover:bg-[#3a9bb5]",
                    form: "gap-2",
                    formFieldInput: "h-10",
                    formFieldLabel: "text-sm",
                  },
                }}
                routing="virtual"
                afterSignInUrl="/"
                afterSignUpUrl="/"
                signInUrl="/"
                redirectUrl="/"
                signUpCompleteCallback={handleSignUpSuccess}
                afterSignUpCallback={handleSignUpSuccess}
              />
            )}

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={onToggleMode}
                    className="text-[#43abc3] hover:text-[#3a9bb5] font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={onToggleMode}
                    className="text-[#43abc3] hover:text-[#3a9bb5] font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </>
        ) : (
          <AuthFormSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AuthFormSkeleton() {
  return (
    <div className="w-full">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-4" />
        <div className="h-10 bg-gray-300 rounded mb-4" />
        <div className="h-10 bg-gray-300 rounded mb-4" />
        <div className="h-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

function ClerkNotConfigured() {
  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
      </div>
      <h2 className="text-xl font-semibold text-center mb-4">
        Clerk Authentication Not Configured
      </h2>
      <div className="text-sm text-gray-600 space-y-3">
        <p>To enable sign-in functionality, please:</p>
        <ol className="list-decimal list-inside space-y-1 ml-4">
          <li>Set up your Clerk account</li>
          <li>Add your Clerk Publishable Key to environment variables</li>
          <li>Restart the development server</li>
        </ol>
        <p className="mt-4 text-xs text-gray-500">
          Check the README.md file for detailed setup instructions.
        </p>
      </div>
    </div>
  );
}
