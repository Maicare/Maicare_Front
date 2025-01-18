import InputControl from "@/common/components/InputControl";
import { CreateClientInput } from "@/types/client.types";
import React, { FunctionComponent } from "react";
import { useFieldArray,  Controller, useFormContext } from "react-hook-form";

const AddressesControlled: FunctionComponent<{ className?: string; required?: boolean }> = ({
  className,
  required,
}) => {
// Use the form context from the parent form
const {
    control,
    formState: { errors },
  } = useFormContext<CreateClientInput>(); // access form context

  // Use useFieldArray hook for managing the addresses array
  const { fields, append, remove,update } = useFieldArray({
    control,
    name: "addresses", // Field name for the array of addresses
  });
  console.log({fields})

  return (
    <div className={className}>
      {fields.map((address, index) => (
        <div key={address.id} className="mb-6">
          <Controller
            name={`addresses.${index}.belongs_to`}
            control={control}
            defaultValue={address.belongs_to || ""}
            render={({ field }) => (
              <InputControl
                label={"Behoort Tot"}
                {...field}
                placeholder={"bijv. moeder, broer"}
                type={"text"}
                className="w-full mb-4.5"
              />
            )}
          />

          <Controller
            name={`addresses.${index}.address`}
            control={control}
            defaultValue={address.address || ""}
            render={({ field }) => (
              <InputControl
                label={"Adres"}
                {...field}
                placeholder={"Adres"}
                type={"text"}
                className="w-full mb-4.5"
              />
            )}
          />

          <Controller
            name={`addresses.${index}.city`}
            control={control}
            defaultValue={address.city || ""}
            render={({ field }) => (
              <InputControl
                label={"Stad"}
                {...field}
                placeholder={"Stad"}
                type={"text"}
                className="w-full mb-4.5"
              />
            )}
          />

          <Controller
            name={`addresses.${index}.zip_code`}
            control={control}
            defaultValue={address.zip_code || ""}
            render={({ field }) => (
              <InputControl
                label={"Postcode"}
                {...field}
                placeholder={"Postcode"}
                type={"text"}
                className="w-full mb-4.5"
              />
            )}
          />

          <Controller
            name={`addresses.${index}.phone_number`}
            control={control}
            defaultValue={address.phone_number || ""}
            render={({ field }) => (
              <InputControl
                label={"Telefoonnummer"}
                {...field}
                placeholder={"Telefoonnummer"}
                type={"text"}
                className="w-full mb-4.5"
              />
            )}
          />

          <button
            type="button"
            className="text-red-500 m-2 w-full text-center"
            onClick={() => remove(index)}
          >
            Verwijder Adres
          </button>
          <hr className="m-2" />
        </div>
      ))}

      <button
        type="button"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg w-full"
        onClick={() => append({ belongs_to: "", address: "", city: "", zip_code: "", phone_number: "" })}
      >
        Voeg Adres Toe
      </button>
    </div>
  );
};

export default AddressesControlled;
