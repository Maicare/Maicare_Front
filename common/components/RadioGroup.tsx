import React, { FunctionComponent, ChangeEvent } from "react";
import { SelectionOption } from "@/common/types/selection-option.types";
import clsx from "clsx";

type Props = {
    picked: SelectionOption["value"];
    options: SelectionOption[];
    id: string;
    label?: string;
    name: string;
    className?: string;
    onChange: (value: string) => void;
};

const RadioGroup: FunctionComponent<Props> = ({
    id,
    picked,
    options,
    label,
    name,
    className,
    onChange,
}) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={className}>
            {label && (
                <div id={id} className="mb-2.5">
                    {label}
                </div>
            )}
            <div role="group" className="flex items-center gap-5.5" aria-labelledby={id}>
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="relative flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-800 dark:text-white"
                    >
                        <input
                            className="sr-only"
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={picked === option.value}
                            onChange={handleChange}
                        />
                        <span
                            className={clsx(
                                "flex h-5 w-5 items-center justify-center rounded-full border border-primary",
                                picked === option.value ? "border-primary" : "border-body"
                            )}
                        >
                            <span
                                className={clsx(
                                    "h-2.5 w-2.5 rounded-full bg-primary flex",
                                    picked === option.value ? "flex" : "hidden"
                                )}
                            />
                        </span>
                        <span
                            className={clsx({
                                "font-bold": picked === option.value,
                            })}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default RadioGroup;
