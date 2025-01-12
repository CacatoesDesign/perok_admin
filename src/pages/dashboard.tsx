import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      // Example queries - modify according to your Supabase schema
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })

      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .eq('status', 'active')

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        revenue: 0 // Add your revenue calculation logic
      })
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Active Users</h3>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Revenue</h3>
          <p className="text-3xl font-bold">${stats.revenue}</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
