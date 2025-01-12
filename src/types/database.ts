export interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    provider?: string
    [key: string]: any
  }
  aud: string
  role?: string
  updated_at?: string
}

export interface Profile {
  id: string
  created_at: string
  updated_at?: string
}

export interface Item {
  id: string
  created_at: string
  name: string
  description: string
  user_id: string
  status: 'active' | 'inactive' | 'deleted'
}

export interface Listing {
  id: string
  created_at: string
}

export interface ListingImage {
  id: string
  created_at: string
  listing_id: string
  url: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalListings: number
  activeListings: number
  recentActivity: {
    type: 'user_joined' | 'listing_created' | 'listing_updated'
    timestamp: string
    details: string
  }[]
}
