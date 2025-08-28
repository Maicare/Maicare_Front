const prefix = '/auth';
const ApiRoutes = {
  Login: prefix + '/token',
  Refresh: prefix + '/refresh',
  Register: prefix + '/register',
  Logout: prefix + '/logout',
  RequestPasswordReset: prefix + '/request-password-reset',
  ResetPassword: prefix + '/reset-password',///auth/change_password
  ChangePassword: prefix + '/change_password',///auth/change_password
  Enable2FA: prefix + '/enable_2fa',///auth/enable_2fa
  Setup2FA: prefix + '/setup_2fa',///auth/setup_2fa
  Verify2FA: prefix + '/verify_2fa',//auth/verify_2fa
};

export default ApiRoutes;