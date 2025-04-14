"use client";

import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useReport } from "@/hooks/report/use-report";
import { cn } from "@/utils/cn";
import { Change, diffWords } from "diff";
import { Sparkles } from "lucide-react";
import {  useMemo, useState } from "react";

type Props = {
    content: string;
    onConfirm: (text: string) => void;
}

const TextEnhancingDialog = ({ content, onConfirm }: Props) => {
    const { enhanceReport } = useReport({ autoFetch: false, clientId: 0 });
    const [open, setOpen] = useState(false);
    const [enhanced, setEnhaced] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    const diffs: Change[] = useMemo(() => {
        if (!enhanced) {
            return [];
        }
        return diffWords(content, enhanced);
    }, [enhanced, content]);
    const keptAndRemoved = useMemo(() => {
        return diffs.filter((diff) => !diff.added);
    }, [diffs]);
    const keptAndAdded = useMemo(() => {
        return diffs.filter((diff) => !diff.removed);
    }, [diffs]);
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <Button
                    disabled={content.trim().split(/\s+/).length < 49}
                    onClick={async() => {
                        setIsLoading(true);
                        try {
                            const enhancedReport = await enhanceReport(content);
                            setEnhaced(enhancedReport.corrected_text);
                        } catch (error) {
                            console.error(error);
                            setIsError(true);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    type='button'
                    className={cn(
                        "absolute z-99999 bottom-2 right-2 h-8 w-8 rounded-full bg-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-indigo-200",
                        content.trim().split(/\s+/).length < 49 ? "bg-gray-400 text-gray-500" : ""
                    )}
                >
                    <Sparkles className='h-6 w-6' />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rapporten verbeteren</DialogTitle>
                </DialogHeader>
                <div className="font-bold mb-2">Originele tekst:</div>
                {!enhanced && (
                    <div className="rounded-xl bg-white p-5 mb-6">{content}</div>
                )}
                {enhanced && (
                    <div className="rounded-xl bg-white p-5 mb-6">
                        {keptAndRemoved.map((diff, index) => (
                            <span
                                key={index}
                                className={cn({
                                    "bg-meta-6/20": diff.removed,
                                    "bg-meta-3/30": diff.added,
                                })}
                            >
                                {diff.value}
                            </span>
                        ))}
                    </div>
                )}
                <div className="font-bold mb-2">Gewijzigde tekst:</div>
                {isLoading && !enhanced && (
                    <div className="rounded-xl bg-white p-5 mb-10">
                        <Loader />
                    </div>
                )}
                {enhanced && (
                    <div className="rounded-xl bg-white p-5 mb-10">
                        {keptAndAdded.map((diff, index) => (
                            <span key={index} className={cn({ "bg-meta-3/30": diff.added })}>
                                {diff.value}
                            </span>
                        ))}
                    </div>
                )}
                {isError && (
                    <div className="rounded-xl bg-white p-5 mb-10 text-red-600">
                        Er is een fout opgetreden bij het verbeteren van de tekst.
                        <Button
                            type="button"
                            onClick={async () => {
                                setIsError(false);
                                await enhanceReport(content || "");
                            }}
                        >
                            Probeer opnieuw
                        </Button>
                    </div>
                )}
                <div className="flex justify-center gap-4">
                    <DialogClose
                        type="button"
                    >
                        Annuleer
                    </DialogClose>
                    <Button
                        disabled={!enhanced}
                        type="button"
                        onClick={() => {
                            onConfirm(enhanced);
                            setOpen(false);
                        }}
                    >
                        Accepteer wijzigingen
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default TextEnhancingDialog