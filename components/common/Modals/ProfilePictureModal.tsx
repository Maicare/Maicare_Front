import { FunctionComponent, useCallback, useState } from "react";
import FormModal from "./FormModal";
import CameraIcon from "@/components/svg/CameraIcon";
import ModalActionButton from "../Buttons/ModalActionButton";
import * as Yup from "yup";
import { Formik, FormikConfig } from "formik";
import ProfilePicture from "../profilePicture/profile-picture";
import { UseMutationResult } from "react-query";
import { ModalProps } from "@/common/types/modal.types";
// import { usePatchClientProfilePicture } from "@/utils/clients/patchClient";

type Props = ModalProps & {
  additionalProps: {
    id: number;
  };
};



export const ClientProfilePictureModal: FunctionComponent<ModalProps> = ({
  additionalProps,
  ...props
}) => {
  // const mutation = usePatchClientProfilePicture(additionalProps.id);

  return (
    <FormModal {...props} open={true} title="Profielfoto Toevoegen">
      <UpdatePicModalForm /* onUpdated={props.onClose} mutation={null}*/ />
    </FormModal>
  );
};

const pictureSchema: Yup.ObjectSchema<{ profile_picture: string }> = Yup.object().shape({
  profile_picture: Yup.string().required("Geef alstublieft een profielfoto op"),
});

type UpdatePicModalFormProps = {
  // onUpdated: () => void;
  // mutation: UseMutationResult<any, unknown, string, unknown>;
};

type FormType = {
  profile_picture: string;
};

const initialValues: FormType = {
  profile_picture: "",
};

const UpdatePicModalForm: FunctionComponent<UpdatePicModalFormProps> = ({
  // onUpdated,
  // mutation,
}) => {
  // const { mutate, isLoading } = mutation;
  const [errorMessage, setErrorMessage] = useState("");
  const defaultImageUrl = "/images/user/user-default.png";
  const [imagePreviewUrl, setImagePreviewUrl] = useState(defaultImageUrl);

  // const onSubmit: FormikConfig<FormType>["onSubmit"] = useCallback(
  //   (data, { resetForm }) => {
  //     setErrorMessage(null);
  //     if (!data.profile_picture) {
  //       setErrorMessage("Geef alstublieft een profielfoto op");
  //       return;
  //     }
  //     mutate(data.profile_picture, {
  //       onSuccess: () => {
  //         resetForm();
  //         onUpdated();
  //       },
  //     });
  //   },
  //   [mutate]
  // );

  const handleFileChange = () => {

  }


  return (
    <form onSubmit={() => { }} className="flex flex-col items-center justify-center">
      <div className="relative drop-shadow-2 w-full mx-auto rounded-full max-w-30 bg-white/20 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
        <div className="w-40 h-40">
          <ProfilePicture width={160} height={160} profilePicture={imagePreviewUrl} />
        </div>
        <label
          htmlFor="profile_picture"
          className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
        >
          <CameraIcon />
          <input
            type="file"
            name="profile_picture"
            id="profile_picture"
            accept="image/jpeg,image/png,image/gif"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {errorMessage && <div className="text-c_red text-center">{errorMessage}</div>}

      <ModalActionButton
        className="mt-7"
        actionType="CONFIRM"
        type="submit"
        isLoading={false}
        disabled={false}
      >
        Foto Bijwerken
      </ModalActionButton>
    </form>
  );

};
