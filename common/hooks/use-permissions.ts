import { useMemo } from 'react';
import { useAuth } from './use-auth';
import { Permission, PermissionName } from '../types/permission.types';

interface PermissionsAPI {
  can: ({entity,action,entityId}:PermissionName) => boolean;
  canNot: ({entity,action,entityId}:PermissionName) => boolean;
  transformToPermissionName: (permission: Permission) => PermissionName;
}

const usePermissions = (): PermissionsAPI => {
  const { user } = useAuth({});
  const transformToPermissionName = (permission: Permission): PermissionName => {
    const parts = permission.name.split('.');

    // Handle entityId if present
    if (parts.length === 3) {
      const [entity, entityId, action] = parts;
      return { entity, entityId:Number(entityId), action };
    }

    // Handle case without entityId
    if (parts.length === 2) {
      const [entity, action] = parts;
      return { entity, action };
    }

    throw new Error("Invalid permission name format");
  };


  const can = ({entity, action, entityId}:PermissionName): boolean => {
    if (!user) {
      return false;
    }
    const permission = `${entity}.${action}`;

    // Vérifie le droit de faire l'action "action" sur toutes les "entity"
    if (user.permissions.map(p => p.name).includes(permission)) {
      return true;
    }

    // Vérifie le droit de faire toutes les actions sur toutes les "entity"
    if (user.permissions.map(p => p.name).includes(`${entity}.*`)) {
      return true;
    }

    if (entityId) {
      // Vérifie l'id de l'entity sur laquelle on a la permission de "action"
      const specificPermission = `${entity}.${entityId}.${action}`;
      if (user.permissions.map(p => p.name).includes(specificPermission)) {
        return true;
      }
    }

    // Aucune correspondance trouvée
    return false;
  };

  const canNot = ({entity, action, entityId}:PermissionName): boolean => {
    return !can({entity, action, entityId});
  };

  return useMemo(() => ({ can, canNot,transformToPermissionName }), [user?.permissions]);
};

export default usePermissions;
