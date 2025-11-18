const prefix = "/schedules";

const ApiRoutes = {
  CreateOne: prefix,
  ReadOne: prefix + "/{id}",
  UpdateOne: prefix + "/{id}",
  DeleteOne: prefix + "/{id}",
  AutoGenerate: prefix + "/auto_generate",
  SaveGeneration: prefix + "/save_generated",
};

export default ApiRoutes;
