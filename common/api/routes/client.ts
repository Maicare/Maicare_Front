const prefix = "/clients";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + "/{id}",
  CreateOne: prefix,
  Medical: {
    Allergies: {
      ReadAll: prefix + "/{id}/client_allergies",
      CreateOne: prefix + "/{id}/client_allergies",
    },
  },
};

export default ApiRoutes;
