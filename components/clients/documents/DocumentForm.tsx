"use client";

import React, { FunctionComponent,  useState } from "react";
import { useRouter } from "next/navigation";
import {  DOCUMENT_LABEL_OPTIONS } from "@/consts";
import Button from "@/components/common/Buttons/Button";
import Select from "@/common/components/Select";
import { useDocument } from "@/hooks/document/use-document";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { Any } from "@/common/types/types";

type PropsType = {
  clientId: string;
};

export const DocumentForm: FunctionComponent<PropsType> = ({ clientId }) => {
  const { createOne,documents } = useDocument({ autoFetch: true, clientId: parseInt(clientId) });
  const { createOne: createOneAttachment } = useAttachment();
  const router = useRouter();


  const [error, setError] = useState("");
  const [file, setFile] = useState<File|null>(null);
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function checkFileExtension(filename: string) {
    const extension = filename.slice(-4).toLowerCase();
    if (extension === ".pdf" || extension === "docx" || extension === ".txt") {
      return true;
    } else {
      return false;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files?.[0]?.name === undefined || e.target.files?.[0] === undefined) {
      setError("Please provide a document file");
      return;
    }
    if (!checkFileExtension(e.target.files?.[0].name)) {
      setError("Please provide a document file");
      return;
    }
    setFile(e.target.files?.[0]);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData: FormData = new FormData();
    if (!file) {
      setError("Gelieve een documentbestand te verstrekken");
      return;
    }
    formData.append('file', file);
    try {
      const attachment = await createOneAttachment(formData, { displaySuccess: true });
      await createOne({attachmentID:attachment.file_id,label}, { displayProgress: true, displaySuccess: true });
      router.back();
    } catch (error: Any) {
      setError(`Error: ${error.message}`);
    }finally{
      setIsLoading(false);
    }
  };

  let ALREADY_UPLOADED_DOCUMENTS: string[] = [];
  let CUSTOM_DOCUMENT_LABEL_OPTIONS: { label: string, value: string }[] = [];

  if (!isLoading && documents !== undefined && documents?.results !== undefined) {
    ALREADY_UPLOADED_DOCUMENTS = documents?.results
      .map((doc) => doc.label)
      .filter((label) => label !== "other");
    CUSTOM_DOCUMENT_LABEL_OPTIONS = DOCUMENT_LABEL_OPTIONS.filter(
      (option) => !ALREADY_UPLOADED_DOCUMENTS.includes(option.value)
    );
  }

  return (
    <form onSubmit={onSubmit} className="p-6.5 pt-4.5">
      <Select
        label="label"
        options={CUSTOM_DOCUMENT_LABEL_OPTIONS}
        className="mb-5"
        name="label"
        onChange={(e) => setLabel(e.target.value)}
      />
      {file ? <div className=" pb-4.5"> {file.name} </div> : <></>}
      <div
        id="FileUpload"
        className="relative mb-4 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-c_gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
      >
        <input
          type="file"
          accept=".pdf, .doc, .docx, .txt, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf"
          className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                fill="#3C50E0"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                fill="#3C50E0"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                fill="#3C50E0"
              />
            </svg>
          </span>
          <p className="text-center">
            <span className="text-primary">Klik om te uploaden</span> of sleep het bestand hierheen
          </p>
          <p className="mt-1.5">PDF, DOCX or TXT</p>
          <p>(maximaal, 20mb)</p>
        </div>
      </div>
      {error != "" && (
        <p role="alert" className="pb-3 text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-4.5">
        <Button type={"submit"} disabled={isLoading} isLoading={isLoading} formNoValidate={true}>
          Document Indienen
        </Button>
      </div>
    </form>
  );
};

export default DocumentForm;
