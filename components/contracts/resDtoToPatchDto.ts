import { PatchContractReqDto } from "@/consts";
import { ContractResDto } from "@/types/contracts.types";
import { omit } from "@/utils/omit";


export function resDtoToPatchDto(resDto: ContractResDto): PatchContractReqDto {
  return {
    ...omit(resDto, ["attachments", "type"]),
    type_id: resDto.type,
    attachment_ids: resDto.attachments.map((a) => a.id),
  };
}
