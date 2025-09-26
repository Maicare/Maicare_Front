
const prefix = '/invoices';
const ApiRoutes = {
  CreateOne: prefix,
  CreditOne: prefix+"/{id}/credit",
  GenerateOne: prefix+"/generate",
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
  SendReminder: prefix + '/{id}/send_reminder',///invoices/{id}/send_reminder
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
