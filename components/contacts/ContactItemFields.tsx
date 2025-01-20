import React, { FunctionComponent } from "react";
import TrashIcon from "@/components/icons/TrashIcon";
import Button from "../common/Buttons/Button";
import InputControl from "@/common/components/InputControl";

type Props = {
    order: number;
    onRemove?: () => void | undefined;
};

const ContactItemFields: FunctionComponent<Props> = ({ order, onRemove }) => {

    return (
        <div className="mb-4.5 flex flex-col gap-6 xl:flex-row">
            <InputControl
                label={"Naam"}
                name={`contacts[${order}].name`}
                placeholder={"Naam"}
                required={true}
                type="text"
            />
            <InputControl
                label={"Email"}
                placeholder={"Email"}
                required={true}
                type="text"
                name={`contacts[${order}].email`}
            />
            <InputControl
                label={"Telefoon"}
                placeholder={"Telefoon"}
                required={true}
                name={`contacts[${order}].phone_number`}
                type="text"
            />
            <Button
                type={"button"}
                buttonType={"Danger"}
                onClick={onRemove}
                className="flex self-start items-center px-4 ml-auto mt-9"
            >
                <TrashIcon />
            </Button>
        </div>
    );
};

export default ContactItemFields;
