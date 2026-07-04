import { useUsers } from '../../hooks/useUsers';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';

export default function AdminUsersPage() {
  const { users, loading, toggleStatus, removeUser } = useUsers();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Users</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      label={u.role}
                      variant={
                        u.role === 'admin' ? 'danger' : u.role === 'organizer' ? 'purple' : 'info'
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      label={u.isActive ? 'Active' : 'Inactive'}
                      variant={u.isActive ? 'success' : 'default'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleStatus(u)}
                        className="text-primary-600 hover:underline"
                      >
                        {u.isActive ? 'Suspend' : 'Approve'}
                      </button>
                      <button
                        onClick={() => removeUser(u.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
