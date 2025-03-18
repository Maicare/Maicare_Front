"use client";

import { Client as ClientType } from "@/types/client.types";
import React, { FunctionComponent } from "react";
import DetailCell from "../../common/DetailCell";
import { mappingGender } from "@/common/data/gender.data";
import dayjs from "dayjs";
import { useModal } from "@/components/providers/ModalProvider";
import { ClientProfilePictureModal } from "../../common/Modals/ProfilePictureModal";
import ProfilePicture from "../../common/profilePicture/profile-picture";
import IconButton from "../../common/Buttons/IconButton";
import CameraIcon from "../../svg/CameraIcon";


type Props = {
    client: ClientType | null;
};

const ClientInformation: FunctionComponent<Props> = ({ client }) => {

    const { open } = useModal(ClientProfilePictureModal);

    console.log("PIIIIC", client?.profile_picture);

    return (
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
                <div
                    onClick={() => {
                        open({
                            id: client?.id,//TODO: add refetch
                        });
                    }}
                    className="relative w-fit cursor-pointer"
                >
                    <ProfilePicture profilePicture={client?.profile_picture} />
                    <IconButton className="p-[5px] absolute right-1 bottom-1">
                        <CameraIcon className="w-3 h-3" />
                    </IconButton>

                </div>
            </div>

            <DetailCell
                ignoreIfEmpty={true}
                label={"Volledige Naam"}
                value={`${client?.first_name} ${client?.last_name}` || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"E-mail"}
                type={"email"}
                value={client?.email || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Telefoon"}
                type={"phone"}
                value={client?.phone_number || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Geslacht"}
                value={mappingGender[client?.gender || "not_specified"] || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Geboortedatum"}
                value={
                    client?.date_of_birth
                        ? dayjs(client?.date_of_birth).format("DD MMM, YYYY")
                        : "Niet gespecificeerd"
                }
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Geboorteplaats"}
                value={client?.birthplace || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Dossiernummer"}
                value={client?.filenumber || "Niet gespecificeerd"}
            />
        </div>
    );

};

export default ClientInformation;
