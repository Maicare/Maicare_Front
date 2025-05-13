import React, { FunctionComponent } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormModal from "./FormModal";
import InputControl from "@/common/components/InputControl";
import ModalActionButton from "../Buttons/ModalActionButton";
import { ModalProps } from "@/common/types/modal.types";
import { useEmployee } from "@/hooks/employee/use-employee";
import { Any } from "@/common/types/types";
import SelectControlled from "@/common/components/SelectControlled";
import ClientSelector from "@/components/ClientSelector/ClientSelector";
import ControlledEmployeeSelect from "@/components/ControlledEmployeeSelect/ControlledEmployeeSelect";
import ControlledEmployeeMultiSelect from "@/components/ControlledEmployeeSelect/ControlledEmployeeMultiSelect";
import ControlledClientMultiSelect from "@/components/ControlledClientsSelect/ControlledEmployeeSelect";

// Update the form data type
type AppointmentFormData = {
    description: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    location: string;
    recurrence_type: string;
    recurrence_interval: string;
    recurrence_end_date: string;
    client_ids: number[];
    participant_employee_ids: number[];
};

// (Update or remove schema as needed)
const schema = yup.object().shape({
    // Your schema validation here...
});

export const AppointmentModal: FunctionComponent<ModalProps> = (props) => {
    const onUpdated = () => {
        props.onClose();
        props.additionalProps?.resetPopup()
    };

    return (
        <FormModal {...props} open={true} title="Change Password" onClose={onUpdated}>
            <AppointmentModalForm
                onUpdated={onUpdated}
                initialStartDate={props.additionalProps?.startDate}
                initialEndDate={props.additionalProps?.endDate}
                addAppointment={props.additionalProps?.addAppointment}
            />
        </FormModal>
    );
};

type ChangePassModalFormProps = {
    onUpdated: () => void;
    initialStartDate: string;
    initialEndDate: string;
    addAppointment: (data: Any) => Promise<void>;
};

const formatInputDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    // getMonth is zero-indexed so add 1
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const formatInputTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    // getHours() and getMinutes() return local time.
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

const AppointmentModalForm: FunctionComponent<ChangePassModalFormProps> = ({
    onUpdated,
    initialStartDate,
    initialEndDate,
    addAppointment,
}) => {
    const methods = useForm<AppointmentFormData>({
        defaultValues: {
            description: "",
            start_date: initialStartDate ? formatInputDate(initialStartDate) : "",
            start_time: initialStartDate ? formatInputTime(initialStartDate) : "",
            end_date: initialEndDate ? formatInputDate(initialEndDate) : "",
            end_time: initialEndDate ? formatInputTime(initialEndDate) : "",
            location: "",
            recurrence_type: "NONE",
            recurrence_interval: "0",
            recurrence_end_date: new Date().toISOString().split("T")[0],
            client_ids: [],
            participant_employee_ids: [],
        },
        // resolver: yupResolver(schema),
    });
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = methods;

    // Watch recurrence_type to disable related inputs if "NONE"
    const recurrenceType = watch("recurrence_type");

    const onSubmit = async (data: AppointmentFormData) => {
        try {
            // If time is not provided, default to "00:00"
            const startTimePart = data.start_time ? data.start_time : "00:00";
            const endTimePart = data.end_time ? data.end_time : "00:00";

            // Construct full ISO strings for start and end times
            const startDateTimeStr = `${data.start_date}T${startTimePart}:00`;
            const endDateTimeStr = `${data.end_date}T${endTimePart}:00`;

            const startDateTime = new Date(startDateTimeStr);
            const endDateTime = new Date(endDateTimeStr);

            // For recurrence_end_date, append a default time to form a valid ISO string if needed.
            const recurrenceEndDateStr = `${data.recurrence_end_date}T00:00:00Z`;
            const recurrenceEndDate = new Date(recurrenceEndDateStr);

            const payload = {
                client_ids: data.client_ids,
                participant_employee_ids: data.participant_employee_ids,
                description: data.description,
                location: data.location,
                recurrence_type: data.recurrence_type,
                // Ensure recurrence_end_date is in "YYYY-MM-DD" format
                recurrence_end_date: recurrenceEndDate,
                start_time: startDateTime.toISOString(),
                end_time: endDateTime.toISOString(),
                recurrence_interval: Number(data.recurrence_interval),
                status: "string",
            };

            await addAppointment(payload);
            onUpdated();
            console.log("DATA:", payload);
        } catch (error: any) {
            console.log(error);
        }
    };

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col items-center justify-center w-full space-y-2"
            >
                <InputControl
                    label="Beschrijving"
                    type="text"
                    placeholder="Beschrijving"
                    className="w-full"
                    name="description"
                />

                <div className="w-full flex space-x-2">
                    <InputControl
                        label="Startdatum"
                        type="date"
                        placeholder="Selecteer startdatum"
                        className="w-1/2"
                        name="start_date"
                    />
                    <InputControl
                        label="Starttijd"
                        type="time"
                        placeholder="Selecteer starttijd"
                        className="w-1/2"
                        name="start_time"
                    />
                </div>

                <div className="w-full flex space-x-2">
                    <InputControl
                        label="Einddatum"
                        type="date"
                        placeholder="Selecteer einddatum"
                        className="w-1/2"
                        name="end_date"
                    />
                    <InputControl
                        label="Eindtijd"
                        type="time"
                        placeholder="Selecteer eindtijd"
                        className="w-1/2"
                        name="end_time"
                    />
                </div>

                <InputControl
                    label="Locatie"
                    type="text"
                    placeholder="Voer locatie in"
                    className="w-full"
                    name="location"
                />

                <SelectControlled
                    label="Herhalingstype"
                    name="recurrence_type"
                    options={[
                        { value: "NONE", label: "Geen herhaling" },
                        { value: "DAILY", label: "Dagelijks" },
                        { value: "WEEKLY", label: "Wekelijks" },
                        { value: "MONTHLY", label: "Maandelijks" },
                    ]}
                    className="w-full"
                />

                <div className="w-full flex space-x-2">
                    <InputControl
                        label="Herhalingsinterval"
                        type="number"
                        placeholder="Voer interval in (bv. 2)"
                        className="w-1/2"
                        name="recurrence_interval"
                        disabled={recurrenceType === "NONE"}
                    />

                    <InputControl
                        label="Einddatum voor herhaling"
                        type="date"
                        placeholder="Selecteer einddatum voor herhaling"
                        className="w-1/2"
                        name="recurrence_end_date"
                        disabled={recurrenceType === "NONE"}
                    />
                </div>

                <ControlledEmployeeMultiSelect
                    name="participant_employee_ids"
                    label="Deelnemende medewerkers"
                    className="w-full"
                />
                <ControlledClientMultiSelect
                    name="client_ids"
                    label="Deelnemende cliënten"
                    className="w-full"
                />

                <ModalActionButton
                    className="mt-7"
                    actionType="CONFIRM"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Submit
                </ModalActionButton>
            </form>
        </FormProvider>
    );
};

export default AppointmentModal;