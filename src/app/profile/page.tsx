"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { UserProfile, useUser } from "@clerk/nextjs";
import { ClipboardCopy, Edit, Mail, User, CreditCard, Package, Shield, Wallet as WalletIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderHistory from "@/components/profile/OrderHistory";
import Wallet from "@/components/profile/Wallet";
import { generateMockOrders, generateMockWallet } from "@/data/orders";
import { OrderType, WalletType } from "@/types/order";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [walletStorageKey] = useState(() =>
    isSignedIn && user ? `wallet_${user.id}` : ''
  );
  const [savedWallet, saveWallet] = useLocalStorage<WalletType | null>(
    walletStorageKey,
    null
  );

  // If the user isn't signed in, redirect to home
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      toast({
        title: "Access denied",
        description: "You need to sign in to view your profile",
        variant: "destructive",
      });
    }
  }, [isLoaded, isSignedIn, router]);

  // Load mock data
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Simulate API call
      setIsLoading(true);

      // Check if we have a saved wallet first
      if (walletStorageKey && savedWallet) {
        setWallet(savedWallet);

        // Still load orders
        setTimeout(() => {
          const mockOrders = generateMockOrders(user.id);
          setOrders(mockOrders);
          setIsLoading(false);
        }, 500);
      } else {
        // Generate fresh data
        setTimeout(() => {
          const mockOrders = generateMockOrders(user.id);
          const mockWallet = generateMockWallet(user.id);
          setOrders(mockOrders);
          setWallet(mockWallet);

          // Save to localStorage
          if (walletStorageKey) {
            saveWallet(mockWallet);
          }

          setIsLoading(false);
        }, 1000);
      }
    }
  }, [isLoaded, isSignedIn, user, savedWallet, walletStorageKey, saveWallet]);

  const handleTopUp = (amount: number) => {
    if (wallet) {
      const newTransaction = {
        id: `txn-${Date.now()}`,
        userId: wallet.userId,
        amount: amount,
        type: "deposit" as const,
        status: "completed" as const,
        description: "Wallet top-up",
        createdAt: new Date().toISOString(),
        reference: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance + amount,
        updatedAt: new Date().toISOString(),
        transactions: [newTransaction, ...wallet.transactions],
      };

      setWallet(updatedWallet);

      // Save to localStorage
      if (walletStorageKey) {
        saveWallet(updatedWallet);
      }
    }
  };

  const handleWithdraw = (amount: number) => {
    if (wallet) {
      const newTransaction = {
        id: `txn-${Date.now()}`,
        userId: wallet.userId,
        amount: -amount, // Negative amount for withdrawal
        type: "withdrawal" as const,
        status: "pending" as const,
        description: "Withdrawal to bank account",
        createdAt: new Date().toISOString(),
        reference: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      };

      const updatedWallet = {
        ...wallet,
        balance: wallet.balance - amount,
        updatedAt: new Date().toISOString(),
        transactions: [newTransaction, ...wallet.transactions],
      };

      setWallet(updatedWallet);

      // Save to localStorage
      if (walletStorageKey) {
        saveWallet(updatedWallet);
      }
    }
  };

  // While Clerk is loading, show a skeleton
  if (!isLoaded || !user || isLoading) {
    return <ProfileSkeleton />;
  }

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast({
      title: "User ID copied",
      description: "User ID has been copied to clipboard",
      variant: "success",
      duration: 2000,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* User summary card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 bg-[#43abc3] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {user.firstName?.[0] || user.emailAddresses[0].emailAddress[0].toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold">
                {user.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : user.emailAddresses[0].emailAddress}
              </h3>
              <p className="text-sm text-muted-foreground">
                {user.emailAddresses[0].emailAddress}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <span className="text-sm">
                  {user.emailAddresses[0].emailAddress}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Member since</span>
                </div>
                <span className="text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Wallet Balance</span>
                </div>
                <span className="text-sm font-medium text-[#43abc3]">
                  ${wallet?.balance.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">User ID</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyUserId}
                  className="text-xs"
                >
                  {copied ? "Copied!" : "Copy ID"}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = "/account/edit"}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </CardFooter>
        </Card>

        {/* Main content area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-1">
                <WalletIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Wallet</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-6">
              <OrderHistory orders={orders} />
            </TabsContent>

            <TabsContent value="wallet" className="mt-6">
              {wallet && (
                <Wallet
                  wallet={wallet}
                  onTopUp={handleTopUp}
                  onWithdraw={handleWithdraw}
                />
              )}
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg">
                    <UserProfile
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
                          navbar: "hidden",
                          navbarMobileMenuButton: "hidden",
                          pageScrollBox: "p-0",
                        },
                      }}
                      routing="virtual"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Change your password regularly for better security
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/account/security"}
                      >
                        Change Password
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div>
                        <h3 className="font-medium">Two-Factor Authentication</h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/account/security"}
                      >
                        Set Up 2FA
                      </Button>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-lg border">
                      <div>
                        <h3 className="font-medium">Payment Methods</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your saved payment methods
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.location.href = "/account/payment-methods"}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Cards
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container py-10">
      <div className="h-8 w-48 bg-gray-200 rounded mb-8 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-gray-100 rounded-lg h-96 animate-pulse" />
        <div className="lg:col-span-3">
          <div className="h-12 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="bg-gray-100 rounded-lg h-96 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
