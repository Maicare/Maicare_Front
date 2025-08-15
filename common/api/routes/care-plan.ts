const prefix = "/care_plans";

const ApiRoutes = {
  ReadOverview: prefix + "/{id}",
  ReadResources: prefix + "/{id}" + "/resources",
  CreateResource: prefix + "/{id}" + "/resources",
  DeleteResource: "/resources" + "/{resourceId}" ,
  UpdateResource: "/resources" + "/{resourceId}" ,
  ReadRisks: prefix + "/{id}" + "/risks",
  CreateRisks: prefix + "/{id}" + "/risks",///care_plans/{care_plan_id}/risks
  UpdateRisks: "/risks" + "/{riskId}",///risks/{risk_id}
  DeleteRisks: "/risks" + "/{riskId}",///risks/{risk_id}
  ReadInterventions: prefix + "/{id}" + "/interventions",
  CreateInterventions: prefix + "/{id}" + "/interventions",
  UpdateInterventions: "/interventions" + "/{interventionId}",///interventions/{intervention_id}
  DeleteInterventions: "/interventions" + "/{interventionId}",///interventions/{intervention_id}
  ReadObjectives: prefix + "/{id}" + "/objectives",
  CreateObjectives: prefix + "/{id}" + "/objectives",
  UpdateObjectives: "/objectives" + "/{objectiveId}",///objectives/{objective_id}
  DeleteObjectives: "/objectives" + "/{objectiveId}",///objectives/{objective_id}
  CreateActions: "/objectives" + "/{objectiveId}" + "/actions",///objectives/{objective_id}/actions
  UpdateActions: "/actions" + "/{actionId}",///actions/{action_id}
  DeleteActions: "/actions" + "/{actionId}",///actions/{action_id}
  ReadSuccessMetrics: prefix + "/{id}" + "/success_metrics",
  CreateSuccessMetrics: prefix + "/{id}" + "/success_metrics",///care_plans/{care_plan_id}/success_metrics
  UpdateSuccessMetrics: "/success_metrics" + "/{metricId}" ,///success_metrics/{metric_id}
  DeleteSuccessMetrics: "/success_metrics" + "/{metricId}",///success_metrics/{metric_id}
  ReadSupportNetwork: prefix + "/{id}" + "/support_network",
  CreateSupportNetwork: prefix + "/{id}" + "/support_network",
  UpdateSupportNetwork: "/support_network" + "/{supportNetworkId}",///care_plan/support_network/{support_network_id}
  DeleteSupportNetwork: "/support_network" + "/{supportNetworkId}",///care_plan/support_network/{support_network_id}
  UpdateOverview: prefix + "/{id}",///care_plans/{care_plan_id}
  DeleteOne: prefix + "/{id}"
};

export default ApiRoutes;
