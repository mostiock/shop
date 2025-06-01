"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, AlertCircle, PlusCircle } from "lucide-react";
import { WalletType } from "@/types/order";
import { generateMockWallet } from "@/data/orders";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * A component that displays the user's wallet balance with quick top-up option
 */
export function WalletBalanceDisplay() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [walletStorageKey] = useState(() =>
    isSignedIn && user ? `wallet_${user.id}` : ''
  );
  const [wallet, setWallet] = useLocalStorage<WalletType | null>(
    walletStorageKey || "wallet_guest",
    null
  );
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("50");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load wallet data if user is signed in
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user) {
        // Check if we have a saved wallet first
        if (walletStorageKey && wallet) {
          setIsLoading(false);
        } else {
          // Simulate API call to get wallet
          setIsLoading(true);
          setTimeout(() => {
            const mockWallet = generateMockWallet(user.id);
            setWallet(mockWallet);
            setIsLoading(false);
          }, 800);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user, wallet, setWallet, walletStorageKey]);

  const handleTopUp = () => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "Please sign in to top up your wallet",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      if (wallet) {
        const amount = Number.parseFloat(topUpAmount);
        const updatedWallet = {
          ...wallet,
          balance: wallet.balance + amount,
          updatedAt: new Date().toISOString(),
          transactions: [
            {
              id: `txn-${Date.now()}`,
              userId: wallet.userId,
              amount: amount,
              type: "deposit" as const,
              status: "completed" as const,
              description: "Wallet top-up",
              createdAt: new Date().toISOString(),
              reference: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
            },
            ...wallet.transactions
          ],
        };

        setWallet(updatedWallet);

        toast({
          title: "Wallet topped up successfully!",
          description: `$${amount.toFixed(2)} has been added to your wallet.`,
          variant: "success",
        });
      }

      setIsProcessing(false);
      setIsTopUpOpen(false);
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Sign in for wallet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            ${wallet?.balance.toFixed(2) || "0.00"}
          </span>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <PlusCircle className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </div>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Top Up</DialogTitle>
            <DialogDescription>
              Add funds to your wallet balance to make purchases across the site.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="pl-8"
                  min="5"
                  step="5"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[25, 50, 100, 200].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant="outline"
                  onClick={() => setTopUpAmount(value.toString())}
                  className={topUpAmount === value.toString() ? "border-primary bg-primary/10" : ""}
                >
                  ${value}
                </Button>
              ))}
            </div>

            <div className="flex items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-xs text-blue-700">
                For demo purposes, this will add funds instantly without real payment processing.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsTopUpOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTopUp}
              disabled={isProcessing || Number.parseFloat(topUpAmount) <= 0}
              className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
            >
              {isProcessing ? "Processing..." : `Add $${Number.parseFloat(topUpAmount || "0").toFixed(2)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
