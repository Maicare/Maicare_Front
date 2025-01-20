"use client";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputControl from "@/common/components/InputControl";
import Panel from '@/components/common/Panel/Panel';
import { EmployeeDetailsResponse, EmployeeForm as EmployeeFormType } from "@/types/employee.types";
import { ControlledLocationSelect } from "../ControlledLocationSelect/ControlledLocationSelect";
import ControlledCheckboxItem from "@/common/components/ControlledCheckboxItem";
import { useEmployee } from "@/hooks/employee/use-employee";
import { GENDER_OPTIONS } from "@/consts";
import ControlledRadioGroup from "@/common/components/ControlledRadioGroup";
import { ControlledRoleSelect } from "../ControlledRoleSelect/ControlledRoleSelect";
import { FunctionComponent, useEffect, useState } from "react";
import Loader from '@/components/common/loader';
import dayjs from "dayjs";
import { employeeSchema } from "@/schemas/employee.schema";
import { Id } from "@/common/types/types";

type PropsType = {
    employeeId?: number;
}


const EmployeeForm: FunctionComponent<PropsType> = ({ employeeId }) => {

    const { addEmployee, readOne, updateEmployee } = useEmployee({});
    const [employee, setEmployee] = useState<EmployeeDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const initialValues: EmployeeFormType = {
        employee_number: '0',
        employment_number: '0',
        location_id: '',
        is_subcontractor: false,
        out_of_service: false,
        first_name: '',
        last_name: '',
        date_of_birth: '',
        home_telephone_number: '',
        private_phone_number: '',
        work_phone_number: '',
        authentication_phone_number: '',
        private_email_address: '',
        email: '',
        gender: '',
        role_id: '',
    }

    useEffect(() => {
        const fetchEmployee = async (id: Id) => {
            const data = await readOne(id);
            setEmployee(data);
            setIsLoading(false);
        }
        if (employeeId) fetchEmployee(employeeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [employeeId]);


    const methods = useForm<EmployeeFormType>({
        resolver: yupResolver(employeeSchema) as Resolver<EmployeeFormType>,
        defaultValues: employee ?? initialValues,
    });


    const {
        handleSubmit,
        formState: { isSubmitting },
        reset
    } = methods;

    useEffect(() => {
        if (employeeId && employee) {
            reset({
                ...employee,
                date_of_birth: dayjs(employee.date_of_birth).format('YYYY-MM-DD'),
            });
        }
    }, [isLoading, reset, employee, employeeId])

    const onSubmit = async (data: EmployeeFormType) => {
        const structuredData = {
            ...data,
            location_id: Number(data.location_id),
            role_id: Number(data.role_id),
            department: null,
            position: null,
        }
        if (employeeId)
            await updateEmployee(structuredData, employeeId);
        else
            await addEmployee(structuredData);
    };


    if (employeeId && isLoading)
        return <Loader />

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid grid-cols-1 gap-9 sm:grid-cols-2">
                <div className="flex flex-col gap-9">

                    <Panel title={"Identificatie"} containerClassName="px-7 py-4">
                        <InputControl
                            name="employee_number"
                            className="w-full mb-4.5"
                            required
                            label="Medewerkernummer"
                            type="number"
                            placeholder="Voer medewerkernummer in"
                        />
                        <InputControl
                            name="employment_number"
                            className="w-full mb-4.5"
                            required
                            label="Dienstnummer"
                            type="number"
                            placeholder="Voer dienstnummer in"
                        />
                        <ControlledLocationSelect
                            label="Locatie"
                            required
                            name="location_id"
                            className="lg:min-w-75 mb-4.5"
                        />
                        <ControlledRoleSelect
                            label="Rol"
                            required
                            name="role_id"
                            className="lg:min-w-75 mb-4.5"
                        />
                        <ControlledCheckboxItem label="Is een onderaannemer" name="is_subcontractor" />
                        <ControlledCheckboxItem label="Uit Dienst" name="out_of_service" />
                    </Panel>

                    <Panel title={"Naam"} containerClassName="px-7 py-4">
                        <InputControl
                            name="first_name"
                            className="w-full mb-4.5"
                            required
                            label="Voornaam"
                            type="text"
                            placeholder="Geef alstublieft een voornaam"
                        />
                        <InputControl
                            name="last_name"
                            className="w-full mb-4.5"
                            required
                            label="Achternaam"
                            type="text"
                            placeholder="Geef alstublieft een achternaam"
                        />
                    </Panel>

                    <Panel title={"Geboortedetails"} containerClassName="px-7 py-4">
                        <InputControl
                            name="date_of_birth"
                            className="w-full mb-4.5"
                            required
                            label="Geboortedatum"
                            type="date"
                            placeholder=""
                        />
                        <ControlledRadioGroup
                            name="gender"
                            options={GENDER_OPTIONS}
                            label="Geslacht"
                        />
                    </Panel>

                    <div className="mb-5">
                        <button
                            disabled={isSubmitting}
                            type="submit"
                            className="w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
                        >
                            {isSubmitting ? (
                                <div className="inline-block h-[1.23rem] w-[1.23rem] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                            ) : (
                                "Medewerker Opslaan"
                            )}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-9">
                    <Panel title={"Contact"} containerClassName="px-7 py-4">
                        <InputControl
                            name="email"
                            className="w-full mb-4.5"
                            required
                            label="E-mailadres"
                            type="email"
                            placeholder="E-mailadres"
                        />
                        <InputControl
                            name="private_email_address"
                            className="w-full mb-4.5"
                            required
                            label="Privé E-mailadres"
                            type="email"
                            placeholder="Privé E-mailadres"
                        />
                        <InputControl
                            name="authentication_phone_number"
                            className="w-full mb-4.5"
                            required
                            label="Authenticatie Telefoonnummer"
                            type="tel"
                            placeholder="Authenticatie Telefoonnummer"
                        />
                        <InputControl
                            name="work_phone_number"
                            className="w-full mb-4.5"
                            required
                            label="Werk Telefoonnummer"
                            type="tel"
                            placeholder="Werk Telefoonnummer"
                        />
                        <InputControl
                            name="private_phone_number"
                            className="w-full mb-4.5"
                            required
                            label="Privé Telefoonnummer"
                            type="tel"
                            placeholder="Privé Telefoonnummer"
                        />
                        <InputControl
                            name="home_telephone_number"
                            className="w-full mb-4.5"
                            required
                            label="Huis Telefoonnummer"
                            type="email"
                            placeholder="Huis Telefoonnummer"
                        />
                    </Panel>

                </div>
            </form>
        </FormProvider>
    );
};

export default EmployeeForm;
