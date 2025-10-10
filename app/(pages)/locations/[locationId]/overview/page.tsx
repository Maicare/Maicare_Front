"use client"
import { PermissionsObjects } from '@/common/data/permission.data';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import React from 'react'

const LocationOverview = () => {
  return (
    <div>LocationOverview</div>
  )
}

export default withAuth(
  withPermissions(LocationOverview, {
      redirectUrl: Routes.Common.NotFound,
      requiredPermissions: PermissionsObjects.ViewLocation, // TODO: Add correct permission
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);