
const prefix = '/employees';
const ApiRoutes = {
  Profile: prefix + '/profile',
  CreateOne: prefix,
  CreateOneCertificate: prefix+"/{id}/certification",
  UpdateOneCertificate: prefix+"/{id}/certification/{cert_id}",
  DeleteOneCertificate: prefix+"/{id}/certification/{cert_id}",
  CreateOneEducation: prefix+"/{id}/education",
  UpdateOneEducation: prefix+"/{id}/education/{edu_id}",
  DeleteOneEducation: prefix+"/{id}/education/{edu_id}",
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadEducations: prefix + '/{id}/education',
  ReadExperiences: prefix + '/{id}/experience',
  ReadCertificates: prefix + '/{id}/certification',
  UpdateOne: prefix + '/{id}',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
