import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Items = () => {
  const [tableInfo, setTableInfo] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTableInfo = async () => {
      try {
        // First, let's get a sample of items to understand the structure
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .limit(1)

        if (error) throw error
        
        if (data && data.length > 0) {
          setTableInfo({
            columns: Object.keys(data[0]),
            sample: data[0]
          })
        }

        // Now get all items
        const { data: allItems, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .order('created_at', { ascending: false })

        if (itemsError) throw itemsError
        setItems(allItems || [])
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTableInfo()
  }, [])

  if (loading) {
    return <div>Loading table information...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Items Table Structure</h1>
      
      {tableInfo && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Table Columns</h2>
          <ul className="list-disc pl-6">
            {tableInfo.columns.map((column: string) => (
              <li key={column} className="mb-2">
                <span className="font-medium">{column}</span>: {' '}
                <span className="text-gray-600">
                  {typeof tableInfo.sample[column]}
                  {tableInfo.sample[column] === null ? ' (nullable)' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Sample Items ({items.length} total)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableInfo?.columns.map((column: string) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.slice(0, 5).map((item, index) => (
                <tr key={index}>
                  {tableInfo?.columns.map((column: string) => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {typeof item[column] === 'object'
                        ? JSON.stringify(item[column])
                        : String(item[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Items
