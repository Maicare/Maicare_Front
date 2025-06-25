
const prefix = '/registration_form';
const ApiRoutes = {
    CreateOne: prefix ,
    ReadAll: prefix,
    ReadOne:prefix+"/{id}",
    UpdateOne:prefix+"/{id}",
    UpdateStatus:prefix+"/{id}/status",
};

export default ApiRoutes;
