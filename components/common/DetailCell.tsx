import React, { FunctionComponent, useMemo } from "react";

type ValueType = "text" | "email" | "phone";
type StrategyProps = {
  value: string;
};

const Strategies: Record<ValueType, FunctionComponent<StrategyProps>> = {
  text: ({ value }) => (
    <div className="mt-1 text-sm text-gray-900 dark:text-gray-100 truncate">{value}</div>
  ),
  email: ({ value }) => (
    <div className="mt-1 text-sm text-gray-900 truncate dark:text-gray-100">
      <a href={`mailto:${value}`} className="text-primary underline hover:opacity-80">
        {value}
      </a>
    </div>
  ),
  phone: ({ value }) => (
    <div className="mt-1 text-sm text-gray-900 truncate dark:text-gray-100">
      <a href={`tel:${value}`} className="text-primary underline hover:opacity-80">
        {value}
      </a>
    </div>
  ),
};

type Props = {
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  additionalInfo?: string | React.ReactNode;
  className?: string;
  ignoreIfEmpty?: boolean;
  type?: ValueType;
};

const DetailCell: FunctionComponent<Props> = ({
  label,
  value,
  additionalInfo,
  className,
  ignoreIfEmpty,
  type = "text",
}) => {
  const Strategy = useMemo(() => Strategies[type], [type]);

  if (!ignoreIfEmpty && (value === null || value === undefined || value === "")) return null;
  return (
    <div className={className}>
      {typeof label === "string" ? (
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 overflow-ellipsis">
          {label}
        </div>
      ) : (
        label
      )}
      {typeof value === "string" ? <Strategy value={value} /> : value}
      {typeof additionalInfo === "string" && (
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{additionalInfo}</div>
      )}
    </div>
  );
};

export default DetailCell;
