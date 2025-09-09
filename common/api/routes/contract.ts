const prefix = "/contracts";
const ApiRoutes = {
    ReadAll: prefix,
    ReadAllClient: "/clients/{id}/contracts",
    READTYPES: "/contract_types",
    AddOne: "/clients/{id}/contracts",
    ReadOne: "/clients/{id}/contracts/{contract_id}",
    UpdateOne: prefix + "/{id}",
};

export default ApiRoutes;
