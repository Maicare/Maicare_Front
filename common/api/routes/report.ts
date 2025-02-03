const prefix = '/clients/{id}';//client Id
const ApiRoutes = {
  ReadAll : prefix + '/progress_reports',
  ReadOne : prefix + '/progress_reports/{report_id}',
  CreateOne : prefix + '/progress_reports',
  UpdateOne : prefix + '/progress_reports/{report_id}',
  Enhance : '/ai/spelling_check',
};

export default ApiRoutes;