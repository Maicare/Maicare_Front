
const prefix = '/locations';
const ApiRoutes = {
  CreateOne: prefix,
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  Schedule: {
    ReadDaily: prefix + '/{id}/daily_schedules',
    ReadMonthly: prefix + '/{id}/monthly_schedules',
  }
};

export default ApiRoutes;
