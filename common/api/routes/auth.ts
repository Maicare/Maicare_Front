const prefix = '/auth';
const ApiRoutes = {
  Login: prefix + '/token',
  Refresh: prefix + '/refresh',
  Register: prefix + '/register',
  Logout: prefix + '/logout',
  RequestPasswordReset: prefix + '/request-password-reset',
  ResetPassword: prefix + '/reset-password',
};

export default ApiRoutes;