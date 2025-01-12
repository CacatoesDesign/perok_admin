import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, Settings } from 'lucide-react'

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Users', path: '/users' },
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
            className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md mb-2"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
