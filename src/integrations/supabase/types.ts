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
      access_credentials: {
        Row: {
          created_at: string
          credential_id: string | null
          id: string
          priority: number | null
          type: string
          value: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          id?: string
          priority?: number | null
          type: string
          value: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          id?: string
          priority?: number | null
          type?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "access_credentials_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          access_credential_id: string | null
          content: string
          created_at: string
          id: string
        }
        Insert: {
          access_credential_id?: string | null
          content: string
          created_at?: string
          id?: string
        }
        Update: {
          access_credential_id?: string | null
          content?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_access_credential_id_fkey"
            columns: ["access_credential_id"]
            isOneToOne: false
            referencedRelation: "access_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          cnpj: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      company_users: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credential_files: {
        Row: {
          created_at: string
          credential_id: string | null
          id: string
          name: string
          size: number
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          credential_id?: string | null
          id?: string
          name: string
          size: number
          type: string
          url: string
        }
        Update: {
          created_at?: string
          credential_id?: string | null
          id?: string
          name?: string
          size?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "credential_files_credential_id_fkey"
            columns: ["credential_id"]
            isOneToOne: false
            referencedRelation: "credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      credentials: {
        Row: {
          card_type: string
          company_id: string | null
          created_at: string
          deleted_at: string | null
          flags: string[] | null
          id: string
          is_deleted: boolean | null
          manufacturer_id: string | null
          title: string
        }
        Insert: {
          card_type: string
          company_id?: string | null
          created_at?: string
          deleted_at?: string | null
          flags?: string[] | null
          id?: string
          is_deleted?: boolean | null
          manufacturer_id?: string | null
          title: string
        }
        Update: {
          card_type?: string
          company_id?: string | null
          created_at?: string
          deleted_at?: string | null
          flags?: string[] | null
          id?: string
          is_deleted?: boolean | null
          manufacturer_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credentials_manufacturer_id_fkey"
            columns: ["manufacturer_id"]
            isOneToOne: false
            referencedRelation: "manufacturers"
            referencedColumns: ["id"]
          },
        ]
      }
      manufacturers: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      monitored_devices: {
        Row: {
          created_at: string
          host_id: string
          id: string
          last_check: string | null
          name: string
          status: string | null
          zabbix_server_id: string | null
        }
        Insert: {
          created_at?: string
          host_id: string
          id?: string
          last_check?: string | null
          name: string
          status?: string | null
          zabbix_server_id?: string | null
        }
        Update: {
          created_at?: string
          host_id?: string
          id?: string
          last_check?: string | null
          name?: string
          status?: string | null
          zabbix_server_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "monitored_devices_zabbix_server_id_fkey"
            columns: ["zabbix_server_id"]
            isOneToOne: false
            referencedRelation: "zabbix_servers"
            referencedColumns: ["id"]
          },
        ]
      }
      network_map_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          map_id: string | null
          position: Json | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          map_id?: string | null
          position?: Json | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          map_id?: string | null
          position?: Json | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "network_map_comments_map_id_fkey"
            columns: ["map_id"]
            isOneToOne: false
            referencedRelation: "network_maps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_map_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      network_maps: {
        Row: {
          company_id: string | null
          created_at: string
          created_by: string | null
          data: Json | null
          description: string | null
          id: string
          is_template: boolean | null
          template_type: string | null
          title: string
          updated_at: string
          version: number | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          template_type?: string | null
          title: string
          updated_at?: string
          version?: number | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          created_by?: string | null
          data?: Json | null
          description?: string | null
          id?: string
          is_template?: boolean | null
          template_type?: string | null
          title?: string
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "network_maps_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_maps_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pops: {
        Row: {
          address: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_safelogin_admin: boolean | null
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_safelogin_admin?: boolean | null
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_safelogin_admin?: boolean | null
          phone?: string | null
        }
        Relationships: []
      }
      user_credentials: {
        Row: {
          access_credential_id: string | null
          created_at: string
          id: string
          password: string | null
          username: string | null
        }
        Insert: {
          access_credential_id?: string | null
          created_at?: string
          id?: string
          password?: string | null
          username?: string | null
        }
        Update: {
          access_credential_id?: string | null
          created_at?: string
          id?: string
          password?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_credentials_access_credential_id_fkey"
            columns: ["access_credential_id"]
            isOneToOne: false
            referencedRelation: "access_credentials"
            referencedColumns: ["id"]
          },
        ]
      }
      zabbix_servers: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          last_sync: string | null
          name: string
          password: string
          url: string
          username: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          last_sync?: string | null
          name: string
          password: string
          url: string
          username: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          last_sync?: string | null
          name?: string
          password?: string
          url?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "zabbix_servers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_safelogin_admin: {
        Args: {
          email: string
          full_name: string
          password: string
        }
        Returns: string
      }
    }
    Enums: {
      card_type:
        | "Infraestrutura"
        | "Servidores"
        | "Rede"
        | "Aplicações"
        | "Banco de Dados"
        | "Cloud"
        | "Desenvolvimento"
        | "Monitoramento"
        | "Outros"
      user_role: "reader" | "technician" | "admin"
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
