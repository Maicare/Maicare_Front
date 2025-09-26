'use client';
import {  Id } from "@/common/types/types";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEmployee } from "@/hooks/employee/use-employee";
import { useRole } from "@/hooks/role/use-role";
import { Role } from "@/types/role.types";
import { Key, Plus, Search, Users } from "lucide-react"
import { useState } from "react";

const RolesCard = ({
    selectedRole,
    setSelectedRole,
    selectedUser,
    setSelectedUser
}: {
    selectedRole: Role | null;
    setSelectedRole: (role: Role | null) => void;
    selectedUser: Id | null;
    setSelectedUser: (user: Id | null) => void;
}) => {
    const { roles, isLoading, createOne, updateOneRole } = useRole({ autoFetch: true });
    const [searchTermUser, setSearchTermUser] = useState<string>("");
    const { employees,mutate } = useEmployee({ autoFetch: true,search:searchTermUser });
    const [newRoleName, setNewRoleName] = useState<string>("");
    const [searchTermRole, setSearchTermRole] = useState<string>("");
    const filteredRoles = roles?.filter(role => role.role_name.toLowerCase().includes(searchTermRole.toLowerCase()));

    const handleCreateRole = async () => {
        try {
            await createOne(newRoleName, {
                displayProgress: true,
                displaySuccess: true
            });
            setNewRoleName("");
        } catch (error) {
            console.error("Failed to create role:", error);
        }
    }

    const handleUserRoleChange = async (userId: number, roleId: string) => {
        try {
            await updateOneRole(userId, parseInt(roleId), {
                displayProgress: true,
                displaySuccess: true
            });
            mutate();
        } catch (error) {
            console.error("Failed to update user role:", error);
        }
    }

    if (isLoading) {
        return <div>loading...</div>
    }

    return (
        <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white border-indigo-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg py-4">
                    <CardTitle className="flex items-center">
                        <Key className="mr-2 h-5 w-5" />
                        Roles
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                        Manage and assign permissions to roles
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <div className="relative w-full">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search Roles..."
                                    className="pl-8 border-indigo-200 w-full"
                                    value={searchTermRole}
                                    onChange={(e) => setSearchTermRole(e.target.value)}
                                />
                            </div>
                        </div>
                        {(filteredRoles ?? []).slice(0, 4).map(role => (
                            <div
                                key={role.id}
                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedRole?.id === role.id
                                    ? 'bg-indigo-100 border border-indigo-300'
                                    : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                onClick={() => { setSelectedRole(role); setSelectedUser(null); }}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-indigo-900">{role.role_name}</span>
                                    <Badge
                                        className={
                                            role.role_name.toUpperCase() === 'ADMIN' ? 'bg-red-100 text-red-800' :
                                                role.role_name.toUpperCase() === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                        }
                                    >
                                        {role.permission_count} permissions
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Label htmlFor="newRole" className="text-indigo-800">Create New Role</Label>
                        <div className="flex space-x-2 mt-2">
                            <Input
                                id="newRole"
                                placeholder="Role name"
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                className="border-indigo-200 focus:border-indigo-400"
                            />
                            <Button
                                onClick={handleCreateRole}
                                disabled={newRoleName.trim() === ''}
                                className="bg-indigo-600 hover:bg-indigo-700"
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-white border-indigo-100 shadow-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg py-4">
                    <CardTitle className="flex items-center">
                        <Users className="mr-2 h-5 w-5" />
                        Users
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                        Assign roles to users
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative w-full">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search Employees..."
                                className="pl-8 border-indigo-200 w-full"
                                value={searchTermUser}
                                onChange={(e) => setSearchTermUser(e.target.value)}
                            />
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(employees?.results ?? []).slice(0,4).map(user => (
                                <TableRow key={user.id} className={selectedUser === user.id ? "bg-indigo-50 rounded-lg" : "cursor-pointer"} onClick={() => {setSelectedUser(user.id);setSelectedRole(null)}}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{user.first_name + " " + user.last_name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role_id.toString()}
                                            onValueChange={(value) => handleUserRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger className="w-[130px] border-indigo-200">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                {(roles ?? []).map(role => (
                                                    <SelectItem key={role.id} value={role.id.toString()}>
                                                        {role.role_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default RolesCard