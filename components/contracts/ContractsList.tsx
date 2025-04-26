import React, { FunctionComponent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/providers/ModalProvider";
import { ColumnDef } from "@tanstack/react-table";
import { fullDateFormat } from "@/utils/timeFormatting";
import {
  careTypeDict,
  CONTRACT_STATUS_TRANSLATION_DICT,
  CONTRACT_STATUS_VARIANT_DICT,
} from "@/consts";
import MonthsBetween from "@/common/components/MonthsBetween";
import StatusBadge from "../common/StatusBadge/StatusBadge";
import {  ContractFilterFormType, ContractItem } from "@/types/contracts.types";
import PaginatedTable from "../common/PaginatedTable/PaginatedTable";
import Loader from "../common/loader";
import DropdownDefault from "@/common/components/DropdownDefault";
import { getRate, rateType } from "@/utils/rate-utils";
import { getDangerActionConfirmationModal } from "../common/Modals/DangerActionConfirmation";
import { useContract } from "@/hooks/contract/use-contract";
import ContractFilters from "./ContractFilters";


type PropsType = {
  clientId?: string;
};

const ContractsList: FunctionComponent<PropsType> = ({  }) => {
  const router = useRouter();
  const [filters, setFilters] = useState<ContractFilterFormType>({
    search: "",
    status: "",
    care_type: "",
    financing_act: "",
    financing_option: "",
  });

  const { contracts, setPage, page, isLoading } = useContract(filters);

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet je zeker dat je dit contract wilt verwijderen?",
      title: "Contract Verwijderen",
    })
  );

  const columnDef = useMemo<ColumnDef<ContractItem>[]>(() => {
    return [
      {
        header: "Opdrachtgever",
        accessorKey: "sender_name",
      },
      {
        header: "Cliënt",
        cell: ({
          row: {
            original: { client_first_name: firstName, client_last_name: lastName },
          },
        }) => `${firstName} ${lastName}`,
      },
      {
        header: "Zorgduur",
        cell: ({
          row: {
            original: { start_date, end_date },
          },
        }) => (
          <div>
            <div>
              <strong>Van:</strong> {fullDateFormat(start_date)}
            </div>
            <div>
              <strong>Tot:</strong> {fullDateFormat(end_date)}
            </div>
            <div>
              <MonthsBetween startDate={start_date} endDate={end_date} />
            </div>
          </div>
        ),
      },
      {
        accessorKey: "care_type",
        header: "Zorgtype",
        cell: (item) => careTypeDict[item.getValue() as keyof typeof careTypeDict],
      },
      {
        accessorKey: "price",
        header: "Tarief",
        cell: ({ row: { original } }) => (
          <>
            <div>{getRate(original)}</div>
            <div>{rateType(original)}</div>
          </>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row: { original } }) => (
          <StatusBadge
            type={CONTRACT_STATUS_VARIANT_DICT[original.status as keyof typeof CONTRACT_STATUS_VARIANT_DICT]}
            text={CONTRACT_STATUS_TRANSLATION_DICT[original.status as keyof typeof CONTRACT_STATUS_TRANSLATION_DICT]}
          />
        ),
      },
      {
        id: "actions",
        accessorKey: "id",
        header: () => "",
        cell: (info) => (
          <div className="flex justify-end">
            <DropdownDefault
              onTriggerClick={(e) => e.stopPropagation()}
              onDelete={(e) => {
                e.stopPropagation();
                open({
                  onConfirm: () => {
                    // deleteContract(info.row.original.id);
                  },
                });
              }}
              onEdit={(e) => {
                e.stopPropagation();
                router.push(
                  `/clients/${info.row.original.client_id}/contracts/${info.row.original.id}/edit`
                );
              }}
            />
          </div>
        ),
      },
    ];
  }, [open,router]);

  return (
    <>
      <ContractFilters onSubmit={setFilters} />

      {isLoading && <Loader />}
      {contracts && (
        <PaginatedTable
          data={contracts}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isLoading}
          onPageChange={(page) => setPage(page)}
          onRowClick={(row) => router.push(`/clients/${row.client_id}/contracts/${row.id}`)}
        />
      )}
    </>
  );
};

export default ContractsList;
