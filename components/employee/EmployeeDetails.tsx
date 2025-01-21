
// import { useModal } from "@/components/providers/ModalProvider";
// import { getDangerActionConfirmationModal } from "@/components/Modals/DangerActionConfirmation";
// import { useDeleteEmployee } from "@/utils/employees/deleteEmployee";

// import EmployeeCertificationsSummary from "@/components/EmployeeDetails/EmployeeCertificationsSummary";
// import EmployeeEducationsSummary from "@/components/EmployeeDetails/EmployeeEducationsSummary";
// import EmployeeExperiencesSummary from "@/components/EmployeeDetails/EmployeeExperiencesSummary";
// import EmployeeRolesSummary from "@/components/EmployeeDetails/EmployeeRolesSummary";
// import LinkButton from "@/components/buttons/LinkButton";
import Link from "next/link";
import PencilSquare from "@/components/icons/PencilSquare";
import TrashIcon from "@/components/icons/TrashIcon";
import CheckIcon from "@/components/icons/CheckIcon";
// import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import Panel from "../common/Panel/Panel";
import usePermissions from "@/common/hooks/use-permissions";
import { PermitableComponent } from "@/common/components/permitable-component";
import { PermissionsObjects } from "@/common/data/permission.data";
import IconButton from "../common/Buttons/IconButton";
import EmployeeInformation from "./EmployeeInformation";
import LinkButton from "../common/Buttons/LinkButton";
import EmployeeCertificationsSummary from "./EmployeeCertificationsSummary";
import EmployeeEducationsSummary from "./EmployeeEducationsSummary";
import EmployeeExperiencesSummary from "./EmployeeExperiencesSummary";
import EmployeeRolesSummary from "./EmployeeRolesSummary";
import { useEmployee } from "@/hooks/employee/use-employee";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getDangerActionConfirmationModal } from "../common/Modals/DangerActionConfirmation";
import { useModal } from "../providers/ModalProvider";

interface EmployeeDetailsProps {
  employeeId: number;
  showAsProfile?: boolean;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId, showAsProfile = false }) => {
  const router = useRouter();
  const { can,transformToPermissionName } = usePermissions();
  const { deleteOne } = useEmployee({autoFetch:false})
  const [isLoading,setIsLoading] = useState(false);
  const [isSuccess,setIsSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        router.push(`/employees`);
      }, 700);
    }
  }, [router,isSuccess]);

  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u deze medewerker wilt verwijderen?",
      title: "Medewerker Verwijderen",
    })
  );

  return (
    <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div className="flex flex-col gap-9">
        <Panel
          title={"Medewerkerinformatie"}
          containerClassName="px-7 py-4"
          sideActions={
            !showAsProfile && (
              <div className="flex gap-4">
                <PermitableComponent permission={PermissionsObjects.ViewEmployee}>{/* TODO: Add correct permisssion */}
                  <Link href={`/employees/${employeeId}/edit`}>
                    <IconButton>
                      <PencilSquare className="w-5 h-5" />
                    </IconButton>
                  </Link>
                </PermitableComponent>

                <PermitableComponent permission={PermissionsObjects.ViewEmployee}>{/* TODO: Add correct permisssion */}
                  <IconButton
                    buttonType="Danger"
                    onClick={() => {
                      open({
                        onConfirm: async() => {
                          try {
                            setIsLoading(true);
                            await deleteOne(employeeId);
                            setIsSuccess(true);
                          } catch (error) {
                            console.log(error);
                          }finally{
                            setIsLoading(false);
                          }
                        },
                      });
                    }}
                    disabled={isSuccess}
                    isLoading={isLoading}
                  >
                    {isSuccess ? (//TODO: Add correct condition isSuccess
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <TrashIcon className="w-5 h-5" />
                    )}
                  </IconButton>
                </PermitableComponent>
              </div>
            )
          }
        >
          <EmployeeInformation employeeId={employeeId} />
        </Panel>
        <Panel
          title={"Certificaten"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Certificatenlijst"}
              href={`/employees/${employeeId}/certificates`}
            />
          }
        >
          <EmployeeCertificationsSummary employeeId={employeeId} />
        </Panel>
      </div>
      <div className="flex flex-col gap-9">
        <Panel
          title={"Opleidingen"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Opleidingenlijst"}
              href={`/employees/${employeeId}/educations`}
            />
          }
        >
          <EmployeeEducationsSummary employeeId={employeeId} />
        </Panel>
         <Panel
          title={"Ervaringen"}
          containerClassName="px-7 py-4"
          sideActions={
            <LinkButton
              text={"Volledige Ervaringenlijst"}
              href={`/employees/${employeeId}/experiences`}
            />
          }
        >
          <EmployeeExperiencesSummary employeeId={employeeId} />
        </Panel>
        <PermitableComponent permission={PermissionsObjects.ViewEmployee}>{/*consts.EMPLOYEE_PERMISSIONS_VIEW*/}
          {!showAsProfile && (
            <Panel
              title={"Rollen"}
              containerClassName="px-7 py-4"
              sideActions={
                can(transformToPermissionName(PermissionsObjects.ViewEmployee)) && (//consts.EMPLOYEE_PERMISSIONS_VIEW
                  <LinkButton text={"Volledige Rollijst"} href={`/employees/${employeeId}/teams`} />
                )
              }
            >
              <EmployeeRolesSummary employeeId={employeeId} />
            </Panel>
          )}
        </PermitableComponent>
        {/* {showAsProfile && (
          <Panel title={"Reset Password"} containerClassName={"px-7 py-4"}>
            <ChangePasswordForm />
          </Panel>
        )} */}
      </div>
    </div>
  );
};

export default EmployeeDetails;
