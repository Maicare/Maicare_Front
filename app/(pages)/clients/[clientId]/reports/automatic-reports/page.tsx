"use client";
import { ArrowBigLeft, ArrowBigRight, AtomIcon } from 'lucide-react'
import React from 'react'
import CreateAutomaticReportDialog from './_components/CreateAutomaticReportDialog'
import { useParams } from 'next/navigation'
import PrimaryButton from '@/common/components/PrimaryButton';
import { useAutomaticReport } from '@/hooks/automatic-report/use-automatic-report';
import { CreateAutomaticReport, ValidateAutomaticReport } from '@/types/automatic-report.types';
import Loader from '@/components/common/loader';
import LargeErrorMessage from '@/components/common/Alerts/LargeErrorMessage';
import AutomaticReport from './_components/AutomaticReport';
import withAuth, { AUTH_MODE } from '@/common/hocs/with-auth';
import withPermissions from '@/common/hocs/with-permissions';
import Routes from '@/common/routes';
import { PermissionsObjects } from '@/common/data/permission.data';

const AutomaticReports = () => {
  const { clientId } = useParams();
  const { automaticReports, isLoading,  page, setPage, generateOne, validateOne } = useAutomaticReport({ clientId: parseInt(clientId as string), autoFetch: true });
  const handleGenerate = async (values:CreateAutomaticReport) => {
    try {
      const res = await generateOne(values);
      return res.report;
    } catch (error) {
      console.error(error);
    }
  }
  const handleValidate = async (values:ValidateAutomaticReport) => {
    try {
      await validateOne(values,{
        displayProgress:true,
        displaySuccess:true
      });
    } catch (error) {
      console.error(error);
    }
  }
  const handlePrevious = () => {
    if (page <= 1) {
        setPage(1);
        return;
    }
    setPage(page - 1);
}
const handleNext = () => {
    if (automaticReports?.next) {
        setPage(page + 1);
        return;
    }
}
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
          <AtomIcon size={24} className='text-indigo-400' />  Automatische rapporten
        </h1>
        <CreateAutomaticReportDialog
          handleValidate={handleValidate}
          handleGenerate={handleGenerate}
        />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {
          isLoading ?
            <Loader />
            : !automaticReports || automaticReports?.results?.length === 0 ?
              <div className="col-span-4 w-full flex items-center justify-center">
                <LargeErrorMessage
                  firstLine={"Oops!"}
                  secondLine={
                    "Het lijkt erop dat er geen medewerkers zijn die aan uw zoekcriteria voldoen."
                  }
                  className="w-full"
                />
              </div>
              :
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-4 gap-2">
                  {
                    automaticReports.results.map((report, i) => (
                      <AutomaticReport
                        key={i}
                        automaticReport={report}
                        index={i}
                      />
                    ))
                  }
                </div>
                <div className="flex px-2 py-3 bg-white dark:bg-[#18181b] dark:border-black rounded-md mt-5 justify-between border-2 border-muted">
                  <PrimaryButton
                    disabled={page === 1}
                    onClick={handlePrevious}
                    text={"Previous"}
                    icon={ArrowBigLeft}
                    iconSide="left"
                  />
                  <PrimaryButton
                    disabled={automaticReports?.next ? false : true}
                    onClick={handleNext}
                    text={"Next"}
                    icon={ArrowBigRight}
                  />
                </div>
              </div>
        }
      </div>
    </div>
  )
}

export default withAuth(
  withPermissions(AutomaticReports, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permission
    }),
    { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login } 
    );