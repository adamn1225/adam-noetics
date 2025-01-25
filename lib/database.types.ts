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
      client_project_plan: {
        Row: {
          additional_services: string | null
          analytics: string | null
          branding_materials: string | null
          budget_range: string | null
          business_description: string | null
          business_name: string | null
          color_preferences: string | null
          content_management: string | null
          content_ready: string | null
          created_at: string | null
          design_style: string | null
          domain_info: string | null
          ecommerce_needs: string | null
          features: string | null
          hosting_info: string | null
          id: number
          inspiration: string | null
          integrations: string | null
          maintenance_needs: string | null
          other_info: string | null
          page_count: string | null
          project_goals: string | null
          seo_assistance: string | null
          target_audience: string | null
          timeline: string | null
          training: string | null
          user_authentication: string | null
        }
        Insert: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          features?: string | null
          hosting_info?: string | null
          id?: number
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
        }
        Update: {
          additional_services?: string | null
          analytics?: string | null
          branding_materials?: string | null
          budget_range?: string | null
          business_description?: string | null
          business_name?: string | null
          color_preferences?: string | null
          content_management?: string | null
          content_ready?: string | null
          created_at?: string | null
          design_style?: string | null
          domain_info?: string | null
          ecommerce_needs?: string | null
          features?: string | null
          hosting_info?: string | null
          id?: number
          inspiration?: string | null
          integrations?: string | null
          maintenance_needs?: string | null
          other_info?: string | null
          page_count?: string | null
          project_goals?: string | null
          seo_assistance?: string | null
          target_audience?: string | null
          timeline?: string | null
          training?: string | null
          user_authentication?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          category: string | null
          created_at: string | null
          file_description: string | null
          file_id: string
          file_name: string
          file_url: string
          id: string
          organization_id: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          file_description?: string | null
          file_id: string
          file_name: string
          file_url: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          file_description?: string | null
          file_id?: string
          file_name?: string
          file_url?: string
          id?: string
          organization_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_profile_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          onboarding_completed: boolean | null
          organization_id: string | null
          phone: string | null
          profile_image: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: number
          is_request: boolean | null
          notes: string | null
          organization_id: string | null
          status: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          is_request?: boolean | null
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: number
          is_request?: boolean | null
          notes?: string | null
          organization_id?: string | null
          status?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
