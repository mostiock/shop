import { ProductType } from "./product";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItemType = {
  id: string;
  productId: string;
  product: ProductType;
  quantity: number;
  price: number; // Price at time of purchase
  subtotal: number;
};

export type OrderType = {
  id: string;
  userId: string;
  items: OrderItemType[];
  status: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  paymentMethod: "wallet" | "card" | "paypal";
  total: number;
  tax: number;
  shipping: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
};

export type WalletTransactionType = {
  id: string;
  userId: string;
  amount: number;
  type: "deposit" | "withdrawal" | "purchase" | "refund";
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
  reference?: string;
  orderId?: string;
};

export type WalletType = {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  updatedAt: string;
  transactions: WalletTransactionType[];
};
