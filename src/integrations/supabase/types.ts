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
      admin_activity_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          token_hash: string
          user_agent: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          token_hash: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          token_hash?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          failed_login_attempts: number | null
          id: string
          is_active: boolean | null
          last_login: string | null
          locked_until: string | null
          password_hash: string
          role: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          failed_login_attempts?: number | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          locked_until?: string | null
          password_hash: string
          role?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          failed_login_attempts?: number | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          locked_until?: string | null
          password_hash?: string
          role?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      agricultural_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      agricultural_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "agricultural_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      atv_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      atv_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "atv_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "atv_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      beauty_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beauty_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "beauty_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      bulldozer_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      bulldozer_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bulldozer_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "bulldozer_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      bus_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "bus_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          icon: string | null
          id: number
          is_active: boolean | null
          level: number | null
          name_kz: string
          name_ru: string
          parent_id: number | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          icon?: string | null
          id?: number
          is_active?: boolean | null
          level?: number | null
          name_kz: string
          name_ru: string
          parent_id?: number | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          icon?: string | null
          id?: number
          is_active?: boolean | null
          level?: number | null
          name_kz?: string
          name_ru?: string
          parent_id?: number | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      children_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "children_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "children_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          id: number
          name_kz: string | null
          name_ru: string
          region_id: number | null
        }
        Insert: {
          id?: number
          name_kz?: string | null
          name_ru: string
          region_id?: number | null
        }
        Update: {
          id?: number
          name_kz?: string | null
          name_ru?: string
          region_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cities_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      commercial_vehicle_types: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      construction_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      construction_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "construction_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      crane_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      crane_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crane_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "crane_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_types: {
        Row: {
          id: string
          name_kz: string
          name_ru: string
        }
        Insert: {
          id: string
          name_kz: string
          name_ru: string
        }
        Update: {
          id?: string
          name_kz?: string
          name_ru?: string
        }
        Relationships: []
      }
      excavator_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      excavator_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "excavator_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "excavator_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      fashion_style_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fashion_style_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "fashion_style_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      filter_options: {
        Row: {
          filter_id: string
          id: number
          name_kz: string
          name_ru: string
          value: string
        }
        Insert: {
          filter_id: string
          id?: number
          name_kz: string
          name_ru: string
          value: string
        }
        Update: {
          filter_id?: string
          id?: number
          name_kz?: string
          name_ru?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "filter_options_filter_id_fkey"
            columns: ["filter_id"]
            isOneToOne: false
            referencedRelation: "filters"
            referencedColumns: ["id"]
          },
        ]
      }
      filters: {
        Row: {
          id: string
          meta: Json | null
          name_kz: string
          name_ru: string
          type: string
        }
        Insert: {
          id: string
          meta?: Json | null
          name_kz: string
          name_ru: string
          type: string
        }
        Update: {
          id?: string
          meta?: Json | null
          name_kz?: string
          name_ru?: string
          type?: string
        }
        Relationships: []
      }
      food_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "food_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "food_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hobbies_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hobbies_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "hobbies_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      home_categories: {
        Row: {
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
        }
        Insert: {
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
        }
        Update: {
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "home_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "home_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      light_commercial_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      light_commercial_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "light_commercial_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "light_commercial_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string | null
          allow_pets: boolean | null
          area: number | null
          bathroom_type: string | null
          building_type: string | null
          category_id: number | null
          ceiling_height: number | null
          city_id: number | null
          created_at: string | null
          deal_type: string | null
          description: string
          discount_percent: number | null
          discount_price: number | null
          district_id: string | null
          expires_at: string | null
          floor: number | null
          furnished: boolean | null
          has_balcony: boolean | null
          has_elevator: boolean | null
          has_parking: boolean | null
          has_playground: boolean | null
          has_separate_entrance: boolean | null
          id: string
          images: string[] | null
          is_corner: boolean | null
          is_free: boolean | null
          is_premium: boolean | null
          is_studio: boolean | null
          latitude: number | null
          longitude: number | null
          microdistrict_id: number | null
          phone: string | null
          property_type: string | null
          region_id: number | null
          regular_price: number | null
          renovation_type: string | null
          rooms: number | null
          security_guarded: boolean | null
          segment: string | null
          source_link: string | null
          status: string | null
          title: string
          total_floors: number | null
          updated_at: string | null
          user_id: string
          utilities_included: boolean | null
          views: number | null
          year_built: number | null
        }
        Insert: {
          address?: string | null
          allow_pets?: boolean | null
          area?: number | null
          bathroom_type?: string | null
          building_type?: string | null
          category_id?: number | null
          ceiling_height?: number | null
          city_id?: number | null
          created_at?: string | null
          deal_type?: string | null
          description: string
          discount_percent?: number | null
          discount_price?: number | null
          district_id?: string | null
          expires_at?: string | null
          floor?: number | null
          furnished?: boolean | null
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_parking?: boolean | null
          has_playground?: boolean | null
          has_separate_entrance?: boolean | null
          id?: string
          images?: string[] | null
          is_corner?: boolean | null
          is_free?: boolean | null
          is_premium?: boolean | null
          is_studio?: boolean | null
          latitude?: number | null
          longitude?: number | null
          microdistrict_id?: number | null
          phone?: string | null
          property_type?: string | null
          region_id?: number | null
          regular_price?: number | null
          renovation_type?: string | null
          rooms?: number | null
          security_guarded?: boolean | null
          segment?: string | null
          source_link?: string | null
          status?: string | null
          title: string
          total_floors?: number | null
          updated_at?: string | null
          user_id: string
          utilities_included?: boolean | null
          views?: number | null
          year_built?: number | null
        }
        Update: {
          address?: string | null
          allow_pets?: boolean | null
          area?: number | null
          bathroom_type?: string | null
          building_type?: string | null
          category_id?: number | null
          ceiling_height?: number | null
          city_id?: number | null
          created_at?: string | null
          deal_type?: string | null
          description?: string
          discount_percent?: number | null
          discount_price?: number | null
          district_id?: string | null
          expires_at?: string | null
          floor?: number | null
          furnished?: boolean | null
          has_balcony?: boolean | null
          has_elevator?: boolean | null
          has_parking?: boolean | null
          has_playground?: boolean | null
          has_separate_entrance?: boolean | null
          id?: string
          images?: string[] | null
          is_corner?: boolean | null
          is_free?: boolean | null
          is_premium?: boolean | null
          is_studio?: boolean | null
          latitude?: number | null
          longitude?: number | null
          microdistrict_id?: number | null
          phone?: string | null
          property_type?: string | null
          region_id?: number | null
          regular_price?: number | null
          renovation_type?: string | null
          rooms?: number | null
          security_guarded?: boolean | null
          segment?: string | null
          source_link?: string | null
          status?: string | null
          title?: string
          total_floors?: number | null
          updated_at?: string | null
          user_id?: string
          utilities_included?: boolean | null
          views?: number | null
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_microdistrict_id_fkey"
            columns: ["microdistrict_id"]
            isOneToOne: false
            referencedRelation: "microdistricts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      loader_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      loader_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "loader_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "loader_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          listing_id: string | null
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          listing_id?: string | null
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      microdistricts: {
        Row: {
          city_id: number | null
          id: number
          name_kz: string | null
          name_ru: string
        }
        Insert: {
          city_id?: number | null
          id?: number
          name_kz?: string | null
          name_ru: string
        }
        Update: {
          city_id?: number | null
          id?: number
          name_kz?: string | null
          name_ru?: string
        }
        Relationships: []
      }
      motorcycle_brands: {
        Row: {
          created_at: string | null
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      motorcycle_models: {
        Row: {
          brand_id: string
          created_at: string | null
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "motorcycle_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      municipal_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      municipal_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "municipal_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "municipal_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          link_to: string | null
          related_item_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_to?: string | null
          related_item_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_to?: string | null
          related_item_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      ojpw: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      pet_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pet_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      pharmacy_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pharmacy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city_id: number | null
          created_at: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          city_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          city_id?: number | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      property_type_filters: {
        Row: {
          deal_type_id: string
          filter_id: string
          id: number
          property_type_id: string
          rent_type_id: string | null
        }
        Insert: {
          deal_type_id: string
          filter_id: string
          id?: number
          property_type_id: string
          rent_type_id?: string | null
        }
        Update: {
          deal_type_id?: string
          filter_id?: string
          id?: number
          property_type_id?: string
          rent_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_type_filters_deal_type_id_fkey"
            columns: ["deal_type_id"]
            isOneToOne: false
            referencedRelation: "deal_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_type_filters_filter_id_fkey"
            columns: ["filter_id"]
            isOneToOne: false
            referencedRelation: "filters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_type_filters_property_type_id_fkey"
            columns: ["property_type_id"]
            isOneToOne: false
            referencedRelation: "property_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_type_filters_rent_type_id_fkey"
            columns: ["rent_type_id"]
            isOneToOne: false
            referencedRelation: "rent_types"
            referencedColumns: ["id"]
          },
        ]
      }
      property_types: {
        Row: {
          id: string
          name_kz: string
          name_ru: string
          segment_id: string
        }
        Insert: {
          id: string
          name_kz: string
          name_ru: string
          segment_id: string
        }
        Update: {
          id?: string
          name_kz?: string
          name_ru?: string
          segment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_types_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      regions: {
        Row: {
          id: number
          name_kz: string | null
          name_ru: string
        }
        Insert: {
          id?: number
          name_kz?: string | null
          name_ru: string
        }
        Update: {
          id?: number
          name_kz?: string | null
          name_ru?: string
        }
        Relationships: []
      }
      rent_types: {
        Row: {
          id: string
          name_kz: string
          name_ru: string
        }
        Insert: {
          id: string
          name_kz: string
          name_ru: string
        }
        Update: {
          id?: string
          name_kz?: string
          name_ru?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          listing_id: string | null
          rating: number
          reviewer_id: string
          target_user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          rating: number
          reviewer_id: string
          target_user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          listing_id?: string | null
          rating?: number
          reviewer_id?: string
          target_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      scooter_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      scooter_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scooter_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "scooter_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          id: string
          name_kz: string
          name_ru: string
        }
        Insert: {
          id: string
          name_kz: string
          name_ru: string
        }
        Update: {
          id?: string
          name_kz?: string
          name_ru?: string
        }
        Relationships: []
      }
      services_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "services_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "site_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      snowmobile_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      snowmobile_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "snowmobile_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "snowmobile_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_electronics_categories: {
        Row: {
          created_at: string | null
          id: string
          level: number
          name_kz: string
          name_ru: string
          parent_id: string | null
          parent_name_ru: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level: number
          name_kz: string
          name_ru: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number
          name_kz?: string
          name_ru?: string
          parent_id?: string | null
          parent_name_ru?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tech_electronics_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "tech_electronics_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trailer_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      trailer_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trailer_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "trailer_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      truck_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "truck_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "truck_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      truck_tractor_brands: {
        Row: {
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      truck_tractor_models: {
        Row: {
          brand_id: string
          created_at: string
          id: string
          name: string
          name_kk: string
          slug: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          id?: string
          name: string
          name_kk: string
          slug: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          id?: string
          name?: string
          name_kk?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "truck_tractor_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "truck_tractor_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      uuid_to_id_mapping: {
        Row: {
          category_type: string
          new_id: number
          old_uuid: string
        }
        Insert: {
          category_type: string
          new_id: number
          old_uuid: string
        }
        Update: {
          category_type?: string
          new_id?: number
          old_uuid?: string
        }
        Relationships: []
      }
      vehicle_brands: {
        Row: {
          id: number
          name: string
          name_kk: string
          slug: string
        }
        Insert: {
          id?: number
          name: string
          name_kk: string
          slug: string
        }
        Update: {
          id?: number
          name?: string
          name_kk?: string
          slug?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          brand_id: number | null
          id: number
          name: string
          name_kk: string
          slug: string
        }
        Insert: {
          brand_id?: number | null
          id?: number
          name: string
          name_kk: string
          slug: string
        }
        Update: {
          brand_id?: number | null
          id?: number
          name?: string
          name_kk?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "vehicle_brands"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_role: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_unique_slug: {
        Args: { base_slug: string; category_prefix: string }
        Returns: string
      }
      has_role: {
        Args: {
          user_id: string
          check_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      import_beauty_category: {
        Args: {
          name_ru_param: string
          name_kz_param: string
          parent_name_ru_param: string
          level_param: number
        }
        Returns: string
      }
      import_categories: {
        Args: {
          p_name_ru: string
          p_name_kz: string
          p_parent_name_ru: string
          p_level: number
        }
        Returns: string
      }
      import_hobbies_category: {
        Args: {
          p_name_ru: string
          p_name_kz: string
          p_parent_name_ru: string
          p_level: number
        }
        Returns: string
      }
      search_property_listings: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_property_types?: string[]
          p_deal_type?: string
          p_min_price?: number
          p_max_price?: number
          p_min_area?: number
          p_max_area?: number
          p_min_rooms?: number
          p_max_rooms?: number
          p_min_floor?: number
          p_max_floor?: number
          p_city_id?: number
          p_region_id?: number
          p_microdistrict_id?: number
          p_building_types?: string[]
          p_renovation_types?: string[]
          p_bathroom_types?: string[]
          p_has_photo?: boolean
          p_furnished?: boolean
          p_allow_pets?: boolean
          p_has_parking?: boolean
          p_has_balcony?: boolean
          p_has_elevator?: boolean
          p_sort_by?: string
          p_sort_order?: string
        }
        Returns: {
          id: string
          title: string
          description: string
          regular_price: number
          discount_price: number
          discount_percent: number
          is_free: boolean
          category_id: number
          user_id: string
          city_id: number
          microdistrict_id: number
          region_id: number
          images: string[]
          status: string
          created_at: string
          updated_at: string
          expires_at: string
          views: number
          phone: string
          is_premium: boolean
          address: string
          latitude: number
          longitude: number
          area: number
          rooms: number
          floor: number
          total_floors: number
          deal_type: string
          property_type: string
          building_type: string
          renovation_type: string
          bathroom_type: string
          year_built: number
          ceiling_height: number
          has_balcony: boolean
          has_elevator: boolean
          has_parking: boolean
          allow_pets: boolean
          furnished: boolean
          utilities_included: boolean
          security_guarded: boolean
          has_playground: boolean
          has_separate_entrance: boolean
          is_corner: boolean
          is_studio: boolean
          district_id: string
          total_count: number
        }[]
      }
      transliterate_cyrillic: {
        Args: { "": string }
        Returns: string
      }
    }
    Enums: {
      user_role: "admin" | "moderator" | "user"
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
    Enums: {
      user_role: ["admin", "moderator", "user"],
    },
  },
} as const
