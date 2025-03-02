"use client";
import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { DOCUMENT_LABELS } from "@/consts";
import dayjs from "dayjs";
import "dayjs/locale/en";
import FileIcon from "@/components/svg/FileIcon";
import { Any } from "@/common/types/types";
import bytesToSize from "@/utils/sizeConverter";
import Panel from "@/components/common/Panel/Panel";
import LinkButton from "@/components/common/Buttons/LinkButton";
import PaginatedTable from "@/components/common/PaginatedTable/PaginatedTable";
import { useDocument } from "@/hooks/document/use-document";
import { ColumnDef } from "@tanstack/table-core";
import { useParams } from "next/navigation";
import { Document } from "@/types/Document.types";
import Loader from "@/components/common/loader";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const DocumentsPage: FunctionComponent = () => {
  const { clientId } = useParams();
  const [page, setPage] = useState<number>(1);
  const { documents, isLoading, error, readMissingDocs, deleteOne } =
    useDocument({
      autoFetch: true,
      clientId: parseInt(clientId as string),
      page,
      page_size: 10,
    });

  const [missingDocs, setMissingDocs] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [document, setDocument] = useState<Document | null>(null);

  const onSubmit = async () => {
    try {
      setDeleting(true);
      await deleteOne(document!, { displaySuccess: true });
      setModalOpen(false);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchMissingDocs = async () => {
      const data = await readMissingDocs(parseInt(clientId as string));
      setMissingDocs(data.missing_docs);
    };
    fetchMissingDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId, documents]);

  const columnDef = useMemo<ColumnDef<Document>[]>(() => {
    return [
      {
        accessorKey: "none",
        header: () => "",
        cell: () => (
          <div className="flex justify-center w-full">
            <FileIcon />
          </div>
        ),
      },
      {
        accessorKey: "original_filename",
        header: () => "Bestandsnaam",
        cell: (info: Any) => info.getValue() || "Niet Beschikbaar",
      },
      {
        accessorKey: "size",
        header: () => "Bestandsgrootte",
        cell: (info: Any) =>
          bytesToSize(parseInt(info.getValue())) || "Niet Beschikbaar",
      },
      {
        accessorKey: "label",
        header: () => "Label",
        cell: (info: Any) => (
          <div className="inline-block whitespace-nowrap text-sm p-1 px-2 text-yellow-700 bg-yellow-400 transition font-bold rounded-full">
            {DOCUMENT_LABELS[
              info.getValue() as keyof {
                registration_form: string;
                intake_form: string;
                consent_form: string;
                risk_assessment: string;
                self_reliance_matrix: string;
                force_inventory: string;
                care_plan: string;
                signaling_plan: string;
                cooperation_agreement: string;
                other: string;
              }
            ] || "-"}
          </div>
        ),
        className: "min-w-fit", // Tailwind v3 class; or use style={{ minWidth: "fit-content" }}
      },
      {
        accessorKey: "created_at",
        header: () => "Geüpload Op",
        cell: (info: Any) =>
          dayjs(info.getValue()).format("DD MMM, YYYY") || "Niet Beschikbaar",
      },
      {
        accessorKey: "file",
        header: () => "",
        cell: (info: Any) => {
          const row = info.row.original; // Access full row data

          const handleDownload = async () => {
            try {
              const response = await fetch(row.file);
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = window.document.createElement("a");
              a.href = url;
              a.download = row.label ? `${row.label}.pdf` : "document.pdf";
              window.document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            } catch (error) {
              console.error("Download failed:", error);
            }
          };

          return (
            <button
              onClick={handleDownload}
              className="w-[30%] text-sm min-w-[120px] p-2 px-3 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
              style={{ textWrap: "nowrap" }}
            >
              Downloaden
            </button>
          );
        },
      },
      {
        accessorKey: "id",
        header: () => "",
        cell: (info: Any) => {
          const row = info.row.original; // Access full row data
          return (
            <a
              onClick={() => {
                setDocument(row);
                setModalOpen(true);
              }}
              className="w-[30%] text-sm min-w-[120px] p-2 px-3 text-white transition border rounded-lg cursor-pointer border-danger bg-danger hover:bg-opacity-90"
              style={{ textWrap: "nowrap" }}
            >
              Verwijderen
            </a>
          );
        },
      },
    ];
  }, []);

  if (!missingDocs.length) {
    return <Loader />;
  }

  const TOTAL_REQUIRED_DOCUMENTS = Object.keys(DOCUMENT_LABELS).length - 1;

  const ALREADY_UPLOADED_DOCUMENTS: string[] = Object.keys(
    DOCUMENT_LABELS
  ).filter((doc) => !missingDocs.includes(doc) && doc !== "other");
  const NOT_UPLOADED_DOCUMENTS: { label: string; value: string }[] =
    missingDocs.map((doc) => {
      return {
        label:
          DOCUMENT_LABELS[
          doc as keyof {
            registration_form: string;
            intake_form: string;
            consent_form: string;
            risk_assessment: string;
            self_reliance_matrix: string;
            force_inventory: string;
            care_plan: string;
            signaling_plan: string;
            cooperation_agreement: string;
            other: string;
          }
          ],
        value: doc,
      };
    });

  return (
    <>
      <ConfirmationModal
        title="Bevestiging Verwijderen"
        message="Weet u zeker dat u dit document wilt verwijderen?"
        buttonMessage="Verwijderen"
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        isLoading={deleting}
        action={() => {
          onSubmit();
        }}
      />

      <Panel
        title={`Documentenlijst (${ALREADY_UPLOADED_DOCUMENTS.length}/${TOTAL_REQUIRED_DOCUMENTS})`}
        sideActions={
          <LinkButton
            text={
              NOT_UPLOADED_DOCUMENTS.length
                ? `Moet ${NOT_UPLOADED_DOCUMENTS.length} extra documenten toevoegen`
                : "Upload een Nieuw Document"
            }
            href={`/clients/${clientId}/document/new`}
            className={NOT_UPLOADED_DOCUMENTS.length > 0 ? "bg-red-600" : ""}
          />
        }
      >
        {isLoading && <div className="p-4 sm:p-6 xl:p-7.5">Loading...</div>}
        {documents && (
          <>
            {NOT_UPLOADED_DOCUMENTS.length > 0 && (
              <div className="p-5 bg-c_red text-white font-bold rounded-lg m-5">
                Zorg ervoor dat u de rest van de documenttypen uploadt:
                <ul>
                  {NOT_UPLOADED_DOCUMENTS.map((doc, i) => (
                    <li key={i}>- {doc.label}</li>
                  ))}
                </ul>
              </div>
            )}
            <PaginatedTable
              data={documents}
              columns={columnDef}
              page={page ?? 1}
              isFetching={isLoading}
              onPageChange={(page) => setPage(page)}
            />
          </>
        )}
        {error && (
          <p role="alert" className="text-red-600">
            Er is een fout opgetreden.
          </p>
        )}
      </Panel>
    </>
  );
};

export default withAuth(
  withPermissions(DocumentsPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
