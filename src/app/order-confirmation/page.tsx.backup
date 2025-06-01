"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  PackageOpen,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Box,
  CreditCard,
  ArrowRight,
  Wallet
} from "lucide-react";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { Badge } from "@/components/ui/badge";

// Tracking statuses
type TrackingStatus =
  | "order_placed"
  | "payment_confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered";

interface TrackingStep {
  status: TrackingStatus;
  label: string;
  icon: React.ReactNode;
  date: Date | null;
  description: string;
  active: boolean;
  completed: boolean;
}

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  // Generate a random order number
  const [orderNumber] = useState(`BOL${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`);
  const [orderDate] = useState(new Date());
  const [trackingNumber] = useState(`TRK${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`);
  // Use the payment method from URL parameters, default to card if not specified
  const [paymentMethod] = useState<"card" | "wallet">(
    searchParams.get('method') === 'wallet' ? 'wallet' : 'card'
  );
  const [orderTotal] = useState(Math.floor(Math.random() * 500) + 100);

  const estimatedDelivery = addDays(orderDate, 5);

  // Initial tracking steps
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([
    {
      status: "order_placed",
      label: "Order Placed",
      icon: <CheckCircle2 className="h-5 w-5" />,
      date: new Date(),
      description: "Your order has been placed successfully",
      active: true,
      completed: true
    },
    {
      status: "payment_confirmed",
      label: "Payment Confirmed",
      icon: <CreditCard className="h-5 w-5" />,
      date: new Date(orderDate.getTime() + 5 * 60000), // 5 minutes later
      description: `Payment confirmed via ${paymentMethod === "card" ? "credit card" : "wallet balance"}`,
      active: true,
      completed: true
    },
    {
      status: "processing",
      label: "Processing",
      icon: <Box className="h-5 w-5" />,
      date: new Date(orderDate.getTime() + 120 * 60000), // 2 hours later
      description: "Your order is being processed",
      active: true,
      completed: true
    },
    {
      status: "shipped",
      label: "Shipped",
      icon: <PackageOpen className="h-5 w-5" />,
      date: null,
      description: "Your order has been shipped",
      active: false,
      completed: false
    },
    {
      status: "out_for_delivery",
      label: "Out for Delivery",
      icon: <Truck className="h-5 w-5" />,
      date: null,
      description: "Your order is out for delivery",
      active: false,
      completed: false
    },
    {
      status: "delivered",
      label: "Delivered",
      icon: <MapPin className="h-5 w-5" />,
      date: null,
      description: "Your order has been delivered",
      active: false,
      completed: false
    }
  ]);

  // Simulate order tracking updates
  useEffect(() => {
    if (!isLoading) {
      // Simulate shipping after 5 seconds
      const shippingTimer = setTimeout(() => {
        setTrackingSteps(prev =>
          prev.map(step =>
            step.status === "shipped"
              ? { ...step, active: true, completed: true, date: new Date() }
              : step
          )
        );
      }, 5000);

      return () => clearTimeout(shippingTimer);
    }
  }, [isLoading]);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="max-w-3xl mx-auto">
          <div className="h-10 w-72 bg-gray-200 rounded mb-6 animate-pulse" />
          <div className="bg-gray-100 rounded-lg h-64 animate-pulse mb-8" />
          <div className="bg-gray-100 rounded-lg h-96 animate-pulse" />
        </div>
      </div>
    );
  }

  const currentStep = trackingSteps.findIndex(step => step.active && !step.completed);
  const activeStep = currentStep === -1
    ? trackingSteps.filter(step => step.completed).length - 1
    : currentStep;

  return (
    <div className="container py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="mt-2 text-gray-600">
            Thank you for your order. We've received your purchase and are preparing it for shipment.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Details about your order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{orderNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{format(orderDate, "PPP")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tracking Number</p>
                <p className="font-medium">{trackingNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                <p className="font-medium">{format(estimatedDelivery, "PPP")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium flex items-center">
                  {paymentMethod === "card" ? (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Credit Card (ending in 4242)
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4 mr-2" />
                      Wallet Balance
                      <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-100" variant="outline">
                        Instant
                      </Badge>
                    </>
                  )}
                </p>
                {paymentMethod === "wallet" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Payment was successfully deducted from your wallet balance
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order Total</p>
                <p className="font-medium">${orderTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Tracking</CardTitle>
            <CardDescription>Follow your package's journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

              <div className="space-y-8">
                {trackingSteps.map((step, index) => (
                  <div key={step.status} className="relative pl-14">
                    {/* Timeline dot */}
                    <div className={`absolute left-[18px] top-0 w-5 h-5 rounded-full border-4
                      ${step.completed
                        ? 'border-green-500 bg-white'
                        : step.active
                          ? 'border-blue-500 bg-white'
                          : 'border-gray-300 bg-white'}`}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className={`mr-2 ${step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step.icon}
                          </span>
                          <h3 className={`font-medium ${step.completed ? 'text-green-600' : step.active ? 'text-blue-600' : 'text-gray-500'}`}>
                            {step.label}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {step.date ? (
                        <div className="mt-1 sm:mt-0 flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{format(step.date, "MMM d, yyyy")}</span>
                          <Clock className="h-3 w-3 mx-1" />
                          <span>{format(step.date, "h:mm a")}</span>
                        </div>
                      ) : (
                        <div className="mt-1 sm:mt-0 text-sm text-gray-400 italic">
                          Pending
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">
                Continue Shopping
              </Link>
            </Button>

            <Button className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white" asChild>
              <Link href="/profile">
                View All Orders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
