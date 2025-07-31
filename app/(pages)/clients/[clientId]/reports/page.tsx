import { PermissionsObjects } from '@/common/data/permission.data';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { redirect } from 'next/navigation'

const ReportsPage = () => {
  return (
    redirect("reports/user-reports")
  )
}

export default withAuth(
  withPermissions(ReportsPage, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);