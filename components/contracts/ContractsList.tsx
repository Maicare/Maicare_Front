import React, { FunctionComponent,  useState } from "react";
import {  ContractFilterFormType } from "@/types/contracts.types";
import Loader from "../common/loader";
import { useContract } from "@/hooks/contract/use-contract";
import ContractFilters from "./ContractFilters";


type PropsType = {
  clientId?: string;
};

const ContractsList: FunctionComponent<PropsType> = ({  }) => {
  const [filters, setFilters] = useState<ContractFilterFormType>({
    search: "",
    status: "",
    care_type: "",
    financing_act: "",
    financing_option: "",
  });

  const {  isLoading } = useContract(filters);





  return (
    <>
      <ContractFilters onSubmit={setFilters} />

      {isLoading && <Loader />}
      {/* {contracts && (
        <PaginatedTable
          data={contracts}
          columns={columnDef}
          page={page ?? 1}
          isFetching={isLoading}
          onPageChange={(page) => setPage(page)}
          onRowClick={(row) => router.push(`/clients/${row.client_id}/contracts/${row.id}`)}
        />
      )} */}
    </>
  );
};

export default ContractsList;
