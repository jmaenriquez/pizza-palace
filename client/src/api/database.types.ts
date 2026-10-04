export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cart: {
        Row: {
          id: string
          ischecked: boolean | null
          product_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          id?: string
          ischecked?: boolean | null
          product_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          id?: string
          ischecked?: boolean | null
          product_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      order: {
        Row: {
          completed_order_date: string | null
          id: string
          order_status: string
          ordered_date: string
          payment_method: string
          total_amount: number
          user_id: string
        }
        Insert: {
          completed_order_date?: string | null
          id?: string
          order_status: string
          ordered_date?: string
          payment_method: string
          total_amount: number
          user_id: string
        }
        Update: {
          completed_order_date?: string | null
          id?: string
          order_status?: string
          ordered_date?: string
          payment_method?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price_at_purchase: number
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price_at_purchase?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "order"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          label: string | null
          price: number
          product_id: string | null
          sku: string
          sort_order: number
          stocks: number
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          price: number
          product_id?: string | null
          sku: string
          sort_order?: number
          stocks?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          price?: number
          product_id?: string | null
          sku?: string
          sort_order?: number
          stocks?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string
          name: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          name: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_infos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_infos: {
        Row: {
          birthday: string | null
          contact: string | null
          created_at: string
          fname: string
          id: string
          isActive: boolean
          lname: string
          mname: string | null
          role: string
        }
        Insert: {
          birthday?: string | null
          contact?: string | null
          created_at?: string
          fname: string
          id?: string
          isActive?: boolean
          lname: string
          mname?: string | null
          role?: string
        }
        Update: {
          birthday?: string | null
          contact?: string | null
          created_at?: string
          fname?: string
          id?: string
          isActive?: boolean
          lname?: string
          mname?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status_enums:
        | "Ordered"
        | "Processing"
        | "Ready"
        | "On Delivery"
        | "Picked Up"
        | "Delivered"
      payment_enums: "Online" | "Bank" | "Cash"
      product_category_enums:
        | "Classic"
        | "Meat"
        | "Vegetarian"
        | "Others"
        | "Beverages"
      user_enums: "User" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status_enums: [
        "Ordered",
        "Processing",
        "Ready",
        "On Delivery",
        "Picked Up",
        "Delivered",
      ],
      payment_enums: ["Online", "Bank", "Cash"],
      product_category_enums: [
        "Classic",
        "Meat",
        "Vegetarian",
        "Others",
        "Beverages",
      ],
      user_enums: ["User", "Admin"],
    },
  },
} as const
