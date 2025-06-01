"use client";

import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoaded && userLoaded) {
        if (!isSignedIn) {
          router.push("/auth/signin?redirect=/admin");
          return;
        }

        // Check if user is admin
        // For now, we'll consider the first user or specific emails as admin
        const isUserAdmin =
          user?.emailAddresses?.[0]?.emailAddress === "admin@boles.com" ||
          user?.emailAddresses?.[0]?.emailAddress?.includes("admin") ||
          user?.publicMetadata?.role === "admin";

        setIsAdmin(isUserAdmin);
        setCheckingRole(false);

        if (!isUserAdmin) {
          // Non-admin users get redirected
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      }
    };

    checkAdminRole();
  }, [isSignedIn, authLoaded, userLoaded, user, router]);

  // Loading state
  if (!authLoaded || !userLoaded || checkingRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#43abc3] mx-auto mb-4" />
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access the admin panel.
          </p>
          <button
            onClick={() => router.push("/auth/signin?redirect=/admin")}
            className="bg-[#43abc3] text-white px-6 py-2 rounded-lg hover:bg-[#3a9bb5]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You need admin privileges to access this area.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Signed in as: {user?.emailAddresses?.[0]?.emailAddress}
          </p>
          <div className="space-x-4">
            <button
              onClick={() => router.push("/")}
              className="bg-[#43abc3] text-white px-6 py-2 rounded-lg hover:bg-[#3a9bb5]"
            >
              Go to Store
            </button>
            <button
              onClick={() => router.push("/auth/signin")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Switch Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 p-8">{children}</main>
      </div>
    </div>
  );
}
