import { Button } from '../components/ui/button'

const Settings = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">General Settings</h3>
            <p className="text-sm text-gray-500">Configure your admin dashboard preferences</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dashboard Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="My Admin Dashboard"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notification Email
              </label>
              <input
                type="email"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
