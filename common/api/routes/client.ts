const prefix = "/clients";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + "/{id}",
  CreateOne: prefix,
  Medical: {
    Allergies: {
      ReadAll: prefix + "/{id}/allergies",
      CreateOne: prefix + "/{id}/allergies",
    },
    Diagnosis: {
      ReadAll: prefix + "/{id}/diagnosis",
      CreateOne: prefix + "/{id}/diagnosis",
    },
    Episodes: {
      ReadAll: prefix + "/{id}/episodes",
      CreateOne: prefix + "/{id}/episodes",
    },
    Medications: {
      ReadAll: prefix + "/{id}/medications",
      CreateOne: prefix + "/{id}/medications",
    },
  },
};

export default ApiRoutes;
