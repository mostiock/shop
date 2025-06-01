"use client";

import { useState } from "react";
import { WalletType, WalletTransactionType } from "@/types/order";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowDownCircle, ArrowUpCircle, CreditCard, DollarSign, PlusCircle, History } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface WalletProps {
  wallet: WalletType;
  onTopUp?: (amount: number) => void;
  onWithdraw?: (amount: number) => void;
}

// Custom PayPal icon
function PaypalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19.8952 6.37572C19.9607 6.02168 19.8952 5.7695 19.6987 5.51732C19.4694 5.23243 19.0436 5.10526 18.5197 5.10526H15.4527C15.2889 5.10526 15.1251 5.23243 15.0596 5.39232L13.5857 12.6358C13.5857 12.7629 13.6512 12.8901 13.782 12.9537C13.8475 13.0172 13.9785 13.0172 14.044 13.0172H15.5834C15.6816 13.0172 15.7471 13.0172 15.8126 12.9537C15.8781 12.9537 15.9108 12.8901 15.9108 12.8266L16.3039 10.6082H18.0385C19.3814 10.6082 20.3274 10.0364 20.6549 8.91197C20.9169 8.21332 20.7531 7.67875 19.8952 6.37572ZM18.6832 8.53522C18.5197 9.10251 18.0385 9.42013 17.3444 9.42013H16.4536L16.8467 7.29904H17.7047C18.3988 7.29904 18.7918 7.61665 18.6832 8.53522Z"
        fill="#003087"
      />
      <path
        d="M9.87347 5.10526H6.80649C6.64273 5.10526 6.47898 5.23243 6.41345 5.39232L4.93955 12.6358C4.93955 12.7629 5.00508 12.8901 5.13587 12.9537C5.2014 13.0172 5.33219 13.0172 5.39772 13.0172H6.93715C7.16643 13.0172 7.32766 12.8901 7.36642 12.6358L7.72396 10.6082H9.45858C10.8014 10.6082 11.7474 10.0364 12.075 8.91197C12.3697 8.21332 12.2059 7.67875 11.3479 6.37572C11.4135 6.02168 11.3479 5.7695 11.1514 5.51732C10.9221 5.23243 10.4964 5.10526 9.87347 5.10526ZM10.136 8.53522C9.97223 9.10251 9.491 9.42013 8.79694 9.42013H7.90614L8.29917 7.29904H9.15717C9.85123 7.29904 10.2443 7.61665 10.136 8.53522Z"
        fill="#0070E0"
      />
    </svg>
  );
}

// Custom Google Pay icon
function GooglePay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.3545 10.4009V13.5991H20.0482V10.4009H21.3545ZM24 11.9991V10.4009H22.6937V11.9991V13.5973H24V11.9991ZM18.7346 10.4009V13.5991H17.4283V10.4009H18.7346Z"
        fill="#5F6368"
      />
      <path
        d="M16.0864 12.8264C15.7392 13.2882 15.2155 13.5991 14.5918 13.5991C13.3964 13.5991 12.4291 12.6318 12.4291 11.4364C12.4291 10.2409 13.3964 9.27365 14.5918 9.27365C15.2173 9.27365 15.7392 9.58635 16.0846 10.0464L16.0864 10.0482L16.7773 9.35547C16.2555 8.77275 15.4882 8.4 14.5918 8.4C12.9155 8.4 11.5555 9.75824 11.5555 11.4364C11.5555 13.1127 12.9137 14.4727 14.5918 14.4727C15.4882 14.4727 16.2573 14.1 16.7773 13.5173C17.2973 12.9345 17.4864 12.1091 17.4282 11.3836H14.5918V12.2555H16.5991C16.5245 12.4745 16.3337 12.6654 16.0882 12.8245L16.0864 12.8264Z"
        fill="#4285F4"
      />
      <path
        d="M9.6 11.9991C9.6 10.6391 10.44 9.60002 11.5555 9.60002C12.12 9.60002 12.6 9.84002 12.9855 10.2255L13.6855 9.52551C13.0855 8.97551 12.36 8.6582 11.5555 8.6582C9.87999 8.6582 8.52002 10.1018 8.52002 11.9973C8.52002 13.8927 9.87999 15.3364 11.5555 15.3364C12.36 15.3364 13.0855 15.0191 13.6855 14.4709C14.2855 13.9227 14.5855 13.1455 14.5855 12.2509C14.5855 12.0318 14.5673 11.8127 14.5309 11.6127H11.5537V12.6H13.5618C13.4873 13.1836 13.1618 13.7645 12.6818 14.0645C12.3618 14.2855 11.9818 14.4 11.5537 14.4C10.44 14.4 9.6 13.3609 9.6 12.0009V11.9991Z"
        fill="#EA4335"
      />
      <path
        d="M6.37822 12.8455C5.97641 12.5455 5.71822 12.0691 5.71822 11.4364C5.71822 10.8036 5.97641 10.3273 6.37822 10.0273C6.77822 9.72727 7.28731 9.59819 7.82731 9.70182C8.18731 9.77637 8.50002 9.96001 8.73641 10.2145L9.43641 9.51456C9.05459 9.1164 8.55459 8.83275 7.99731 8.71457C7.11822 8.51457 6.21641 8.74185 5.54731 9.29457C4.85459 9.86548 4.4582 10.6345 4.4582 11.4364C4.4582 12.2382 4.85459 13.0073 5.54731 13.5782C6.23823 14.1491 7.21822 14.3764 8.13641 14.1764C8.7382 14.0382 9.27641 13.7055 9.65823 13.2545C10.04 12.8036 10.2582 12.2209 10.2582 11.6182C10.2582 11.3964 10.2382 11.1745 10.1964 10.9564H7.85822V11.8282H9.32731C9.27641 12.1664 9.08368 12.4855 8.81641 12.7145C8.5673 12.9236 8.23822 13.0727 7.88731 13.0727C7.34731 13.0727 6.87641 12.9236 6.37822 12.8455Z"
        fill="#FBBC04"
      />
      <path
        d="M2.4 13.5991V8.4H0V13.5991H2.4Z"
        fill="#34A853"
      />
    </svg>
  );
}

// Custom Apple Pay icon
function ApplePay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.30111 5.03825C7.91911 4.30825 8.33111 3.28825 8.19311 2.25325C7.30111 2.30425 6.22111 2.86825 5.58511 3.59825C5.02111 4.21625 4.52711 5.28225 4.68311 6.26425C5.66511 6.33325 6.68311 5.77825 7.30111 5.03825Z"
        fill="black"
      />
      <path
        d="M8.19291 6.44707C6.82891 6.37807 5.69291 7.20307 5.05691 7.20307C4.42091 7.20307 3.45691 6.48207 2.40291 6.50007C1.03891 6.51807 -0.20909 7.34307 -0.84509 8.65907C-2.13709 11.3091 -0.31709 15.2471 0.94091 17.2621C1.55891 18.2441 2.30791 19.3441 3.31691 19.2931C4.27191 19.2421 4.66591 18.6601 5.82091 18.6601C6.97591 18.6601 7.33291 19.2931 8.35091 19.2601C9.40491 19.2271 10.0519 18.2441 10.6699 17.2621C11.3879 16.1621 11.6809 15.0981 11.6989 15.0451C11.6809 15.0281 9.91691 14.3271 9.89891 12.2611C9.88091 10.5211 11.2809 9.66207 11.3519 9.60907C10.4959 8.32907 9.12291 8.18207 8.67491 8.13807C7.33291 7.98207 6.12291 8.78007 5.43291 8.78007C4.75091 8.78007 3.73291 6.51807 8.19291 6.44707Z"
        fill="black"
      />
    </svg>
  );
}

// Bitcoin icon
function BitcoinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M23.6377 14.9246C22.3168 20.9127 16.3806 24.7722 10.3925 23.4514C4.40431 22.1305 0.544808 16.1943 1.86564 10.2062C3.18647 4.21806 9.12267 0.358555 15.1108 1.67939C21.0989 3.00022 24.9585 8.93642 23.6377 14.9246Z"
        fill="#F7931A"
      />
      <path
        d="M17.2936 10.4819C17.5104 8.82722 16.2549 7.9573 14.5119 7.36353L15.0513 5.31824L13.8163 5.00234L13.2923 6.98733C12.9516 6.90368 12.6007 6.82428 12.2527 6.74546L12.7799 4.74911L11.5461 4.43321L11.0066 6.47791C10.7228 6.41391 10.4449 6.35049 10.1746 6.28531L10.1758 6.27939L8.48492 5.85546L8.14716 7.18566C8.14716 7.18566 9.0631 7.38974 9.04425 7.40159C9.57884 7.53465 9.67001 7.88965 9.6559 8.17073L9.03464 10.5268C9.07433 10.5372 9.12587 10.5533 9.18207 10.5799C9.13646 10.5687 9.0873 10.5557 9.03698 10.5429L8.16739 13.8493C8.10515 14.0172 7.95249 14.2661 7.5871 14.1747C7.59888 14.1914 6.69355 13.9577 6.69355 13.9577L6.06836 15.3825L7.67563 15.7851C7.9879 15.8629 8.29309 15.9441 8.59416 16.0211L8.04943 18.0968L9.28206 18.4127L9.82259 16.3639C10.1763 16.458 10.5196 16.5448 10.8547 16.6253L10.3166 18.6602L11.5516 18.9761L12.0963 16.9052C14.4549 17.3334 16.2077 17.1667 16.9896 15.0103C17.6208 13.2639 16.9522 12.242 15.6504 11.5916C16.6339 11.3558 17.3696 10.719 17.2936 10.4819ZM14.3646 14.0994C13.9058 15.8458 11.2328 14.968 10.3019 14.753L11.0348 11.9631C11.9657 12.1793 14.8423 12.2821 14.3646 14.0994ZM14.8246 10.4591C14.4058 12.0482 12.1654 11.3023 11.3902 11.1249L12.0563 8.60826C12.8315 8.78566 15.2609 8.7971 14.8246 10.4591Z"
        fill="white"
      />
    </svg>
  );
}

// Bank Transfer icon
function BankTransferIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const getTransactionIcon = (type: WalletTransactionType["type"]) => {
  switch (type) {
    case "deposit":
      return <ArrowDownCircle className="h-4 w-4 text-green-500" />;
    case "withdrawal":
      return <ArrowUpCircle className="h-4 w-4 text-red-500" />;
    case "purchase":
      return <CreditCard className="h-4 w-4 text-blue-500" />;
    case "refund":
      return <ArrowDownCircle className="h-4 w-4 text-purple-500" />;
    default:
      return <DollarSign className="h-4 w-4 text-gray-500" />;
  }
};

const getTransactionColor = (amount: number) => {
  return amount >= 0 ? "text-green-600" : "text-red-600";
};

const getTransactionStatusBadge = (status: WalletTransactionType["status"]) => {
  const variants: Record<string, string> = {
    completed: "bg-green-100 text-green-800 border-green-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    failed: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} capitalize text-xs`}>
      {status}
    </Badge>
  );
};

const WalletTopUpDialog = ({ onTopUp }: { onTopUp?: (amount: number) => void }) => {
  const [amount, setAmount] = useState("50");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const handleTopUp = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (onTopUp) {
        onTopUp(Number.parseFloat(amount));
      }
      toast({
        title: "Wallet topped up successfully!",
        description: `$${amount} has been added to your wallet.`,
        variant: "success",
      });
      setIsLoading(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          Top Up
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Top Up Your Wallet</DialogTitle>
          <DialogDescription>
            Add funds to your wallet to make purchases, save payment details, and track your spending.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="card">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="card" onClick={() => setPaymentMethod("card")}>
              <CreditCard className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="paypal" onClick={() => setPaymentMethod("paypal")}>
              <PaypalIcon className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="apple" onClick={() => setPaymentMethod("apple")}>
              <ApplePay className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="google" onClick={() => setPaymentMethod("google")}>
              <GooglePay className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
          </TabsList>

          <TabsContent value="card">
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
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
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="paypal">
            <div className="py-4 text-center">
              <PaypalIcon className="h-16 w-16 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                You'll be redirected to PayPal to complete your top up securely.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="paypal-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="paypal-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="5"
                    step="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[25, 50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="apple">
            <div className="py-4 text-center">
              <ApplePay className="h-16 w-16 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Complete your top up quickly and securely with Apple Pay.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="apple-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="apple-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="5"
                    step="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[25, 50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="google">
            <div className="py-4 text-center">
              <GooglePay className="h-16 w-16 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Complete your top up quickly and securely with Google Pay.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="google-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="google-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="5"
                    step="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[25, 50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="more">
            <div className="py-4">
              <RadioGroup defaultValue="bank" className="space-y-3">
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank" className="flex-1 flex items-center gap-2 cursor-pointer">
                    <BankTransferIcon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">1-3 business days</p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-3">
                  <RadioGroupItem value="bitcoin" id="bitcoin" />
                  <Label htmlFor="bitcoin" className="flex-1 flex items-center gap-2 cursor-pointer">
                    <BitcoinIcon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Bitcoin</p>
                      <p className="text-xs text-muted-foreground">Instant after confirmation</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid gap-2 mt-4">
                <Label htmlFor="more-amount">Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="more-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                    min="5"
                    step="5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[25, 50, 100, 200].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant="outline"
                    onClick={() => setAmount(value.toString())}
                    className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                  >
                    ${value}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={handleTopUp}
            disabled={isLoading || Number.parseFloat(amount) <= 0}
            className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
          >
            {isLoading ? "Processing..." : `Add $${Number.parseFloat(amount).toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const WalletWithdrawDialog = ({ onWithdraw, maxAmount }: { onWithdraw?: (amount: number) => void, maxAmount: number }) => {
  const [amount, setAmount] = useState("50");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleWithdraw = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (onWithdraw) {
        onWithdraw(Number.parseFloat(amount));
      }
      toast({
        title: "Withdrawal initiated",
        description: `$${amount} will be transferred to your bank account within 1-3 business days.`,
        variant: "info",
      });
      setIsLoading(false);
      setIsOpen(false);
    }, 1500);
  };

  const isAmountValid = Number.parseFloat(amount) > 0 && Number.parseFloat(amount) <= maxAmount;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpCircle className="h-4 w-4 mr-2" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Transfer money from your wallet to your bank account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="withdraw-amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="withdraw-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                min="5"
                max={maxAmount.toString()}
                step="5"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Available balance: {formatCurrency(maxAmount)}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[25, 50, 100, Math.floor(maxAmount / 2)].map((value) => (
              <Button
                key={value}
                type="button"
                variant="outline"
                onClick={() => setAmount(value.toString())}
                className={amount === value.toString() ? "border-[#43abc3] bg-[#43abc3]/10" : ""}
                disabled={value > maxAmount}
              >
                ${value}
              </Button>
            ))}
          </div>

          <div className="rounded-lg bg-blue-50 p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Bank Account</h4>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-blue-800">Bank of America ending in 5678</span>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3">
            <h4 className="text-sm font-medium mb-1">Withdrawal Information</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Withdrawals are processed within 1-3 business days</li>
              <li>• Minimum withdrawal amount is $5</li>
              <li>• No fees for standard withdrawals</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button
            onClick={handleWithdraw}
            disabled={isLoading || !isAmountValid}
            className={!isAmountValid ? "bg-gray-300" : "bg-[#43abc3] hover:bg-[#3a9bb5] text-white"}
          >
            {isLoading ? "Processing..." : "Withdraw"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Wallet = ({ wallet, onTopUp, onWithdraw }: WalletProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-medium">Your Wallet</h3>
        <div className="flex items-center gap-2">
          <WalletTopUpDialog onTopUp={onTopUp} />
          <WalletWithdrawDialog onWithdraw={onWithdraw} maxAmount={wallet.balance} />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Balance</CardTitle>
          <CardDescription>
            Last updated: {format(new Date(wallet.updatedAt), "MMM d, yyyy h:mm a")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-4">
            <div className="text-3xl font-bold">{formatCurrency(wallet.balance)}</div>
            <div className="text-sm text-muted-foreground">Available balance</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="bg-green-50 border-green-100">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Quick Add</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-100"
                    onClick={() => onTopUp && onTopUp(50)}
                  >
                    $50
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-200 hover:bg-green-100"
                    onClick={() => onTopUp && onTopUp(100)}
                  >
                    $100
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-100">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Auto Top-up</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-200 hover:bg-blue-100"
                  onClick={() => {
                    toast({
                      title: "Auto top-up enabled",
                      description: "Your wallet will be topped up automatically when balance falls below $25",
                      variant: "info"
                    });
                  }}
                >
                  Enable
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-100">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Payment Methods</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-purple-200 hover:bg-purple-100"
                  onClick={() => {
                    toast({
                      title: "Coming soon",
                      description: "Payment method management will be available soon",
                      variant: "info"
                    });
                  }}
                >
                  Manage
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-base font-medium flex items-center gap-2">
              <History className="h-4 w-4" />
              Transaction History
            </h4>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
              <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <TransactionList transactions={wallet.transactions} />
          </TabsContent>

          <TabsContent value="deposits">
            <TransactionList
              transactions={wallet.transactions.filter(t => t.type === "deposit" || t.type === "refund")}
            />
          </TabsContent>

          <TabsContent value="withdrawals">
            <TransactionList
              transactions={wallet.transactions.filter(t => t.type === "withdrawal")}
            />
          </TabsContent>

          <TabsContent value="purchases">
            <TransactionList
              transactions={wallet.transactions.filter(t => t.type === "purchase")}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface TransactionListProps {
  transactions: WalletTransactionType[];
}

const TransactionList = ({ transactions }: TransactionListProps) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center gap-4 p-3 border rounded-lg">
          <div className="flex-shrink-0">
            {getTransactionIcon(transaction.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <p className="text-sm font-medium">{transaction.description}</p>
              {transaction.status !== "completed" && (
                <span className="ml-2">{getTransactionStatusBadge(transaction.status)}</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {format(new Date(transaction.createdAt), "MMM d, yyyy · h:mm a")}
              {transaction.reference && ` · Ref: ${transaction.reference}`}
            </p>
          </div>
          <div className={`text-sm font-medium ${getTransactionColor(transaction.amount)}`}>
            {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wallet;
