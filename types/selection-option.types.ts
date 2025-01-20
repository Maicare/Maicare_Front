import { ReactNode } from "react";

export type GenericSelectionOption<L extends ReactNode, V> = {
  label: L;
  value: V;
};

