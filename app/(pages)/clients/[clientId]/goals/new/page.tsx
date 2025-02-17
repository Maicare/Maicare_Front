"use client";
import GoalForm from "@/components/clients/goals/GoalForm";
import Breadcrumb from "@/components/common/Breadcrumbs/Breadcrumb"
import { useParams } from "next/navigation";

const NewGoalPage = () => {
    const { clientId } = useParams();
  return (
    <div>
      <Breadcrumb pageName="Nieuw Doelen" />
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-slate-800  dark:text-white">
                Creëer een Nieuw Noodcontact
              </h3>
            </div>
            <GoalForm clientId={clientId as string} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewGoalPage