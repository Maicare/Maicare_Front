const prefix = "/intake_form";
const ApiRoutes = {
    CreateOne: prefix,
    upload: prefix + '/upload',
    ReadOne: prefix + '/{id}',
    MoveToWaitingList: prefix + '/{id}/move_to_waiting_list',
    UpdateUrgency: prefix + '/{id}/urgency_score',
};

export default ApiRoutes;
