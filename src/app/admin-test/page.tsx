import { Shield, User } from "lucide-react";
import Link from "next/link";

export default function AdminTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* BOLES Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-[#43abc3] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Access Test
          </h1>
          <p className="mt-2 text-gray-600">
            Test admin panel access and authentication
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Authentication Information
            </h2>
            <div className="text-gray-600">
              <p className="mb-4">
                This page tests admin access to the BOLES Smart Home admin
                panel.
              </p>
              <p>
                To test admin functionality, please sign in with an admin
                account.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Admin Access Rules
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Email is "admin@boles.com"</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>Email contains "admin"</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>User metadata role is "admin"</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Sign In Required</p>
                <p className="text-sm text-blue-600">
                  Please sign in to test admin access functionality
                </p>
              </div>
            </div>
            <div className="mt-4 space-x-3">
              <Link href="/auth/signin">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href="/auth/signup">
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/">
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Home Page
                </button>
              </Link>
              <Link href="/admin">
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Admin Panel
                </button>
              </Link>
              <Link href="/test-auth">
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Auth Debug
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
