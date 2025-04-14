"use client";

import React, { FunctionComponent, useEffect, useState } from "react";
import DetailCell from "../common/DetailCell";
import dayjs from "dayjs";
import "dayjs/locale/en";
import CameraIcon from "../svg/CameraIcon";
import ProfilePicture from "../common/profilePicture/profile-picture";
import IconButton from "../common/Buttons/IconButton";
import { mappingGender } from "@/common/data/gender.data";
import { useEmployee } from "@/hooks/employee/use-employee";
import { EmployeeDetailsResponse } from "@/types/employee.types";
import Loader from "../common/loader";
import { useModal } from "../providers/ModalProvider";
import { EmployeeProfilePictureModal } from "../common/Modals/EmployeeProfileModal";
import Button from "../common/Buttons/Button";
import { ChangePassModal } from "../common/Modals/ChangePassModal";

type Props = {
  employeeId: number;
};

const EmployeeInformation: FunctionComponent<Props> = ({ employeeId }) => {
  const { readOne } = useEmployee({ autoFetch: false });
  const [employee, setEmployee] = useState<EmployeeDetailsResponse | null>(null);
  const [picture, setPicture] = useState("/images/user/user-default.png");
  const [refetch, setRefetch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { open } = useModal(EmployeeProfilePictureModal);
  const { open: openChangePassword } = useModal(ChangePassModal);

  console.log("IDDDD", employee)


  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await readOne(employeeId);
      setEmployee(data);
      setPicture(data.profile_picture || "/images/user/user-default.png");
      setIsLoading(false);
    };
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, refetch]);

  if (isLoading) return <Loader />;

  if (!employee) return null;
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <div
          onClick={() => {
            open({
              id: employeeId,
              employeeImage: picture,
              onRefetch: () => setRefetch(v => !v),
            });
          }}
          className="relative w-fit cursor-pointer"
        >
          <ProfilePicture profilePicture={picture} />
          <IconButton className="p-[5px] absolute right-1 bottom-1">
            <CameraIcon className="w-3 h-3" />
          </IconButton>
        </div>
      </div>
      <DetailCell
        ignoreIfEmpty={true}
        label={"Volledige Naam"}
        value={
          `${employee.first_name} ${employee.last_name}` ||
          "Niet gespecificeerd"
        }
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Positie"}
        value={employee.position || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Is een onderaannemer"}
        value={
          employee.is_subcontractor === null
            ? "Niet gespecificeerd"
            : employee.is_subcontractor === true
              ? "Yes"
              : "No"
        }
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Werk E-mail"}
        type={employee.email ? "email" : "text"}
        value={employee.email || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Privé E-mail"}
        type={employee.private_email_address ? "email" : "text"}
        value={employee.private_email_address || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Werk Telefoonnummer"}
        type={employee.work_phone_number ? "phone" : "text"}
        value={employee.work_phone_number || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Afdeling"}
        value={employee.department || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Privé Telefoonnummer"}
        type={employee.private_phone_number ? "phone" : "text"}
        value={employee.private_phone_number || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Huis Telefoonnummer"}
        type={employee.home_telephone_number ? "phone" : "text"}
        value={employee.home_telephone_number || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Authenticatie Telefoonnummer"}
        type={employee.authentication_phone_number ? "phone" : "text"}
        value={employee.authentication_phone_number || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Geslacht"}
        value={mappingGender[employee.gender] || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Geboortedatum"}
        value={dayjs(employee.date_of_birth).format("DD MMM, YYYY")}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Medewerkernummer"}
        value={employee.employee_number || "Niet gespecificeerd"}
      />
      <DetailCell
        ignoreIfEmpty={true}
        label={"Dienstnummer"}
        value={employee.employment_number || "Niet gespecificeerd"}
      />

      {employee.is_logged_in_user &&
        <Button
          className="col-span-2 my-5"
          onClick={() => {
            openChangePassword({});
          }}
          buttonType="Primary"
        >Wachtwoord Wijzigen</Button>


      }

    </div>
  );
};

export default EmployeeInformation;
