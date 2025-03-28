const prefix = "/contracts";
const ApiRoutes = {
    ReadAll: prefix,
    READTYPES: "/contract_types",
    AddOne: "/clients/{id}/contracts",
    ReadOne: "/clients/{id}/contracts/{contract_id}",
    UpdateOne: prefix + "/{id}",
};

export default ApiRoutes;
""