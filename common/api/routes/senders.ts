const prefix = "/senders";
const ApiRoutes = {
    ReadAll: prefix,
    ReadOne: prefix + '/{id}',
    CreateOne: prefix,
    UpdateOne: prefix + '/{id}',
    DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
