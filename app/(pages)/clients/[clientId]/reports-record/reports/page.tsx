"use client";

import React, { Fragment, FunctionComponent, useState } from "react";
import styles from "./reports.module.css";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import LinkButton from "@/components/common/Buttons/LinkButton";
import LargeErrorMessage from "@/components/common/Alerts/LargeErrorMessage";
import ProfilePicture from "@/components/common/profilePicture/profile-picture";
import { REPORT_TYPE_RECORD, showEmojies } from "@/types/reports.types";
import Button from "@/components/common/Buttons/Button";
import { useModal } from "@/components/providers/ModalProvider";
import { useReport } from "@/hooks/report/use-report";
import DropdownDefault from "@/common/components/DropdownDefault";
import { getLocateDatetime } from "@/utils/message-time";
import Loader from "@/components/common/loader";
import withAuth, { AUTH_MODE } from "@/common/hocs/with-auth";
import withPermissions from "@/common/hocs/with-permissions";
import Routes from "@/common/routes";
import { PermissionsObjects } from "@/common/data/permission.data";

const ReportsPage: FunctionComponent = () => {
  const router = useRouter();
  const { clientId } = useParams();
  const [page, setPage] = useState(1);
  const { reports, isLoading, error } = useReport({
    clientId: +(clientId as string),
    autoFetch: true,
    page,
  });
  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet je zeker dat je dit rapport wilt verwijderen?",
      title: "Rapport Verwijderen",
    })
  );

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="flex flex-wrap items-center p-4">
        <LinkButton
          text={"Rapporten Toevoegen"}
          href={"../reports/new"}
          className="ml-auto"
        />
      </div>
      {error && !isLoading && (
        <p role="alert" className="text-red-600">
          Sorry, een fout heeft ons verhinderd de lijst te laden.
        </p>
      )}

      {reports.results && reports.results.length === 0 && !isLoading && (
        <LargeErrorMessage
          firstLine={"Oops!"}
          secondLine={"Er zijn geen rapporten beschikbaar"}
        />
      )}
      <div className="p-6 lg:max-w-[50%]">
        <div className="flex flex-col gap-7 ">
          {reports.results && reports.results.length > 0 && (
            <Fragment>
              {reports &&
                reports?.results.map((post, key) => (
                  <div
                    className={clsx(
                      "relative z-1 flex gap-5.5",
                      styles.withTrail
                    )}
                    key={key}
                  >
                    <div className="h-16 w-full max-w-16 rounded-full border-[2px] border-stroke dark:border-strokedark">
                      <ProfilePicture
                        width={60}
                        height={60}
                        className="min-w-[60px]"
                        profilePicture={""}
                      />
                    </div>

                    <div className="group">
                      <div className="text-slate-800  dark:text-white flex gap-4">
                        <div>
                          <span className="font-medium">
                            Report #{post?.id}
                          </span>
                          <span className="px-1">Geschreven door</span>
                          <span className="font-medium">
                            {post?.employee_first_name +
                              " " +
                              post?.employee_last_name}
                          </span>
                        </div>

                        <span className="hidden group-hover:block">
                          <DropdownDefault
                            onEdit={() => {
                              router.push(
                                `/clients/${clientId}/reports/${post?.id}/edit`
                              );
                            }}
                            onDelete={() => {
                              open({
                                onConfirm: async () => {
                                  // deleteReport(post.id);
                                  alert("Report deleted! Comming soon...");
                                },
                              });
                            }}
                          />
                        </span>
                      </div>
                      <span className="mt-1 block text-sm">
                        {getLocateDatetime(post?.date || "")} -{" "}
                        {
                          REPORT_TYPE_RECORD[
                            post?.type as keyof typeof REPORT_TYPE_RECORD
                          ]
                        }
                      </span>
                      <span className="">
                        {showEmojies(post?.emotional_state || "")}
                      </span>
                      <p className="mt-2.5 text-slate-800  dark:text-white">
                        {post?.report_text}
                      </p>
                    </div>
                  </div>
                ))}
            </Fragment>
          )}
        </div>
        <div className="ml-4 mt-8">
          {reports.next && (
            <Button
              onClick={() => {
                setPage((v) => v + 1);
              }}
            >
              Laad meer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(
  withPermissions(ReportsPage, {
    redirectUrl: Routes.Common.NotFound,
    requiredPermissions: PermissionsObjects.ViewEmployee, // TODO: Add correct permisssion
  }),
  { mode: AUTH_MODE.LOGGED_IN, redirectUrl: Routes.Auth.Login }
);
