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
      daily_goals: {
        Row: {
          created_at: string
          date: string
          goal_id: number
          protein_goal_grams: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          goal_id?: number
          protein_goal_grams: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          goal_id?: number
          protein_goal_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      daily_totals: {
        Row: {
          date: string
          goal_met: boolean
          last_updated: string
          total_id: number
          total_protein_grams: number
          user_id: string
        }
        Insert: {
          date: string
          goal_met?: boolean
          last_updated?: string
          total_id?: number
          total_protein_grams?: number
          user_id: string
        }
        Update: {
          date?: string
          goal_met?: boolean
          last_updated?: string
          total_id?: number
          total_protein_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      meal_totals: {
        Row: {
          date: string
          item_count: number
          last_updated: string
          meal: Database["public"]["Enums"]["meal_type"]
          meal_total_id: number
          total_protein_grams: number
          user_id: string
        }
        Insert: {
          date: string
          item_count?: number
          last_updated?: string
          meal: Database["public"]["Enums"]["meal_type"]
          meal_total_id?: number
          total_protein_grams?: number
          user_id: string
        }
        Update: {
          date?: string
          item_count?: number
          last_updated?: string
          meal?: Database["public"]["Enums"]["meal_type"]
          meal_total_id?: number
          total_protein_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      protein_entries: {
        Row: {
          created_at: string
          date: string
          entry_id: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          entry_id?: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          entry_id?: number
          food_name?: string
          meal?: Database["public"]["Enums"]["meal_type"]
          protein_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      protein_entries_current: {
        Row: {
          created_at: string
          date: string
          entry_id: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          entry_id?: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          entry_id?: number
          food_name?: string
          meal?: Database["public"]["Enums"]["meal_type"]
          protein_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      protein_entries_default: {
        Row: {
          created_at: string
          date: string
          entry_id: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          entry_id?: number
          food_name: string
          meal: Database["public"]["Enums"]["meal_type"]
          protein_grams: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          entry_id?: number
          food_name?: string
          meal?: Database["public"]["Enums"]["meal_type"]
          protein_grams?: number
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: number
          preference_key: string
          preference_value: Json
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          preference_key: string
          preference_value: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: never
          preference_key?: string
          preference_value?: Json
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_daily_goal: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      meal_type: "breakfast" | "lunch" | "dinner" | "snacks"
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
