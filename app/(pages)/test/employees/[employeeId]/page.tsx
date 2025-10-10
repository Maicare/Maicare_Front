"use client";
import { PermissionsObjects } from "@/common/data/permission.data";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb";
import EmployeeDetails from "@/components/employee/EmployeeDetails";
import { useParams } from "next/navigation";
import { FunctionComponent } from "react";



const EmployeeDetailsPage: FunctionComponent = () => {
    const params = useParams(); // Access the dynamic route params
    const { employeeId } = params;
    return (
        <div>
            <Breadcrumb pageName="Medewerkerdetails" />
            <EmployeeDetails employeeId={+employeeId!} />

        </div>
    );
};
export default withAuth(
    withPermissions(EmployeeDetailsPage, {
        redirectUrl: Routes.Common.Home,
        requiredPermissions: PermissionsObjects.ViewEmployee,// TODO: Add correct permisssion 
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
