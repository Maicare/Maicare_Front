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

type Props = {
  employeeId: number;
};

const EmployeeInformation: FunctionComponent<Props> = ({ employeeId }) => {
  // const { open } = useModal(EmployeeProfilePictureModal);
  const { readOne } = useEmployee({employee_id: employeeId});
  const [employee, setEmployee] = useState<EmployeeDetailsResponse|null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      const data = await readOne(employeeId);
      setEmployee(data);
      setIsLoading(false);
    }
    fetchEmployee();
  },[employeeId,readOne]);
  
  if (isLoading) return <Loader />;
  // if (isError) return <div className="text-red-600">We failed to load employee data</div>;

  if (employee) {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <div
            onClick={() => {
              // open({
              //   id: employeeId,
              // });
            }}
            className="relative w-fit cursor-pointer"
          >
            <ProfilePicture profilePicture={employee.profile_picture} />
            <IconButton className="p-[5px] absolute right-1 bottom-1">
              <CameraIcon className="w-3 h-3" />
            </IconButton>
          </div>
        </div>
        <DetailCell
          ignoreIfEmpty={true}
          label={"Volledige Naam"}
          value={`${employee.first_name} ${employee.last_name}` || "Niet gespecificeerd"}
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
      </div>
    );
  }
};

export default EmployeeInformation;
