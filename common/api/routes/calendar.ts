const prefix = "/appointments";

const ApiRoutes = {
  CreateOne: prefix,
  ReadOne: prefix + "/{id}",
  UpdateOne: prefix + "/{id}",
  DeleteOne: prefix + "/{id}",
  AddClient: prefix + "/{id}/clients",
  ConfirmAppointment: prefix + "/{id}/confirm",
  AddParticipants: prefix + "/{id}/participants",
};

export default ApiRoutes;
