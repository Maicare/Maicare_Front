import React, { FunctionComponent, useState } from "react";
import Panel from "../common/Panel/Panel";
import Button from "../common/Buttons/Button";
import Loader from "../common/loader";
import LargeErrorMessage from "../common/Alerts/LargeErrorMessage";
import { Any } from "@/common/types/types";
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

  employeeId: number;
  query: Any;
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

  query,
  ListComponent,
}: Props<TData, TInitialValue>) {
  const [isAdding, setIsAdding] = useState(false);
  return (
    <Panel title={title} containerClassName="py-4 px-7">
      <div className="mb-4.5">
        <Button className="w-72 block ml-auto" onClick={() => setIsAdding((is) => !is)}>
          {isAdding ? cancelText : addButtonText}
        </Button>
      </div>
      {isAdding && <FormComponent employeeId={+employeeId} onSuccess={() => setIsAdding(false)} />}
      {query && <ListComponent data={query} />}
      {query?.isLoading && <Loader />}
      {query?.success && <LargeErrorMessage firstLine="Something went wrong" secondLine={errorText} />}
    </Panel>
  );
}

export default EmployeeBackground;
