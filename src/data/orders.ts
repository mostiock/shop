import { products } from "./products";
import type { OrderType, WalletTransactionType, WalletType } from "@/types/order";
import type { ProductType } from "@/types/product";

// Helper function to create a random date within the last 6 months
const getRandomPastDate = (maxDaysAgo = 180) => {
  const today = new Date();
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - Math.floor(Math.random() * maxDaysAgo));
  return pastDate.toISOString();
};

// Helper function to create a random future date within the next 14 days
const getRandomFutureDate = () => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1);
  return futureDate.toISOString();
};

// Create mock order items from products
const createOrderItems = (count: number) => {
  const items = [];
  const usedProductIds = new Set();

  for (let i = 0; i < count; i++) {
    let product: ProductType;

    // Ensure we don't use the same product twice in an order
    do {
      const randomIndex = Math.floor(Math.random() * products.length);
      product = products[randomIndex] as ProductType;
    } while (usedProductIds.has(product.id));

    usedProductIds.add(product.id);

    const quantity = Math.floor(Math.random() * 3) + 1;
    const price = product.price;
    const subtotal = price * quantity;

    items.push({
      id: `item-${product.id}-${Date.now()}-${i}`,
      productId: product.id,
      product,
      quantity,
      price,
      subtotal,
    });
  }

  return items;
};

// Generate mock orders
export const generateMockOrders = (userId: string, count = 5): OrderType[] => {
  const statuses: OrderType["status"][] = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  const paymentMethods: OrderType["paymentMethod"][] = ["wallet", "card", "paypal"];

  const orders: OrderType[] = [];

  for (let i = 0; i < count; i++) {
    const createdAt = getRandomPastDate();
    const updatedAt = new Date(createdAt);
    updatedAt.setHours(updatedAt.getHours() + Math.floor(Math.random() * 48));

    const items = createOrderItems(Math.floor(Math.random() * 3) + 1);
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = Number.parseFloat((subtotal * 0.07).toFixed(2));
    const shipping = Number.parseFloat((Math.random() * 20 + 5).toFixed(2));
    const discount = i % 3 === 0 ? Number.parseFloat((subtotal * 0.1).toFixed(2)) : 0;
    const total = Number.parseFloat((subtotal + tax + shipping - discount).toFixed(2));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];

    // Generate tracking number for shipped and delivered orders
    const trackingNumber = status === "shipped" || status === "delivered"
      ? `TRK${Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')}`
      : undefined;

    // Generate estimated delivery for shipped orders
    const estimatedDelivery = status === "shipped"
      ? getRandomFutureDate()
      : undefined;

    orders.push({
      id: `order-${Date.now()}-${i}`,
      userId,
      items,
      status,
      shippingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        country: "USA",
        zipCode: "12345",
      },
      billingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        country: "USA",
        zipCode: "12345",
      },
      paymentMethod,
      total,
      tax,
      shipping,
      discount,
      createdAt,
      updatedAt: updatedAt.toISOString(),
      trackingNumber,
      estimatedDelivery,
      notes: i === 0 ? "Please leave package at the door" : undefined,
    });
  }

  // Sort by created date (newest first)
  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Helper for wallet transaction description
const getTransactionDescription = (type: WalletTransactionType["type"], amount: number): string => {
  switch (type) {
    case "deposit":
      return "Wallet top-up";
    case "withdrawal":
      return "Withdrawal to bank account";
    case "purchase":
      return `Payment for order #${Math.floor(Math.random() * 100000)}`;
    case "refund":
      return `Refund for order #${Math.floor(Math.random() * 100000)}`;
    default:
      return "";
  }
};

// Generate mock wallet transactions
export const generateMockWalletTransactions = (userId: string, count = 10): WalletTransactionType[] => {
  const transactions: WalletTransactionType[] = [];
  const types: WalletTransactionType["type"][] = ["deposit", "withdrawal", "purchase", "refund"];
  const statuses: WalletTransactionType["status"][] = ["completed", "pending", "failed"];

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // Generate different amounts based on transaction type
    let amount = 0;

    switch (type) {
      case "deposit":
        amount = Number.parseFloat((Math.random() * 200 + 50).toFixed(2));
        break;
      case "withdrawal":
        amount = Number.parseFloat((-1 * (Math.random() * 100 + 20)).toFixed(2));
        break;
      case "purchase":
        amount = Number.parseFloat((-1 * (Math.random() * 300 + 30)).toFixed(2));
        break;
      case "refund":
        amount = Number.parseFloat((Math.random() * 150 + 30).toFixed(2));
        break;
    }

    const createdAt = getRandomPastDate(90);

    transactions.push({
      id: `txn-${Date.now()}-${i}`,
      userId,
      amount,
      type,
      status,
      description: getTransactionDescription(type, amount),
      createdAt,
      reference: `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      orderId: type === "purchase" || type === "refund" ? `order-${Math.floor(Math.random() * 1000)}` : undefined,
    });
  }

  // Sort by created date (newest first)
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Generate mock wallet
export const generateMockWallet = (userId: string): WalletType => {
  const transactions = generateMockWalletTransactions(userId);
  const balance = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return {
    id: `wallet-${userId}`,
    userId,
    balance: Number.parseFloat(balance.toFixed(2)),
    currency: "USD",
    updatedAt: new Date().toISOString(),
    transactions,
  };
};
