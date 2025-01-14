import React, { FunctionComponent, ReactNode } from "react";
import CheckboxItem from "./CheckboxItem";

export type GenericSelectionOption<L extends ReactNode, V> = {
  label: L;
  value: V;
};

export type SelectionOption = GenericSelectionOption<string, string>;

type Props = {
  options: SelectionOption[];
  selected: SelectionOption["value"][];
  onChange: (selected: SelectionOption["value"][]) => void;
};

const UncontrolledCheckboxGroup: FunctionComponent<Props> = ({ options, selected, onChange }) => {
  function getOnClick(value: SelectionOption["value"]) {
    return () => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    };
  }

  return options.map(({ value, label }) => (
    <CheckboxItem
      onClick={getOnClick(value)}
      onChange={getOnClick(value)}
      label={label}
      id={value}
      key={value}
      value={value}
      checked={selected.includes(value)}
    />
  ));
};

export default UncontrolledCheckboxGroup;
