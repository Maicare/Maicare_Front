const prefix = "/maturity_matrix";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
};

export default ApiRoutes;
