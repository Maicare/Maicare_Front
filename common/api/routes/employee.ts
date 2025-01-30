
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
  CreateOneExperience: prefix+"/{id}/experience",
  UpdateOneExperience: prefix+"/{id}/experience/{exp_id}",
  DeleteOneExperience: prefix+"/{id}/experience/{exp_id}",
  ReadAll: prefix,
  ReadOne: prefix + '/{id}',
  ReadEducations: prefix + '/{id}/education',
  ReadExperiences: prefix + '/{id}/experience',
  ReadCertificates: prefix + '/{id}/certification',
  UpdateOne: prefix + '/{id}',
  UpdateImage: prefix + '/{id}/profile_picture',
  DeleteOne: prefix + '/{id}',
};

export default ApiRoutes;
