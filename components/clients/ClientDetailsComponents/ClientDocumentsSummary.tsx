"use client";

import React, { FunctionComponent } from "react";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { DOCUMENT_LABELS } from "@/consts";
import bytesToSize from "@/utils/sizeConverter";
import DetailCell from "../../common/DetailCell";
import { useDocument } from "@/hooks/document/use-document";
import { getUniqueConcurrencesObjects } from "@/utils/concurrences";


type Props = {
  clientId: number;
};

const ClientDocumentsSummary: FunctionComponent<Props> = ({clientId}) => {
  const {documents} = useDocument({autoFetch: true,clientId});

  if (documents.results.length === 0) return <div>Geen documenten gevonden</div>;
  return (
    <ul className="flex flex-col gap-2">
      {getUniqueConcurrencesObjects(documents.results,"label").map((document) => {
        return (
          <li
            key={document.id}
            className="grid grid-cols-3 hover:bg-gray-3 dark:hover:bg-slate-700 p-4 cursor-pointer rounded-xl"
          >
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={document.name}
              value=""
            />
            <DetailCell
              className="flex items-center"
              ignoreIfEmpty={true}
              label={bytesToSize(document.size)}
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
              label={dayjs(document.created_at).format("DD MMM, YYYY")}
              value=""
            />
          </li>
        );
      })}
    </ul>
  );
};

export default ClientDocumentsSummary;
