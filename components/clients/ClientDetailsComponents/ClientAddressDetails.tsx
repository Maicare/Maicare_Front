"use client";

import React, { FunctionComponent } from "react";
import { Client } from "@/types/client.types";

type Props = {
  client: Client | null;
};

const ClientAddressDetails: FunctionComponent<Props> = ({ client }) => {
  if (!client) return <div className="text-red-600">We failed to load client address details</div>;
  return <div>Geen adresgegevens gevonden</div>;
};

export default ClientAddressDetails;
