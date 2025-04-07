import { ContractFormType } from "@/types/contracts.types";
import dayjs from "dayjs";
import { FunctionComponent } from "react";
import InfoIcon from "../icons/InfoIcon";
import { dateFormat } from "@/utils/timeFormatting";

export const WhenNotification: FunctionComponent<{
    startDate: string,
    endDate: string,
    reminderPeriod: string
}> = ({ startDate, endDate, reminderPeriod }) => {
    if (endDate && startDate && reminderPeriod) {
        const reminderDate = dayjs(endDate).subtract(+reminderPeriod, "days").toDate();
        return (
            <div className="flex flex-col gap-2 px-4 py-3 info-box mb-6">
                <p>
                    <InfoIcon className="inline-block relative -top-0.5" /> <strong>Herinnering:</strong> U
                    ontvangt een herinnering op {dateFormat(reminderDate)}
                </p>
            </div>
        );
    }
    return null;
};