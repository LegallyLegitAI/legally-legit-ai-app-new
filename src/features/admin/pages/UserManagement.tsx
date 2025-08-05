import { useMemo } from 'react';
import { useAdminUsers } from '../hooks/useAdminData';
import { useTable, useSortBy, useGlobalFilter, Column } from 'react-table';
import { Button, Input } from '@/shared/components';
import type { AdminUser } from '../types';

const UserManagement = () => {
  const { users, loading, searchTerm, setSearchTerm, suspendUser, updateUserRole, refetch } = useAdminUsers();

  const columns: readonly Column<AdminUser>[] = useMemo(() => [
    { Header: 'Full Name', accessor: 'full_name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Business', accessor: 'business_name' },
    { Header: 'Role', accessor: 'role' },
    { Header: 'Subscription', accessor: 'subscription_plan' },
    { Header: 'Joined', accessor: 'created_at', Cell: ({ value }) => new Date(value).toLocaleDateString() },
    {
      Header: 'Actions',
      id: 'actions',
      Cell: ({ row: { original } }) => (
        <div className="space-x-2">
          <Button size="sm" onClick={() => alert('View details for ' + original.full_name)}>View</Button>
          <Button size="sm" variant="destructive" onClick={() => suspendUser(original.id)}>Suspend</Button>
          <select
            value={original.role}
            onChange={(e) => updateUserRole(original.id, e.target.value)}
            className="rounded border border-gray-300 p-1"
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ),
    },
  ], [suspendUser, updateUserRole]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data: users }, useGlobalFilter, useSortBy);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center space-x-2">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-64"
          />
          <Button onClick={refetch}>Refresh</Button>
        </div>
      </div>

      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="divide-y divide-gray-200 bg-white">
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
