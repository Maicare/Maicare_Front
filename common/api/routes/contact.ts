const prefix = "/senders";
const ApiRoutes = {
  ReadAll: prefix,
  AddContact: `${prefix}`,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
};

export default ApiRoutes;
