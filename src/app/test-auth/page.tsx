"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";

interface DebugInfo {
  authLoaded?: boolean;
  userLoaded?: boolean;
  isSignedIn?: boolean;
  userId?: string;
  userEmail?: string;
  clerkPublishableKey?: string;
  hostname?: string;
  protocol?: string;
}

export default function TestAuthPage() {
  const { isSignedIn, isLoaded: authLoaded, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    setDebugInfo({
      authLoaded,
      userLoaded,
      isSignedIn,
      userId: userId ? userId : undefined,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      clerkPublishableKey: `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...`,
      hostname:
        typeof window !== "undefined" ? window.location.hostname : "server",
      protocol:
        typeof window !== "undefined" ? window.location.protocol : "server",
    });
  }, [authLoaded, userLoaded, isSignedIn, userId, user]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Clerk Authentication Debug</h1>

        <div className="bg-white border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Debug Information</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Auth Loaded:</span>
              <span
                className={`ml-2 ${debugInfo.authLoaded ? "text-green-600" : "text-red-600"}`}
              >
                {debugInfo.authLoaded ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div>
              <span className="font-medium">User Loaded:</span>
              <span
                className={`ml-2 ${debugInfo.userLoaded ? "text-green-600" : "text-red-600"}`}
              >
                {debugInfo.userLoaded ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div>
              <span className="font-medium">Is Signed In:</span>
              <span
                className={`ml-2 ${debugInfo.isSignedIn ? "text-green-600" : "text-red-600"}`}
              >
                {debugInfo.isSignedIn ? "✅ Yes" : "❌ No"}
              </span>
            </div>

            <div>
              <span className="font-medium">User ID:</span>
              <span className="ml-2 text-gray-900">
                {debugInfo.userId || "None"}
              </span>
            </div>

            <div>
              <span className="font-medium">User Email:</span>
              <span className="ml-2 text-gray-900">
                {debugInfo.userEmail || "None"}
              </span>
            </div>

            <div>
              <span className="font-medium">Publishable Key:</span>
              <span className="ml-2 text-gray-900">
                {debugInfo.clerkPublishableKey || "Not set"}
              </span>
            </div>

            <div>
              <span className="font-medium">Hostname:</span>
              <span className="ml-2 text-gray-900">{debugInfo.hostname}</span>
            </div>

            <div>
              <span className="font-medium">Protocol:</span>
              <span className="ml-2 text-gray-900">{debugInfo.protocol}</span>
            </div>
          </div>

          <div className="mt-6 space-x-4">
            <Link
              href="/auth/signin"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Test Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Test Sign Up
            </Link>
            <Link
              href="/"
              className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800">
            Troubleshooting Tips
          </h3>
          <ul className="mt-2 text-sm text-yellow-700 space-y-1">
            <li>
              • Check that NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in
              .env.local
            </li>
            <li>
              • Ensure the Clerk application is configured in the Clerk
              dashboard
            </li>
            <li>
              • Verify that the domain is added to the allowed origins in Clerk
            </li>
            <li>
              • Make sure both auth and user are loaded before checking sign-in
              status
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
