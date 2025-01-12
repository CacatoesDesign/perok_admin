import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users2, Settings, Package } from 'lucide-react'
import { cn } from '../../lib/utils'

const Sidebar = () => {
  const { pathname } = useLocation()
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users2, label: 'Users', path: '/users' },
    { icon: Package, label: 'Items', path: '/items' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-4">
      <div className="text-xl font-bold mb-8 p-2">Admin Dashboard</div>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center space-x-3 p-2 rounded-lg',
              pathname === item.path ? 'bg-gray-100' : 'hover:bg-gray-50'
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
