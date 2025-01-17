
const prefix = '/employees';
const ApiRoutes = {
  Profile: prefix + '/profile',
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadEducation: prefix + '/{id}/education',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
