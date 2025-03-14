"use client";

import React, { FunctionComponent, useState } from "react";
import { dateFormat } from "@/utils/timeFormatting";
import PencilSquare from "@/components/icons/PencilSquare";
import TrashIcon from "@/components/icons/TrashIcon";
import styles from "./styles.module.css";
import clsx from "clsx";
import CheckIcon from "@/components/icons/CheckIcon";
import { Experience } from "@/types/experience.types";
import { useModal } from "@/components/providers/ModalProvider";
import { getDangerActionConfirmationModal } from "@/components/common/Modals/DangerActionConfirmation";
import DetailCell from "@/components/common/DetailCell";
import IconButton from "@/components/common/Buttons/IconButton";
import ExperienceForm from "./ExperienceForm";
import { useExperience } from "@/hooks/experience/use-experience";

type Props = {
  data: Experience[];
};

const ExperiencesList: FunctionComponent<Props> = ({ data }) => {
  return (
    <table className={styles.table}>
      <tbody>
        {data.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </tbody>
    </table>
  );
};

export default ExperiencesList;

type ExperienceItemProps = {
  experience: Experience;
};

const ExperienceItem: FunctionComponent<ExperienceItemProps> = ({ experience }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { deleteOne, mutate } = useExperience({ autoFetch: false, employeeId: experience.employee_id.toString() });
  const { open } = useModal(
    getDangerActionConfirmationModal({
      msg: "Weet u zeker dat u deze ervaring wilt verwijderen?",
      title: "Ervaring Verwijderen",
    })
  );
  const triggerEdit = async () => {
    setIsEdit(v => !v);
    await mutate();
  }
  return (
    <>
      <tr>
        <td>
          <DetailCell label={"Functietitel"} value={experience.job_title} />
        </td>
        <td>
          <DetailCell label={"Bedrijfsnaam"} value={experience.company_name} />
        </td>
        <td>
          <DetailCell
            label={"Periode"}
            value={dateFormat(experience.start_date) + " - " + dateFormat(experience.end_date)}
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
                      await deleteOne(experience);
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
            <ExperienceForm
              mode="update"
              initialData={experience}
              onSuccess={() => setIsEdit(false)}
              employeeId={experience.employee_id}
            />
          </td>
        </tr>
      )}
    </>
  );
};
