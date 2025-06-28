export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      note_purchases: {
        Row: {
          buyer_id: string
          id: string
          note_id: string
          payment_method_id: string | null
          payment_status: string | null
          purchase_price: number
          purchased_at: string
          transaction_id: string | null
        }
        Insert: {
          buyer_id: string
          id?: string
          note_id: string
          payment_method_id?: string | null
          payment_status?: string | null
          purchase_price: number
          purchased_at?: string
          transaction_id?: string | null
        }
        Update: {
          buyer_id?: string
          id?: string
          note_id?: string
          payment_method_id?: string | null
          payment_status?: string | null
          purchase_price?: number
          purchased_at?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "note_purchases_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      note_reviews: {
        Row: {
          created_at: string
          id: string
          note_id: string
          purchase_id: string
          rating: number
          review_text: string | null
          reviewer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          purchase_id: string
          rating: number
          review_text?: string | null
          reviewer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          purchase_id?: string
          rating?: number
          review_text?: string | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_reviews_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_reviews_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "note_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      note_tags: {
        Row: {
          created_at: string
          id: string
          note_id: string
          tag_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          note_id: string
          tag_name: string
        }
        Update: {
          created_at?: string
          id?: string
          note_id?: string
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_tags_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content_type: string
          course_code: string | null
          created_at: string
          description: string | null
          downloads_count: number | null
          file_path: string
          file_size: number | null
          id: string
          preview_available: boolean | null
          preview_file_path: string | null
          price: number
          professor_name: string | null
          rating: number | null
          reviews_count: number | null
          seller_id: string
          semester: string | null
          status: string | null
          subject: string
          title: string
          university: string
          updated_at: string
          year: number | null
        }
        Insert: {
          content_type: string
          course_code?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          file_path: string
          file_size?: number | null
          id?: string
          preview_available?: boolean | null
          preview_file_path?: string | null
          price: number
          professor_name?: string | null
          rating?: number | null
          reviews_count?: number | null
          seller_id: string
          semester?: string | null
          status?: string | null
          subject: string
          title: string
          university: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          content_type?: string
          course_code?: string | null
          created_at?: string
          description?: string | null
          downloads_count?: number | null
          file_path?: string
          file_size?: number | null
          id?: string
          preview_available?: boolean | null
          preview_file_path?: string | null
          price?: number
          professor_name?: string | null
          rating?: number | null
          reviews_count?: number | null
          seller_id?: string
          semester?: string | null
          status?: string | null
          subject?: string
          title?: string
          university?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: []
      }
      order_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          order_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          order_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assignment_type: string
          created_at: string
          deadline: string
          description: string
          design_preference: string | null
          estimated_price: number | null
          estimated_time: string | null
          grade: string
          id: string
          pages: number
          payment_amount: number | null
          payment_method_id: string | null
          payment_status: string | null
          special_instructions: string | null
          status: string
          subject: string
          title: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assignment_type: string
          created_at?: string
          deadline: string
          description: string
          design_preference?: string | null
          estimated_price?: number | null
          estimated_time?: string | null
          grade: string
          id?: string
          pages: number
          payment_amount?: number | null
          payment_method_id?: string | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: string
          subject: string
          title: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assignment_type?: string
          created_at?: string
          deadline?: string
          description?: string
          design_preference?: string | null
          estimated_price?: number | null
          estimated_time?: string | null
          grade?: string
          id?: string
          pages?: number
          payment_amount?: number | null
          payment_method_id?: string | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: string
          subject?: string
          title?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          grade: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          grade?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          grade?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
