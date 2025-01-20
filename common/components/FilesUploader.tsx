import React, { useCallback, useEffect, useState, FunctionComponent } from "react";
import { useFormContext } from "react-hook-form";
import XMarkIcon from "@/components/icons/XMarkIcon";
import UploadIcon from "@/components/svg/UploadIcon";
import LoadingCircle from "@/components/icons/LoadingCircle";

import Link from "next/link";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { SelectionOption } from "../types/selection-option.types";
import Button from "@/components/common/Buttons/Button";
import SelectThin from "./SelectThin";

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  tagOptions?: SelectionOption[];
  tagLabel?: string;
};

const FilesUploader: FunctionComponent<Props> = ({
  name,
  label,
  tagOptions,
  tagLabel,
  ...props
}) => {
  const { register, setValue, watch } = useFormContext();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const currentFiles = watch(name);

  useEffect(() => {
    setValue(name, uploadedFiles); // Update React Hook Form value
  }, [uploadedFiles, setValue, name]);

  const selectFiles = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  }, []);

  return (
    <div>
      <label htmlFor={name} className="mb-2.5 block text-slate-800 dark:text-white">
        {label} {props.required && <span className="text-meta-1">*</span>}
      </label>
      <div>
        <div
          id="FileUpload"
          className="relative block w-full appearance-none rounded-sm border border-dashed border-stroke bg-white py-4 px-4 dark:border-strokedark dark:bg-boxdark sm:py-14"
        >
          <input
            {...register(name)}
            onChange={selectFiles}
            type="file"
            multiple
            className="absolute inset-0 z-50 m-0 h-full w-full p-0 opacity-0 outline-none"
          />
          <div className="flex flex-col items-center justify-center space-y-3">
            <span className="flex h-11.5 w-11.5 items-center justify-center rounded-full border border-stroke bg-primary/5 dark:border-strokedark">
              <UploadIcon />
            </span>
            <p className="text-xs">
              Click to <span className="text-primary">upload</span> or{" "}
              <span className="text-primary">drag and drop</span>
            </p>
          </div>
        </div>

        {selectedFiles.map((file, index) => (
          <FileUploader
            key={index}
            file={file}
            onUploaded={(id) => {
              setUploadedFiles((prev) => [...prev, id]);
            }}
            onRemove={(id) => {
              setUploadedFiles((prev) => prev.filter((fileId) => fileId !== id));
              setSelectedFiles((prev) => prev.filter((f) => f !== file));
            }}
            tagOptions={tagOptions}
            tagLabel={tagLabel}
          />
        ))}
      </div>
    </div>
  );
};

export default FilesUploader;

const FileUploader: FunctionComponent<{
  file: File;
  onUploaded: (id: string) => void;
  onRemove: (id?: string) => void;
  tagOptions?: SelectionOption[];
  tagLabel?: string;
}> = ({ file, onRemove, onUploaded, tagOptions, tagLabel }) => {
  const { mutate: upload, isLoading: isUploading, isSuccess, isError } = useUploadFile(endpoint);
  const [fileId, setFileId] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const uploadFile = useCallback(() => {
    upload(file, {
      onSuccess: (data) => {
        setFileId(data.id);
        setUrl(data.file);
        onUploaded(data.id);
      },
    });
  }, [upload, file, onUploaded]);

  useEffect(() => {
    uploadFile();
  }, [uploadFile]);

  const { mutate: fileUpdate } = usePatchFileData(fileId);
  const { data: fileData } = useFileData(fileId);

  return (
    <div className="mt-4.5">
      <div className="border border-stroke bg-white py-3 px-4 dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center">
          <div>{file.name}</div>
          {isUploading && (
            <div className="animate-spin ml-auto">
              <LoadingCircle />
            </div>
          )}
          {isSuccess && url && (
            <div className="ml-auto mr-4 flex gap-4">
              <span className="text-primary">Success!</span>
              <Link href={url} target={"_blank"} download>
                <DownloadIcon />
              </Link>
            </div>
          )}
          {isError && (
            <div className="ml-auto flex items-center">
              <span className="text-danger">Failed</span>
              <Button className="py-2 px-5 mx-3" onClick={uploadFile}>
                Retry
              </Button>
            </div>
          )}
          {!isUploading && (
            <button
              onClick={() => {
                onRemove?.(fileId || undefined);
              }}
            >
              <XMarkIcon className="w-5 h-5 stroke-1.5" />
            </button>
          )}
        </div>
      </div>
      {tagOptions && !isUploading && isSuccess && (
        <SelectThin
          onChange={(e) => {
            fileUpdate({ tag: e.target.value });
          }}
          options={tagOptions}
          id={`${fileId}_tag`}
          label={tagLabel}
          value={fileData?.tag}
        />
      )}
    </div>
  );
};
