import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          email: string;
          role: 'user' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          full_name?: string | null;
          email: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          email?: string;
          role?: 'user' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_modules: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          template_code: string;
          preview_image: string | null;
          is_free: boolean;
          price: number;
          category: string;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          template_code: string;
          preview_image?: string | null;
          is_free?: boolean;
          price?: number;
          category?: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          template_code?: string;
          preview_image?: string | null;
          is_free?: boolean;
          price?: number;
          category?: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_portfolios: {
        Row: {
          id: string;
          user_id: string;
          module_id: string | null;
          full_name: string;
          specialty: string;
          skills: string | null;
          bio: string | null;
          profile_image: string | null;
          linkedin: string | null;
          github: string | null;
          email: string | null;
          projects: any;
          tools: any;
          template_settings: any;
          generated_html: string | null;
          is_published: boolean;
          slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id?: string | null;
          full_name: string;
          specialty: string;
          skills?: string | null;
          bio?: string | null;
          profile_image?: string | null;
          linkedin?: string | null;
          github?: string | null;
          email?: string | null;
          projects?: any;
          tools?: any;
          template_settings?: any;
          generated_html?: string | null;
          is_published?: boolean;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string | null;
          full_name?: string;
          specialty?: string;
          skills?: string | null;
          bio?: string | null;
          profile_image?: string | null;
          linkedin?: string | null;
          github?: string | null;
          email?: string | null;
          projects?: any;
          tools?: any;
          template_settings?: any;
          generated_html?: string | null;
          is_published?: boolean;
          slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          amount: number;
          currency: string;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method: string | null;
          transaction_id: string | null;
          payment_data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          amount: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: string | null;
          transaction_id?: string | null;
          payment_data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          amount?: number;
          currency?: string;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          payment_method?: string | null;
          transaction_id?: string | null;
          payment_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_module_access: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          payment_id: string | null;
          granted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          payment_id?: string | null;
          granted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          payment_id?: string | null;
          granted_at?: string;
        };
      };
    };
  };
};
