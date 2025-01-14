import React, { Fragment, useMemo, useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  Row,
} from "@tanstack/table-core";
import { flexRender, useReactTable } from "@tanstack/react-table";
import ChevronDown from "@/components/icons/ChevronDown";
import clsx from "clsx";
import { cn } from "@/utils/cn";

const debugTable = process.env.NODE_ENV === "development";

export type TableProps<InstanceType> = {
  data: InstanceType[];
  columns: ColumnDef<InstanceType>[];
  onRowClick?: (instance: InstanceType) => void;
  className?: string;
  rowClassName?: (row: Row<InstanceType>) => string;
  renderRowDetails?: (row: Row<InstanceType>) => React.ReactNode;
};

function Table<T>({
  data,
  columns: columnDefs,
  onRowClick,
  className,
  renderRowDetails,
  rowClassName,
}: TableProps<T>) {
  const [showRowDetails, setShowRowDetails] = useState<Row<T>>();

  const columns = useMemo<ColumnDef<T>[]>(() => {
    if (!renderRowDetails) {
      return columnDefs;
    }
    const columnHelper = createColumnHelper<T>();
    return [
      ...columnDefs,
      columnHelper.display({
        id: "expand",
        cell: ({ row }) => {
          return (
            <div className="flex justify-end w-full dark:text-slate-50">
              <ChevronDown
                width={36}
                height={36}
                className={clsx({
                  "rotate-[-90deg]": row.getIsExpanded(),
                })}
              />
            </div>
          );
        },
      }),
    ];
  }, [columnDefs, renderRowDetails]);

  const table = useReactTable({
    columns,
    data,
    // TODO: PASS THIS AS A FUNCTION FROM PROPS
    //@ts-ignore
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable,
    manualPagination: true,
    getRowCanExpand: () => !!renderRowDetails,
    getIsRowExpanded: (row) => row.id === showRowDetails?.id,
  });
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={clsx(
          "w-full px-4 overflow-hidden break-words border-collapse table-auto datatable-table datatable-one md:overflow-auto md:table-fixed md:px-8 yyyyyyy",
          className
        )}
      >
        <thead className="px-4 border-separate">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="border-t border-stroke " key={headerGroup.id}>
              {headerGroup.headers.map((header, i) => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={clsx(
                      "py-2 px-4",
                      "bg-gray-100 dark:bg-slate-800", // Apply dark mode background color
                      "text-left"
                    )}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className:
                            "flex items-center relative " +
                            (header.column.getCanSort() ? "cursor-pointer select-none" : ""),
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        <div className="w-full">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                        <div className="absolute top-0 right-0 w-6 ml-auto">
                          {{
                            asc: (
                              <div className="rotate-180 z-1">
                                <ChevronDown />
                              </div>
                            ),
                            desc: (
                              <div>
                                <ChevronDown />
                              </div>
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr
                  onClick={() => {
                    onRowClick?.(row.original);
                    setShowRowDetails((r) => {
                      if (!row.getCanExpand()) {
                        return r;
                      }
                      if (r?.id === row.id) {
                        return undefined;
                      }
                      return row;
                    });
                  }}
                  className={cn(
                    "px-2 py-2 border-t cursor-pointer border-stroke hover:bg-gray-3 dark:hover:bg-slate-700 rounded-2xl",
                    rowClassName?.(row)
                  )}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
                {row.getCanExpand() && row.getIsExpanded() && (
                  <tr>
                    <td
                      colSpan={row.getVisibleCells().length}
                      className="border-t-2 bg-gray-3 border-stroke dark:border-none dark:bg-slate-800"
                    >
                      {renderRowDetails?.(row)}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
