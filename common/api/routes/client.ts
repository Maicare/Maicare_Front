const prefix = "/clients";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + "/{id}",
  UpdateProfilePicture: prefix + "/{id}/profile_picture",
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
  Incident: {
    ReadAll: prefix + "/{id}/incidents",
    CreateOne: prefix + "/{id}/incidents",
    UpdateOne: prefix + "/{id}/incidents/{incident_id}",
    ReadOne: prefix + "/{id}/incidents/{incident_id}",
  },
};

export default ApiRoutes;
