"use client";
import { Id } from "@/common/types/types";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRole } from "@/hooks/role/use-role";
import { Role } from "@/types/role.types"
import { Key, Search, UserCheck } from "lucide-react"
import { useEffect, useState } from "react"
// Transform the given data into grouped permissions
const transformPermissions = (data: {
    permission_id: Id;
    permission_name: string;
    permission_resource: string;
    role_id?: Id;
}[]): {
    category: string;
    permissions: {
        id: number;
        name: string;
        resource: string;
        action: string;
    }[];
}[] => {
    const grouped: Record<string, { category: string, permissions: { id: Id, name: string, resource: string, action: string }[] }> = {};

    data.forEach(item => {
        // Extract category from permission_name (e.g., "TEST" from "TEST.VIEW")
        const category = item.permission_name.split('.')[0];

        if (!grouped[category]) {
            grouped[category] = {
                category: category,
                permissions: []
            };
        }

        grouped[category].permissions.push({
            id: item.permission_id,
            name: item.permission_name,
            resource: item.permission_resource,
            action: item.permission_name.split('.')[1]
        });
    });

    return Object.values(grouped);
};
const PermissionCard = ({ selectedRole,selectedUser }: { selectedRole: Role | null , selectedUser: Id | null }) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [permissions, setPermissions] = useState<{
        category: string;
        permissions: {
            id: number;
            name: string;
            resource: string;
            action: string;
        }[];
    }[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Id[]>([]);
    const { readRolePermissions,updateRolePermissions,readPermissions,readEmployeePermissions } = useRole({ autoFetch: false });
    useEffect(()=>{
        const getPermissions = async () => {
            try {
                const permissions = await readPermissions();
                const transformed = transformPermissions(permissions);
                setPermissions(transformed);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };
        getPermissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const getRolePermissions = async () => {
            if (!selectedRole) return;
            try {
                const permissions = await readRolePermissions(selectedRole.id);
                setSelectedPermissions(permissions.map(p => p.permission_id));
            } catch (error) {
                console.error("Error fetching role permissions:", error);
            }
        };
        const getEmployeePermissions = async () => {
            if (!selectedUser) return;
            try {
                const {permissions} = await readEmployeePermissions(selectedUser);
                setSelectedPermissions(permissions.map(p => p.id));
            } catch (error) {
                console.error("Error fetching employee permissions:", error);
            }
        };
        if (selectedRole) {
            getRolePermissions();
        }
        if (selectedUser) {
            getEmployeePermissions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRole, selectedUser]);
    const handlePermissionToggle = (permissionId: Id) => {
        if (selectedPermissions.includes(permissionId)) {
            setSelectedPermissions(selectedPermissions.filter(id => id !== permissionId));
        } else {
            setSelectedPermissions([...selectedPermissions, permissionId]);
        }
    };
    const saveRolePermissions = async() => {
        if (!selectedRole) return;
        try {
            await updateRolePermissions(selectedRole.id, selectedPermissions,{
                displayProgress: true,
                displaySuccess: true
            });
        } catch (error) {
            console.error("Error saving role permissions:", error);
        }
    };
    const filteredPermissions = permissions.map(group => ({
        ...group,
        permissions: group.permissions.filter(permission =>
            permission.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.permissions.length > 0);

    return (
        <div className="lg:col-span-2">
            <Card className="bg-white border-indigo-100 shadow-sm h-full">
                <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-t-lg py-4">
                    <CardTitle className="flex items-center">
                        <UserCheck className="mr-2 h-5 w-5" />
                        Permissions for {selectedRole?.role_name || 'Select a role'}
                    </CardTitle>
                    <CardDescription className="text-cyan-100">
                        Manage permissions for the selected role
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4  max-h-[900px] overflow-y-scroll">
                    {selectedRole || selectedUser ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search permissions..."
                                        className="pl-8 border-indigo-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button
                                    onClick={saveRolePermissions}
                                    className="bg-teal-600 hover:bg-teal-700"
                                >
                                    Save Permissions
                                </Button>
                            </div>

                            <div className="space-y-6  overflow-y-auto pr-2">
                                {filteredPermissions.map(({category, permissions}) => (
                                    <div key={category} className="border border-indigo-100 rounded-lg p-4 bg-indigo-50/50">
                                        <h3 className="font-semibold text-indigo-800 mb-3 flex items-center">
                                            <div className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></div>
                                            {category}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {(permissions || []).map(permission => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-center space-x-2 p-2 rounded-md bg-white border border-indigo-100"
                                                >
                                                    <Checkbox
                                                        id={`permission-${permission.id}`}
                                                        checked={selectedPermissions.includes(permission.id)}
                                                        onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                                    />
                                                    <Label
                                                        htmlFor={`permission-${permission.id}`}
                                                        className="flex-1 cursor-pointer"
                                                    >
                                                        {permission.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Key className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4">Select a role to manage its permissions</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PermissionCard