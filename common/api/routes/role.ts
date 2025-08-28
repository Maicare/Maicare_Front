
const prefix = '/roles';
const ApiRoutes = {
    User: prefix + '/user',
    AssignRole: '/employees/{employee_id}/roles',//prefix + '/assign',
    ReadAll: prefix,
    CreateOne: prefix,
    ReadRolePermissions: prefix + '/{role_id}/permissions',
    UpdateRolePermissions: prefix + '/{role_id}/permissions',///roles/{role_id}/permissions
    ReadPermissions: "/permissions",
    GrantEmployeePermissions: '/employees/{employee_id}/permissions',
    ReadEmployeePermissions: '/employees/{employee_id}/roles_permissions',
};

export default ApiRoutes;
