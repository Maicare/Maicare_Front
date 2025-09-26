"use client"
import { PermissionsObjects } from '@/common/data/permission.data';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { redirect } from 'next/navigation'

const ClientNetworkPage = () => {
  return (
      redirect("client-network/emergency")
    )
}

export default withAuth(
  withPermissions(ClientNetworkPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: {
        or:[
          PermissionsObjects.ViewClientEmergencyContact,
          PermissionsObjects.ViewClientInvolvedEmployee,
        ]
      }, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);