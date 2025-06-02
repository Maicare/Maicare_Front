const prefix = "/schedules";

const ApiRoutes = {
  CreateOne: prefix,
  ReadOne: prefix + "/{id}",
  UpdateOne: prefix + "/{id}",
  DeleteOne: prefix + "/{id}",
};

export default ApiRoutes;
