import { Permission } from "@/common/types/permission.types"
import { Id } from "@/common/types/types"

export type Employee = {
    user_id: Id,
    employee_id: Id, 
    first_name: string, 
    last_name: string, 
    email: string, 
    role_id: Id,
    permissions: Permission[],
}