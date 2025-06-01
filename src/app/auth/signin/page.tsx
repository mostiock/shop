import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* BOLES Logo */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 bg-[#43abc3] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">BOLES Smart Home</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      {/* Clerk Sign In Component */}
      <div className="w-full max-w-md">
        <SignIn
          forceRedirectUrl="/"
          fallbackRedirectUrl="/"
          signUpUrl="/auth/signup"
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
              card: "shadow-xl border border-gray-200",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            },
          }}
        />
      </div>
    </div>
  );
}
