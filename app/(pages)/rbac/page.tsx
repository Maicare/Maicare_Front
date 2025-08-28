'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import RolesCard from './_components/roles-card';
import PermissionCard from './_components/permission-card';
import { Id } from '@/common/types/types';



export default function RolePermissionPage() {

  const [selectedRole, setSelectedRole] = useState<{
    id: number;
    role_name: string;
    permission_count: number;
  } | null>(null);

  const [selectedUser,setSelectedUser] = useState<Id | null>(null);


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-indigo-900">Role & Permission Management</h1>
          <div className="flex items-center space-x-2">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="mr-2 h-4 w-4" /> New Role
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Roles List */}
          <RolesCard
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
          />

          {/* Right Column - Permissions */}
          <PermissionCard selectedRole={selectedRole} selectedUser={selectedUser} />
        </div>
      </div>
    </div>
  );
}