import { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePermissions from '../hooks/use-permissions';
import { Permission, PermissionCheck } from '../types/permission.types';

interface WithPermissionsProps {
  requiredPermissions: PermissionCheck;
  redirectUrl: string;
}

const withPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  { requiredPermissions, redirectUrl }: WithPermissionsProps
): ComponentType<P> => {
  const WithPermissions: ComponentType<P> = (props: P) => {
    const { can,transformToPermissionName } = usePermissions();
    const router = useRouter();

    const isPermission = (check: PermissionCheck): check is Permission => {
      return (check as Permission).name !== undefined;
    };

    const evaluatePermission = (permissionCheck: PermissionCheck): boolean => {
      if ('and' in permissionCheck) {
        return permissionCheck.and?.every(evaluatePermission) ?? false;
      }
      if ('or' in permissionCheck) {
        return permissionCheck.or?.some(evaluatePermission) ?? false;
      }
      if ('not' in permissionCheck) {
        return !evaluatePermission(permissionCheck.not!);
      }
      if (isPermission(permissionCheck)) {
        return can(transformToPermissionName(permissionCheck));
      }
      return false;
    };

    useEffect(() => {
      // Vérifier les permissions avec entityId si router.query.id existe
      // if (router.query.id && typeof router.query.id === 'string') {
      //   const id = router.query.id as string;

      //   // const updateEntityId = (permissionCheck: PermissionCheck): PermissionCheck => {
      //   //   if (isPermission(permissionCheck) && !permissionCheck.entityId) {
      //   //     return { ...permissionCheck, entityId: Number(id) };
      //   //   }
      //   //   if ('and' in permissionCheck) {
      //   //     return { and: permissionCheck.and?.map(updateEntityId) };
      //   //   }
      //   //   if ('or' in permissionCheck) {
      //   //     return { or: permissionCheck.or?.map(updateEntityId) };
      //   //   }
      //   //   if ('not' in permissionCheck) {
      //   //     return { not: updateEntityId(permissionCheck.not!) };
      //   //   }
      //   //   return permissionCheck;
      //   // };

      //   requiredPermissions = updateEntityId(requiredPermissions);
      // }

      const hasRequiredPermission = evaluatePermission(requiredPermissions);

      if (!hasRequiredPermission) {
        router.replace(redirectUrl);
      }
    // }, [requiredPermissions, redirectUrl, can, router]);
    }, [requiredPermissions, redirectUrl, router]);

    return <WrappedComponent {...props} />;
  };

  return WithPermissions;
};

export default withPermissions;
