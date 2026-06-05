/**
 * Auto-generated Supabase Database types — DO NOT EDIT MANUALLY.
 *
 * Regenerate with the Supabase MCP `generate_typescript_types` tool
 * (project_id = wdpgkhghigaowtdtjztz) every time the schema changes.
 *
 * Convenience aliases at the bottom keep the existing import surface
 * (`Profile`, `Course`, `Module`, `Lesson`, ...) working across the
 * codebase without forcing a rename.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      access_codes: {
        Row: {
          code: string;
          course_id: string | null;
          created_at: string;
          created_by: string | null;
          digital_product_id: string | null;
          expires_at: string | null;
          id: string;
          max_uses: number | null;
          notes: string | null;
          scope: string;
          uses_count: number;
        };
        Insert: {
          code: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          digital_product_id?: string | null;
          expires_at?: string | null;
          id?: string;
          max_uses?: number | null;
          notes?: string | null;
          scope?: string;
          uses_count?: number;
        };
        Update: {
          code?: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          digital_product_id?: string | null;
          expires_at?: string | null;
          id?: string;
          max_uses?: number | null;
          notes?: string | null;
          scope?: string;
          uses_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "access_codes_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_codes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "access_codes_digital_product_id_fkey";
            columns: ["digital_product_id"];
            isOneToOne: false;
            referencedRelation: "digital_products";
            referencedColumns: ["id"];
          },
        ];
      };
      certificates: {
        Row: {
          cert_code: string;
          course_id: string;
          id: string;
          issued_at: string;
          user_id: string;
        };
        Insert: {
          cert_code: string;
          course_id: string;
          id?: string;
          issued_at?: string;
          user_id: string;
        };
        Update: {
          cert_code?: string;
          course_id?: string;
          id?: string;
          issued_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      contacts: {
        Row: {
          age: number | null;
          created_at: string;
          email: string;
          id: string;
          interest: string | null;
          level: string | null;
          message: string | null;
          name: string;
        };
        Insert: {
          age?: number | null;
          created_at?: string;
          email: string;
          id?: string;
          interest?: string | null;
          level?: string | null;
          message?: string | null;
          name: string;
        };
        Update: {
          age?: number | null;
          created_at?: string;
          email?: string;
          id?: string;
          interest?: string | null;
          level?: string | null;
          message?: string | null;
          name?: string;
        };
        Relationships: [];
      };
      course_resources: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          file_path: string | null;
          file_size_bytes: number | null;
          id: string;
          is_free_preview: boolean;
          kind: string;
          lesson_id: string | null;
          position: number;
          title: string;
          url: string | null;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          file_size_bytes?: number | null;
          id?: string;
          is_free_preview?: boolean;
          kind?: string;
          lesson_id?: string | null;
          position?: number;
          title: string;
          url?: string | null;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          file_path?: string | null;
          file_size_bytes?: number | null;
          id?: string;
          is_free_preview?: boolean;
          kind?: string;
          lesson_id?: string | null;
          position?: number;
          title?: string;
          url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "course_resources_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_resources_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      course_reviews: {
        Row: {
          body: string | null;
          course_id: string;
          created_at: string;
          id: string;
          is_pinned: boolean;
          is_visible: boolean;
          rating: number;
          title: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          is_visible?: boolean;
          rating: number;
          title?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          is_pinned?: boolean;
          is_visible?: boolean;
          rating?: number;
          title?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_tags: {
        Row: {
          course_id: string;
          tag_id: string;
        };
        Insert: {
          course_id: string;
          tag_id: string;
        };
        Update: {
          course_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_tags_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "tags";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          avg_rating: number | null;
          caption_style: string;
          cover_image_path: string | null;
          created_at: string;
          created_by: string | null;
          currency: string;
          description: string | null;
          id: string;
          is_published: boolean;
          learning_outcomes: string[];
          level: string;
          money_back_days: number;
          money_back_enabled: boolean;
          price_gbp: number;
          ratings_count: number;
          slug: string;
          students_count: number;
          subtitle: string | null;
          title: string;
          trailer_video_path: string | null;
          updated_at: string;
        };
        Insert: {
          avg_rating?: number | null;
          caption_style?: string;
          cover_image_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          learning_outcomes?: string[];
          level?: string;
          money_back_days?: number;
          money_back_enabled?: boolean;
          price_gbp?: number;
          ratings_count?: number;
          slug: string;
          students_count?: number;
          subtitle?: string | null;
          title: string;
          trailer_video_path?: string | null;
          updated_at?: string;
        };
        Update: {
          avg_rating?: number | null;
          caption_style?: string;
          cover_image_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description?: string | null;
          id?: string;
          is_published?: boolean;
          learning_outcomes?: string[];
          level?: string;
          money_back_days?: number;
          money_back_enabled?: boolean;
          price_gbp?: number;
          ratings_count?: number;
          slug?: string;
          students_count?: number;
          subtitle?: string | null;
          title?: string;
          trailer_video_path?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      digital_product_purchases: {
        Row: {
          access_code_id: string | null;
          amount_paid_gbp: number;
          created_at: string;
          id: string;
          paypal_order_id: string | null;
          product_id: string;
          source: string;
          user_id: string;
        };
        Insert: {
          access_code_id?: string | null;
          amount_paid_gbp?: number;
          created_at?: string;
          id?: string;
          paypal_order_id?: string | null;
          product_id: string;
          source: string;
          user_id: string;
        };
        Update: {
          access_code_id?: string | null;
          amount_paid_gbp?: number;
          created_at?: string;
          id?: string;
          paypal_order_id?: string | null;
          product_id?: string;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "digital_product_purchases_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "digital_products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "digital_product_purchases_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      digital_products: {
        Row: {
          cover_image_path: string | null;
          created_at: string;
          created_by: string | null;
          currency: string;
          description: string | null;
          file_path: string;
          file_size_bytes: number | null;
          id: string;
          is_published: boolean;
          preview_path: string | null;
          price_gbp: number;
          slug: string;
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          cover_image_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description?: string | null;
          file_path: string;
          file_size_bytes?: number | null;
          id?: string;
          is_published?: boolean;
          preview_path?: string | null;
          price_gbp?: number;
          slug: string;
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          cover_image_path?: string | null;
          created_at?: string;
          created_by?: string | null;
          currency?: string;
          description?: string | null;
          file_path?: string;
          file_size_bytes?: number | null;
          id?: string;
          is_published?: boolean;
          preview_path?: string | null;
          price_gbp?: number;
          slug?: string;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "digital_products_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      discount_codes: {
        Row: {
          code: string;
          course_id: string | null;
          created_at: string;
          created_by: string | null;
          digital_product_id: string | null;
          expires_at: string | null;
          id: string;
          max_uses: number | null;
          notes: string | null;
          percent_off: number;
          scope: string;
          uses_count: number;
        };
        Insert: {
          code: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          digital_product_id?: string | null;
          expires_at?: string | null;
          id?: string;
          max_uses?: number | null;
          notes?: string | null;
          percent_off: number;
          scope: string;
          uses_count?: number;
        };
        Update: {
          code?: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          digital_product_id?: string | null;
          expires_at?: string | null;
          id?: string;
          max_uses?: number | null;
          notes?: string | null;
          percent_off?: number;
          scope?: string;
          uses_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: "discount_codes_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discount_codes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "discount_codes_digital_product_id_fkey";
            columns: ["digital_product_id"];
            isOneToOne: false;
            referencedRelation: "digital_products";
            referencedColumns: ["id"];
          },
        ];
      };
      email_log: {
        Row: {
          error: string | null;
          id: string;
          payload: Json | null;
          provider_message_id: string | null;
          sent_at: string;
          status: string;
          subject: string;
          template: string;
          to_email: string;
          to_user_id: string | null;
        };
        Insert: {
          error?: string | null;
          id?: string;
          payload?: Json | null;
          provider_message_id?: string | null;
          sent_at?: string;
          status?: string;
          subject: string;
          template: string;
          to_email: string;
          to_user_id?: string | null;
        };
        Update: {
          error?: string | null;
          id?: string;
          payload?: Json | null;
          provider_message_id?: string | null;
          sent_at?: string;
          status?: string;
          subject?: string;
          template?: string;
          to_email?: string;
          to_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_log_to_user_id_fkey";
            columns: ["to_user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          access_code_id: string | null;
          course_id: string;
          created_at: string;
          id: string;
          paypal_order_id: string | null;
          source: string;
          user_id: string;
        };
        Insert: {
          access_code_id?: string | null;
          course_id: string;
          created_at?: string;
          id?: string;
          paypal_order_id?: string | null;
          source: string;
          user_id: string;
        };
        Update: {
          access_code_id?: string | null;
          course_id?: string;
          created_at?: string;
          id?: string;
          paypal_order_id?: string | null;
          source?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_access_code_id_fkey";
            columns: ["access_code_id"];
            isOneToOne: false;
            referencedRelation: "access_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_bookmarks: {
        Row: {
          created_at: string;
          id: string;
          label: string | null;
          lesson_id: string;
          timestamp_seconds: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          label?: string | null;
          lesson_id: string;
          timestamp_seconds: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          label?: string | null;
          lesson_id?: string;
          timestamp_seconds?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_bookmarks_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_bookmarks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_notes: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          lesson_id: string;
          timestamp_seconds: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          lesson_id: string;
          timestamp_seconds: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          lesson_id?: string;
          timestamp_seconds?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_notes_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: {
          completed_at: string;
          id: string;
          last_position_seconds: number;
          lesson_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          id?: string;
          last_position_seconds?: number;
          lesson_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          id?: string;
          last_position_seconds?: number;
          lesson_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_subtitles: {
        Row: {
          error: string | null;
          generated_at: string | null;
          id: string;
          language: string;
          lesson_id: string;
          status: string;
          updated_at: string;
          vtt_path: string | null;
        };
        Insert: {
          error?: string | null;
          generated_at?: string | null;
          id?: string;
          language: string;
          lesson_id: string;
          status?: string;
          updated_at?: string;
          vtt_path?: string | null;
        };
        Update: {
          error?: string | null;
          generated_at?: string | null;
          id?: string;
          language?: string;
          lesson_id?: string;
          status?: string;
          updated_at?: string;
          vtt_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_subtitles_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_free_preview: boolean;
          is_trailer: boolean;
          module_id: string;
          mux_asset_id: string | null;
          mux_duration_seconds: number | null;
          mux_playback_id: string | null;
          mux_static_mp4_url: string | null;
          mux_status: string;
          mux_thumbnail_url: string | null;
          mux_upload_id: string | null;
          position: number;
          release_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
          video_duration_seconds: number | null;
          video_path: string | null;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_free_preview?: boolean;
          is_trailer?: boolean;
          module_id: string;
          mux_asset_id?: string | null;
          mux_duration_seconds?: number | null;
          mux_playback_id?: string | null;
          mux_static_mp4_url?: string | null;
          mux_status?: string;
          mux_thumbnail_url?: string | null;
          mux_upload_id?: string | null;
          position?: number;
          release_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
          video_duration_seconds?: number | null;
          video_path?: string | null;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_free_preview?: boolean;
          is_trailer?: boolean;
          module_id?: string;
          mux_asset_id?: string | null;
          mux_duration_seconds?: number | null;
          mux_playback_id?: string | null;
          mux_static_mp4_url?: string | null;
          mux_status?: string;
          mux_thumbnail_url?: string | null;
          mux_upload_id?: string | null;
          position?: number;
          release_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
          video_duration_seconds?: number | null;
          video_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
      modules: {
        Row: {
          course_id: string;
          created_at: string;
          description: string | null;
          id: string;
          is_free: boolean;
          position: number;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_free?: boolean;
          position?: number;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_free?: boolean;
          position?: number;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          amount: number;
          course_id: string;
          created_at: string;
          currency: string;
          discount_code_id: string | null;
          discount_percent: number | null;
          id: string;
          provider: string;
          provider_capture_id: string | null;
          provider_order_id: string;
          raw_payload: Json | null;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          course_id: string;
          created_at?: string;
          currency?: string;
          discount_code_id?: string | null;
          discount_percent?: number | null;
          id?: string;
          provider?: string;
          provider_capture_id?: string | null;
          provider_order_id: string;
          raw_payload?: Json | null;
          status: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          course_id?: string;
          created_at?: string;
          currency?: string;
          discount_code_id?: string | null;
          discount_percent?: number | null;
          id?: string;
          provider?: string;
          provider_capture_id?: string | null;
          provider_order_id?: string;
          raw_payload?: Json | null;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_discount_code_id_fkey";
            columns: ["discount_code_id"];
            isOneToOne: false;
            referencedRelation: "discount_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string | null;
          id: string;
          onboarded_at: string | null;
          role: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name?: string | null;
          id: string;
          onboarded_at?: string | null;
          role?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string | null;
          id?: string;
          onboarded_at?: string | null;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subtitle_cue_history: {
        Row: {
          cue_id: string;
          edited_at: string;
          edited_by: string | null;
          id: string;
          previous_text: string;
        };
        Insert: {
          cue_id: string;
          edited_at?: string;
          edited_by?: string | null;
          id?: string;
          previous_text: string;
        };
        Update: {
          cue_id?: string;
          edited_at?: string;
          edited_by?: string | null;
          id?: string;
          previous_text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subtitle_cue_history_cue_id_fkey";
            columns: ["cue_id"];
            isOneToOne: false;
            referencedRelation: "subtitle_cues";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subtitle_cue_history_edited_by_fkey";
            columns: ["edited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      subtitle_cues: {
        Row: {
          created_at: string;
          edited_at: string | null;
          edited_by: string | null;
          end_seconds: number;
          id: string;
          is_edited: boolean;
          language: string;
          lesson_id: string;
          position: number;
          start_seconds: number;
          text: string;
        };
        Insert: {
          created_at?: string;
          edited_at?: string | null;
          edited_by?: string | null;
          end_seconds: number;
          id?: string;
          is_edited?: boolean;
          language: string;
          lesson_id: string;
          position: number;
          start_seconds: number;
          text: string;
        };
        Update: {
          created_at?: string;
          edited_at?: string | null;
          edited_by?: string | null;
          end_seconds?: number;
          id?: string;
          is_edited?: boolean;
          language?: string;
          lesson_id?: string;
          position?: number;
          start_seconds?: number;
          text?: string;
        };
        Relationships: [
          {
            foreignKeyName: "subtitle_cues_edited_by_fkey";
            columns: ["edited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subtitle_cues_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          created_at: string;
          display_order: number;
          id: string;
          name: string;
          slug: string;
        };
        Insert: {
          created_at?: string;
          display_order?: number;
          id?: string;
          name: string;
          slug: string;
        };
        Update: {
          created_at?: string;
          display_order?: number;
          id?: string;
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          caption_lang_default: string;
          created_at: string;
          learning_goal: string | null;
          playback_speed: number;
          reminder_day_of_week: number | null;
          reminder_enabled: boolean;
          reminder_frequency: string | null;
          reminder_time_of_day: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          caption_lang_default?: string;
          created_at?: string;
          learning_goal?: string | null;
          playback_speed?: number;
          reminder_day_of_week?: number | null;
          reminder_enabled?: boolean;
          reminder_frequency?: string | null;
          reminder_time_of_day?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          caption_lang_default?: string;
          created_at?: string;
          learning_goal?: string | null;
          playback_speed?: number;
          reminder_day_of_week?: number | null;
          reminder_enabled?: boolean;
          reminder_frequency?: string | null;
          reminder_time_of_day?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      webhook_events: {
        Row: {
          event_id: string;
          event_type: string;
          id: string;
          payload: Json | null;
          processed_at: string | null;
          provider: string;
          received_at: string;
        };
        Insert: {
          event_id: string;
          event_type: string;
          id?: string;
          payload?: Json | null;
          processed_at?: string | null;
          provider: string;
          received_at?: string;
        };
        Update: {
          event_id?: string;
          event_type?: string;
          id?: string;
          payload?: Json | null;
          processed_at?: string | null;
          provider?: string;
          received_at?: string;
        };
        Relationships: [];
      };
      workbook_notes: {
        Row: {
          content: string;
          created_at: string;
          id: string;
          updated_at: string;
          user_id: string;
          workbook_id: string;
        };
        Insert: {
          content?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id: string;
          workbook_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: string;
          updated_at?: string;
          user_id?: string;
          workbook_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workbook_notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workbook_notes_workbook_id_fkey";
            columns: ["workbook_id"];
            isOneToOne: false;
            referencedRelation: "workbooks";
            referencedColumns: ["id"];
          },
        ];
      };
      workbooks: {
        Row: {
          created_at: string;
          id: string;
          lesson_id: string | null;
          module_id: string | null;
          pdf_path: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          module_id?: string | null;
          pdf_path: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lesson_id?: string | null;
          module_id?: string | null;
          pdf_path?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "workbooks_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "workbooks_module_id_fkey";
            columns: ["module_id"];
            isOneToOne: false;
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// =============================================================
// Convenience aliases (kept stable across schema versions)
// =============================================================

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Module = Database["public"]["Tables"]["modules"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type Workbook = Database["public"]["Tables"]["workbooks"]["Row"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type LessonProgress =
  Database["public"]["Tables"]["lesson_progress"]["Row"];
export type WorkbookNote =
  Database["public"]["Tables"]["workbook_notes"]["Row"];
export type AccessCode = Database["public"]["Tables"]["access_codes"]["Row"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Contact = Database["public"]["Tables"]["contacts"]["Row"];

// New (ondemand build)
export type DiscountCode =
  Database["public"]["Tables"]["discount_codes"]["Row"];
export type DigitalProduct =
  Database["public"]["Tables"]["digital_products"]["Row"];
export type DigitalProductPurchase =
  Database["public"]["Tables"]["digital_product_purchases"]["Row"];
export type CourseResource =
  Database["public"]["Tables"]["course_resources"]["Row"];
export type CourseReview =
  Database["public"]["Tables"]["course_reviews"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type EmailLog = Database["public"]["Tables"]["email_log"]["Row"];
export type LessonNote = Database["public"]["Tables"]["lesson_notes"]["Row"];
export type LessonBookmark =
  Database["public"]["Tables"]["lesson_bookmarks"]["Row"];
export type LessonSubtitle =
  Database["public"]["Tables"]["lesson_subtitles"]["Row"];
export type SubtitleCue =
  Database["public"]["Tables"]["subtitle_cues"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];
export type CourseTag = Database["public"]["Tables"]["course_tags"]["Row"];
export type UserPreferences =
  Database["public"]["Tables"]["user_preferences"]["Row"];
export type WebhookEvent =
  Database["public"]["Tables"]["webhook_events"]["Row"];

// Useful enum-ish unions
export type UserRole = "student" | "admin";
export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "All Levels";
export type EnrollmentSource =
  | "paypal"
  | "access_code"
  | "free"
  | "admin_grant";
export type PaymentStatus =
  | "created"
  | "approved"
  | "captured"
  | "failed"
  | "refunded";
export type MuxStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "ready"
  | "errored";
export type SubtitleLanguage = "en" | "es";
export type SubtitleStatus =
  | "pending"
  | "generating"
  | "auto"
  | "edited"
  | "failed";
export type CodeScope = "course" | "digital_product" | "any";
export type ResourceKind =
  | "pdf"
  | "audio"
  | "image"
  | "doc"
  | "spreadsheet"
  | "slides"
  | "archive"
  | "other";
