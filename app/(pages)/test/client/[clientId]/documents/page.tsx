"use client";

import PrimaryButton from "@/common/components/PrimaryButton";
import Loader from "@/components/common/loader";
import { useDocument } from "@/hooks/document/use-document";
import { ArrowBigLeft, ArrowBigRight, Clock, Database, Download,FileArchive, Tag,  Type, Upload, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import AddDocumentDialog from "./_components/AddDocumentDialog";
import { CreateDocument, Document } from "@/types/Document.types";
import bytesToSize from "@/utils/sizeConverter";
import { formatDateToDutch } from "@/utils/timeFormatting";
import { DOCUMENT_LABEL_OPTIONS } from "@/consts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DeleteDocumentDialog from "./_components/DeleteDocumentDialog";


const DocumentsPage = () => {
    const { clientId } = useParams();
    const { isLoading, documents, page, setPage, createOne, deleteOne } = useDocument({ autoFetch: true, clientId: parseInt(clientId as string) });
    const [open, setOpen] = useState(false);
    const [defaultSeleted, setDefaultSeleted] = useState("");

    const handlePrevious = () => {
        if (page <= 1) {
            setPage(1);
            return;
        }
        setPage(page - 1);
    }
    const handleNext = () => {
        if (documents?.next) {
            setPage(page + 1);
            return;
        }
    }
    const handleAdd = async (values: CreateDocument) => {
        try {
            const res = await createOne(values, {
                displayProgress: true,
                displaySuccess: true
            });
            return res;
        } catch (error) {
            console.error(error);
        }
    }
    let ALREADY_UPLOADED_DOCUMENTS: string[] = [];
    let CUSTOM_DOCUMENT_LABEL_OPTIONS: { label: string, value: string }[] = [];

    ALREADY_UPLOADED_DOCUMENTS = documents.results?.map((doc) => doc.label)
        .filter((label) => label !== "other") || [];
    CUSTOM_DOCUMENT_LABEL_OPTIONS = DOCUMENT_LABEL_OPTIONS.filter(
        (option) => !ALREADY_UPLOADED_DOCUMENTS.includes(option.value)
    );
    const handleDownload = async (doc: Document) => {
        try {
            const response = await fetch(doc.file);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = window.document.createElement("a");
            a.href = url;
            a.download = doc.label ? `${doc.label}.pdf` : "document.pdf";
            window.document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };
    const handleDelete = async (id: string) => {
        try {
            const doc = documents?.results?.find(d => d.attachment_uuid === id);
            if (!doc) {
                alert("doc invalid");
                return
            }
            await deleteOne(doc, {
                displayProgress: true,
                displaySuccess: true
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <div className="w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
                    <FileArchive size={24} className='text-indigo-400' />  Documenten
                </h1>
                <AddDocumentDialog
                    handleAdd={handleAdd}
                    open={open}
                    setOpen={(bool) => setOpen(bool)}
                    documents={documents.results || []}
                    defaultSelected={defaultSeleted}
                />

            </div>
            <div className="grid grid-cols-1 gap-4">
                {
                    isLoading ?
                        <Loader />
                        :
                        <div className="grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 gap-2 p-2 bg-white rounded-md">
                                {
                                    documents.results.map((doc, i) => (
                                        <div key={i} className="flex items-center justify-between px-2 py-1 rounded-md bg-green-50 hover:bg-green-100">
                                            <div className="flex items-center gap-2">

                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        {/* <FileCheck className="w-5 h-5 text-green-500" /> */}
                                                        <img src="/icons/registration.png" alt="file-icon" height={40} width={40} className="" />
                                                        <p className="text-sm text-slate-600">{doc.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1 border-1 border-yellow-400 bg-yellow-50 text-yellow-600 rounded-md p-1 text-xs"><Database className="w-3 h-3" /> {bytesToSize(doc.size)}</span>
                                                        <span className="flex items-center gap-1 border-1 border-cyan-400 bg-cyan-50 text-cyan-600 rounded-md p-1 text-xs"><Clock className="h-3 w-3" />{formatDateToDutch(doc.created_at, true)}</span>
                                                        <span className="flex items-center gap-1 border-1 border-orange-400 bg-orange-50 text-orange-600 rounded-md p-1 text-xs"><Type className="h-3 w-3" />{DOCUMENT_LABEL_OPTIONS.find(i => i.value === doc.label)?.label}</span>
                                                        {doc.tag && <span className="flex items-center gap-1 border-1 border-orange-400 bg-orange-50 text-orange-600 rounded-md p-1 text-xs"><Tag className="h-3 w-3" />{doc.tag}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => handleDownload(doc)}
                                                    className="bg-indigo-200 text-indigo-600 hover:bg-indigo-500 hover:text-white transition-colors"
                                                >
                                                    <Download className="h-4 w-4" />
                                                    Download
                                                </Button>
                                                <DeleteDocumentDialog
                                                    handleConfirm={(id) => { handleDelete(id) }}
                                                    id={doc.attachment_uuid}
                                                />
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    CUSTOM_DOCUMENT_LABEL_OPTIONS.filter(i => i.value !== "").map((doc, i) => (
                                        <div key={i} className="flex items-center  justify-between  px-2 py-1  rounded-md bg-slate-100">
                                            <div className="flex items-center gap-2">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        {/* <FileX className="w-5 h-5 text-red-500" /> */}
                                                        <img src="/icons/registration.png" alt="file-icon" height={40} width={40} className="" />
                                                        <p className="text-sm text-red-600">{doc.label}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="flex items-center gap-1 border-1 border-red-400 bg-red-50 text-red-600 rounded-md p-1 text-xs"><XCircle className="h-3 w-3" />Ontbrekend</span>
                                                        <span className="flex items-center gap-1 border-1 border-red-400 bg-red-50 text-red-600 rounded-md p-1 text-xs"><XCircle className="h-3 w-3" />verplicht</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => { setDefaultSeleted(doc.value); setOpen(true); }}
                                                    className="bg-green-200 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                                                >
                                                    <Upload className="h-4 w-4" />
                                                    Upload
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                            <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                                <PrimaryButton
                                    disabled={page === 1}
                                    onClick={handlePrevious}
                                    text={"Previous"}
                                    icon={ArrowBigLeft}
                                    iconSide="left"
                                />
                                <PrimaryButton
                                    disabled={documents?.next ? false : true}
                                    onClick={handleNext}
                                    text={"Next"}
                                    icon={ArrowBigRight}
                                />
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default DocumentsPage