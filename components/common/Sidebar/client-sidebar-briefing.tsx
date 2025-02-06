"use client";
import dayjs from "dayjs";
import { getAge } from "@/utils/get-age";
import ProfilePicture from "../profilePicture/profile-picture";
import { useClient } from "@/hooks/client/use-client";
import { useEffect, useState } from "react";
import { Client } from "@/types/client.types";
import { useSnackbar } from "notistack";

interface ClientSidebarBriefingProps {
  clientId: number;
}

const ClientSidebarBriefing: React.FC<ClientSidebarBriefingProps> = ({ clientId:clientId }) => {
    const {readOne} = useClient({autoFetch:false});
    const [client,setClient] = useState<Client|null>(null);
    const {enqueueSnackbar} = useSnackbar();
    useEffect(() => {
      const fetchClient = async () => {
        try {
          const data = await readOne(clientId);
          setClient(data);
        } catch (error) {
          enqueueSnackbar("Er is iets misgelopen bij het ophalen van de client", {variant: "error"});
        }
      };
      fetchClient();
    }, [clientId]);
    if (!client) {
      return null;
    }
  return (
    <div className="w-full flex flex-col font-bold items-center">
      <ProfilePicture profilePicture={client?.profile_picture} />
      <p className="pt-5 text-white">{client?.first_name + " " + client?.last_name}</p>
      <p>
        {client?.date_of_birth
          ? dayjs(client?.date_of_birth).format("DD MMM, YYYY") +
            ` (${getAge(client?.date_of_birth)} jaar oud)`
          : null}
      </p>
      <p>{"Dossiernummer : " + client?.filenumber}</p>
    </div>
  );
};

export default ClientSidebarBriefing;
