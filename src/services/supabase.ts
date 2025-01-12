import { supabase } from '../lib/supabase'
import { User, Item, DashboardStats } from '../types/database'

export const userService = {
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase
      .from('auth.users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getUserCount(): Promise<number> {
    const { count, error } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact' })

    if (error) throw error
    return count || 0
  },

  async getActiveUserCount(): Promise<number> {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count, error } = await supabase
      .from('auth.users')
      .select('*', { count: 'exact' })
      .gt('last_sign_in_at', thirtyDaysAgo.toISOString())

    if (error) throw error
    return count || 0
  }
}

export const itemService = {
  async getItems(): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getItemsByUser(userId: string): Promise<Item[]> {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getItemCount(): Promise<number> {
    const { count, error } = await supabase
      .from('items')
      .select('*', { count: 'exact' })

    if (error) throw error
    return count || 0
  },

  async getActiveItemCount(): Promise<number> {
    const { count, error } = await supabase
      .from('items')
      .select('*', { count: 'exact' })
      .eq('status', 'active')

    if (error) throw error
    return count || 0
  }
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const [
      totalUsers,
      activeUsers,
      totalItems,
      activeItems,
      recentActivity
    ] = await Promise.all([
      userService.getUserCount(),
      userService.getActiveUserCount(),
      itemService.getItemCount(),
      itemService.getActiveItemCount(),
      this.getRecentActivity()
    ])

    return {
      totalUsers,
      activeUsers,
      totalItems,
      activeItems,
      recentActivity
    }
  },

  async getRecentActivity() {
    // Combine recent users and items
    const { data: recentUsers, error: usersError } = await supabase
      .from('auth.users')
      .select('id, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: recentItems, error: itemsError } = await supabase
      .from('items')
      .select('id, name, created_at, updated_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (usersError || itemsError) throw usersError || itemsError

    const activity = [
      ...(recentUsers?.map(user => ({
        type: 'user_joined' as const,
        timestamp: user.created_at,
        details: `New user joined: ${user.email}`
      })) || []),
      ...(recentItems?.map(item => ({
        type: 'item_created' as const,
        timestamp: item.created_at,
        details: `New item created: ${item.name}`
      })) || [])
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

    return activity
  }
}
