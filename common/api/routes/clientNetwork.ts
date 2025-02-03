const prefix = "/clients/{id}";
const ApiRoutes = {
    ReadAll: prefix,
    ReadOne: prefix + "/{id}",
    CreateOne: prefix,
    emergency: {
        ReadAll: prefix + '/emergency_contacts',
        CreateOne: prefix + '/emergency_contacts',
        ReadOne: prefix + '/emergency_contacts/{contact_id}',
        DeleteOne: prefix + '/emergency_contacts/{contact_id}',
    },
    involved: {
        ReadAll: prefix + '/involved_employees',
        CreateOne: prefix + '/involved_employees',
        ReadOne: prefix + '/involved_employees/{employee_id}',
        DeleteOne: prefix + '/involved_employees/{employee_id}',
    },
};

export default ApiRoutes;
