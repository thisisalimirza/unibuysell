export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ListingCategory = "Textbooks" | "Medical Gear" | "Electronics" | "Subleases";
export type ListingCondition = "New" | "Like New" | "Good" | "Fair";
export type ListingStatus = "available" | "pending" | "sold";
export type EnrollmentStatus = "verified_student" | "verified_medical_student";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          university_domain: string;
          university_name: string;
          enrollment_status: EnrollmentStatus;
          avatar_url: string | null;
          rating: number;
          review_count: number;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          university_domain: string;
          university_name: string;
          enrollment_status?: EnrollmentStatus;
          avatar_url?: string | null;
          rating?: number;
          review_count?: number;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          university_name?: string;
          enrollment_status?: EnrollmentStatus;
          avatar_url?: string | null;
          verified_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: ListingCategory;
          condition: ListingCondition;
          images: string[];
          status: ListingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          title: string;
          description: string;
          price: number;
          category: ListingCategory;
          condition: ListingCondition;
          images?: string[];
          status?: ListingStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          description?: string;
          price?: number;
          category?: ListingCategory;
          condition?: ListingCondition;
          images?: string[];
          status?: ListingStatus;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_rooms: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          seller_id: string;
          listing_id: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          chat_room_id: string;
          sender_id: string;
          text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_room_id: string;
          sender_id: string;
          text: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          listing_id: string;
          chat_room_id: string;
          buyer_id: string;
          seller_id: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          chat_room_id: string;
          buyer_id: string;
          seller_id: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          transaction_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          full_name: string;
          university_domain: string;
          university_name: string;
          enrollment_status: EnrollmentStatus;
          avatar_url: string | null;
          rating: number;
          review_count: number;
          verified_at: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type PublicProfile = Database["public"]["Views"]["public_profiles"]["Row"];
export type Listing = Database["public"]["Tables"]["listings"]["Row"];
export type ChatRoom = Database["public"]["Tables"]["chat_rooms"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Review = Database["public"]["Tables"]["reviews"]["Row"];
