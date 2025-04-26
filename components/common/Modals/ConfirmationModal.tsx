import React, { FunctionComponent, PropsWithChildren } from "react";
import { Dialog } from "@headlessui/react";
import { cn } from "@/utils/cn";
import ModalActionButton from "../Buttons/ModalActionButton";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    modalTitle: string;
    variant?: "ack" | "confirm";
    onConfirm?: () => void;
    className?: string;
};

const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
    open,
    onClose,
    modalTitle,
    variant = "ack",
    onConfirm,
    children,
    className = "",
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            className={cn(
                `fixed top-0 left-0 z-99 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5`
            )}
        >
            <Dialog.Panel
                className={cn(
                    `w-full max-w-142.5 rounded-lg bg-white py-12 px-8 text-center dark:bg-boxdark`,
                    className
                )}
            >
                <Dialog.Title className="pb-2 text-xl font-bold text-slate-800  dark:text-white sm:text-2xl">
                    {modalTitle}
                </Dialog.Title>
                <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                <div className="mb-10 overflow-y-auto max-h-[70dvh]">{children}</div>
                <div className="-mx-3 flex flex-wrap gap-y-4 justify-center">
                    {variant === "confirm" && (
                        <div className="w-full px-3 2xsm:w-1/2 flex">
                            <ModalActionButton onClick={onClose} actionType="CANCEL" className="w-full">
                                Annuleren
                            </ModalActionButton>
                        </div>
                    )}
                    <div className="w-full px-3 2xsm:w-1/2">
                        <ModalActionButton
                            onClick={variant === "confirm" ? onConfirm : onClose}
                            actionType="CONFIRM"
                            className="w-full"
                        >
                            Bevestigen
                        </ModalActionButton>
                    </div>
                </div>
            </Dialog.Panel>
        </Dialog>
    );
};

export default Modal;

export function getAckModal(props: { children: React.ReactNode; modalTitle: string }) {
    const AckModal: React.FC<ModalProps> = (modalProps) => <Modal {...modalProps} {...props} />;
    AckModal.displayName = "AckModal";
    return AckModal;
}

export function getConfirmModal(props: { children: React.ReactNode; modalTitle: string }) {
    const ConfirmModal: React.FC<
        ModalProps & { additionalProps: { onConfirm: (onClose: () => void) => void } }
    > = (modalProps) => (
        <Modal
            {...modalProps}
            {...props}
            variant={"confirm"}
            onConfirm={() => {
                modalProps.additionalProps.onConfirm(modalProps.onClose);
            }}
        />
    );
    ConfirmModal.displayName = "ConfirmModal";
    return ConfirmModal;
}
