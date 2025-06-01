// Instructions: Create a simplified not-found page that can render without Clerk authentication

import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* BOLES Logo */}
        <div className="mb-8">
          <div className="h-12 w-12 bg-[#43abc3] rounded-lg flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            BOLES Smart Home
          </h3>
        </div>

        {/* 404 Error */}
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-[#43abc3] mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page might
            have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2 bg-[#43abc3] hover:bg-[#3a9bb5] text-white rounded-lg transition-colors w-full sm:w-auto"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Link>
          <Link
            href="/categories/smart-lighting"
            className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full sm:w-auto"
          >
            <Search className="h-4 w-4 mr-2" />
            Browse Products
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link
              href="/categories/smart-lighting"
              className="text-gray-600 hover:text-[#43abc3] transition-colors"
            >
              Smart Lighting
            </Link>
            <Link
              href="/categories/security-cameras"
              className="text-gray-600 hover:text-[#43abc3] transition-colors"
            >
              Security Cameras
            </Link>
            <Link
              href="/categories/smart-speakers"
              className="text-gray-600 hover:text-[#43abc3] transition-colors"
            >
              Smart Speakers
            </Link>
            <Link
              href="/categories/smart-locks"
              className="text-gray-600 hover:text-[#43abc3] transition-colors"
            >
              Smart Locks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
