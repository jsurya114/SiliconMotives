/**
 * Database types for supabase/migrations/*.sql.
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
/** Insert/Update shape: everything optional except the listed required keys. */
type Writable<Row, Required extends keyof Row = never> = Partial<Row> & Pick<Row, Required>;

type Table<Row, Required extends keyof Row = never> = {
  Row: Row;
  Insert: Writable<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};

export type TestimonialStatus = "pending" | "approved" | "rejected";

export type ClientRow = Timestamps & {
  id: string;
  name: string;
  logo: string | null;
  website: string;
  industry: string;
  description: string;
  is_public: boolean;
  featured: boolean;
  sort_order: number;
};

export type ProjectRow = Timestamps & {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_id: string | null;
  category: string;
  project_type: string;
  summary: string;
  description: string;
  cover_image: string | null;
  gallery: string[];
  tech_stack: string[];
  services: string[];
  url: string;
  alt: string;
  confidential: boolean;
  featured: boolean;
  published: boolean;
  sort_order: number;
  start_date: string | null;
  end_date: string | null;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
};

export type CaseStudyRow = Timestamps & {
  id: string;
  slug: string;
  title: string;
  project_id: string | null;
  client_id: string | null;
  anonymized: boolean;
  headline: string;
  summary: string;
  challenge: string;
  solution: string;
  outcome: string;
  responsibilities: string[];
  technologies: string[];
  metrics: Json;
  architecture: Json;
  cover_image: string | null;
  gallery: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
};

export type TestimonialRow = Timestamps & {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  status: TestimonialStatus;
  reviewed_at: string | null;
  ip_hash: string | null;
  company: string;
  company_logo: string | null;
  profile_url: string;
  project_id: string | null;
  featured: boolean;
  sort_order: number;
};

export type TeamMemberRow = Timestamps & {
  id: string;
  name: string;
  initials: string;
  role: string;
  focus: string;
  linkedin: string;
  photo: string | null;
  published: boolean;
  sort_order: number;
};

export type FaqRow = Timestamps & {
  id: string;
  topic: string;
  question: string;
  short_answer: string;
  answer: string;
  link_label: string;
  link_href: string;
  show_on_home: boolean;
  published: boolean;
  sort_order: number;
};

export type ServiceRow = Timestamps & {
  id: string;
  title: string;
  description: string;
  image: string | null;
  icon: string;
  features: string[];
  tools: string[];
  alt: string;
  href: string;
  sort_order: number;
  published: boolean;
};

export type SiteContentRow = {
  id: number;
  hero: Json;
  fun_fact: Json;
  about: Json;
  contact_info: Json;
  footer: Json;
  home: Json;
  updated_at: string;
};

export type SeoSettingsRow = {
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

export type ContactSubmissionRow = {
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

export interface Database {
  public: {
    Tables: {
      admin_users: Table<{ user_id: string; name: string; created_at: string }, "user_id">;
      site_content: Table<SiteContentRow>;
      seo_settings: Table<SeoSettingsRow>;
      services: Table<ServiceRow, "title">;
      projects: Table<ProjectRow, "slug" | "title" | "category">;
      case_studies: Table<CaseStudyRow, "slug" | "title">;
      clients: Table<ClientRow, "name">;
      testimonials: Table<TestimonialRow, "name" | "role" | "quote">;
      team_members: Table<TeamMemberRow, "name">;
      faqs: Table<FaqRow, "question" | "answer">;
      contact_submissions: Table<ContactSubmissionRow, "name" | "email" | "message">;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      public_project_details: {
        Args: Record<string, never>;
        Returns: { project_id: string; url: string; client_name: string | null; client_logo: string | null }[];
      };
      public_case_study_clients: {
        Args: Record<string, never>;
        Returns: { case_study_id: string; client_name: string }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
