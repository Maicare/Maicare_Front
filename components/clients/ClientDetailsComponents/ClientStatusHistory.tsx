import React, { FunctionComponent, useMemo, useState } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import { STATUS_RECORD } from "@/consts";
import Button from "../../common/Buttons/Button";

const mockStatusHistory = [
  {
    id: 1,
    status: "In Care",
    start_date: "2023-01-01",
  },
  {
    id: 2,
    status: "On Waiting List",
    start_date: "2023-02-15",
  },
  {
    id: 3,
    status: "Out Of Care",
    start_date: "2023-03-10",
  },
  {
    id: 4,
    status: "In Care",
    start_date: "2023-04-20",
  },
  {
    id: 5,
    status: "On Waiting List",
    start_date: "2023-05-05",
  },
];

const SHOW_COUNT = 3;

const ClientStatusHistory: FunctionComponent = () => {
  const [expanded, setExpanded] = useState(false);

  const show = useMemo(() => {
    if (expanded) {
      return mockStatusHistory ?? [];
    }
    return mockStatusHistory?.slice(0, SHOW_COUNT) ?? [];
  }, [expanded]);

  return (
    <div>
      {show.map((status) => (
        <div key={status.id} className="flex justify-between py-3 px-7 border-b border-stroke">
          <p className="text-sm">{STATUS_RECORD[status.status as keyof typeof STATUS_RECORD]}</p>
          <p className="text-sm">
            <strong>{dateFormat(status.start_date)}</strong>
          </p>
        </div>
      ))}
      {mockStatusHistory?.length > SHOW_COUNT && (
        <Button
          buttonType={"Outline"}
          className="p-0 flex items-center h-10 top-0 w-full rounded-none border-none"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="mr-4">{expanded ? "Zie minder" : "Zie meer"}</span>
        </Button>
      )}
    </div>
  );
};

export default ClientStatusHistory;
