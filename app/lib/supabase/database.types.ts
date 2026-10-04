/**
 * Database types for supabase/migrations/20261004120000_initial_schema.sql.
 * Regenerate after schema changes with:
 *   npx supabase gen types typescript --linked > app/lib/supabase/database.types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type Timestamps = { created_at: string; updated_at: string };

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: { user_id: string; name: string; created_at: string };
        Insert: { user_id: string; name?: string; created_at?: string };
        Update: { user_id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      site_content: {
        Row: {
          id: number;
          hero: Json;
          fun_fact: Json;
          about: Json;
          contact_info: Json;
          footer: Json;
          updated_at: string;
        };
        Insert: {
          id?: number;
          hero?: Json;
          fun_fact?: Json;
          about?: Json;
          contact_info?: Json;
          footer?: Json;
          updated_at?: string;
        };
        Update: {
          id?: number;
          hero?: Json;
          fun_fact?: Json;
          about?: Json;
          contact_info?: Json;
          footer?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_settings: {
        Row: {
          id: number;
          title_template: string;
          default_title: string;
          default_description: string;
          default_keywords: string;
          site_name: string;
          canonical_url: string;
          google_site_verification: string;
          og_image: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["seo_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["seo_settings"]["Row"]>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string | null;
          icon: string;
          features: string[];
          alt: string;
          href: string;
          sort_order: number;
          is_active: boolean;
        } & Timestamps;
        Insert: {
          id?: string;
          title: string;
          description?: string;
          image?: string | null;
          icon?: string;
          features?: string[];
          alt?: string;
          href?: string;
          sort_order?: number;
          is_active?: boolean;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
        Relationships: [];
      };
      portfolio: {
        Row: {
          id: string;
          title: string;
          client_name: string;
          category: string;
          description: string;
          image: string | null;
          link: string;
          alt: string;
          sort_order: number;
          is_active: boolean;
        } & Timestamps;
        Insert: {
          id?: string;
          title: string;
          client_name?: string;
          category: string;
          description?: string;
          image?: string | null;
          link?: string;
          alt?: string;
          sort_order?: number;
          is_active?: boolean;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["portfolio"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          role: string;
          quote: string;
          rating: number;
          initials: string;
          status: "pending" | "approved" | "rejected";
          reviewed_at: string | null;
          ip_hash: string | null;
        } & Timestamps;
        Insert: {
          id?: string;
          name: string;
          role: string;
          quote: string;
          rating?: number;
          initials?: string;
          status?: "pending" | "approved" | "rejected";
          reviewed_at?: string | null;
          ip_hash?: string | null;
        } & Partial<Timestamps>;
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          service: string;
          message: string;
          is_read: boolean;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string;
          service?: string;
          message: string;
          is_read?: boolean;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_submissions"]["Row"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
