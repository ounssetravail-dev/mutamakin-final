export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "student" | "admin";
          xp: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          xp?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: "student" | "admin";
          xp?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      specializations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          category_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          category_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          category_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "specializations_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };

      modules: {
        Row: {
          id: string;
          category_id: string | null;
          specialization_id: string | null;
          title: string;
          description: string | null;
          is_free: boolean;
          price: number;
          created_at: string;
          categories?: {
            slug: string;
            name: string;
          } | null;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          specialization_id?: string | null;
          title: string;
          description?: string | null;
          is_free?: boolean;
          price?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          specialization_id?: string | null;
          title?: string;
          description?: string | null;
          is_free?: boolean;
          price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "modules_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "modules_specialization_id_fkey";
            columns: ["specialization_id"];
            referencedRelation: "specializations";
            referencedColumns: ["id"];
          }
        ];
      };

      media_resources: {
        Row: {
          id: string;
          module_id: string | null;
          specialization_id: string | null;
          title: string;
          type: "video" | "podcast" | "article" | "book";
          url: string;
          original_url: string | null;
          thumbnail_url: string | null;
          content: string | null;
          source_type: "upload" | "youtube";
          created_at: string;
          modules?: {
            categories?: {
              slug: string;
              name: string;
            } | null;
          } | null;
        };
        Insert: {
          id?: string;
          module_id?: string | null;
          specialization_id?: string | null;
          title: string;
          type: "video" | "podcast" | "article" | "book";
          url: string;
          original_url?: string | null;
          thumbnail_url?: string | null;
          content?: string | null;
          source_type?: "upload" | "youtube";
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string | null;
          specialization_id?: string | null;
          title?: string;
          type?: "video" | "podcast" | "article" | "book";
          url?: string;
          original_url?: string | null;
          thumbnail_url?: string | null;
          content?: string | null;
          source_type?: "upload" | "youtube";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "media_resources_module_id_fkey";
            columns: ["module_id"];
            referencedRelation: "modules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "media_resources_specialization_id_fkey";
            columns: ["specialization_id"];
            referencedRelation: "specializations";
            referencedColumns: ["id"];
          }
        ];
      };

      reviews: {
        Row: {
          id: string;
          user_id: string | null;
          content: string;
          rating: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          content: string;
          rating: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          content?: string;
          rating?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      exercises: {
        Row: {
          id: string;
          module_id: string | null;
          title: string;
          xp_reward: number;
          passing_score: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id?: string | null;
          title: string;
          xp_reward?: number;
          passing_score?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string | null;
          title?: string;
          xp_reward?: number;
          passing_score?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      questions: {
        Row: {
          id: string;
          exercise_id: string | null;
          question_text: string;
          options: Json;
          correct_answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          exercise_id?: string | null;
          question_text: string;
          options: Json;
          correct_answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          exercise_id?: string | null;
          question_text?: string;
          options?: Json;
          correct_answer?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      exercise_submissions: {
        Row: {
          id: string;
          user_id: string | null;
          exercise_id: string | null;
          score: number;
          passed: boolean;
          xp_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          exercise_id?: string | null;
          score: number;
          passed: boolean;
          xp_earned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          exercise_id?: string | null;
          score?: number;
          passed?: boolean;
          xp_earned?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      meetings: {
        Row: {
          id: string;
          module_id: string | null;
          title: string;
          meeting_url: string;
          scheduled_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          module_id?: string | null;
          title: string;
          meeting_url: string;
          scheduled_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          module_id?: string | null;
          title?: string;
          meeting_url?: string;
          scheduled_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          module_id: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          module_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          module_id?: string | null;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}