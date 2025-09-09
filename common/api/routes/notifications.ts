
const prefix = '/notifications';
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}/read',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
