import React from "react";
import Table, { TableProps } from "@/components/common/Table/Table";
import Pagination, {
  PaginationProps,
} from "@/components/common/Pagination/Pagination";
import { PAGE_SIZE } from "@/consts";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import clsx from "clsx";
import { PaginatedResponse } from "@/common/types/pagination.types";

type Props<TData> = Omit<TableProps<TData>, "data"> &
  Omit<PaginationProps, "totalPages" | "onClick"> & {
    data: PaginatedResponse<TData>;
    rowClassName?: (row: TData) => string;
    sideActions?: React.ReactNode;
    onPageChange: (page: number) => void;
    isFetching?: boolean;
    alertMessage?: string;
  };

function PaginatedTable<TData>({
  page,
  // adjacentPagesShown,
  onPageChange,
  // disabled,
  data,
  sideActions,
  isFetching,
  alertMessage,
  ...tableProps
}: Props<TData>) {
  const pageCount = Math.ceil(data.count / (data.page_size ?? PAGE_SIZE));
  const pagination =
    pageCount > 1 ? (
      <Pagination page={page} onClick={onPageChange} totalPages={pageCount} />
    ) : undefined;
  return (
    <>
      <div
        className={clsx(
          "bg-meta-3 text-white overflow-hidden text-center transition-max-height duration-1000 ease-in-out",
          {
            "max-h-20": isFetching,
            "max-h-0": !isFetching,
          }
        )}
      >
        <div className="p-2">Pagina wordt geladen...</div>
      </div>
      {(pagination || sideActions) && (
        <div className="flex flex-wrap items-center p-4">
          {pagination}
          {sideActions}
        </div>
      )}
      <Table data={data.results} {...tableProps} />

      {data.results?.length == 0 && (
        <LargeErrorMessage
          firstLine={"Oops!"}
          secondLine={
            alertMessage ? alertMessage : "Sorry, geen resultaten gevonden!"
          }
        />
      )}
      <div className="flex flex-wrap justify-between items-center p-4">
        {pagination}
      </div>
    </>
  );
}

export default PaginatedTable;
