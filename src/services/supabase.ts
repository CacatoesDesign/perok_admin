import { supabase } from '../lib/supabase'
import { Profile, Listing, ListingImage, DashboardStats } from '../types/database'

export const profileService = {
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getProfileCount(): Promise<number> {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' })

    if (error) throw error
    return count || 0
  }
}

export const listingService = {
  async getListings(): Promise<Listing[]> {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getListingCount(): Promise<number> {
    const { count, error } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })

    if (error) throw error
    return count || 0
  },

  async getActiveListingCount(): Promise<number> {
    const { count, error } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    if (error) throw error
    return count || 0
  }
}

export const listingImageService = {
  async getListingImages(): Promise<ListingImage[]> {
    const { data, error } = await supabase
      .from('listing_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getListingImagesByListing(listingId: string): Promise<ListingImage[]> {
    const { data, error } = await supabase
      .from('listing_images')
      .select('*')
      .eq('listing_id', listingId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [
      totalProfiles,
      totalListings,
      activeListings,
      recentActivity
    ] = await Promise.all([
      profileService.getProfileCount(),
      listingService.getListingCount(),
      listingService.getActiveListingCount(),
      this.getRecentActivity()
    ])

    return {
      totalUsers: totalProfiles,
      activeUsers: totalProfiles, // You might want to define what makes a user "active"
      totalListings,
      activeListings,
      recentActivity
    }
  },

  async getRecentActivity() {
    const { data: recentProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentListings, error: listingsError } = await supabase
      .from('listings')
      .select('id, created_at, title')
      .order('created_at', { ascending: false })
      .limit(5)

    if (profilesError || listingsError) throw profilesError || listingsError

    const activity = [
      ...(recentProfiles?.map(profile => ({
        type: 'user_joined' as const,
        timestamp: profile.created_at,
        details: `New user joined`
      })) || []),
      ...(recentListings?.map(listing => ({
        type: 'listing_created' as const,
        timestamp: listing.created_at,
        details: `New listing created: ${listing.title || 'Untitled'}`
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

    return activity
  }
}
