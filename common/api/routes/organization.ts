
const prefix = '/organisations';
const ApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadCount: prefix+"/{id}/counts",
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
