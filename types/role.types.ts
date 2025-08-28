import { ROLE } from "@/common/types/permission.types";
import { Id } from "@/common/types/types";

export interface Role {
    id:Id;
    role_name:string;
    permission_count:number;
}