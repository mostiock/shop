"use client";

import {
  type DatabaseAddress,
  type Order as DatabaseOrder,
  type DatabasePaymentMethod,
  type WishlistItem as DatabaseWishlistItem,
  type User,
  db,
} from "@/lib/database";
import type { PaymentMethod } from "@/types/user";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface Order {
  id: string;
  userId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shippingAddress: {
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress: {
    address1: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
}

interface WishlistItem {
  id: string;
  productId: string;
  userId: string;
  dateAdded: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  orders: Order[];
  wishlist: WishlistItem[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock address for orders
const mockAddress = {
  id: "addr-1",
  type: "shipping" as const,
  firstName: "John",
  lastName: "Smith",
  address1: "123 Smart Home Ave",
  city: "Tech City",
  state: "CA",
  zipCode: "94105",
  country: "United States",
  isDefault: true,
};

// Convert database Order to AuthContext Order format
function convertDatabaseOrderToAuthOrder(dbOrder: DatabaseOrder): Order {
  const defaultAddress = {
    address1: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  };

  const defaultPaymentMethod: PaymentMethod = {
    id: "",
    type: "card",
    last4: "",
    brand: "",
    expiryMonth: 1,
    expiryYear: 2025,
    isDefault: false,
  };

  // Helper function to ensure payment method type is valid
  function getValidPaymentType(
    type: string,
  ): "card" | "paypal" | "apple_pay" | "google_pay" {
    const validTypes = ["card", "paypal", "apple_pay", "google_pay"] as const;
    type ValidType = (typeof validTypes)[number];
    return (validTypes as readonly string[]).includes(type)
      ? (type as ValidType)
      : "card";
  }

  return {
    id: dbOrder.id,
    userId: dbOrder.user_id,
    status: dbOrder.status,
    items: Array.isArray(dbOrder.items)
      ? dbOrder.items.map((item) => ({
          productId: item.productId || "",
          productName: item.productName || "",
          productImage: "", // This would need to be populated from product data
          quantity: item.quantity || 1,
          price: item.price || 0,
          total: item.total || (item.price || 0) * (item.quantity || 1),
        }))
      : [],
    subtotal: dbOrder.subtotal,
    tax: dbOrder.tax,
    shipping: dbOrder.shipping,
    total: dbOrder.total,
    orderDate: dbOrder.created_at?.split("T")[0] || "",
    estimatedDelivery: dbOrder.estimated_delivery,
    trackingNumber: dbOrder.tracking_number,
    shippingAddress: dbOrder.shipping_address
      ? {
          address1: dbOrder.shipping_address.address1 || "",
          city: dbOrder.shipping_address.city || "",
          state: dbOrder.shipping_address.state || "",
          zipCode: dbOrder.shipping_address.zipCode || "",
          country: dbOrder.shipping_address.country || "",
        }
      : defaultAddress,
    billingAddress: dbOrder.billing_address
      ? {
          address1: dbOrder.billing_address.address1 || "",
          city: dbOrder.billing_address.city || "",
          state: dbOrder.billing_address.state || "",
          zipCode: dbOrder.billing_address.zipCode || "",
          country: dbOrder.billing_address.country || "",
        }
      : defaultAddress,
    paymentMethod: dbOrder.payment_method
      ? {
          id: dbOrder.payment_method.id || "",
          type: getValidPaymentType(dbOrder.payment_method.type),
          last4: dbOrder.payment_method.last4 || "",
          brand: dbOrder.payment_method.brand || "",
          expiryMonth: dbOrder.payment_method.expiryMonth || 1,
          expiryYear: dbOrder.payment_method.expiryYear || 2025,
          isDefault: dbOrder.payment_method.isDefault || false,
        }
      : defaultPaymentMethod,
  };
}

const mockOrders: Order[] = [
  {
    id: "order-001",
    userId: "user-1",
    status: "delivered",
    items: [
      {
        productId: "mixpad-mini",
        productName: "MixPad Mini Super Smart Panel",
        productImage: "https://ext.same-assets.com/596243380/550675188.png",
        quantity: 1,
        price: 299,
        total: 299,
      },
    ],
    subtotal: 299,
    tax: 23.92,
    shipping: 0,
    total: 322.92,
    shippingAddress: mockAddress,
    billingAddress: mockAddress,
    paymentMethod: {
      id: "pm-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    orderDate: "2024-01-10",
    estimatedDelivery: "2024-01-15",
    trackingNumber: "BOLES123456789",
  },
  {
    id: "order-002",
    userId: "user-1",
    status: "shipped",
    items: [
      {
        productId: "outdoor-security-cam",
        productName: "BOLES Outdoor Security Camera",
        productImage:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop",
        quantity: 2,
        price: 249,
        total: 498,
      },
    ],
    subtotal: 498,
    tax: 39.84,
    shipping: 0,
    total: 537.84,
    shippingAddress: mockAddress,
    billingAddress: mockAddress,
    paymentMethod: {
      id: "pm-1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    orderDate: "2024-01-20",
    estimatedDelivery: "2024-01-25",
    trackingNumber: "BOLES987654321",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { signOut } = useClerkAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // Sync Clerk user with Supabase user
  useEffect(() => {
    const syncUser = async () => {
      if (!clerkLoaded) return;

      if (clerkUser) {
        try {
          // Check if user exists in Supabase
          let supabaseUser = await db.getUserByClerkId(clerkUser.id);

          if (!supabaseUser) {
            // Create user in Supabase
            const newUserData = {
              clerk_id: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress || "",
              first_name: clerkUser.firstName || "",
              last_name: clerkUser.lastName || "",
              role: "user" as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };

            supabaseUser = await db.createUser(newUserData);
          }

          setUser(supabaseUser as unknown as User);

          // Load user data
          if (supabaseUser?.id) {
            // Load orders from Supabase
            try {
              const userOrders = await db.getOrdersByUserId(
                supabaseUser.id as string,
              );
              const convertedOrders = userOrders.map(
                convertDatabaseOrderToAuthOrder,
              );
              setOrders(
                convertedOrders.length > 0 ? convertedOrders : mockOrders,
              );
            } catch (error) {
              console.error("Error loading orders:", error);
              setOrders(mockOrders); // Fallback to mock orders
            }

            // Load wishlist from Supabase
            try {
              const userWishlist = await db.getWishlist(
                supabaseUser.id as string,
              );
              const wishlistItems: WishlistItem[] = userWishlist.map(
                (item: DatabaseWishlistItem) => ({
                  id: item.id,
                  productId: item.product_id,
                  userId: item.user_id,
                  dateAdded: item.created_at,
                }),
              );
              setWishlist(wishlistItems);
            } catch (error) {
              console.error("Error loading wishlist:", error);
              setWishlist([]);
            }
          }
        } catch (error) {
          console.error("Error syncing user:", error);
        }
      } else {
        // User is not authenticated
        setUser(null);
        setOrders([]);
        setWishlist([]);
      }

      setIsLoading(false);
    };

    syncUser();
  }, [clerkUser, clerkLoaded]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setOrders([]);
      setWishlist([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedUser = await db.updateUser(user.id, data);
      if (updatedUser) {
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await db.addToWishlist(user.id, productId);

      const newItem: WishlistItem = {
        id: `wishlist-${Date.now()}`,
        productId,
        userId: user.id,
        dateAdded: new Date().toISOString(),
      };

      setWishlist((prev) => [...prev, newItem]);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      await db.removeFromWishlist(user.id, productId);
      setWishlist((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!clerkUser,
        isAdmin: !!user && user.role === "admin",
        isLoading: isLoading || !clerkLoaded,
        logout,
        updateProfile,
        orders,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
