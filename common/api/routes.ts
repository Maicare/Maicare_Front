
import Client from './routes/client';
import Auth from "./routes/auth";
import Employee from "./routes/employee";
import Role from "./routes/role";
import Location from "./routes/location";
import Contact from "./routes/contact";
import Attachment from "./routes/attachment";

const ApiRoutes = {
  Auth,
  Employee,
  Role,
  Location,
  Client,
  Contact,
  Attachment,
};

export default ApiRoutes;
