import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import { STATUS_RECORD } from "@/consts";
import Button from "../../common/Buttons/Button";
import { useClient } from "@/hooks/client/use-client";
import { useParams } from "next/navigation";
import Loader from "@/components/common/loader";
import { ClientStatusHistoryItem } from "@/types/client.types";

const SHOW_COUNT = 3;

const ClientStatusHistory: FunctionComponent = () => {
  const params = useParams();
  const clientId = params?.clientId ? params?.clientId.toString() : "0";
  const { getStatusHistory } = useClient({});

  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<ClientStatusHistoryItem[]>([]);


  useEffect(() => {
    const fetchHistory = async () => {
      const data = await getStatusHistory(clientId);
      setHistory(data ? data : []);
    };
    fetchHistory();
  }, [clientId, getStatusHistory]);


  const displayedHistory = useMemo(() => {
    return expanded ? history : history.slice(0, SHOW_COUNT);
  }, [expanded, history]);

  if (!history) return <Loader />;

  return (
    <div>
      {displayedHistory.map((status: any) => (
        <div
          key={status.id}
          className="flex justify-between py-3 px-7 border-b border-stroke"
        >
          <p className="text-sm">
            {STATUS_RECORD[status.new_status as keyof typeof STATUS_RECORD]}
          </p>
          <p className="text-sm">
            <strong>{dateFormat(status.changed_at)}</strong>
          </p>
        </div>
      ))}
      {history.length > SHOW_COUNT && (
        <Button
          buttonType={"Outline"}
          className="p-0 flex items-center h-10 w-full rounded-none border-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="mr-4">{expanded ? "Zie minder" : "Zie meer"}</span>
        </Button>
      )}
    </div>
  );
};

export default ClientStatusHistory;