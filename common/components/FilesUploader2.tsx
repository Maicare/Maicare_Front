import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import XMarkIcon from "@/components/icons/XMarkIcon";
import UploadIcon from "@/components/svg/UploadIcon";
import LoadingCircle from "@/components/icons/LoadingCircle";
import Link from "next/link";
import DownloadIcon from "@/components/icons/DownloadIcon";
import { SelectionOption } from "../types/selection-option.types";
import Button from "@/components/common/Buttons/Button";
import SelectThin from "./SelectThin";
import { useIntake } from "@/hooks/intake/use-intake";
import { useAttachment } from "@/hooks/attachment/use-attachment";

type Props = {
    name: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    tagOptions?: SelectionOption[];
    tagLabel?: string;
    intakeForm?: boolean;
};

const FilesUploader2: FunctionComponent<Props> = ({
    name,
    label,
    tagOptions,
    tagLabel,
    intakeForm,
    ...props
}) => {
    const { register, setValue, watch } = useFormContext();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const files = watch(name);

    // Manually register the field (if not already registered)
    useEffect(() => {
        register(name);
    }, [name]);

    // Automatically update the form field whenever the uploadedFiles state changes
    useEffect(() => {
        setValue(name, uploadedFiles);
        console.log("Form field updated", name, uploadedFiles);
    }, [uploadedFiles, name]);

    const selectFiles = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = event.target.files;
            if (fileList) {
                // Add the newly selected files to the state
                setSelectedFiles((prev) => [...prev, ...Array.from(fileList)]);
            }
        },
        []
    );

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
                    {/* Removed {...register(name)} */}
                    <input
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
                        intakeForm={intakeForm}
                        file={file}
                        onUploaded={(id: string) => {
                            // Append new file id using functional update
                            setUploadedFiles([...uploadedFiles, id]);
                        }}
                        onRemove={(id?: string) => {
                            setUploadedFiles((prev) => prev.filter((fileId) => fileId !== id));
                            setSelectedFiles((prev) => prev.filter((f) => f.name !== file.name));
                        }}
                        tagOptions={tagOptions}
                        tagLabel={tagLabel}
                    />
                ))}
            </div>
        </div>
    );
};

export default FilesUploader2;

// Nested FileUploader component remains the same:
const FileUploader: FunctionComponent<{
    file: File;
    onUploaded: (id: string) => void;
    onRemove: (id?: string) => void;
    tagOptions?: SelectionOption[];
    tagLabel?: string;
    intakeForm?: boolean;
}> = ({ file, onRemove, onUploaded, tagOptions, tagLabel, intakeForm }) => {
    const { createOne } = useAttachment();
    const { uploadFileForIntake } = useIntake({});
    const [fileId, setFileId] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const uploadFile = useCallback(async () => {
        if (fileId) return; // prevent re-upload if already done
        setError("");
        setIsUploading(true);
        const formData: FormData = new FormData();
        formData.append("file", file);
        try {
            let attachment;
            if (intakeForm) {
                attachment = await uploadFileForIntake(formData, { displaySuccess: true });
            } else {
                attachment = await createOne(formData, { displaySuccess: true });
            }
            setUrl(attachment.file_url);
            setFileId(attachment.file_id);
            onUploaded(attachment.file_id);
        } catch (e) {
            console.error(e);
            setError(String(e) || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    }, [file, fileId, intakeForm, onUploaded, createOne, uploadFileForIntake]);

    // Call uploadFile only once on mount
    useEffect(() => {
        uploadFile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mt-4.5">
            <div className="border border-stroke bg-white py-3 px-4 dark:border-strokedark dark:bg-boxdark">
                <div className="flex items-center">
                    <div className="w-[80%] truncate overflow-hidden whitespace-nowrap">{file.name}</div>
                    {isUploading && (
                        <div className="animate-spin ml-auto">
                            <LoadingCircle />
                        </div>
                    )}
                    {url && (
                        <div className="ml-auto mr-4 flex gap-4">
                            <Link href={url} target="_blank" download>
                                <DownloadIcon />
                            </Link>
                        </div>
                    )}
                    {error && (
                        <div className="ml-auto flex items-center">
                            <span className="text-danger">{error}</span>
                            <Button className="py-2 px-5 mx-3" onClick={uploadFile}>
                                Retry
                            </Button>
                        </div>
                    )}
                    {!isUploading && (
                        <button onClick={() => onRemove(fileId || undefined)}>
                            <XMarkIcon className="w-5 h-5 stroke-1.5" />
                        </button>
                    )}
                </div>
            </div>
            {/* Tagging functionality if needed */}
        </div>
    );
};