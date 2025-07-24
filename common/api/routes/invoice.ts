
const prefix = '/invoices';
const ApiRoutes = {
  CreateOne: prefix+"/generate",
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  InvoiceTemplate:{
    ReadAll:prefix+"/template_items"
  },
  Payment:{
    CreateOne: prefix + '/{id}/payments',
    ReadAll: prefix + '/{id}/payments',
    ReadOne: prefix + '/{id}/payments/{paymentId}',
    UpdateOne: prefix + '/{id}/payments/{paymentId}',
    DeleteOne: prefix + '/{id}/payments/{paymentId}',
  },
  Log:{
    CreateOne: prefix + '/{id}/audit',
    ReadAll: prefix + '/{id}/audit',
    ReadOne: prefix + '/{id}/audit/{auditId}',
    UpdateOne: prefix + '/{id}/audit/{auditId}',
    DeleteOne: prefix + '/{id}/audit/{auditId}',
  }
};

export default ApiRoutes;
