// Supabase types based on actual database schema
// Generated from entries table

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      entries: {
        Row: {
          id: string
          domain: string
          wp_user: string | null
          wp_password: string | null
          login_url: string | null
          notes: string | null
          hosting_url: string | null
          hosting_user: string | null
          hosting_password: string | null
          ftp_url: string | null
          ftp_user: string | null
          ftp_password: string | null
          port: string | null
          ftp_directory: string | null
          private_key: string | null
          local_directory: string | null
          ssh_host: string | null
          ssh_port: string | null
          ssh_user: string | null
          ssh_pass: string | null
          ssh_key_ref: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          domain: string
          wp_user?: string | null
          wp_password?: string | null
          login_url?: string | null
          notes?: string | null
          hosting_url?: string | null
          hosting_user?: string | null
          hosting_password?: string | null
          ftp_url?: string | null
          ftp_user?: string | null
          ftp_password?: string | null
          port?: string | null
          ftp_directory?: string | null
          private_key?: string | null
          local_directory?: string | null
          ssh_host?: string | null
          ssh_port?: string | null
          ssh_user?: string | null
          ssh_pass?: string | null
          ssh_key_ref?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          domain?: string
          wp_user?: string | null
          wp_password?: string | null
          login_url?: string | null
          notes?: string | null
          hosting_url?: string | null
          hosting_user?: string | null
          hosting_password?: string | null
          ftp_url?: string | null
          ftp_user?: string | null
          ftp_password?: string | null
          port?: string | null
          ftp_directory?: string | null
          private_key?: string | null
          local_directory?: string | null
          ssh_host?: string | null
          ssh_port?: string | null
          ssh_user?: string | null
          ssh_pass?: string | null
          ssh_key_ref?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      agent_commands: {
        Row: {
          id: string
          action: string
          payload: Json
          status: string
          result_message: string | null
          created_at: string
        }
        Insert: {
          id: string
          action: string
          payload: Json
          status?: string
          result_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          action?: string
          payload?: Json
          status?: string
          result_message?: string | null
          created_at?: string
        }
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
  }
}
