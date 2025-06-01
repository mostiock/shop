import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize Supabase with graceful fallback for missing environment variables
let supabase: ReturnType<typeof createClient> | null = null;

if (
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "https://your-project.supabase.co" &&
  supabaseAnonKey !== "your-anon-key-here"
) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn("Failed to initialize Supabase client:", error);
    supabase = null;
  }
} else {
  console.warn("Supabase not configured - using mock database for development");
}

export { supabase };

// Database types
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  category: string;
  brand: string;
  model?: string;
  stock_count: number;
  in_stock: boolean;
  warranty?: string;
  image_url: string;
  images?: string[];
  features?: string[];
  specifications?: Record<string, unknown>;
  badges?: string[];
  created_at: string;
  updated_at: string;
}

export interface DatabaseAddress {
  address1: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface DatabasePaymentMethod {
  id: string;
  type: "card" | "paypal" | "apple_pay" | "google_pay";
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shipping_address?: DatabaseAddress;
  billing_address?: DatabaseAddress;
  payment_method?: DatabasePaymentMethod;
  tracking_number?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: Product;
}

// Database functions with graceful fallback
export const db = {
  // Users
  async createUser(userData: Partial<User>) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock user creation");
        return { id: "mock-user-id", ...userData };
      }
      const { data, error } = await supabase
        .from("users")
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async getUserByClerkId(clerkId: string) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock user lookup");
        return null;
      }
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", clerkId)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock user update");
        return null;
      }

      const { data, error } = await supabase
        .from("users")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  // Products
  async getAllProducts() {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - returning empty products");
        return [];
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getProductById(id: string) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - returning null product");
        return null;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  async createProduct(productData: Partial<Product>) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock product creation");
        return null;
      }

      const { data, error } = await supabase
        .from("products")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock product update");
        return null;
      }

      const { data, error } = await supabase
        .from("products")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async deleteProduct(id: string) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock product deletion");
        return true;
      }

      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Orders
  async createOrder(orderData: Partial<Order>) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock order creation");
        return null;
      }

      const { data, error } = await supabase
        .from("orders")
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - returning empty orders");
        return [];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Order[];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  async getAllOrders(): Promise<Order[]> {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - returning empty orders");
        return [];
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Order[];
    } catch (error) {
      console.error("Error fetching all orders:", error);
      return [];
    }
  },

  async updateOrder(id: string, updates: Partial<Order>) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock order update");
        return null;
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  },

  // Wishlist
  async addToWishlist(userId: string, productId: string) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock wishlist addition");
        return null;
      }

      const { data, error } = await supabase
        .from("wishlist")
        .insert([{ user_id: userId, product_id: productId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  async removeFromWishlist(userId: string, productId: string) {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - mock wishlist removal");
        return true;
      }

      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  async getWishlist(userId: string): Promise<WishlistItem[]> {
    try {
      if (!supabase) {
        console.warn("Supabase not configured - returning empty wishlist");
        return [];
      }

      const { data, error } = await supabase
        .from("wishlist")
        .select(`
          *,
          products (*)
        `)
        .eq("user_id", userId);

      if (error) throw error;
      return (data || []) as unknown as WishlistItem[];
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return [];
    }
  },
};
