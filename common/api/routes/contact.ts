const prefix = "/senders";
const ApiRoutes = {
  ReadAll: prefix,
  AddContact: `${prefix}`,
  ReadOne: prefix + '/{id}',
  UpdateOne: prefix + '/{id}',
  InvoiceTemplate:{
    CreateOne:prefix + "/{id}/invoice_template"
  }
};

export default ApiRoutes;
