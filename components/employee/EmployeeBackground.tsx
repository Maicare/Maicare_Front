import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import Panel from "../common/Panel/Panel";
import Button from "../common/Buttons/Button";
import Loader from "../common/loader";
import LargeErrorMessage from "../common/Alerts/LargeErrorMessage";
import { FormProps } from "@/types/form-props";

type ListComponentProps<TData> = {
  data: TData;
};

type FormComponentProps<TInitialData> = FormProps<TInitialData> & {
  employeeId: number;
};

type Props<TQueryData, TFormInitialValue> = {
  title: string;
  addButtonText: string;
  cancelText: string;
  errorText: string;
  isLoading:boolean;
  employeeId: number;
  query: TQueryData|undefined;
  mutate:()=>void;
  ListComponent: FunctionComponent<ListComponentProps<TQueryData>>;
  FormComponent: FunctionComponent<FormComponentProps<TFormInitialValue>>;
};

function EmployeeBackground<TData, TInitialValue>({
  title,
  employeeId,
  addButtonText,
  cancelText,
  errorText,
  FormComponent,
  isLoading,
  query,
  ListComponent,
  mutate
}: Props<TData, TInitialValue>) {
  const [isAdding, setIsAdding] = useState(false);
  const triggerCreate = () => {
    setIsAdding((is) => !is);
    mutate();
  }

  return (
    <Panel title={title} containerClassName="py-4 px-7">
      <div className="mb-4.5">
        <Button className="w-72 block ml-auto" onClick={triggerCreate}>
          {isAdding ? cancelText : addButtonText}
        </Button>
      </div>
      {isLoading && <Loader />}
      {isAdding && <FormComponent employeeId={+employeeId} onSuccess={() => setIsAdding(false)} />}
      {(!query && !isLoading && !isAdding) && <LargeErrorMessage firstLine="Something went wrong" secondLine={errorText} />}
      {query && !isAdding && <ListComponent data={query} />}
    </Panel>
  );
}

export default EmployeeBackground;
