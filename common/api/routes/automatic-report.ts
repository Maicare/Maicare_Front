const prefix = "/clients/{id}";
const ApiRoutes = {
  ReadAll: prefix + "/ai_progress_reports",
  GenerateOne: prefix + "/ai_progress_reports",
  Validate: prefix + "/ai_progress_reports/confirm",
};

export default ApiRoutes;
