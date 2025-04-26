"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_LABEL_OPTIONS } from "@/consts";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { CreateDocument,  Document } from "@/types/Document.types";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
    handleAdd: (values: CreateDocument) => Promise<Document | undefined>;
    documents: Document[];
    open:boolean;
    setOpen: (bool:boolean)=>void;
    defaultSelected?:string;
}

const AddDocumentDialog = ({ handleAdd, documents,open,setOpen,defaultSelected }: Props) => {
    const [_isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState("");
    const [selectedError, setSelectedError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const { createOne: createOneAttachment } = useAttachment();
    function checkFileExtension(filename: string) {
        const extension = filename.slice(-4).toLowerCase();
        if (extension === ".pdf" || extension === "docx" || extension === ".txt") {
            return true;
        } else {
            return false;
        }
    }
    const [selectedOption, setSelectedOption] = useState("")
    let ALREADY_UPLOADED_DOCUMENTS: string[] = [];
    let CUSTOM_DOCUMENT_LABEL_OPTIONS: { label: string, value: string }[] = [];

    ALREADY_UPLOADED_DOCUMENTS = documents?.map((doc) => doc.label)
        .filter((label) => label !== "other") || [];
    CUSTOM_DOCUMENT_LABEL_OPTIONS = DOCUMENT_LABEL_OPTIONS.filter(
        (option) => !ALREADY_UPLOADED_DOCUMENTS.includes(option.value)
    );
    const handleSelectChange = (value: string) => {
        setSelectedError("");
        setSelectedOption(value);
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
        if (!selectedOption) {
            setSelectedError("Een label is vereist!");
            return;
        }
        setIsLoading(true);
        const formData: FormData = new FormData();
        if (!file) {
            setError("Gelieve een documentbestand te verstrekken");
            return;
        }
        formData.append('file', file);
        try {
            const attachment = await createOneAttachment(formData, { displaySuccess: true });
            await handleAdd({ attachmentID: attachment.file_id, label: selectedOption });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unexpected error";
            setError(`Error: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(()=>{
        if (defaultSelected) {
            setSelectedOption(defaultSelected);
        }
    },[defaultSelected]);
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <PrimaryButton
                    text="Add"
                    animation="animate-bounce"
                    icon={PlusCircle}
                    type="button"
                    onClick={() => setOpen(true)}
                />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nieuw Document</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <Select onValueChange={handleSelectChange} defaultValue={selectedOption} >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Betrokenheid melder" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectGroup>
                                {
                                    CUSTOM_DOCUMENT_LABEL_OPTIONS.filter(v => v.value !== "").map((item, index) => (
                                        <SelectItem key={index} value={item.value} className="hover:bg-slate-100 cursor-pointer">{item.label}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {
                        selectedError && (
                            <p role="alert" className="my-3 text-xs px-2 w-full text-red-600 p-1 border-2 border-red-600 bg-red-100 rounded-md">
                                {selectedError}
                            </p>
                        )
                    }
                    <div
                        id="FileUpload"
                        className="relative my-4  block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-c_gray py-4 px-4 dark:bg-meta-4 sm:py-7.5"
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
                    {file ? <div className="mb-3 px-2 w-full p-1 border-2 border-indigo-600 text-indigo-600 bg-indigo-100 rounded-md"> {file.name} </div> : <></>}
                    {error !== "" && (
                        <p role="alert" className="mb-3 px-2 w-full text-red-600 p-1 border-2 border-red-600 bg-red-100 rounded-md">
                            {error}
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <DialogClose
                            type="button"
                            className="p-2 w-full bg-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-colors rounded-md"
                        >
                            Annuleer
                        </DialogClose>
                        <Button
                            type="submit"
                            className="p-2 w-full bg-indigo-200 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors"
                        >
                            Document Indienen
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddDocumentDialog