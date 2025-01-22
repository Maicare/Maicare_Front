"use client";

import React, { FunctionComponent, useState } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import PencilSquare from "@/components/icons/PencilSquare";
import TrashIcon from "@/components/icons/TrashIcon";
import styles from "./styles.module.css";
import clsx from "clsx";
import CheckIcon from "@/components/icons/CheckIcon";
import { useModal } from "@/components/providers/ModalProvider";
import { Education } from "@/types/education.types";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import EducationForm from "./EducationForm";
import { useEducation } from "@/hooks/education/use-education";

type Props = {
  data: Education[];
};

const EducationsList: FunctionComponent<Props> = ({ data }) => {
  return (
    <table className={styles.table}>
      <tbody>
        {data.map((education) => (
          <EducationItem key={education.id} education={education} />
        ))}
      </tbody>
    </table>
  );
};

export default EducationsList;

type EducationItemProps = {
  education: Education;
};

const EducationItem: FunctionComponent<EducationItemProps> = ({ education }) => {
  const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const {deleteOne,mutate} = useEducation({autoFetch:false,employeeId:education.employee_id.toString()});
  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u deze opleiding wilt verwijderen?",
      title: "Opleiding Verwijderen",
    })
  );
  const triggerEdit = async() => {
    setIsEdit(v=>!v);
    await mutate();
  }
  return (
    <>
      <tr>
        <td>
          <DetailCell
            label={"Periode"}
            value={dateFormat(education.start_date) + " - " + dateFormat(education.end_date)}
          />
        </td>
        <td>
          <DetailCell label={"Naam Instituut"} value={education.institution_name} />
        </td>
        <td>
          <DetailCell
            label={"Diploma"}
            value={
              <div>
                <strong>{education.degree}</strong> | <span>{education.field_of_study}</span>
              </div>
            }
          />
        </td>
        <td className="flex justify-end">
          <div className="flex items-center gap-4">
            <IconButton onClick={triggerEdit}>
              <PencilSquare className="w-5 h-5" />
            </IconButton>
            <IconButton
              buttonType="Danger"
              onClick={() => {
                open({
                  onConfirm: async() => {
                    try {
                      setLoading(true);
                      await deleteOne(education);
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
            <EducationForm
              mode="update"
              initialData={education}
              onSuccess={() => setIsEdit(false)}
              employeeId={education.employee_id}
            />
          </td>
        </tr>
      )}
    </>
  );
};
