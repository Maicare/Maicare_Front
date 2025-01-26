import { ReactNode } from "react";

export type GenericSelectionOption<L extends ReactNode, V> = {
  label: L;
  value: V;
};

export type ComboboxOption<TData> = GenericSelectionOption<ReactNode, TData>;

export type BaseObject<IdType = number | string> = {
  id: IdType;
  name?: string
};
