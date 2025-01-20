const prefix = '/clients';
const ApiRoutes = {
    ReadAll: prefix,
    ReadOne: prefix + '/{id}',
    CreateOne: prefix + '/{id}',
};

export default ApiRoutes;