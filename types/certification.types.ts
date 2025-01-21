import { Id } from "@/common/types/types"
import { ApiResponse } from "../common/types/api.types";

export type Certification = {
  date_issued: string,
  employee_id: Id,
  id: Id,
  issued_by: string,
  name: string
}

export type CreateCertificate = {
  name:string;
  issued_by:string,
  date_issued:string,
  employee_id:Id,
}

export const initialValues: CreateCertificate = {
  name: "",
  issued_by: "",
  date_issued: "",
  employee_id: 0
};

