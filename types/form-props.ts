export type FormProps<TInitialData> =
  | {
      mode?: "add";
      onSuccess?: () => void;
      onCancel?: () => void;
      initialData?: undefined;
    }
  | {
      mode: "update";
      onSuccess?: () => void;
      onCancel?: () => void;
      initialData: TInitialData;
    };