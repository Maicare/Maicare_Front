"use client";

import React, { FunctionComponent } from "react";
// import DownloadFile from "@/components/DownloadFile";
import DetailCell from "../../common/DetailCell";
import { Client } from "@/types/client.types";

type Props = {
  client: Client | null;
};

const ClientIdentityDetails: FunctionComponent<Props> = ({ client }) => {
  if (!client) return <div className="text-red-600">We failed to load client identity</div>;
  return (
    <div className="grid grid-cols-2 gap-4">
      <DetailCell
        ignoreIfEmpty={true}
        label={"Identiteit"}
        value={client.identity ? "Geverifieerd" : "Niet geverifieerd"}
      />
      <DetailCell ignoreIfEmpty={true} label={"Bsn"} value={client.bsn || "Niet gespecificeerd"} />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Bron"}
        value={client.source || "Niet gespecificeerd"}
      />
      <DetailCell
        className="col-span-2"
        label={"Identiteitsbewijs"}
        value={
          <div className="flex flex-wrap mt-2 gap-4">
            {/* {data.attachments?.map((attachment) => (
                <DownloadFile file={attachment} key={attachment.id} />
              ))} */}
          </div>
        }
      />
    </div>
  );

};

export default ClientIdentityDetails;
