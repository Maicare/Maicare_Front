
const prefix = '/locations';
const ApiRoutes = {
  CreateOne: prefix,
  CreateOneForOrganisation: "organisations" + '/{organisationId}/locations',
  ReadAllForOrganisation: "organisations" + '/{organisationId}/locations',
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  Schedule: {
    ReadDaily: prefix + '/{id}/daily_schedules',
    ReadMonthly: prefix + '/{id}/monthly_schedules',
  },
  Shift:{
    CreateOne: prefix + '/{id}/shifts',
    ReadAll: prefix + '/{id}/shifts',
    ReadOne: prefix + '/{id}/shifts/{shiftId}',
    UpdateOne: prefix + '/{id}/shifts/{shiftId}',
    DeleteOne: prefix + '/{id}/shifts/{shiftId}',
  }
};

export default ApiRoutes;
