import { useState, useEffect } from 'react'
import { usersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const response = await usersAPI.getAll({ page, limit: 10 })
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (err) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    const loadingToast = toast.loading('Updating role...')
    try {
      await usersAPI.updateRole(userId, newRole)
      toast.dismiss(loadingToast)
      toast.success('User role updated successfully')
      fetchUsers(pagination.current)
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error(err.response?.data?.message || 'Failed to update user role')
    }
  }

  const handleToggleStatus = async (userId) => {
    const loadingToast = toast.loading('Updating status...')
    try {
      await usersAPI.toggleStatus(userId)
      toast.dismiss(loadingToast)
      toast.success('User status updated successfully')
      fetchUsers(pagination.current)
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error(err.response?.data?.message || 'Failed to update user status')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    const loadingToast = toast.loading('Deleting user...')

    try {
      await usersAPI.delete(userId)
      toast.dismiss(loadingToast)
      toast.success('User deleted successfully')
      fetchUsers(pagination.current)
    } catch (err) {
      toast.dismiss(loadingToast)
      toast.error(err.response?.data?.message || 'Failed to delete user')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-500">{pagination.total} total users</p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border-0 cursor-pointer ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                          }`}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {users.length} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fetchUsers(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchUsers(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUsers
