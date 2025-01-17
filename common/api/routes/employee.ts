
const prefix = '/employees';
const ApiRoutes = {
  Profile: prefix + '/profile',
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadEducations: prefix + '/{id}/education',
  ReadExperiences: prefix + '/{id}/experience',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
