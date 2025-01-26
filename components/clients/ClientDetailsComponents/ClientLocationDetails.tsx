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

const ClientLocationDetails: FunctionComponent<Props> = ({ client }) => {


    return (
        <div className="grid grid-cols-2 gap-4">
            <DetailCell
                ignoreIfEmpty={true}
                label={"Locatie"}
                value={client?.location || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Organisatie"}
                value={client?.organisation || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Afdeling"}
                value={client?.departement || "Niet gespecificeerd"}
            />
            <DetailCell
                ignoreIfEmpty={true}
                label={"Wettelijke maatregel"}
                value={client?.legal_measure || "Niet gespecificeerd"}
            />
        </div>
    );

};

export default ClientLocationDetails;
