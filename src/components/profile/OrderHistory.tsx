"use client";

import { OrderType } from "@/types/order";
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2, Clock, PackageOpen, Truck, XCircle, RefreshCcw } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface OrderHistoryProps {
  orders: OrderType[];
}

const getStatusIcon = (status: OrderType["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "processing":
      return <RefreshCcw className="h-5 w-5 text-blue-500" />;
    case "shipped":
      return <Truck className="h-5 w-5 text-purple-500" />;
    case "delivered":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "refunded":
      return <PackageOpen className="h-5 w-5 text-gray-500" />;
    default:
      return <Clock className="h-5 w-5 text-yellow-500" />;
  }
};

const getStatusBadge = (status: OrderType["status"]) => {
  const variants: Record<OrderType["status"], string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Badge variant="outline" className={`${variants[status]} capitalize`}>
      {status}
    </Badge>
  );
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const OrderHistory = ({ orders }: OrderHistoryProps) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <PackageOpen className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">No orders yet</h3>
        <p className="text-muted-foreground mb-4">
          You haven't placed any orders yet.
        </p>
        <Button
          onClick={() => window.location.href = "/"}
          className="bg-[#43abc3] hover:bg-[#3a9bb5] text-white"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Your Orders</h3>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-medium">
                    Order #{order.id.split("-").pop()}
                  </CardTitle>
                  <CardDescription>
                    Placed {format(new Date(order.createdAt), "MMM d, yyyy")} (
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    )
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`order-${order.id}`} className="border-none">
                  <AccordionTrigger className="py-2 hover:no-underline">
                    <span className="text-sm font-medium">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"} • Total: {formatCurrency(order.total)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-start gap-3 rounded-lg border p-3">
                            <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <h4 className="text-sm font-medium">{item.product.name}</h4>
                              <div className="text-xs text-muted-foreground">
                                Qty: {item.quantity} × {formatCurrency(item.price)}
                              </div>
                            </div>
                            <div className="text-sm font-medium">
                              {formatCurrency(item.subtotal)}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-2 text-sm border-t pt-3">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(order.items.reduce((sum, item) => sum + item.subtotal, 0))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>{formatCurrency(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>{formatCurrency(order.tax)}</span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between">
                            <span>Discount:</span>
                            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium border-t pt-2 mt-1">
                          <span>Total:</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>

                      {order.status === "shipped" && (
                        <div className="rounded-lg bg-blue-50 p-3 text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Shipping Information</span>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p>Tracking Number: {order.trackingNumber}</p>
                            <p>
                              Estimated Delivery: {order.estimatedDelivery &&
                                format(new Date(order.estimatedDelivery), "MMM d, yyyy")
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {order.notes && (
                        <div className="text-sm text-muted-foreground border-t pt-2">
                          <span className="font-medium">Order Notes:</span> {order.notes}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex justify-between pt-1">
              <Button variant="outline" size="sm">
                View Details
              </Button>
              {(order.status === "delivered" || order.status === "shipped") && (
                <Button variant="outline" size="sm">
                  Track Order
                </Button>
              )}
              {order.status === "pending" && (
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Cancel Order
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
