const prefix = "/attachments";
const ApiRoutes = {
  ReadAll: prefix,
  CreateOne: prefix+"/upload",
  ReadOne: prefix+"/upload/{id}",
  DeleteOne: prefix+"/upload/{id}",

};

export default ApiRoutes;
