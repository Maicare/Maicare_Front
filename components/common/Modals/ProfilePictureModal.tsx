import { ChangeEvent, FunctionComponent, useState } from "react";
import FormModal from "./FormModal";
import CameraIcon from "@/components/svg/CameraIcon";
import ModalActionButton from "../Buttons/ModalActionButton";
import ProfilePicture from "../profilePicture/profile-picture";
import { ModalProps } from "@/common/types/modal.types";
import { useAttachment } from "@/hooks/attachment/use-attachment";
import { useClient } from "@/hooks/client/use-client";
import { useSnackbar } from "notistack";
import { Any } from "@/common/types/types";
// import { usePatchClientProfilePicture } from "@/utils/clients/patchClient";



export const ClientProfilePictureModal: FunctionComponent<ModalProps> = ({
  ...props
}) => {
  const onUpdated = () => {
    props.additionalProps?.onRefetch();
    props.onClose();
}

  return (
    <FormModal {...props} open={true} title="Profielfoto Toevoegen">
      <UpdatePicModalForm  onUpdated={onUpdated} clientId={props.additionalProps?.id || null} clientImage={props.additionalProps?.clientImage || null} />
    </FormModal>
  );
};

type UpdatePicModalFormProps = {
  onUpdated?: () => void;
  clientId: number | null;
  clientImage: string | null;
};



const UpdatePicModalForm: FunctionComponent<UpdatePicModalFormProps> = ({
  onUpdated,
  clientId,
  clientImage
}) => {
 const { createOne } = useAttachment();
     const { updateClientPicture } = useClient({ autoFetch: false });
     const [imagePreviewUrl, setImagePreviewUrl] = useState(clientImage||"/images/user/user-default.png");
     const [file, setFile] = useState<File | null>(null);
     const { enqueueSnackbar } = useSnackbar();
     const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
         const file = event.target.files?.[0]; // Get the first file
 
         if (!file) {
             enqueueSnackbar("No file provided!", { variant: "error" });
             return;
         }
 
         const maxFileSize = 5 * 1024 * 1024; // 5MB in bytes
         const allowedFileTypes = ["image/jpeg", "image/png"];
 
         // Validate file size
         if (file.size > maxFileSize) {
             enqueueSnackbar(`File ${file.name} exceeds the maximum size of 5MB.`, { variant: "error" });
             return;
         }
 
         // Validate file type
         if (!allowedFileTypes.includes(file.type)) {
             enqueueSnackbar(`File ${file.name} is not an allowed type.`, { variant: "error" });
             return;
         }
 
         // Create a preview URL
         const fileUrl = URL.createObjectURL(file);
         setImagePreviewUrl(fileUrl); // Set preview image
         setFile(file);
     };
 
     if (!clientId) {
         return;
     }
 
     const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
         e.preventDefault();
         if (!file) {
             enqueueSnackbar("upload a File!", { variant: "error" });
             return;
         }
         const formData: FormData = new FormData();
         formData.append('file', file);
         try {
             const attachment = await createOne(formData, { displaySuccess: true });
             await updateClientPicture(clientId, attachment.file_id, { displayProgress: true, displaySuccess: true });
             onUpdated?.();
         } catch (error: Any) {
             enqueueSnackbar(`Error: ${error.message}`, { variant: "error" });
         }
 
     }


  return (
    <form onSubmit={onSubmit} className="flex flex-col items-center justify-center">
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
            onChange={onFileChange}
          />
        </label>
      </div>


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
