import { Id } from "@/common/types/types"

export type Document = {
    attachment_uuid: string,
    client_id: Id,
    created_at: string,
    file: string,
    id: Id,
    is_used: true,
    label: string,
    name: string,
    size: number,
    tag: string,
    updated_at: string,
    uuid: string
}
export type CreateDocument = {
    attachment_id: string,
    label: string
}
export type CreateDocumentResponse = {
    "attachment_id": "string",
    "client_id": 0,
    "id": 0,
    "label": "string"
}