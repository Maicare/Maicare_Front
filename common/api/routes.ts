import Client from "./routes/client";
import Auth from "./routes/auth";
import Employee from "./routes/employee";
import Role from "./routes/role";
import Location from "./routes/location";
import Contact from "./routes/contact";
import Attachment from "./routes/attachment";
import Report from "./routes/report";
import ClientNetwork from "./routes/clientNetwork";
import MaturityMatrix from "./routes/maturity-matrix";
import AutomaticReport from "./routes/automatic-report";
import IntakeForm from "./routes/intake-form"

const ApiRoutes = {
  Auth,
  Employee,
  Role,
  Location,
  Client,
  Contact,
  Attachment,
  Report,
  ClientNetwork,
  MaturityMatrix,
  AutomaticReport,
  IntakeForm
};

export default ApiRoutes;
