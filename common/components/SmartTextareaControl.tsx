import { Controller, useFormContext } from "react-hook-form";
import IconButton from "@/components/common/Buttons/IconButton";
import { cn } from "@/utils/cn";
import Sparkles from "@/components/icons/Sparkles";
import TextEnhancingModal from "@/components/common/Modals/TextEnhancingModal";
import { useModal } from "@/components/providers/ModalProvider";

type SmartTextareaProps = {
    name: string;
    label: string;
    modalTitle: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const SmartTextarea: React.FC<SmartTextareaProps> = ({
    name,
    label,
    modalTitle,
    placeholder,
    required,
    disabled,
    ...props
}) => {
    const { open } = useModal(TextEnhancingModal);
    const {
        control,
        formState: { errors },
    } = useFormContext(); // Get the form context

    return (
        <div className="w-full">
            <label htmlFor={name} className="mb-2.5 block text-slate-800 dark:text-white">
                {label} {required && <span className="text-meta-1">*</span>}
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="relative w-full h-fit rounded bg-white border-[1.5px] border-stroke transition focus-within:border-primary active:border-primary group-disabled:cursor-default group-disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus-within:border-primary">
                        <textarea
                            {...field}
                            id={name}
                            placeholder={placeholder}
                            disabled={disabled}
                            {...props}
                            className="w-full h-full block rounded px-5 py-3 bg-transparent font-medium outline-none resize-none"
                        />
                        <IconButton
                            disabled={disabled || field.value.trim().split(/\s+/).length < 75}
                            onClick={() => {
                                open({
                                    title: modalTitle,
                                    content: field.value,
                                    onConfirm: (content: string) => {
                                        field.onChange(content);
                                    },
                                });
                            }}
                            className={cn(
                                "absolute bottom-4 right-2",
                                field.value.trim().split(/\s+/).length < 75 ? "bg-gray-400 text-gray-500" : ""
                            )}
                        >
                            <Sparkles />
                        </IconButton>
                    </div>
                )}
            />

            {errors[name] && (
                <p role="alert" className="pt-1 text-red-600">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};

export default SmartTextarea;