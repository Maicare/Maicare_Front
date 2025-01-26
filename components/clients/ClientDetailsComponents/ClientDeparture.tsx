import React, { FunctionComponent } from "react";
import Panel from "../../common/Panel/Panel";
import { Client } from "@/types/client.types";

const ClientDeparture: FunctionComponent<{
  client: Client | null;
}> = ({ client }) => {

  if (!client || client.status !== "Out Of Care") return null;
  if (!client.departure_reason && !client.departure_report) return null;
  return (
    <Panel title={"Vertrekgegevens"} containerClassName="px-7 py-4">
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-bold">Vertrekreden</div>
          <div>{client?.departure_reason}</div>
        </div>
        <div>
          <div className="font-bold">Vertrekrapport</div>
          <div>{client?.departure_report}</div>
        </div>
      </div>
    </Panel>
  );
};

export default ClientDeparture;
