import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wuptzgavpdlutycmdjkd.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cHR6Z2F2cGRsdXR5Y21kamtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NTgzMzksImV4cCI6MjA3NzIzNDMzOX0.I_4PH-ZTidr6lqa0gZvURCZ8fMn58JvxMIZ7MPYJHgQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  featured_image_url: string | null
  author_id: string
  author_name: string | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
  category: string | null
  tags: string[] | null
  reading_time: number | null
  language: string
  meta_title: string | null
  meta_description: string | null
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  sort_order: number | null
  is_active: boolean
}

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  role: string
  bio: string | null
  avatar_url: string | null
  created_at: string
}

export interface Comment {
  id: string
  article_id: string
  user_id: string
  content: string
  parent_id: string | null
  created_at: string
  updated_at: string
  user?: UserProfile
}

export interface BreakingNews {
  id: string
  title: string
  content: string
  link_url: string | null
  is_active: boolean
  priority: number
  expires_at: string | null
  created_at: string
}
