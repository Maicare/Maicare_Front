import { ReactNode } from "react";

export type GenericSelectionOption<L extends ReactNode, V> = {
  label: L;
  value: V;
};

export type SelectionOption = GenericSelectionOption<string, string>;

export type ComboboxOption<TData> = GenericSelectionOption<ReactNode, TData>;

export type LinkOption = {
  label: ReactNode;
  href: string;
  getIsActive?: (pathname: string, href: string) => boolean;
};
