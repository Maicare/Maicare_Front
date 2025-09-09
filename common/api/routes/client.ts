import { add } from "date-fns";

const prefix = "/clients";
const ApiRoutes = {
  ReadAll: prefix,
  ReadOne: prefix + "/{id}",
  UpdateProfilePicture: prefix + "/{id}/profile_picture",
  Status: prefix + "/{id}/status",
  StatusHistory: prefix + "/{id}/status_history",
  CreateOne: prefix,
  addresses: prefix + "/{id}/addresses",
  ReadCounts: prefix + "/counts",///clients/counts
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
      ReadAll: prefix + "/{id}/diagnosis/{diagnosis_id}/medications",
      CreateOne: prefix + "/{id}/diagnosis/{diagnosis_id}/medications",
      UpdateOne: prefix + "/{id}/diagnosis/{diagnosis_id}/medications/{medication_id}",
      readOne: prefix + "/{id}/diagnosis/{medication_id}",
      DeleteOne: prefix + "/{id}/medications/{medication_id}",
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
    GenerateOne: prefix + '/{id}/assessments',
    ReadOne: prefix + '/{id}/maturity_matrix_assessment/{mma_id}',
  },
  CarePlan: {
    ReadAll: prefix + "/{id}/assessments",///clients/{id}/assessments
  },
  Goal: {
    ReadAll: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals",
    ReadOne: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals/{goal_id}",
    CreateOne: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals",
    CreateObjective: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals/{goal_id}/objectives",
    GenerateObjectives: prefix + "/{id}/maturity_matrix_assessment/{assessment_id}/goals/{goal_id}/objectives/generate",
  },
  RelatedEmails: {
    ReadAll: prefix + "/{id}/related_emails",
  },
  Appointmens: {
    ReadAll: prefix + "/{id}/appointments",
  }
};

export default ApiRoutes;
