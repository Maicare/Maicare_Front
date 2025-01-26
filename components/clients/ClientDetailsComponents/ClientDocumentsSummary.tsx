"use client";

import React, { FunctionComponent } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { DOCUMENT_LABELS } from "@/consts";
import bytesToSize from "@/utils/sizeConverter";
import DetailCell from "../../common/DetailCell";



type Document = {
  id: string;
  original_filename: string;
  file_size: number;
  label: string;
  uploaded_at: string;
};

const mockData: Document[] = [];

const ClientDocumentsSummary: FunctionComponent = () => {
  // const { data, isLoading, isError } = useDocumentList(clientId.toString());

  if (mockData.length === 0) return <div>Geen documenten gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {mockData.map((document) => {
        return (
          <li
            key={document.id}
            className="grid grid-cols-3 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={document.original_filename}
              value=""
            />
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={bytesToSize(document.file_size)}
              value=""
            />
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={
                <span className="text-sm  p-1 px-2 text-yellow-700 bg-yellow-400 transition font-bold rounded-full">
                  {DOCUMENT_LABELS[document.label as keyof typeof DOCUMENT_LABELS] || "-"}
                </span>
              }
              value=""
            />
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={dayjs(document.uploaded_at).format("DD MMM, YYYY")}
              value=""
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ClientDocumentsSummary;
