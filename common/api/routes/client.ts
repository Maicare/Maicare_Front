const prefix = "/clients";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + "/{id}",
  UpdateProfilePicture: prefix + "/{id}/profile_picture",
  CreateOne: prefix,
  Appointment: {
    ReadAll: prefix + "/{id}/appointment_cards",
    Download: prefix + "/{id}/appointment_cards/generate_document",
  },
  Medical: {
    Allergies: {
      ReadAll: prefix + "/{id}/allergies",
      CreateOne: prefix + "/{id}/allergies",
      readOne: prefix + "/{id}/allergies/{allergy_id}",
      getAllergyTypes: prefix + "/allergy_types",
    },
    Diagnosis: {
      ReadAll: prefix + "/{id}/diagnosis",
      CreateOne: prefix + "/{id}/diagnosis",
      readOne: prefix + "/{id}/diagnosis/{diagnosis_id}",
    },
    Episodes: {
      ReadAll: prefix + "/{id}/episodes",
      CreateOne: prefix + "/{id}/episodes",
    },
    Medications: {
      ReadAll: prefix + "/{id}/medications",
      CreateOne: prefix + "/{id}/medications",
      readOne: prefix + "/{id}/diagnosis/{medication_id}",
    },
  },
  Incident: {
    ReadAll: prefix + "/{id}/incidents",
    CreateOne: prefix + "/{id}/incidents",
    UpdateOne: prefix + "/{id}/incidents/{incident_id}",
    ConfirmOne: prefix + "/{id}/incidents/{incident_id}/confirm",
    ReadOne: prefix + "/{id}/incidents/{incident_id}",
    GeneratePdf: prefix + "/{id}/incidents/{incident_id}/file"
  },
  Document: {
    ReadAll: prefix + "/{id}/documents",
    CreateOne: prefix + "/{id}/documents",
    MissingDocs: prefix + "/{id}/missing_documents",
    DeleteOne: prefix + "/{id}/documents/{doc_id}",
    ReadOne: prefix + "/{id}/documents/{doc_id}",
  },
  Assessment: {
    ReadAll: prefix + "/{id}/maturity_matrix_assessment",
    CreateOne: prefix + '/{id}/maturity_matrix_assessment',
    ReadOne: prefix + '/{id}/maturity_matrix_assessment/{mma_id}',
  },
  Goal: {
    ReadAll: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals",
    ReadOne: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals/{goal_id}",
  },
  RelatedEmails: {
    ReadAll: prefix + "/{id}/related_emails",
  },
};

export default ApiRoutes;
