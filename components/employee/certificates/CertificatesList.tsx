"use client";

import React, { FunctionComponent, useState } from "react";
import { fullDateFormat } from "@/utils/timeFormatting";
import PencilSquare from "@/components/icons/PencilSquare";
import TrashIcon from "@/components/icons/TrashIcon";
import styles from "./styles.module.css";
import clsx from "clsx";
import CheckIcon from "@/components/icons/CheckIcon";
import { useModal } from "@/components/providers/ModalProvider";
import { Certification } from "@/types/certification.types";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import CertificationForm from "./CertificateForm";
import { useEmployee } from "@/hooks/employee/use-employee";

type Props = {
  data: Certification[];
};

const CertificatesList: FunctionComponent<Props> = ({ data }) => {
  return (
    <table className={styles.table}>
      <tbody>
        {data.map((certificate) => (
          <CertificationItem key={certificate.id} certificate={certificate} />
        ))}
      </tbody>
    </table>
  );
};

export default CertificatesList;

type CertificationItemProps = {
  certificate: Certification;
};

const CertificationItem: FunctionComponent<CertificationItemProps> = ({ certificate }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {deleteOneCertificate} = useEmployee({autoFetch:false});
  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u dit certificaat wilt verwijderen?",
      title: "Certificaat Verwijderen",
    })
  );
  return (
    <>
      <tr>
        <td>
          <DetailCell label={"Titel"} value={certificate.name} />
        </td>
        <td>
          <DetailCell label={"Uitgegeven Door"} value={certificate.issued_by} />
        </td>
        <td>
          <DetailCell label={"Datum Uitgegeven"} value={fullDateFormat(certificate.date_issued)} />
        </td>
        <td className="flex justify-end">
          <div className="flex items-center gap-4">
            <IconButton onClick={() => setIsEdit((v) => !v)}>
              <PencilSquare className="w-5 h-5" />
            </IconButton>
            <IconButton
              buttonType="Danger"
              onClick={() => {
                open({
                  onConfirm: async() => {
                    try {
                      setLoading(true);
                      await deleteOneCertificate(certificate);
                      setSuccess(true);
                    } catch (error) {
                      console.log(error);
                      setSuccess(false);
                    } finally{
                      setLoading(false);
                    }
                  },
                });
              }}
              disabled={success}
              isLoading={loading}
            >
              {success ? <CheckIcon className="w-5 h-5" /> : <TrashIcon className="w-5 h-5" />}
            </IconButton>
          </div>
        </td>
      </tr>
      {isEdit && (
        <tr>
          <td colSpan={4} className={clsx("bg-c_gray dark:bg-graydark p-8", styles.formTd)}>
            <CertificationForm
              mode="update"
              initialData={certificate}
              onSuccess={() => setIsEdit(false)}
              employeeId={certificate.employee_id}
            />
          </td>
        </tr>
      )}
    </>
  );
};
