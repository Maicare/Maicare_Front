import { ModalProps } from "@/common/types/modal.types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import FormModal from "./FormModal";
import { cn } from "@/utils/cn";
import Loader from "../loader";
import Button from "../Buttons/Button";
import { Change, diffWords } from "diff";
import { useReport } from "@/hooks/report/use-report";



const TextEnhancingModal: FunctionComponent<ModalProps> = ({ additionalProps, ...props }) => {
    const { enhanceReport } = useReport({ autoFetch: false, clientId: 0 });
    const [enhanced, setEnhaced] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    useEffect(() => {
        const enhance = async (content: string) => {
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
        }
        if (additionalProps?.content) {
            enhance(additionalProps.content);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [additionalProps?.content]);
    const diffs: Change[] = useMemo(() => {
        if (!enhanced) {
            return [];
        }
        return diffWords(additionalProps?.content, enhanced);
    }, [enhanced, additionalProps?.content]);
    const keptAndRemoved = useMemo(() => {
        return diffs.filter((diff) => !diff.added);
    }, [diffs]);
    const keptAndAdded = useMemo(() => {
        return diffs.filter((diff) => !diff.removed);
    }, [diffs]);
    return (
        <FormModal {...props} title={additionalProps?.title}>
            <div className="font-bold mb-2">Originele tekst:</div>
            {!enhanced && (
                <div className="rounded-xl bg-white p-5 mb-6">{additionalProps?.content}</div>
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
                        onClick={async () => {
                            setIsError(false);
                            await enhanceReport(additionalProps?.content || "");
                        }}
                    >
                        Probeer opnieuw
                    </Button>
                </div>
            )}
            <div className="flex justify-center gap-4">
                <Button
                    buttonType={"Outline"}
                    onClick={() => {
                        props.onClose();
                    }}
                >
                    Annuleer
                </Button>
                <Button
                    disabled={!enhanced}
                    onClick={() => {
                        additionalProps?.onConfirm(enhanced);
                        props.onClose();
                    }}
                >
                    Accepteer wijzigingen
                </Button>
            </div>
        </FormModal>
    );
};

export default TextEnhancingModal;