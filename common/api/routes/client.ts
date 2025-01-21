const prefix = '/clients';
const ApiRoutes = {
    ReadAll: prefix,
    ReadOne: prefix + '/{id}',
    CreateOne: prefix,
};

export default ApiRoutes;