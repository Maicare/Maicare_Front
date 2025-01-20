import React, { FunctionComponent } from "react";
import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import InputControl from "@/common/components/InputControl";
import { CreateClientInput } from "@/types/client.types";

const AddressesControlled: FunctionComponent<{ className?: string; required?: boolean }> = ({
  className,
}) => {
  const { control } = useFormContext<CreateClientInput>();


  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses", // Field name for the array of addresses
  });


  return (
    <div className={className}>
      {fields.map((address, index) => (
        <div key={address.id} className="mb-6">
          {/* Belongs To */}
          <Controller
            name={`addresses.${index}.belongs_to`}
            control={control}
            defaultValue={address.belongs_to || ""}
            rules={{ required: "Belongs to is required" }}
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

          {/* Address */}
          <Controller
            name={`addresses.${index}.address`}
            control={control}
            defaultValue={address.address || ""}
            rules={{ required: "Address is required" }}
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

          {/* City */}
          <Controller
            name={`addresses.${index}.city`}
            control={control}
            defaultValue={address.city || ""}
            rules={{ required: "City is required" }}
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

          {/* Zip Code */}
          <Controller
            name={`addresses.${index}.zip_code`}
            control={control}
            defaultValue={address.zip_code || ""}
            rules={{ required: "Zipcode is required" }}
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

          {/* Phone Number */}
          <Controller
            name={`addresses.${index}.phone_number`}
            control={control}
            defaultValue={address.phone_number || ""}
            rules={{ required: "Phone number is required" }}
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
        onClick={() =>
          append({ belongs_to: "", address: "", city: "", zip_code: "", phone_number: "" })
        }
      >
        Voeg Adres Toe
      </button>
    </div>
  );
};

export default AddressesControlled;
