import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data - replace with actual API call
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    joinedAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    joinedAt: '2023-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    joinedAt: '2023-03-10',
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
          Manage your users
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{user.name}</div>
                        <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{user.joinedAt}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm hidden sm:inline">
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
