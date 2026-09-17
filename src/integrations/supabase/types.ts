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
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: Database["public"]["Enums"]["listing_category"]
          contact_phone: string | null
          created_at: string
          currency: string
          description: string
          id: string
          images: string[]
          listing_kind: Database["public"]["Enums"]["listing_kind"]
          location: string
          price: number
          seller_id: string | null
          seller_name: string | null
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["listing_category"]
          contact_phone?: string | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: string[]
          listing_kind?: Database["public"]["Enums"]["listing_kind"]
          location?: string
          price?: number
          seller_id?: string | null
          seller_name?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category"]
          contact_phone?: string | null
          created_at?: string
          currency?: string
          description?: string
          id?: string
          images?: string[]
          listing_kind?: Database["public"]["Enums"]["listing_kind"]
          location?: string
          price?: number
          seller_id?: string | null
          seller_name?: string | null
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean
          listing_id: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean
          listing_id: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean
          listing_id?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notary_requests: {
        Row: {
          admin_comment: string
          buyer_full_name: string
          buyer_passport: string
          buyer_phone: string
          buyer_pinfl: string
          cadastre_number: string | null
          created_at: string
          currency: string
          id: string
          identity_method: string
          identity_payload: Json | null
          identity_status: Database["public"]["Enums"]["identity_status"]
          identity_verified_at: string | null
          listing_id: string | null
          notes: string
          price_snapshot: number
          property_address: string
          property_area: number | null
          property_title: string
          property_type: string
          property_value: number
          seller_full_name: string
          seller_passport: string
          seller_phone: string
          seller_pinfl: string
          service_code: string
          status: Database["public"]["Enums"]["notary_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_comment?: string
          buyer_full_name?: string
          buyer_passport?: string
          buyer_phone?: string
          buyer_pinfl?: string
          cadastre_number?: string | null
          created_at?: string
          currency?: string
          id?: string
          identity_method?: string
          identity_payload?: Json | null
          identity_status?: Database["public"]["Enums"]["identity_status"]
          identity_verified_at?: string | null
          listing_id?: string | null
          notes?: string
          price_snapshot?: number
          property_address?: string
          property_area?: number | null
          property_title?: string
          property_type?: string
          property_value?: number
          seller_full_name?: string
          seller_passport?: string
          seller_phone?: string
          seller_pinfl?: string
          service_code: string
          status?: Database["public"]["Enums"]["notary_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_comment?: string
          buyer_full_name?: string
          buyer_passport?: string
          buyer_phone?: string
          buyer_pinfl?: string
          cadastre_number?: string | null
          created_at?: string
          currency?: string
          id?: string
          identity_method?: string
          identity_payload?: Json | null
          identity_status?: Database["public"]["Enums"]["identity_status"]
          identity_verified_at?: string | null
          listing_id?: string | null
          notes?: string
          price_snapshot?: number
          property_address?: string
          property_area?: number | null
          property_title?: string
          property_type?: string
          property_value?: number
          seller_full_name?: string
          seller_passport?: string
          seller_phone?: string
          seller_pinfl?: string
          service_code?: string
          status?: Database["public"]["Enums"]["notary_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notary_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notary_requests_service_code_fkey"
            columns: ["service_code"]
            isOneToOne: false
            referencedRelation: "service_prices"
            referencedColumns: ["code"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      service_prices: {
        Row: {
          code: string
          created_at: string
          currency: string
          description_ru: string
          description_uz: string
          id: string
          is_active: boolean
          name_ru: string
          name_uz: string
          price: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          description_ru?: string
          description_uz?: string
          id?: string
          is_active?: boolean
          name_ru: string
          name_uz: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          description_ru?: string
          description_uz?: string
          id?: string
          is_active?: boolean
          name_ru?: string
          name_uz?: string
          price?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_listing_views: {
        Args: { _listing_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "notary" | "user"
      identity_status: "pending" | "verified" | "failed"
      listing_category:
        | "real_estate"
        | "vehicles"
        | "electronics"
        | "furniture"
        | "other"
      listing_kind: "sale" | "rent"
      listing_status: "active" | "archived" | "sold"
      notary_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "approved"
        | "rejected"
        | "completed"
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
      app_role: ["admin", "notary", "user"],
      identity_status: ["pending", "verified", "failed"],
      listing_category: [
        "real_estate",
        "vehicles",
        "electronics",
        "furniture",
        "other",
      ],
      listing_kind: ["sale", "rent"],
      listing_status: ["active", "archived", "sold"],
      notary_status: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "rejected",
        "completed",
      ],
    },
  },
} as const
